const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
  companyName: String,
  location: String,
  jobDesc: String,
  jobPosition: String,
  jobType: String,
  minCgpa: Number,
  gateScore: Number,
  courses: {
    type: Array
  },
  year: Date
});

module.exports = mongoose.model('Job', jobSchema);
