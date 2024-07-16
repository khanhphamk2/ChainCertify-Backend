const mongoose = require('mongoose');
const { userRole } = require('../config/role.enum');

const userSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: userRole,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    }
}, {
    timestamps: true,
});


userSchema.index({ address: 1, role: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);