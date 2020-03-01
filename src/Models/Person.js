const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const PersonModel = mongoose.model('person', PersonSchema);
module.exports = PersonModel;
