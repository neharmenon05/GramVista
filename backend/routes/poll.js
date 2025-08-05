const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Poll = require('../models/Poll');

router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.type !== 'user') return res.status(403).send('Access denied: User type required');
    const { question, options, tags } = req.body;
    const poll = new Poll({
      userId: req.user.id,
      question,
      options: options.split(',').map(opt => opt.trim()),
      tags: tags.split(',').map(tag => tag.trim())
    });
    await poll.save();
    res.status(201).send('Poll created');
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.type !== 'user') return res.status(403).send('Access denied: User type required');
    const polls = await Poll.find({ userId: req.user.id });
    res.json(polls);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

router.get('/all', async (req, res) => {
  try {
    const polls = await Poll.find();
    res.json(polls);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

router.get('/filter/:tag', async (req, res) => {
  try {
    const polls = await Poll.find({ tags: req.params.tag });
    res.json(polls);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

router.post('/vote/:pollId', authMiddleware, async (req, res) => {
  try {
    if (req.user.type !== 'user') return res.status(403).send('Access denied: User type required');
    const { option } = req.body;
    const poll = await Poll.findById(req.params.pollId);
    if (!poll) return res.status(404).send('Poll not found');
    if (!poll.options.includes(option)) return res.status(400).send('Invalid option');
    if (poll.votes.some(vote => vote.userId.toString() === req.user.id)) {
      return res.status(400).send('User already voted');
    }
    poll.votes.push({ option, userId: req.user.id });
    await poll.save();
    res.send('Vote recorded');
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

router.get('/results/:pollId', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.pollId);
    if (!poll) return res.status(404).send('Poll not found');
    const results = poll.options.reduce((acc, option) => {
      acc[option] = poll.votes.filter(vote => vote.option === option).length;
      return acc;
    }, {});
    res.json({ question: poll.question, results });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

module.exports = router;