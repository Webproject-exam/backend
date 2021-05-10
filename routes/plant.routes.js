const express = require('express');
const {
  getAllPlants,
  getPlant,
  waterPlant,
  updatePlantCare,
  requestPlant,
} = require('../controllers/plant.controller');

const router = express.Router();

/**
 * GET
 *	get all plants
 */
router.get('/', getAllPlants);

/**
 * GET
 *	get individual plant using id
 */
router.get('/:id', getPlant);

/**
 * PATCH
 * req.body = id
 */
router.patch('/request', requestPlant);

/**
 * PATCH
 * req.params = id
 * req.body =
 *            name,
 *            information,
 *            lighting,
 *            fertAmount,
 *            fertFrequency,
 *            fertNext,
 *            placement,
 *            waterAmount,
 *            waterFrequency,
 *            waterNext,
 */
router.patch('/:id', updatePlantCare);

/**
 * PATCH
 * req.body =
 *            selectedPlant
 *						waterNext
 *					  fertNext
 */
router.patch('/', waterPlant);

module.exports = router;
