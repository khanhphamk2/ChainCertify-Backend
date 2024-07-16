const mongoose = require('mongoose');
const { requestStatus } = require('../config/request.enum');

const requestIssue = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    pdfIpfsHash: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        required: true
    },
    note: {
        type: String,
        required: false,
        default: ''
    },
    status: {
        type: String,
        required: true,
        enum: requestStatus
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        required: false,
        default: null
    },
});

requestIssue.index({ address: 1, pdfIpfsHash: 1 }, { unique: true });

module.exports = mongoose.model('RequestIssue', requestIssue);
