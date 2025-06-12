const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, password: hashed });
    await user.save();
    res.status(201).json({ msg: 'User registered' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
});

module.exports = router;