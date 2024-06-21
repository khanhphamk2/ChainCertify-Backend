const mongoose = require('mongoose');

const HolderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    publishedDate: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model('Holder', HolderSchema);