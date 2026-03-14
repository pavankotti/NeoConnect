

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');



router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role, department } = req.body;


    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }




    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);







    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: role || 'staff',
      department: department || undefined
    });


    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );


    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }


    const user = await User.findOne({ email }).select('+password');




    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }


    const isMatch = await bcrypt.compare(password, user.password);






    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }


    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );


    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



router.get('/me', async (req, res) => {
  try {








    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/case-managers', protect, authorize('secretariat', 'admin'), async (req, res) => {
  try {
    const caseManagers = await User.find({ role: 'case_manager' })
      .select('_id name email department');

    res.json({ caseManagers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
