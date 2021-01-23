import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  IconButton,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import classNames from "classnames";
import React, { useState } from "react";
import Config from "../config";
import { parseMarkdownLinks } from "../functions";
import { CvEntry } from "../models/cv";

const useStyles = makeStyles((theme) => ({
  card: {
    transform: "translate3d(0, 0, 0)",
    WebkitTransform: "translate3d(0, 0, 0)",
    WebkitVackfaceVisibility: "hidden",
  },
  media: {
    height: "170px",
    margin: theme.spacing(4),
    marginBottom: "2rem",
    backgroundSize: "contain",
  },
  noMargin: {
    height: `${170 + theme.spacing(4)}px`,
    paddingBottom: "2rem",
    margin: 0,
    backgroundSize: "cover",
  },
  cardContent: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
    height: "100%",
  },
  text: {
    color: theme.palette.primary.contrastText,
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: "auto",
    color: theme.palette.primary.contrastText,
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  actions: {
    marginRight: -theme.spacing(1),
    marginTop: "-5px",
  },
  collapseParentOverwrite: {
    flexDirection: "column",
    height: "100%",
  },
  collapseChildOverwrite: {
    alignSelf: "center",
    marginTop: "5px",
    marginBottom: "-1em",
  },
  collapseChildRoot: {
    alignSelf: "center",
    marginRight: "0",
  },
  collapseParentShift: {
    marginRight: "-64px",
  },
}));

const parseDescription = (description: string | undefined, classes: ClassNameMap) => {
  if (!description) {
    return <></>;
  }
  const descriptionJSX = parseMarkdownLinks(description, classes.text);
  return <Typography className={classes.text}>{descriptionJSX}</Typography>;
};

function CVCard(props: CvEntry): JSX.Element {
  /** This Component includes css overwrites based on screen width
   *  basically we overwrite flex rules for card header if the screen width is smaller than "lg"
   *  else we give the card header content a negative right margin to compensate for the width
   *  of the collapse button right next to it
   */
  const { image, url, title, duration, description } = props;
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const classes = useStyles(theme);
  const descriptionJSX = parseDescription(description, classes);

  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const { hostUrl } = Config;

  return (
    <Card
      elevation={4}
      className={classes.card}
      // overwrite card background if needed
      style={image.background ? { backgroundColor: image.background } : {}}
    >
      <a target="_blank" rel="noopener noreferrer" href={url}>
        <CardMedia
          className={classNames(classes.media, image.fullWidth && classes.noMargin)}
          image={`${hostUrl}/images/${image.url}`}
          title={image.title}
          style={image.background ? { backgroundColor: image.background } : {}}
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
        className={classNames(classes.cardHeader, isSmall && classes.collapseParentOverwrite)}
        classes={{
          title: classes.text,
          subheader: classes.text,
          action: classes.collapseChildRoot,
          content: (description && !isSmall && classes.collapseParentShift) || "",
        }}
        action={
          description && (
            <CardActions
              className={classNames(classes.actions, isSmall && classes.collapseChildOverwrite)}
            >
              <IconButton
                className={classNames(classes.expand, expanded && classes.expandOpen)}
                onClick={() => {
                  setExpanded(!expanded);
                }}
                aria-expanded={expanded}
                aria-label="Show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
          )
        }
      />
      {description && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent className={classes.cardContent}>{descriptionJSX}</CardContent>
        </Collapse>
      )}
    </Card>
  );
}

export default CVCard;
