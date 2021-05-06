const Plant = require('../models/Plant');
const User = require('../models/User');
const jwtDecode = require('jwt-decode');
exports.getAllPlants = async (req, res) => {
  try {
    const allPlants = await Plant.find({}, [
      'name',
      'placement',
      'watering.waterNext',
      'watering.waterFrequency',
      'lighting',
      'fertilization.fertAmount',
      'fertilization.fertFrequency'
    ]);
    res.status(200).json(allPlants);
  } catch (error) {
    res.status(500).send({
      message: 'Internal server error when fetching all plants',
      error,
    });
  }
};

exports.getPlant = async (req, res) => {
  try {
    const plant = await Plant.findOne({_id: req.params.id}, [
      'name',
      'lighting',
      'responsible',
      'placement',
      'watering',
      'fertilization',
      'information',
      'createdAt',
    ]);
    res.status(200).json({plant});
  } catch (error) {
    res
      .status(500)
      .send({message: 'Internal server error when fetching plant', error});
  }
};

exports.updatePlantCare = async (req, res) => {
  const {id} = req.params;
  const {watering, fertilization} = req.body;
  let updates = {};

  // Checks if there is any headers in request
  const headers = req.headers.authorization;
  if (!headers) return res.status(401).send({error: 'Unauthorized'});

  const token = headers.split(' ')[1];
  const {_id, role, exp} = jwtDecode(token);

  //Verify token
  if (Date.now() >= exp * 1000)
    return res.status(401).send({error: 'Unauthorized'});

  if (!role == 'manager' || !role === 'gardener')
    return res.status(401).send({error: 'Unauthorized'});

  //finds user in DB to find name
  const user = await User.findOne({_id});

  // Check if watering object or fertilization object is present
  if (!watering && !fertilization)
    return res.status(400).send({
      error: 'Either watering or fertilization is needed to update plant!',
    });

  if (watering) {
    const convertWaterFreqToMilli = watering.waterFrequency * 86400000;
    watering.waterNext = new Date(Date.now() + convertWaterFreqToMilli);
    watering.lastWateredBy = user.name;
    watering.lastWateredDate = Date.now();
    updates = {watering};
  }

  if (fertilization) {
    const convertFertFreqToMilli = fertilization.fertFrequency * 86400000;
    fertilization.fertNext = new Date(Date.now() + convertFertFreqToMilli);
    fertilization.lastFertBy = user.name;
    fertilization.lastFertDate = Date.now();
    updates = {fertilization};
  }

  try {
    // decode token to get role and user id
    // Update plant based on id
    await Plant.updateOne({_id: id}, {$set: updates});
    return res
      .status(200)
      .json({message: 'Plant has been watered / fertilized'});
  } catch (error) {
    res
      .status(500)
      .send({error: 'Internal server error when updating plant', error});
  }
};
