const mongoose = require('mongoose');
const { requestStatus } = require('../config/request.enum');

const requestRevokeSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    certHash: {
        type: String,
        required: true
    },
    revokeReason: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        required: false
    },
    note: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true,
        enum: requestStatus
    }
});

module.exports = mongoose.model('RequestRevoke', requestRevokeSchema);
