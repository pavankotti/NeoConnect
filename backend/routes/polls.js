

const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');
const { protect, authorize } = require('../middleware/auth');



router.post('/', protect, authorize('secretariat', 'admin'), async (req, res) => {
  try {
    const { question, options } = req.body;


    if (!question || !options || options.length < 2) {
      return res.status(400).json({
        message: 'Please provide a question and at least 2 options'
      });
    }


    const formattedOptions = options.map(opt => ({
      text: opt,
      votes: 0
    }));


    const poll = await Poll.create({
      question,
      options: formattedOptions,
      createdBy: req.user._id,
      votedBy: [],
      isActive: true
    });

    await poll.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      poll
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/', protect, async (req, res) => {
  try {
    const polls = await Poll.find({ isActive: true })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      polls
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.post('/:id/vote', protect, authorize('staff'), async (req, res) => {
  try {
    const { optionIndex } = req.body;

    if (optionIndex === undefined) {
      return res.status(400).json({ message: 'Please provide option index' });
    }

    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    if (!poll.isActive) {
      return res.status(400).json({ message: 'Poll is closed' });
    }


    const hasVoted = poll.votedBy.some(
      voterId => voterId.toString() === req.user._id.toString()
    );

    if (hasVoted) {
      return res.status(400).json({ message: 'You have already voted' });
    }


    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ message: 'Invalid option' });
    }


    poll.options[optionIndex].votes += 1;
    poll.votedBy.push(req.user._id);

    await poll.save();

    res.json({
      success: true,
      poll
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
