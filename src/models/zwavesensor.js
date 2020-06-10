const mongoose = require('mongoose');
const { Schema } = mongoose;

const ZWaveSensorSchema = new Schema({
    id: {type: Number, required: true},
    manufacturer: {type: String, required: true},
    manufacturerid: {type: Number, required: true},
    product: {type: String, required: true},
    producttype: {type: String, required: true},
    productid: {type: Number, required: true},
    type: {type: String, required: true},
    ready: {type: Boolean, required: true}

})

module.exports = mongoose.model('zwavesensor', ZWaveSensorSchema);