//Not used

const mongoose = require('mongoose');

const RSUSchema = mongoose.Schema({
    stationID : {
        type : Number,
        required : true
    },
    generationDateTime: {
        type: Date,
    },    
    lastBootDateTime : {
        type : Date,
    },
    ipAddress : {
        type : String,
        required : true,
    },  
    latitude : {
        type : Number,
        required : true,
    },  
    longitude : {
        type : Number,
        required : true,
    },
    altitude : {
        type : Number,
        required : true,
    },
    cpuUsagePercentage : {
        type : Number,
        required : true
    },
    memoryUsagePercentage : {
        type : Number,
        required : true
    },
    freeDiskSpacePercentage : {
        type : Number,
        required : true
    },           
});

module.exports = mongoose.model('RSUs', RSUSchema);