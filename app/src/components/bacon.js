import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";

const styles = theme => ({
  bacon: {
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 4,
    width: "100%"
  }
});

/**
 * Renders a picture of delicious bacon
 * on mobile devices, the device orientation will be used to flip around the image in 3D space
 */
class Bacon extends Component {
  state = {
    baconTransform: ""
  };

  componentDidMount() {
    window.addEventListener("deviceorientation", this.handleOrientation, true);
  }

  handleOrientation = e => {
    let tiltLR = e.gamma;
    let tiltFB = e.beta;
    let baconTransform = `rotate(${tiltLR}deg)rotate3d(1,0,0,${tiltFB *
      -1}deg)`;
    this.setState({ baconTransform });
  };

  render() {
    const { baconTransform } = this.state;
    const { classes } = this.props;
    return (
      <img
        style={{ transform: baconTransform }}
        className={classes.bacon}
        alt="delicious bacon"
        id="bacon"
        src="https://upload.wikimedia.org/wikipedia/commons/3/31/Made20bacon.png"
      />
    );
  }
}

export default withStyles(styles, { withTheme: true })(Bacon);
