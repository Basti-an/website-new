import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import Config from "../config.js";

const styles = theme => ({
  heroImage: {
    width: "100vw"
  }
});

class HeroImage extends Component {
  render() {
    const { classes } = this.props;
    const { hostUrl } = Config;
    /*  we could cycle through heroImages with his src attribute
        using number of images and small cachin times:
        src={`${hostUrl}/images/heroImage${Math.floor(Math.random() * numImages) +
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
