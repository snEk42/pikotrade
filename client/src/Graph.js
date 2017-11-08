import React, { Component } from 'react';
import enums from './enums';
import Highcharts from 'highcharts';
import ReactHighcharts from 'react-highcharts';

export class LiveGraph extends Component {

  state = {
    drawn: false
  }
  
  componentDidMount() {
  }

  shouldComponentUpdate() {
    // So the graph wouldn't get rendered all the time
    // We only need it to render once and then add data
    return false;
  }

  componentWillUnmount() {
    this.refs.chart.destroy();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.drawn && nextProps.data) {
      let chart = this.refs.chart.getChart();
      nextProps.data.forEach(commodity => {
        chart.series[commodity.id-1].setData(commodity.data, false);
      });
      chart.redraw();
      this.setState({ drawn: true });
    }
    if (nextProps.lastPoints) {
      let chart = this.refs.chart.getChart();
      const removePoints = chart.series[0].points.length >= this.props.maxDisplayedPoints;
      nextProps.lastPoints.forEach(change => {
        chart.series[change.commodityId-1].addPoint({ x: change.index, y: change.exchangeRate }, false, removePoints);
      });
      chart.redraw();
    }
  }

  render() {
    const graphConfig = {
      chart: {
          type: 'line',
          animation: Highcharts.svg, // don't animate in old IE
          marginRight: 10,
      },
      title: {
          text: ''
      },
      xAxis: {
          type: 'linear'
          //tickPixelInterval: 150
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
      plotOptions: {
          line: {
              marker: {
                  enabled: true
              }
          },
          series: {
              allowPointSelect: false
          }
      },
      legend: {
        enabled: false,
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
          data: [],
          lineWidth: 5,
          color: enums.COMMODITIES.ids[id].color
        }
      })
    };
    return ( <ReactHighcharts config={graphConfig} ref="chart"></ReactHighcharts> );
  }
}