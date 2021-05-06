const UserModel = require('../models/User');
const Plant = require('../models/Plant');
const bcrypt = require('bcryptjs');

//
// @USER
//

// Managers can create users
exports.createUser = async (req, res) => {
  const {name, surname, role, email, password} = req.body;
  // validate fields
  if (!name || !surname || !role || !email || !password) {
    return res.status(400).json({
      error: 'name, surname, role, email and password is required',
    });
  }

  // Return 400 if user exists
  const userExists = await UserModel.exists({email});
  if (userExists) return res.status(400).json({error: 'User already exists'});

  const passwordHash = bcrypt.hashSync(password, 10);

  const user = new UserModel({
    name,
    surname,
    role,
    email,
    password: passwordHash,
  });

  // Save new user to db
  try {
    await user.save();
    res.status(200).json({name, surname, role, email});
  } catch (error) {
    res
      .status(500)
      .json({error: 'internal server error when creating user', error});
  }
};

// Manager can only get all users information (not id, password)
exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await UserModel.find({}, [
      'name',
      'surname',
      'email',
      'role',
      '-_id',
    ]);

    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({error: 'Could not get all users'}, error);
  }
};

// Manager can update user information (not id, password)
exports.updateUser = async (req, res) => {
  const email = req.body.selectedUser;
  const password = req.body.password;
  const newEmail = req.body.email;

  // status 400 if body is empty
  if (!req.body)
    return res.status(400).send({error: 'Data to update cannot be empty!'});
  // status 400 if password is in body
  if (password) return res.status(400).send({error: 'Cannot update password'});
  //check if user exists
  const userExists = await UserModel.exists({email});
  if (!userExists)
    return res
      .status(400)
      .send({error: `Cannot find user with email ${email}`});
  // Check if new email is already in use
  const newEmailExists = await UserModel.exists({email: newEmail});
  if (newEmailExists)
    return res.status(400).send({
      error: `Another user is already using the following email ${newEmail}`,
    });

  try {
    // Update user based on email
    const updatedUser = await UserModel.findOneAndUpdate({email}, req.body, {
      useFindAndModify: false,
    });
    res.status(200).send({
      name: updatedUser.name,
      surname: updatedUser.surname,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    res
      .status(500)
      .send({message: 'Internal server error when updating user', error});
  }
};

// Manager can only delete users
exports.deleteUser = async (req, res) => {
  const email = req.body.email;

  // Check if user exists
  const userExists = await UserModel.exists({email});
  if (!userExists)
    return res
      .status(400)
      .send({error: `Cannot find user with email ${email}`});

  // Find user and delete using email
  try {
    await UserModel.findOneAndDelete({email});
    res.status(200).send({
      message: `User with email=${email} was deleted successfully`,
    });
  } catch (error) {
    res
      .status(500)
      .send({message: 'Internal server error when deleting user', error});
  }
};

//
// @PLANT
//

exports.createPlant = async (req, res) => {
  const {
    name,
    lighting,
    responsible,
    information,
    placement,
    watering,
    fertilization,
  } = req.body;
  // validate fields
  if (
    !name ||
    !placement ||
    !watering ||
    !fertilization ||
    !lighting
  ) {
    return res.status(400).json({
      error:
        'name, information, placement, fertilization and lighting is required',
    });
  }

  const plant = new Plant({
    name,
    lighting,
    responsible,
    placement,
    watering,
    fertilization,
    information,
  });

  const convertWaterFreqToMilli = plant.watering.waterFrequency * 86400000;
  const convertFertFreqToMilli = plant.fertilization.fertFrequency * 86400000;

  plant.watering.waterNext = new Date(Date.now() + convertWaterFreqToMilli);
  plant.fertilization.fertNext = new Date(Date.now() + convertFertFreqToMilli);

  // Save new plant to db
  try {
    await plant.save();
    res
      .status(200)
      .json({message: `Plant with name ${plant.name} has been created.`});
  } catch (error) {
    res
      .status(500)
      .json({error: 'internal server error when creating plant', error});
  }
};

exports.deletePlant = async (req, res) => {
  const {id} = req.params;
  const plantExist = await Plant.exists({_id: id});
  if (!plantExist)
    return res.status(400).json({error: `Cannot find plant with id ${id}`});

  try {
    await Plant.findOneAndDelete({_id: id});
    res.status(200).json({
      message: `Plant with id ${id} was deleted successfully`,
    });
  } catch (error) {
    res
      .status(500)
      .send({message: 'Internal server error when deleting plant'}, error);
  }
};
