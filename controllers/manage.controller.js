const UserModel = require('../models/User');
const Plant = require('../models/Plant');
const bcrypt = require('bcryptjs');
const merge = require('deepmerge');

const { cloudinary } = require('../helpers/cloudinary.config');
//
// @USER
//

// Managers can create users
exports.createUser = async (req, res) => {
  const { name, surname, role, email, password } = req.body;
  // validate fields
  if (!name || !surname || !role || !email || !password) {
    return res.status(400).json({
      error: 'name, surname, role, email and password is required',
    });
  }

  // Return 400 if user exists
  const userExists = await UserModel.exists({ email });
  if (userExists) return res.status(400).json({ error: 'User already exists' });

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
    res.status(201).json({ name, surname, role, email });
  } catch (error) {
    res.status(500).json({ error: 'internal server error when creating user', error });
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
    res.status(500).json({ error: 'Could not get all users' }, error);
  }
};

// Manager can update user information (not id, password)
exports.updateUser = async (req, res) => {
  const email = req.body.selectedUser;
  const password = req.body.password;
  const newEmail = req.body.email;

  // status 400 if body is empty
  if (!req.body)
    return res.status(400).send({ error: 'Data to update cannot be empty!' });
  // status 400 if password is in body
  if (password) return res.status(400).send({ error: 'Cannot update password' });
  //check if user exists
  const userExists = await UserModel.exists({ email });
  if (!userExists)
    return res.status(400).send({ error: `Cannot find user with email ${email}` });
  // Check if new email is already in use
  const newEmailExists = await UserModel.exists({ email: newEmail });
  if (newEmailExists)
    return res.status(400).send({
      error: `Another user is already using the following email ${newEmail}`,
    });

  try {
    // Update user based on email
    const updatedUser = await UserModel.findOneAndUpdate({ email }, req.body, {
      useFindAndModify: false,
    });
    res.status(200).send({
      name: updatedUser.name,
      surname: updatedUser.surname,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Internal server error when updating user',
      error,
    });
  }
};

// Manager can only delete users
exports.deleteUser = async (req, res) => {
  const email = req.body.email;

  // Check if user exists
  const userExists = await UserModel.exists({ email });
  if (!userExists)
    return res.status(400).send({ error: `Cannot find user with email ${email}` });

  // Find user and delete using email
  try {
    await UserModel.findOneAndDelete({ email });
    res.status(200).send({
      message: `User with email=${email} was deleted successfully`,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Internal server error when deleting user',
      error,
    });
  }
};

//
// @PLANT
//

exports.createPlant = async (req, res) => {
  const {
    name,
    lighting,
    information,
    placement,
    watering,
    fertilization,
    image,
  } = req.body;

  // validate fields
  if (!name || !placement || !watering || !fertilization || !lighting) {
    return res.status(400).json({
      error: 'name, placement, watering, fertilization and lighting is required',
    });
  }
  let setImage;
  if (image) {
    const { public_id } = await cloudinary.uploader.upload(image, {
      upload_preset: 'webproject',
      quality: 60,
    });
    setImage = public_id;
  }

  const plant = new Plant({
    name,
    lighting,
    image: image ? setImage : 'plants/cflhg7mdqmrfcucabwdi', // default image url
    placement,
    watering,
    fertilization,
    information,
  });

  // Save new plant to db
  try {
    await plant.save();
    res.status(201).json({
      message: `Plant with name ${plant.name} has been created.`,
    });
  } catch (error) {
    res.status(500).json({ message: 'internal server error when creating plant', error });
  }
};

exports.updatePlant = async (req, res) => {
  const {
    id,
    name,
    information,
    lighting,
    fertAmount,
    fertFrequency,
    fertNext,
    placement,
    waterAmount,
    waterFrequency,
    waterNext,
    image,
  } = req.body;

  if (!req.body) {
    return res.status(400).json({ error: 'Body cannot be empty' });
  }
  const plant = await Plant.findOne(
    { _id: id },
    'watering fertilization name image -_id'
  );

  if (!plant) {
    return res.status(400).json({ error: `Plant with ${id} does not exist` });
  }

  // let plantImage = plant.image;

  let setImage;
  if (image && plant.image !== 'plants/cflhg7mdqmrfcucabwdi') {
    await cloudinary.uploader.destroy(plant.image, {
      upload_preset: 'webproject',
    });
  }

  if (image) {
    const { public_id } = await cloudinary.uploader.upload(image, {
      upload_preset: 'webproject',
      quality: 60,
    });
    setImage = public_id;
  }

  const updatedPlant = {
    name,
    lighting,
    placement,
    image: image ? setImage : plant.image, // same image as before update
    watering: {
      waterFrequency,
      waterAmount,
      waterNext,
    },
    fertilization: {
      fertFrequency,
      fertAmount,
      fertNext,
    },
    information,
  };

  try {
    await Plant.findOneAndUpdate({ _id: id }, merge(plant.toObject(), updatedPlant));
    res.status(200).json({ message: `Plant ${plant.name} successfully updated` });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error when updating plant', error });
  }
};

exports.deletePlant = async (req, res) => {
  const { id } = req.body;
  const plant = await Plant.findOne({ _id: id });
  if (!plant) return res.status(400).json({ error: `Cannot find plant with id ${id}` });

  console.log(plant.image);
  if (plant.image !== 'plants/cflhg7mdqmrfcucabwdi' && plant.image !== null) {
    await cloudinary.uploader.destroy(plant.image, {
      upload_preset: 'webproject',
    });
  }

  try {
    await Plant.findOneAndDelete({ _id: id });
    res.status(200).json({
      message: `Plant with id ${id} was deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error when deleting plant', error });
  }
};
