import { Avatar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import withWidth from "@material-ui/core/withWidth";
import classNames from "classnames";
import React, { Component } from "react";
import Config from "../config.js";

const styles = theme => ({
  avatarBase: {
    marginRight: "auto",
    marginLeft: "auto",
    zIndex: 1000
  },
  BigAvatar: {
    width: 80,
    height: 80,
    marginRight: "auto",
    marginLeft: "auto",
    marginTop: -47,
    border: "4px solid " + theme.palette.background.default,
    borderRadius: 44
  },
  smallAvatar: {
    width: 60,
    height: 60,
    marginTop: -34,
    borderRadius: 32,
    border: "2px solid " + theme.palette.background.default
  },
  microAvatar: {
    width: 44,
    height: 44,
    marginTop: -26,
    borderRadius: 24,
    border: "2px solid " + theme.palette.background.default
  }
});

class HeroAvatar extends Component {
  getAvatarSize() {
    const { width, classes } = this.props;

    let avatar = classes.BigAvatar;
    if (width === "sm") {
      avatar = classes.smallAvatar;
    } else if (width === "xs") {
      avatar = classes.microAvatar;
    }
    return classNames(classes.avatarBase, avatar);
  }

  render() {
    const { hostUrl } = Config;
    const avatar = this.getAvatarSize();

    return (
      <Avatar
        alt="Sebastian Wiendlocha"
        src={`${hostUrl}/images/sebastian.jpg`}
        className={avatar}
      />
    );
  }
}

export default withWidth()(withStyles(styles, { withTheme: true })(HeroAvatar));
