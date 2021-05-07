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
      'fertilization.fertFrequency',
      'fertilization.fertNext',
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

exports.waterPlant = async (req, res) => {
  const {id, waterNext} = req.body;
  console.log(req.body);
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
  const updatedPlant = {
    watering: {
      waterNext,
      lastWateredBy: user.name,
      lastWateredDate: Date.now(),
    },
  };
  // console.log(updatedPlant);
  try {
    // decode token to get role and user id
    // Update plant based on id
    const plant = await Plant.updateOne({_id: id}, {$set: updatedPlant});
    // console.log(plant);
    return res.status(200).json({message: plant});
  } catch (error) {
    res
      .status(500)
      .send({error: 'Internal server error when updating plant', error});
  }
};
