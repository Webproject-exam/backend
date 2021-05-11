const express = require('express');
const {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  createPlant,
  updatePlant,
  deletePlant,
  imageUpload,
} = require('../controllers/manage.controller');

const router = express.Router();

//
// @USER
//

/**
 * POST
 * req.body = name, surname, role, email, password
 */
router.post('/users', createUser);

/**
 * GET
 * Get all users
 * Returns name, surname, email, role
 */
router.get('/users', getAllUsers);

/**
 * PATCH
 * Update users profile
 * req.body = name, surname, email, role
 */
router.patch('/users', updateUser);

/**
 * DELETE
 * req.body = email
 */
router.delete('/users', deleteUser);

//
// @Plant
//

/**
 * POST
 * Create new plant
 *	req.body =
 *						name,
 *						building,
 *						floor,
 *						room,
 *						waterFrequency,
 *						waterNext,
 *						responsible,
 *						fertFrequency,
 *						fertNext,
 *						lighting,
 *						description,
 *						placement,
 *						water,
 *						nutrition,
 */
router.post('/plants', createPlant);

/**
 * PATCH
 * Update existing plant
 *	req.body = id
 */
router.patch('/plants', updatePlant);

/**
 * POST
 * Create new plant
 *	req.params = id
 */
router.delete('/plants', deletePlant);

module.exports = router;
