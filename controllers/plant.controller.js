const Plant = require("../models/Plant");
const jwtDecode = require("jwt-decode");
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

  const headers = req.headers.authorization;
  if (!headers) return res.status(401).send({ error: "Unauthorized" });

  const token = headers.split(" ")[1];
  const { role } = jwtDecode(token);
  if (!role) return res.status(401).send({ error: "Unauthorized" });

  if (!role == "manager" || !role === "gardener") {
    console.log(user.role);
    return res.status(401).send({ error: "Unauthorized" });
  }

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

    console.log(updatedPlant);
    res
      .status(200)
      .json({ lastPostponedReason, lastWateredBy, lastWateredDate, waterNext });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal server error when updating plant", error });
  }
};
