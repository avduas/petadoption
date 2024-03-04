const db = require("../db/db");
const bcrypt = require('bcrypt');

const getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const [userRows] = await db.execute('SELECT * FROM Users WHERE id = ?', [userId]);

        if (userRows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userRows[0];

        const [petRows] = await db.execute('SELECT Pets.* FROM Pets INNER JOIN Adoptions ON Pets.id = Adoptions.pet_id WHERE Adoptions.user_id = ?', [userId]);

        user.pets = petRows;

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

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

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute('UPDATE Users SET email = ?, password = ?, firstName = ?, lastName = ?, phone = ?, bio = ? WHERE id = ?', 
            [email, hashedPassword, firstName, lastName, phone, bio, userId]);

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            console.log('Access denied: User is not an admin');
            return res.status(403).json({ message: 'Access denied' });
        }
        
        const [users] = await db.execute('SELECT * FROM Users');

        const [pets] = await db.execute('SELECT id, name, type, adoption_status, picture_url, height, weight, color, bio, hypoallergenic, dietary_restrictions, breed FROM Pets');
        
        res.json({ users, pets });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { getUserById, updateUser, getAllUsers };
