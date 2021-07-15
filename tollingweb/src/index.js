import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { Connector } from 'react-mqtt';

ReactDOM.render(
  <Connector mqttProps="ws://broker.es.av.it.pt:1883">
  <React.StrictMode>
   
    <App />
 
  </React.StrictMode>
  </Connector>,
  document.getElementById('root')
);
