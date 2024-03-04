const { body, param, validationResult, query } = require('express-validator');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const validatePetId = [
    param('id').notEmpty().isInt(), 
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); 
    }
  ];

const addPetValidator = [
    upload.single('picture_url'),
    body('type').notEmpty(),
    body('name').notEmpty(),
    body('adoption_status').notEmpty().isIn(['Adopted', 'Fostered', 'Available']),
    body('height').isNumeric(),
    body('weight').isNumeric(),
    body('color').notEmpty(),
    body('bio').notEmpty(),
    body('hypoallergenic').isBoolean(),
    body('dietary_restrictions').optional().notEmpty(),
    body('breed').notEmpty(),
];

const searchPetsValidator = [
    query('adoption_status').optional().isIn(['Adopted', 'Fostered', 'Available']),
    query('type').optional(),
    query('height').optional().isNumeric(),
    query('weight').optional().isNumeric(),
    query('name').optional(),
  ];

module.exports = { validatePetId, addPetValidator, searchPetsValidator };
