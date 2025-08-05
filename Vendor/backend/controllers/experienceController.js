const Experience = require('../models/Experience');

exports.addExperience = async (req, res) => {
  const exp = new Experience(req.body);
  await exp.save();
  res.json({ message: 'Experience added' });
};

exports.getExperiences = async (req, res) => {
  const { vendorName } = req.query;
  const exps = await Experience.find({ vendorName });
  res.json(exps);
};
