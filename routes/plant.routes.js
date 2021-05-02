const express = require("express");
const {
  getAllPlants,
  getPlant,
  updatePlant,
} = require("../controllers/plant.controller");

const router = express.Router();

router.get("/", getAllPlants);
router.get("/:id", getPlant);
router.patch("/:id", updatePlant);
module.exports = router;
