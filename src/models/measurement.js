const mongoose = require('mongoose');
const { Schema } = mongoose;

const MeasurementSchema = new Schema({
    sensorid:  {type: Number, required: true},
    tag: {type: String, required: true},
    oldvalue: {type:Object, required: false},
    newvalue: {type:Object, required: false},
    fecha: {type: Date}
});

MeasurementSchema.index({fecha: -1, sensorid: 1, tag: 1});

module.exports = mongoose.model('measurement', MeasurementSchema);