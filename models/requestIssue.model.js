const mongoose = require('mongoose');
const { requestStatus } = require('../config/request.enum');

const requestIssue = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    jsonData: {
        type: String,
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
    updateAt: {
        type: Date,
        required: false
    },
    status: {
        type: String,
        required: true,
        enum: requestStatus
    }
});

module.exports = mongoose.model('RequestIssue', requestIssue);
