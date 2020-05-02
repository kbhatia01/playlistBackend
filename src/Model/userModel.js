const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    firstName: { type: String, required: true },
    email: { type: String, required: true },
    id: { type: String, required: true },
    lastName: { type: String, required: true },
    photoUrl: String,
    created_at: { type: Date, default: Date.now }
});

const user = mongoose.model('user', userSchema);
// make this available to our users in our Node applications
module.exports = user;