const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
    minlength: [3, "Name must be at least 3 letter long."],
    maxlength: [60, "Name must be less than 60 letters"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Emial is required."],
    unique: true,
    lowercase: true,
    trim: true,
    validation: {
      validtor: function(v) {
        return /^\S+@\S+\.\S+$/.test(v);
      },
      message: "Please enter a valid email address."
    }
  },
  password: {
    type: String,
    required: [true, "Password is required"],    
    minlength: [6, "Password must be at least 6 characters long."],
    maxlength: [15, "Password must be less than 15 characters"]
  }
},{
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;


// Create a virtual property that handles formatting cleanly
userSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});