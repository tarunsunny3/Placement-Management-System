const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
  companyName: String,
  location: String,
  jobDesc: String,
  jobPosition: String,
  jobType: String,
  minCgpa: Number,
  gateScore: Number,
  courses: Array,
  year: Date,
  dateOfExpiry: Date,
  isOpen: Boolean,
  noOfStudentsPlaced: Number,
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

module.exports = mongoose.model('Job', jobSchema);
