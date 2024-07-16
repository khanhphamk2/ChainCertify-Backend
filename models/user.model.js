const mongoose = require('mongoose');
const roles = require('../config/role.enum');

const userSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        // enum: roles,
    },
    isActive: {
        type: Boolean,
        required: true,
    }
}, {
    timestamps: true,
});


userSchema.index({ address: 1, role: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);