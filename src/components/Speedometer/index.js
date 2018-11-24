import React, {Component} from "react";
import speedometer from "../../assets/speedometer.png";
import "../../App.css";

// const Speedometer = props => {
// const x = props.rotation;

class Speedometer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({x: 90}), 2000);
    setTimeout(() => this.setState({x: 45}), 4000);
    setTimeout(() => this.setState({x: 160}), 6000);
    setTimeout(() => this.setState({x: 20}), 8000);
    setTimeout(() => this.setState({x: 150}), 10000);
    setTimeout(() => this.setState({x: 90}), 12000);
  }

  render() {
    const speedometerRotate = {
      transform: `rotate(${this.state.x}deg)`
    };

    return (
      <div className="speedometer-container">
        <div style={speedometerRotate}>
          <img src={speedometer}/>
        </div>
      </div>
    );
  }
}

export default Speedometer;
