import { withStyles } from "@material-ui/core/styles";
import React from "react";
import Config from "../../config.js";

// TODO: change between zingtouch and my implementation based on device
const styles = () => ({
  switch: {
    width: 30
  }
});

class Switch extends React.Component {
  state = {
    active: false
  };

  onInput = () => {
    const { active } = this.state;
    const { onInput } = this.props;
    if (onInput) {
      onInput(active);
    }
  };

  switchHandler = () => {
    console.log("clicked");
    let control = this.refs.switch;
    const { active } = this.state;
    // change view
    if (active) {
      control.style.transform = "rotate(0deg)";
    } else {
      control.style.transform = "rotate(180deg)";
    }
    this.setState({ active: !active }, this.onInput);
  };
  render() {
    const { classes } = this.props;

    return (
      <img
        ref="switch"
        alt="synthesizer switch"
        className={classes.switch}
        src={`${Config.hostUrl}/images/erebus_switch.png`}
        onClick={this.switchHandler}
      />
    );
  }
}
export default withStyles(styles)(Switch);
