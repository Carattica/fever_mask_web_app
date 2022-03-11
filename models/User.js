const mongoose = require('mongoose');

const conn = mongoose.createConnection(process.env.USER_DB, {useNewUrlParser: true, useUnifiedTopology: true}); 
conn.on('open',()=>{
    console.log('Connected to the Users Database');
});
conn.on('error',()=>{
    console.log('Error in connecting to the Users Database');
});

// db schema for a user of the website
// name, email, password
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});

module.exports = conn.model('User', UserSchema);