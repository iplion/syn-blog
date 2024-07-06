const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const jwtSecret = 'my_supper_pupper_secret_key_ctrhtn777';

router.post('/register', async (req, res) => {
  const {email, password} = req.body;

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({msg: 'Email already exists'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({email, password: hashedPassword});

    res.status(201).json({msg: 'User registered successfully', newUser});
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({msg: 'Server error'});
  }
});

router.post('/login', async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({msg: 'User not found'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({msg: 'Invalid credentials'});
    }

    const token = jwt.sign({userId: user._id}, jwtSecret, {expiresIn: '1h'});

    res.status(200).json({token});
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({msg: 'Server error'});
  }
});

module.exports = router;
