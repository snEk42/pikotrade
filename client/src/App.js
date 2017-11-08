import { subscribeToExchangeRateChange } from './sockets';
import React, { Component } from 'react';
import masoLogo from './static/images/maso_logo.png';
import './App.css';
import { LiveGraph } from './Graph';
import { ExchangeRates } from './ExchangeRates';
import { Timer } from './Timer';

class App extends Component {

  state = {
    game: {
      start: new Date('2017-11-08T10:00:00.000Z'),
      end: new Date('2017-11-08T11:30:00.000Z')
    },
    exchangeRates: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
    }
  }

  maxDisplayedPoints = 60
  
  constructor(props) {
    super(props);
    subscribeToExchangeRateChange((err, exchangeRateChanges) => {
      if (exchangeRateChanges) {
        const newExchangeRates = this.state.exchangeRates
        exchangeRateChanges.forEach(change => {
          newExchangeRates[change.commodityId] = change.exchangeRate
        });
        this.setState({ exchangeRates: newExchangeRates, lastPoints: exchangeRateChanges });
      }
    });
  }

  componentDidMount() {
    fetch(`/api/commodities?limit=${this.maxDisplayedPoints}`)
      .then(res => res.json())
      .then(data => {
        const newExchangeRates = []
        data.forEach(commodity => {
          newExchangeRates[commodity.id] = commodity.data[commodity.data.length - 1].y
        });
        this.setState({ exchangeRates: newExchangeRates, data });
      })
    fetch(`/api/games/1`)
      .then(res => res.json())
      .then(game => this.setState({ game: {
        start: new Date(game.start),
        end: new Date(game.end),
      } }));
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <Timer exchangeRates={this.state.exchangeRates}></Timer>
          <div className="App-logo">
            <img src={masoLogo} alt="logo" />
          </div>
          <ExchangeRates exchangeRates={this.state.exchangeRates}></ExchangeRates>
        </div>

        <LiveGraph 
          data={this.state.data}
          lastPoints={this.state.lastPoints}
          maxDisplayedPoints={this.maxDisplayedPoints}
          ref="chart"></LiveGraph>
      </div>
    );
  }
}

export default App;
