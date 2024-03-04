const db = require("../db/db");
const { validationResult } = require("express-validator");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const addPet = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    const {
      type,
      name,
      adoption_status,
      height,
      weight,
      color,
      bio,
      hypoallergenic,
      dietary_restrictions,
      breed,
    } = req.body;

    const picture_url = req.file ? req.file.path : null;

    const hypoallergenicValue = hypoallergenic === "true" ? 1 : 0;

    console.log("Picture URL:", picture_url);

    const query = `INSERT INTO Pets (type, name, adoption_status, picture_url, height, weight, color, bio, hypoallergenic, dietary_restrictions, breed) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      type,
      name,
      adoption_status,
      picture_url,
      height,
      weight,
      color,
      bio,
      hypoallergenicValue,
      dietary_restrictions,
      breed,
    ];

    await db.execute(query, values);

    console.log("Pet added successfully");

    res.status(201).json({ message: "Pet added successfully" });
  } catch (error) {
    console.error("Error adding pet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPetById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; 

    const petQuery = `SELECT * FROM Pets WHERE id = ?`;
    const adoptionQuery = `SELECT * FROM Adoptions WHERE pet_id = ? AND user_id = ?`;

    const [petRows, petFields] = await db.execute(petQuery, [id]);
    const [adoptionRows, adoptionFields] = await db.execute(adoptionQuery, [id, userId]);

    if (petRows.length === 0) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    const pet = petRows[0];
    const isOwner = adoptionRows.length > 0; 

    res.json({ ...pet, isOwner });
  } catch (error) {
    console.error('Error getting pet by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const editPetById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      type,
      name,
      adoption_status,
      height,
      weight,
      color,
      bio,
      hypoallergenic,
      dietary_restrictions,
      breed,
    } = req.body;

    const picture_url = req.file ? req.file.path : null;

    const hypoallergenicValue = hypoallergenic === "true" ? 1 : 0;

    const query = `UPDATE Pets 
                   SET type=?, name=?, adoption_status=?, picture_url=?, height=?, weight=?, color=?, bio=?, hypoallergenic=?, dietary_restrictions=?, breed=? 
                   WHERE id=?`;
    const values = [
      type,
      name,
      adoption_status,
      picture_url,
      height,
      weight,
      color,
      bio,
      hypoallergenicValue,
      dietary_restrictions,
      breed,
      req.params.id, 
    ];

    await db.execute(query, values);

    res.status(200).json({ message: "Pet updated successfully" });
  } catch (error) {
    console.error("Error updating pet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const searchPets = async (req, res) => {
  try {
    console.log("Search request query:", req.query); 
    const { adoption_status, type, height, weight, name } = req.query;

    if (!adoption_status && !type && !height && !weight && !name) {
      console.log("No search parameters provided, returning all pets"); 
      const [rows, fields] = await db.execute('SELECT * FROM Pets');
      res.json(rows);
      return;
    }

    let query = 'SELECT * FROM Pets WHERE 1';
    let values = [];

    if (adoption_status) {
      query += ' AND adoption_status = ?';
      values.push(adoption_status);
    }
    if (type) {
      query += ' AND type = ?';
      values.push(type);
    }
    if (height) {
      query += ' AND height = ?';
      values.push(height);
    }
    if (weight) {
      query += ' AND weight = ?';
      values.push(weight);
    }
    if (name) {
      query += ' AND name LIKE ?';
      values.push(`%${name}%`);
    }

    const [rows, fields] = await db.execute(query, values);

    console.log("Search results:", rows); 
    res.json(rows);
  } catch (error) {
    console.error("Error searching pets:", error); 
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addPet,
  upload,
  getPetById,
  editPetById,
  searchPets,
};
