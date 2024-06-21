const mongoose = require('mongoose');

const CredentialSchema = new mongoose.Schema({
    id : {
        type: String,
        required: true,
    },
    holder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Holder',
        required: true,
    },
    issuer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Issuer',
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    hashCredential: {
        type: String,
        required: true,
    },
    publishedDate: {
        type: Date,
        required: true,
    },
    expirationDate: {
        type: Date,
        required: true,
    },
    credentialStatus: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Credential', CredentialSchema);