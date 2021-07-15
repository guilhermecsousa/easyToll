const mongoose = require('mongoose');

const TransSchema = mongoose.Schema({
    stationID : {
        type : String,
        required : true
    },
    clientID: {
        type: String,
        required : true,
    },    
    veichleID: {
        type: String,
        required : true,
    },
    value : {
        type : Number,
        required : true,
    },
    date : {
        type : String,
        required : true,
    }, 
    address : {
        type : String,
    },          
});

module.exports = mongoose.model('Transaction', TransSchema);