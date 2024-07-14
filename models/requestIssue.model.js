const mongoose = require('mongoose');

const requestIssue = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    credentialDetails: {
        type: Object,
        required: true
    },
    pdfFile: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    Done: {
        type: Boolean,
        required: false,
        default: false
    }
});

module.exports = mongoose.model('RequestIssue', requestIssue);
