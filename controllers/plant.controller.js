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
    res.status(500).send({
      message: "Internal server error when fetching all plants",
      error,
    });
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
    res
      .status(500)
      .send({ message: "Internal server error when fetching plant", error });
  }
};

exports.updatePlant = async (req, res) => {
  const { id } = req.params;
  const {
    lastPostponedReason,
    lastWateredBy,
    lastWateredDate,
    waterNext,
  } = req.body;

  if (!lastPostponedReason || !lastWateredBy || !lastWateredDate || !waterNext)
    return res.status(400).send({ error: "Data to update cannot be empty!" });

  try {
    // Update plant based on id
    const updatedPlant = await Plant.findOneAndUpdate(
      { _id: id },
      {
        watering: {
          lastPostponedReason,
          lastWateredBy,
          lastWateredDate,
          waterNext,
        },
      },
      {
        useFindAndModify: false,
      }
    );
    res.status(200).send({
      lastPostponedReason: updatedPlant.watering.lastPostponedReason,
      lastWateredBy: updatedPlant.watering.lastWateredBy,
      lastWateredDate: updatedPlant.watering.lastWateredDate,
      waterNext: updatedPlant.watering.waterNext,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal server error when updating plant", error });
  }
};
