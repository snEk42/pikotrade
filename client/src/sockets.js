import openSocket from 'socket.io-client';

const  socket = openSocket('https://pikotrade-staging.herokuapp.com/');
function subscribeToExchangeRateChange(cb) {
  socket.on('exchangeRateChange', exchangeRates => cb(null, exchangeRates));
  socket.emit('subscribeToExchangeRateChange', 1000);
}

export { subscribeToExchangeRateChange };