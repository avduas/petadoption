const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const { validatePetId, addPetValidator, searchPetsValidator } = require('../middlewares/editPetValidator');
const { adoptPet, returnPet, savePet, unsavePet, getPetsByUserId } = require('../controllers/adoptController');
const { authenticateToken } = require("../middlewares/authMiddleware")

router.post('/pets', addPetValidator, petController.addPet);

router.get('/pets/:id', authenticateToken, validatePetId, petController.getPetById); 

router.put('/pets/:id', addPetValidator, petController.editPetById);

router.get('/search', searchPetsValidator, petController.searchPets);

router.put('/pets/:id/adopt', authenticateToken, adoptPet);

router.delete('/:id/return', authenticateToken, returnPet);

router.put('/pets/:id/save', authenticateToken, savePet);

router.delete('/pets/:id/unsave', authenticateToken, unsavePet);

router.get('/pets/user/:id', authenticateToken, getPetsByUserId);

module.exports = router;
