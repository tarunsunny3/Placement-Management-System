const mongoose = require('mongoose');
var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
};

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
  salaryPackage: String,
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
}, schemaOptions);

module.exports = mongoose.model('Job', jobSchema);
