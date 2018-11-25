import React, {Component} from "react";
import speedometer from "../../assets/speedometer.png";
import "../../App.css";

class Speedometer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const dgrees = (1 - (1 - this.props.level) ** 4) * 180;
    const speedometerRotate = {
      transform: `rotate(${dgrees}deg)`
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
