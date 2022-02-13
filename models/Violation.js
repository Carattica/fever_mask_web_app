const mongoose = require('mongoose');

const conn = mongoose.createConnection(process.env.VIOL_DB, {useNewUrlParser: true, useUnifiedTopology: true}); 
conn.on('open',()=>{
    console.log('Connected to the Violations Database');
});
conn.on('error',()=>{
    console.log('Error in connecting to the Violations Database');
});

// db schema for each violation
// time, date, location, type, url
const ViolationSchema = new mongoose.Schema({
    time: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    violationType: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
});

module.exports = conn.model('Violation', ViolationSchema);