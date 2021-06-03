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

var userDetailsSchema = new mongoose.Schema({
firstName: {
    type: String,
},
lastName: {
    type: String,
},

phone: {
    type: String,
    validate: {
        validator: function(v) {
        return /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
    },
    // required: true/
},
email: {
    type: String,
    validate: {
        validator: function(v) {
            return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
        },
    required: true
},
profilePicturePath: String, //store the path to profilepic
gender:{
    type: String,
    enum: [
        'Female',
        'Male',
        'Other'
    ]
},
course: {
    type: String,
},
semesters:{
    type: Number,
},
tenthCgpa: Number,
twelfthCgpa: Number,
branchName: String,
gateScore: Number,
ugPercentage: Number,
otherAcademicsName: String,
otherAcademicPercentage: Number
}, schemaOptions);
const UserDetails =mongoose.model('UserDetails', userDetailsSchema);
module.exports = {userDetailsSchema, UserDetails};
