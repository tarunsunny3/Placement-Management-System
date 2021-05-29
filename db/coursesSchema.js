const mongoose = require('mongoose');
const coursesSchema= new mongoose.Schema({
  courseName: String
});

module.exports = mongoose.model('Course', coursesSchema);
