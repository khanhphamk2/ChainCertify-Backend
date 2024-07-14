const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
    certHash: {
        type: String,
        required: true,
    },
    holder: {
        type: String,
        required: true,
    },
    expireDate: {
        type: Date,
        required: true,
    }
});

credentialSchema.index({ certHash: 1, holder: 1 }, { unique: true });

module.exports = mongoose.model('Credential', credentialSchema);