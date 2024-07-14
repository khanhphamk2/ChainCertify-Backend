const mongoose = require('mongoose');

const holderSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    certHash: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Holder', holderSchema);