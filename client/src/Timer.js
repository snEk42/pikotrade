import React, { Component } from 'react';

const commencingLength = 6*60*60*1000 + 31*60*1000 //5*60*1000
//const gameLength = 90*60*1000

export class Timer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      phase: getPhase(props.start, props.end),
      msUntilStart: getMSUntil(props.start),
      msUntilEnd: getMSUntil(props.end),
    };
    this.timer = null;
  }

  componentDidMount() {
    this.timer = setInterval(
      () => this.tick(),
      1000
    );
  }

  tick() {
    const newState = getNewState(this.state)
    this.setState(newState)
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.start && nextProps.end) {
      this.setState({
        phase: getPhase(nextProps.start, nextProps.end),
        msUntilStart: getMSUntil(nextProps.start),
        msUntilEnd: getMSUntil(nextProps.end),
      });
    }
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
          && <div>
              <div className="capture">Hra začne za</div>
              <div className="value">{formattedMS(this.state.msUntilStart)}</div>
              </div>}

        {this.state.phase === 'RUNNING'
          && <div>
              <div className="capture">Hra skonci za</div>
              <div className="value">{formattedMS(this.state.msUntilStart)}</div>}
              </div>}
      </div>
    );
  }
}

function formattedMS(ms) {
  let result = ''
  const sec = Math.round(ms / 1000)
  const hours = Math.floor(sec / 3600)
  if (hours > 0) {
    result += hours + ':'
  }
  const minutes = Math.floor(sec / 60) - (hours * 60)
  const fill = (hours > 0 && minutes < 10) ? '0' : ''
  return result + fill + minutes + ':' + ('0' + sec % 60).slice(-2)
}

function getPhase(start, end) {
  const startMs = start.getTime();
  const endMs = end.getTime();
  const nowMs = new Date().getTime();
  if (nowMs < startMs - commencingLength) {
    return 'BEFORE'
  }
  if (nowMs < startMs) {
    return 'COMMENCING'
  }
  if (nowMs < endMs) {
    return 'RUNNING'
  }
  return 'AFTER'
}

function getMSUntil(time) {
  const timeMs = time.getTime();
  const nowMs = new Date().getTime();
  const difference = Math.round(timeMs - nowMs)
  return difference > 0 ? difference : 0
}

function getNewState(state) {
  const newState = {
    msUntilStart: state.msUntilStart - 1000,
    msUntilEnd: state.msUntilEnd - 1000
  }
  newState.phase = getPhaseFromState(newState, state.phase)
  return newState
}

function getPhaseFromState(state, currentPhase) {
  if (Math.round(state.msUntilEnd/1000) === 0) {
    return 'AFTER'
  }
  if (Math.round(state.msUntilStart/1000) === 0) {
    return 'RUNNING'
  }
  if (Math.round((state.msUntilStart - commencingLength)/1000) === 0) {
    return 'COMMENCING'
  }
  return currentPhase
}