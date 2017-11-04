import { subscribeToExchangeRateChange } from './sockets';
import React, { Component } from 'react';
import logo from './static/images/maso_logo.png';
import enums from './enums';
import './App.css';
import Highcharts from 'highcharts';
import ReactHighcharts from 'react-highcharts';

class LiveGraph extends Component {

  constructor(props) {
    super(props);
    subscribeToExchangeRateChange((err, exchangeRateChanges) => {
      if (exchangeRateChanges) {
        let chart = this.refs.chart.getChart();
        exchangeRateChanges.forEach(change => {
            chart.series[change.commodityId-1].addPoint({ x: new Date(change.time).getTime(), y: change.exchangeRate });
        })
      }
    });
  }

  componentDidMount() {
    let chart = this.refs.chart.getChart();
    return fetch('/api/commodities')
      .then(res => res.json())
      .then(data => {
        data.forEach(commodity => {
          commodity.data.forEach(point => {
            chart.series[commodity.id-1].addPoint(point);
          })
        })
      });
  }
  
  componentWillUnmount() {
    this.refs.chart.destroy();
  }
 
  render() {
    const config = {
      chart: {
          type: 'line',
          animation: Highcharts.svg, // don't animate in old IE
          marginRight: 10,
      },
      title: {
          text: ''
      },
      xAxis: {
          type: 'datetime',
          tickPixelInterval: 150
      },
      yAxis: {
          title: {
              text: 'Kurz'
          },
          plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
          }]
      },
      tooltip: {
          enabled: false
      },
      legend: {
        align: 'right',
        verticalAlign: 'top',
        zIndex: 3000,
        x: -10,
        y: 0,
        floating: true
      },
      exporting: {
          enabled: false
      },
      series: enums.COMMODITIES.idsAsEnum.map(function(id) {
        return {
          name: enums.COMMODITIES.ids[id].name,
          data: []
        }
      })
    };
    return <ReactHighcharts config={config} ref="chart"></ReactHighcharts>;
  }
}

class App extends Component {

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <div className="App-logo">
            <img src={logo}  alt="logo" />
          </div>
          <h2>Burza</h2>
        </div>

        <LiveGraph />
      </div>
    );
  }
}

export default App;
