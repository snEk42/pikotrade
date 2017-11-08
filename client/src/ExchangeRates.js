import React, { Component } from 'react';
import enums from './enums';
import bananasImage from './static/images/bananas.png';
import woodImage from './static/images/wood.jpg';
import rockImage from './static/images/rock.png';
import diamondsImage from './static/images/diamonds.jpg';

export class ExchangeRates extends Component {

  render() {
    return (
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
                      {this.props.exchangeRates[commodityId] !== 0 && this.props.exchangeRates[commodityId].toFixed(2)}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
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