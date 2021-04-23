const express = require('express');
const { getUser, updateUser } = require('../controllers/profile.controller');

const router = express.Router();

router.get('/', getUser);
router.patch('/', updateUser);

module.exports = router;
