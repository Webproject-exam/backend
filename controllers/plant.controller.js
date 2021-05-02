const Plant = require("../models/Plant");

exports.getAllPlants = async (req, res) => {
  try {
    const allPlants = await Plant.find({}, [
      "name",
      "placement",
      "watering.waterNext",
      "watering.waterFrequency",
      "lighting",
    ]);
    res.status(200).json(allPlants);
  } catch (error) {
    res.status(500).json({ error: "Could not get all plants" }, error);
  }
};

exports.getPlant = async (req, res) => {
  try {
    const plant = await Plant.findOne({ _id: req.params.id }, [
      "name",
      "placement",
      "watering",
      "fertilization",
      "information",
      "lighting",
    ]);
    res.status(200).json({ plant });
  } catch (error) {
    res.status(500).json({ error });
  }
};
