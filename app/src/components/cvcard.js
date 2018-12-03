import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  IconButton,
  Typography
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import withWidth from "@material-ui/core/withWidth";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import classNames from "classnames";
import React from "react";
import Config from "../config.js";
import { parseMarkdownLinks } from "../functions.js";

const styles = theme => ({
  media: {
    height: "170px",
    margin: theme.spacing.unit * 4,
    marginBottom: 0,
    backgroundSize: "contain"
  },
  noMargin: {
    height: 170 + theme.spacing.unit * 4 + "px",
    margin: 0,
    backgroundSize: "cover"
  },
  card: {},
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    }),
    marginLeft: "auto"
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  actions: {
    marginRight: -(theme.spacing.unit * 1),
    marginTop: "-5px"
  },
  collapseParentOverwrite: {
    flexDirection: "column"
  },
  collapseChildOverwrite: {
    alignSelf: "center",
    marginBottom: "-1em"
  },
  collapseChildRoot: {
    alignSelf: "center",
    marginRight: "0"
  },
  collapseParentShift: {
    marginRight: "-64px"
  }
});

class CVcard extends React.Component {
  /** This Component includes css overwrites based on screen width
   *  basically we overwrite flex rules for card header if the screen width is smaller than "lg"
   *  else we give the card header content a negative right margin to compensate for the width
   *  of the collapse button right next to it
   */
  state = { expanded: false, description: null };
  hostUrl = Config.hostUrl;

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  componentDidMount = () => {
    let { description } = this.props;
    if (description) {
      let descriptionJSX = parseMarkdownLinks(description);
      descriptionJSX = <Typography>{descriptionJSX}</Typography>;

      this.setState({ descriptionJSX });
    }
  };

  render() {
    const { image, url, title, duration, classes, width } = this.props;
    const { descriptionJSX } = this.state;

    // base rendering of collapse button on width
    let overwriteCollapse = false;
    if (width !== "lg" && width !== "xl") {
      overwriteCollapse = true;
    }

    return (
      <Card className={classes.card}>
        <a target="_blank" href={url}>
          <CardMedia
            className={classNames(
              classes.media,
              image.fullWidth && classes.noMargin
            )}
            image={`${this.hostUrl}/images/` + image.url}
            title={image.title}
          />
        </a>
        {/* we have to overwite the class of header
            because the "root" of cardHeader action
            is NOT actually the root class..
            we also overwrite the width of the CardHeaderContent on screen sizes
            where CardAction is in same row, so CardHeaderContent is always centered
        */}
        <CardHeader
          title={title}
          subheader={duration}
          className={classNames(
            classes.cardHeader,
            overwriteCollapse && classes.collapseParentOverwrite
          )}
          classes={{
            action: classes.collapseChildRoot,
            content:
              descriptionJSX &&
              !overwriteCollapse &&
              classes.collapseParentShift
          }}
          action={
            descriptionJSX && (
              <CardActions
                className={classNames(
                  classes.actions,
                  overwriteCollapse && classes.collapseChildOverwrite
                )}
              >
                <IconButton
                  className={classNames(
                    classes.expand,
                    this.state.expanded && classes.expandOpen
                  )}
                  onClick={this.handleExpandClick}
                  aria-expanded={this.state.expanded}
                  aria-label="Show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </CardActions>
            )
          }
        />
        {descriptionJSX && (
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent>{descriptionJSX}</CardContent>
          </Collapse>
        )}
      </Card>
    );
  }
}

export default withWidth()(withStyles(styles)(CVcard));
