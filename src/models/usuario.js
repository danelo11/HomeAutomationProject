const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    date: {type: Date}
})

UserSchema.methods.encryptPassword = async (password) => {
    const cifrado = await bcrypt.genSalt(5);
    const hash = bcrypt.hash(password, cifrado);
    return hash;
}

UserSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password, this.password);
    
}

module.exports = mongoose.model('usuario', UserSchema);