const mongoose = require('mongoose');

const statesSchema = new mongoose.Schema({
    stateCode: {
        type: String,
        required: true,
        unique: true
    },
    funfacts: {
        type: Array,
    }
}, { collection: 'States' }); 

const States = mongoose.model('States', statesSchema);

module.exports = States;
