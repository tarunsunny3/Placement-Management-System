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
  year: Number,
  salaryPackage: Number,
  dateOfExpiry: Date,
  closingDate: Date,
  isOpen: {
    type: Boolean,
    default: true
  },
  noOfStudentsPlaced: Number,
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

module.exports = mongoose.model('Job', jobSchema);
