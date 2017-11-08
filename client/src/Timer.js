import React, { Component } from 'react';

export class Timer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      phase: 'BEFORE',
      secondsUntilStart: 300,
      secondsUntilGameEnd: 90*60,
      lastClearedIncrementer: null
    };
    this.incrementer = null;
  }  

  render() {
    return (
      <div className="App-timer">

        {this.state.phase === 'BEFORE'
          && <div className="fullHeightCapture">
              Vítejte na MaSe
              </div>}

        {this.state.phase === 'AFTER'
          && <div className="fullHeightCapture" style={{ color: 'red' }}>
              Hra skončila
              </div>}

        {this.state.phase === 'COMMENCING'
          && <div className="fullHeightCapture">
              Vítejte na MaSe
              </div>}

        {this.state.phase === 'RUNNING'
          && <div className="fullHeightCapture">
              Vítejte na MaSe
              </div>}
        <div className="capture">Hra začne za</div>
        <div className="value">{formattedSeconds(this.state.secondsElapsed)}</div>
      </div>
    );
  }
}

function formattedSeconds(sec) {
  return Math.floor(sec / 60) + ':' + ('0' + sec % 60).slice(-2)
}


// class Stopwatch extends React.Component {
// constructor(props) {
//   super(props);
//   this.state = { 
//     secondsElapsed: 0, 
//     laps: [],
//     lastClearedIncrementer: null
//   };
//   this.incrementer = null;
// }  
  
// handleStartClick() {
//   this.incrementer = setInterval( () =>
//     this.setState({
//       secondsElapsed: this.state.secondsElapsed + 1
//     })
//   , 1000);
// }

// handleStopClick() {
//   clearInterval(this.incrementer);
//   this.setState({
//     lastClearedIncrementer: this.incrementer
//   });
// }

// handleResetClick() {
//   clearInterval(this.incrementer);
//   this.setState({
//     secondsElapsed: 0,
//     laps: []
//   });
// }

// render() {
//   return (
//     <div className="stopwatch">
//       <h1 className="stopwatch-timer">{formattedSeconds(this.state.secondsElapsed)}</h1>
 
//       {(this.state.secondsElapsed === 0 ||
//         this.incrementer === this.state.lastClearedIncrementer
//         ? <Button className="start-btn" onClick={this.handleStartClick.bind(this)}>start</Button>
//         : <Button className="stop-btn" onClick={this.handleStopClick.bind(this)}>stop</Button>
//       )}
      
//       {(this.state.secondsElapsed !== 0 &&
//         this.incrementer !== this.state.lastClearedIncrementer
//         ? <Button onClick={this.handleLabClick.bind(this)}>lab</Button>
//         : null
//       )}


//       {(this.state.secondsElapsed !== 0 &&
//         this.incrementer === this.state.lastClearedIncrementer
//         ? <Button onClick={this.handleResetClick.bind(this)}>reset</Button>
//         : null
//       )}

//       <ul className="stopwatch-laps">
//         { this.state.laps.map((lap, i) =>
//             <li className="stopwatch-lap"><strong>{i + 1}</strong>/ {formattedSeconds(lap)}</li>)
//         }
//       </ul>
//     </div>
//   );
// }
// }