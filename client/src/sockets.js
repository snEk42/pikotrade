import openSocket from 'socket.io-client';

const  socket = openSocket('http://localhost:3000');
function subscribeToExchangeRateChange(cb) {
  socket.on('exchangeRateChange', exchangeRates => cb(null, exchangeRates));
  socket.emit('subscribeToExchangeRateChange', 1000);
}

export { subscribeToExchangeRateChange };