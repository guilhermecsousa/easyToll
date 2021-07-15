const express = require('express')
const app = express()
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://broker.es.av.it.pt:1883')
var client2  = mqtt.connect('mqtt://broker.es.av.it.pt:1883')
var  xml2js = require('xml2js');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const Transaction = require('./models/Transaction');

var pos = [];
var trans = [];

//Middlewares
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());
app.get('/', async (req,res) => { 
  res.json({pos});
});

app.get('/trans', async (req,res) => { 
  Transaction.find().then((result) => {
    var aux = []
    result.forEach(rsu => {
      if(req.query.rsu === rsu.stationID){
        aux.push(rsu)
      }
    })
    res.json({aux});
  })
});

//Connection to MongoDB
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology : true
}).then(() => {
  console.log('Mongodb connected...');
})

//JSON to MongoDB
async function saveOnMongo(result){
  const trans = new Transaction({
    stationID : result.rsun,
    clientID : result.trans.clientId ,    
    veichleID: result.trans.veichleId ,
    value : result.trans.value ,
    date : result.trans.time.split('.')[0] ,
    address : result.trans.address ,
  })      

  try{
    const savedTrans = await trans.save();
    console.log("Entry saved on Mongo.");
  }catch(err){
    console.log(err)
  }
}

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent to the API
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var jsonAux=null;

// Connect to Broker (positions)
client.on('connect', function () {
  client.subscribe('its_center/inqueue/xml/+/Heartbeat', function (err) {
    console.log("Broker1 connected...")
  })
})

client.on('message', function (topic, message) {

    // Message is buffer / XML to JSON
    var parser = new xml2js.Parser();
    var aux = true;
    
    parser.parseString(message.toString(), function (err, result) {
     // console.log(result.Heartbeat.header[0])
      for(i=0; i<pos.length; i++){
        if(pos[i].station_id == result.Heartbeat.header[0].stationID[0]){
          pos[i].longitude = result.Heartbeat.body[0].position[0].longitude[0] ;
          pos[i].latitude = result.Heartbeat.body[0].position[0].latitude[0];
          aux = false;
        }
      }
      if(aux) pos.push({station_id:  result.Heartbeat.header[0].stationID[0], 
                        longitude:  result.Heartbeat.body[0].position[0].longitude[0],
                        latitude:  result.Heartbeat.body[0].position[0].latitude[0] }) 
    });
})

// Connect to Broker (transactions)
client2.on('connect', function () {
  client2.subscribe('transaction/+', function (err) {
    console.log("Broker2 connected...")
  })
})

client2.on('message', function (topic, message) {
  var s = message.toString()
  s = s.replaceAll("'",'"')  
  var aux = JSON.parse(s)

  trans.push(aux)
  jsonAux = {rsun : topic.split('/')[1], trans: aux}
  saveOnMongo(jsonAux);
})

app.listen(8000)