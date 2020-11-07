import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import Config from "../config.js";

const styles = (theme) => ({
  heroImage: {
    width: "100vw",
    maxHeight: "calc(50vh - 64px)",
  },
});

/**
 * @TODO rewrite as function
 * @TODO make this thing rotate according to users device orientation
 */
class HeroImage extends Component {
  render() {
    const { classes } = this.props;
    const { hostUrl } = Config;
    /*  we could cycle through heroImages with his src attribute
        using number of images and small cachin times:
        src={`${hostUrl}/images/heroImage${Math.floor(Math.random() * numImges) +
        1}.jpg`
    */
    return (
      <img
        className={classes.heroImage}
        alt="description"
        id="heroImage"
        src={`${hostUrl}/images/heroImage7.jpg`}
      />
    );
  }
}

export default withStyles(styles, { withTheme: true })(HeroImage);
