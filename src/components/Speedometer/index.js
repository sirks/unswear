import React, { Component } from "react";
import speedometer from "../../assets/speedometer.png";
import "../../App.css";

// const Speedometer = props => {
// const x = props.rotation;

class Speedometer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x1: 0,
      x2: 0
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ x1: 0, x2: 65 }), 3000);
    setTimeout(() => this.setState({ x1: 10, x2: -55 }), 6000);
  }

  render() {
    const speedometerRotate = {
      transform: `rotate(${this.state.x1}deg) rotate(${this.state.x2}deg)`
    };

    return (
      <div className="speedometer-container">
        <div style={speedometerRotate}>
          <img src={speedometer} />
        </div>
      </div>
    );
  }
}
export default Speedometer;
