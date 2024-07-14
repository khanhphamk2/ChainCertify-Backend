const mongoose = require('mongoose');

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
    note: {
        type: String,
        required: false
    },
    done: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('RequestRevoke', requestRevokeSchema);
