const Plant = require('../models/Plant');
const User = require('../models/User');
const jwtDecode = require('jwt-decode');
const { parseISO, isToday } = require('date-fns');

exports.getAllPlants = async (req, res) => {
  try {
    const allPlants = await Plant.find({}, [
      'name',
      'placement',
      'watering.waterNext',
      'watering.waterFrequency',
      'watering.waterAmount',
      'watering.lastWateredDate',
      'lighting',
      'fertilization.fertAmount',
      'fertilization.fertFrequency',
      'fertilization.fertNext',
      'information',
      'createdAt',
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
    const plant = await Plant.findOne(
      {
        _id: req.params.id,
      },
      [
        'name',
        'lighting',
        'placement',
        'watering',
        'fertilization',
        'information',
        'createdAt',
        'lastRequestedDate',
      ]
    );
    res.status(200).json({
      plant,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Internal server error when fetching plant',
      error,
    });
  }
};

exports.waterPlant = async (req, res) => {
  const { selectedPlant, waterNext, fertNext } = req.body;
  // Checks if there is any headers in request
  const headers = req.headers.authorization;
  if (!headers)
    return res.status(401).send({
      error: 'Unauthorized',
    });

  const token = headers.split(' ')[1];
  const { _id, role, exp } = jwtDecode(token);

  //Verify token
  if (Date.now() >= exp * 1000)
    return res.status(401).send({
      error: 'Unauthorized',
    });

  if (!role === 'manager' || !role === 'gardener')
    return res.status(401).send({
      error: 'Unauthorized',
    });

  //finds user in DB to find name
  const user = await User.findOne({
    _id,
  });
  let updatedPlant;
  if (waterNext) {
    updatedPlant = {
      'watering.waterNext': waterNext,
      'watering.lastWateredBy': `${user.name} ${user.surname}`,
      'watering.lastWateredDate': Date.now(),
    };
  }
  if (fertNext) {
    updatedPlant = {
      'fertilization.fertNext': fertNext,
      'fertilization.lastFertBy': `${user.name} ${user.surname}`,
      'fertilization.lastFertDate': Date.now(),
    };
  }
  try {
    // decode token to get role and user id
    // Update plant based on id
    await Plant.updateOne(
      {
        _id: selectedPlant,
      },
      {
        $set: updatedPlant,
      }
    );
    return res.status(200).json({
      message: 'Plant updated',
    });
  } catch (error) {
    res.status(500).send({
      message: 'Internal server error when updating plant',
      error,
    });
  }
};

exports.updatePlantCare = async (req, res) => {
  const { id } = req.params;
  const { waterNext, fertNext, lastPostponedReason } = req.body;
  // Checks if there is any headers in request
  const headers = req.headers.authorization;
  if (!headers)
    return res.status(401).send({
      error: 'Unauthorized',
    });

  const token = headers.split(' ')[1];
  const { _id, role, exp } = jwtDecode(token);

  //Verify token
  if (Date.now() >= exp * 1000)
    return res.status(401).send({
      error: 'Unauthorized',
    });

  if (!role == 'manager' || !role === 'gardener')
    return res.status(401).send({
      error: 'Unauthorized',
    });

  // lastPostponed is not required so not checking for it
  if (!waterNext && !fertNext)
    return res
      .status(401)
      .json({ error: 'Watering or fertilization field cannot be empty' });

  //finds user in DB to find name
  const user = await User.findOne({
    _id,
  });
  let updatedPlant;
  if (waterNext) {
    updatedPlant = {
      'watering.waterNext': waterNext,
      'watering.lastWateredBy': `${user.name} ${user.surname}`,
      'watering.lastWateredDate': Date.now(),
      'watering.lastPostponedReason': lastPostponedReason
        ? lastPostponedReason
        : 'No reason given', // for now this is the best option, need to test maxLength more (currently not working)
    };
  }

  if (fertNext) {
    updatedPlant = {
      'fertilization.fertNext': fertNext,
      'fertilization.lastFertBy': `${user.name} ${user.surname}`,
      'fertilization.lastFertDate': Date.now(),
      'fertilization.lastPostponedReason': lastPostponedReason
        ? lastPostponedReason
        : 'No reason given', // for now this is the best option, need to test maxLength more (currently not working)
    };
  }
  try {
    await Plant.updateOne(
      {
        _id: id,
      },
      updatedPlant,
      { upsert: true }
    );
    res.status(200).json({ message: 'Plant updated' });
  } catch (error) {
    res.status(500).send({
      message: 'Internal server error when updating plant',
      error,
    });
  }
};

exports.requestPlant = async (req, res) => {
  const { id, date } = req.body;

  if (!isToday(parseISO(date)) && !isPast(parseISO(date))) {
    return res.status(400).json({ error: 'Date is not today' });
  }

  try {
    await Plant.updateOne(
      {
        _id: id,
      },
      { lastRequestedDate: Date.now() },
      { upsert: true }
    );
    res.status(200).json({ message: 'Plant success' });
  } catch (error) {
    res.status(500).send({
      message: 'Internal server error when updating plant',
      error,
    });
  }
};
