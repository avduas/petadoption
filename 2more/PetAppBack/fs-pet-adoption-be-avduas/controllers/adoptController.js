const db = require("../db/db");

const adoptPet = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;
  const userId = req.user.id;

  try {
    if (!userId || !id || !type) {
      console.error("One or more required parameters are undefined");
      return res.status(400).json({ message: "One or more required parameters are undefined" });
    }

    const [pet] = await db.execute("SELECT * FROM Pets WHERE id = ?", [id]);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    await db.execute("INSERT INTO Adoptions (user_id, pet_id, type) VALUES (?, ?, ?)", [userId, id, type]);

    await db.execute("UPDATE Pets SET adoption_status = ? WHERE id = ?", [type, id]);

    res.status(200).json({ message: "Pet adoption successful" });
  } catch (error) {
    console.error("Error adopting pet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const returnPet = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      console.error("Pet ID is undefined");
      return res.status(400).json({ message: "Pet ID is undefined" });
    }

    const [adoption] = await db.execute("SELECT * FROM Adoptions WHERE pet_id = ?", [id]);
    if (!adoption) {
      return res.status(404).json({ message: "Adoption record not found for this pet" });
    }

    await db.execute("DELETE FROM Adoptions WHERE pet_id = ?", [id]);

    await db.execute("UPDATE Pets SET adoption_status = 'Available' WHERE id = ?", [id]);

    res.status(200).json({ message: "Pet returned to the agency successfully" });
  } catch (error) {
    console.error("Error returning pet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const savePet = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; 

    try {
        const [pet] = await db.execute('SELECT * FROM Pets WHERE id = ?', [id]);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        await db.execute('INSERT INTO SavedPets (user_id, pet_id) VALUES (?, ?)', [userId, id]);

        res.status(200).json({ message: 'Pet saved successfully' });
    } catch (error) {
        console.error('Error saving pet:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const unsavePet = async (req, res) => {
    const { id } = req.params; 
  
    try {
      const userId = req.user.id;
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }

      const [pet] = await db.execute('SELECT * FROM Pets WHERE id = ?', [id]);
      if (!pet) {
        return res.status(404).json({ message: 'Pet not found' });
      }
  
      await db.execute('DELETE FROM SavedPets WHERE user_id = ? AND pet_id = ?', [userId, id]);
  
      res.status(200).json({ message: 'Pet removed from saved pets successfully' });
    } catch (error) {
      console.error('Error removing pet from saved pets:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const getPetsByUserId = async (req, res) => {
    const userId = req.params.id;

    try {
        const [savedPets] = await db.execute('SELECT Pets.* FROM Pets INNER JOIN SavedPets ON Pets.id = SavedPets.pet_id WHERE SavedPets.user_id = ?', [userId]);

        const [adoptedPets] = await db.execute('SELECT Pets.* FROM Pets INNER JOIN Adoptions ON Pets.id = Adoptions.pet_id WHERE Adoptions.user_id = ?', [userId]);

        const petsByUser = {
            savedPets: savedPets,
            adoptedPets: adoptedPets
        };

        res.status(200).json(petsByUser);
    } catch (error) {
        console.error('Error fetching pets by user ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { adoptPet, returnPet, savePet, unsavePet, getPetsByUserId };
