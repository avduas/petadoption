const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/db');

async function signup(req, res) {
    try {
        const { email, password, confirmPassword, firstName, lastName, phone } = req.body;

        if (!email || !password || !confirmPassword || !firstName || !lastName || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const connection = await db.getConnection();

        const [existingUser] = await connection.query('SELECT * FROM Users WHERE email = ?', [email]);

        connection.release();

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); 

        const insertConnection = await db.getConnection();

        await insertConnection.query('INSERT INTO Users (email, password, firstName, lastName, phone) VALUES (?, ?, ?, ?, ?)', [email, hashedPassword, firstName, lastName, phone]);

        insertConnection.release();

        const [newUser] = await connection.query('SELECT * FROM Users WHERE email = ?', [email]);

        const user = newUser[0];

        const token = jwt.sign({ 
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        }, 'secret', { expiresIn: '1h' });

        await db.query('UPDATE Users SET token = ? WHERE id = ?', [token, user.id]);

        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); // Set cookie

        res.status(201).json({ message: 'User registered successfully', token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateUser = async (req, res) => {
    const userId = req.user.id;
    let { email, password, firstName, lastName, phone, bio } = req.body;

    email = email !== undefined ? email : null;
    password = password !== undefined ? password : null;
    firstName = firstName !== undefined ? firstName : null;
    lastName = lastName !== undefined ? lastName : null;
    phone = phone !== undefined ? phone : null;
    bio = bio !== undefined ? bio : null;

    try {
        const [existingUser] = await db.execute('SELECT * FROM Users WHERE email = ? AND id != ?', [email, userId]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email is already in use' });
        }

        // Обновление данных пользователя в базе данных
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute('UPDATE Users SET email = ?, password = ?, firstName = ?, lastName = ?, phone = ?, bio = ? WHERE id = ?', 
            [email, hashedPassword, firstName, lastName, phone, bio, userId]);

        // Генерация нового токена
        const user = { id: userId, email, firstName, lastName, role: req.user.role };
        const token = jwt.sign(user, 'secret', { expiresIn: '5h' });

        // Обновление токена в базе данных
        await db.query('UPDATE Users SET token = ? WHERE id = ?', [token, userId]);

        // Установка токена в заголовке и куки ответа
        res.setHeader('Authorization', `Bearer ${token}`);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });

        // Отправка ответа с обновленным токеном
        res.status(200).json({ message: 'User updated successfully', token });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { signup, login };