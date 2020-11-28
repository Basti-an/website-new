import { Avatar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import withWidth from "@material-ui/core/withWidth";
import classNames from "classnames";
import React, { Component } from "react";
import Config from "../config";

const styles = (theme) => ({
  avatarBase: {
    marginRight: "auto",
    marginLeft: "auto",
    zIndex: 1000,
    marginTop: "5rem",
  },
  BigAvatar: {
    width: "100%",
    height: "100%",
    maxHeight: 255,
    maxWidth: 237,
    marginRight: "auto",
    marginLeft: "auto",

    border: `4px solid ${theme.palette.background.default}`,
    borderRadius: 24,
  },
  smallAvatar: {
    width: 60,
    height: 60,

    borderRadius: 32,
    border: `2px solid ${theme.palette.background.default}`,
  },
  microAvatar: {
    width: 44,
    height: 44,

    borderRadius: 24,
    border: `2px solid ${theme.palette.background.default}`,
  },
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
        src={`${hostUrl}/images/sebastian_2020_crop.jpg`}
        className={avatar}
      />
    );
  }
}

export default withWidth()(withStyles(styles, { withTheme: true })(HeroAvatar));
