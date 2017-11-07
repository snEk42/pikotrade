import { subscribeToExchangeRateChange } from './sockets';
import React, { Component } from 'react';
import masoLogo from './static/images/maso_logo.png';
import bananasImage from './static/images/bananas.png';
import woodImage from './static/images/wood.jpg';
import rockImage from './static/images/rock.png';
import diamondsImage from './static/images/diamonds.jpg';
import enums from './enums';
import './App.css';
import { LiveGraph } from './Graph';

class App extends Component {

  state = {
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
    return fetch(`/api/commodities?limit=${this.maxDisplayedPoints}`)
      .then(res => res.json())
      .then(data => {
        const newExchangeRates = []
        data.forEach(commodity => {
          newExchangeRates[commodity.id] = commodity.data[commodity.data.length - 1].y
        });
        this.setState({ exchangeRates: newExchangeRates, data });
      })
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <div className="App-logo">
            <img src={masoLogo} alt="logo" />
          </div>
          <div className="App-exchangeRates">
            {toPairs(enums.COMMODITIES.idsAsEnum).map(pair => {
              return (
                <div className="row" key={pair}>
                  {pair.map(commodityId => {
                    return (
                      <div className="cell" key={commodityId}>
                        <div className="commodityImageContainer">
                          <img src={getImage(commodityId)} className="commodityImage" alt={enums.COMMODITIES.ids[commodityId].name} />
                        </div>
                        <div className="exchangeRate" style={{ color: enums.COMMODITIES.ids[commodityId].color }}>
                          {this.state.exchangeRates[commodityId] !== 0 && this.state.exchangeRates[commodityId].toFixed(2)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>

        <LiveGraph 
          data={this.state.data}
          lastPoints={this.state.lastPoints}
          maxDisplayedPoints={this.maxDisplayedPoints}
          ref="chart"></LiveGraph>;
      </div>
    );
  }
}

function toPairs(arr) {
  var groups = [];
  for(var i = 0; i < arr.length; i += 2)
  {
      groups.push(arr.slice(i, i + 2));
  }
  return groups
}

function getImage(commodityId) {
  switch (commodityId) {
    case enums.COMMODITIES.BANANAS.id:
      return bananasImage
    case enums.COMMODITIES.ROCK.id:
      return rockImage
    case enums.COMMODITIES.WOOD.id:
      return woodImage
    case enums.COMMODITIES.DIAMONDS.id:
    default:
      return diamondsImage
  }
}

export default App;
