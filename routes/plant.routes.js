const express = require('express');
const {getAllPlants, getPlant, waterPlant, updatePlantCare} = require('../controllers/plant.controller');

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
 * req.params = id
 * req.body =
 * 						lastPostponedReason,
 * 						lastWateredBy,
 *						lastWateredDate,
 *						waterNext
 */
router.patch('/', waterPlant);

router.patch('/:id', updatePlantCare);

module.exports = router;
