const express = require("express");
const { getAllPlants, getPlant } = require("../controllers/plant.controller");

const router = express.Router();

router.get("/", getAllPlants);
router.get("/:id", getPlant);
module.exports = router;
