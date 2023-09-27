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
import { useTheme } from "@material-ui/core/styles";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import classNames from "classnames";
import Markdown from "markdown-to-jsx";
import React, { useEffect, useRef, useState } from "react";
import Config from "../config";
import { cvCardStyles } from "../jss";
import { CvEntry } from "../models/cv";
import { getIsMobileOS } from "../utils";

const useStyles = cvCardStyles;

const parseDescription = (description: string | undefined, classes: ClassNameMap) => {
  if (!description) {
    return <></>;
  }
  return (
    <Typography className={classes.text}>
      <Markdown>{description}</Markdown>
    </Typography>
  );
};

type Point = {
  x: number;
  y: number;
};

function clamp(x: number, minmax: number) {
  return x > minmax ? minmax : x < -minmax ? -minmax : x;
}

function abs(x: number) {
  return x >= 0 ? x : x * -1;
}

const isSafari = navigator.userAgent.indexOf("Safari") > -1;
const isFirefox = navigator.userAgent.indexOf("Firefox") > -1;

const applyMouseTrackingToEffects =
  (texts: HTMLElement[], images: HTMLElement[], self: HTMLDivElement) => (e: MouseEvent) => {
    const rect = self.getBoundingClientRect();
    const pos: Point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    const middle: Point = {
      x: rect.width / 2,
      y: rect.height / 2,
    };
    const offset: Point = {
      x: Math.floor((pos.x / rect.width) * 100),
      y: Math.floor((pos.y / rect.height) * 100),
    };
    const rotation: Point = {
      x: clamp((pos.x - middle.x) / 16, 360 / 24),
      y: clamp((pos.y - middle.y) / 9, 360 / 24),
    };

    self.style.transform = `rotateY(${rotation.x}deg) rotateX(${rotation.y * -1}deg)`;

    const brightness = (60 - abs(rotation.y + rotation.x)) * 10 + 100;
    const contrast = (abs(rotation.y) + abs(rotation.x)) * 14;

    // eslint-disable-next-line
    if ((window as any).chrome) {
      // safari does not support css blend-mode: saturation yet
      for (let i = 0; i < texts.length; i += 1) {
        texts[i].style.filter = `contrast(${contrast}%) brightness(${brightness}%)`;
      }
    }

    const lp = 50 + (offset.x - 50) / 1.5;
    const tp = 50 + (offset.y - 50) / 1.5;
    const pa = 50 - offset.x + (50 - offset.y);
    const opacity = 30 + Math.abs(pa) * 1.5;

    for (let i = 0; i < images.length; i += 1) {
      images[i].style.opacity = `${opacity / 100}`;
      images[i].style.backgroundPosition = `${lp}% ${tp}%`;
      images[i].style.filter = `brightness(.66) contrast(${
        ((Math.abs(rotation.x) + Math.abs(rotation.y)) / 30) * 1.33
      })`;
    }
  };

function CVCard(props: CvEntry): JSX.Element {
  /** This Component includes css overwrites based on screen width
   *  basically we overwrite flex rules for card header if the screen width is smaller than "lg"
   *  else we give the card header content a negative right margin to compensate for the width
   *  of the collapse button right next to it
   */
  const { image, url, title, duration, description } = props;
  const cardRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
  const cardHeaderRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const classes = useStyles(theme);
  const descriptionJSX = parseDescription(description, classes);

  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const { hostUrl } = Config;

  useEffect(() => {
    const cardElement = cardRef.current;

    if (!cardElement) {
      return undefined;
    }

    if (getIsMobileOS()) {
      return undefined;
    }

    if (isFirefox) {
      // firefox 3D transforms are slow as hell for complex DOM Elements, dont even bother
      return undefined;
    }

    if (isSafari && getIsMobileOS()) {
      // eslint-disable-next-line
      (DeviceMotionEvent as any).requestPermission().then((response: string) => {
        if (response === "granted") {
          console.log("accelerometer permission granted");
          // Do stuff here
        }
      });
    }

    const texts = [...(cardElement.getElementsByTagName("span") as HTMLCollectionOf<HTMLElement>)];
    const images = [
      ...(cardElement.getElementsByClassName("foil-overlay") as HTMLCollectionOf<HTMLElement>),
    ];
    const track3D = applyMouseTrackingToEffects(texts, images, cardElement);
    cardElement.addEventListener("mousemove", track3D);

    return () => {
      cardElement.removeEventListener("mousemove", track3D);
    };
  }, [cardRef]);

  return (
    <Card
      elevation={4}
      className={classNames(classes.card, "3D-Card")}
      // overwrite card background if needed
      style={image.background ? { backgroundColor: image.background } : {}}
      ref={cardRef}
    >
      <a target="_blank" rel="noopener noreferrer" href={url}>
        <CardMedia
          className={classNames(classes.media, image.fullWidth && classes.noMargin)}
          image={`${hostUrl}/images/${image.url}`}
          title={image.title}
          style={image.background ? { backgroundColor: image.background } : {}}
        />
        <div className={classNames(classes.overlay, "foil-overlay")} />
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
          title: classNames(classes.text, classes.noise, classes.title),
          subheader: classNames(classes.text, classes.noise),
          action: classes.collapseChildRoot,
          content: (description && !isSmall && classes.collapseParentShift) || "",
        }}
        ref={cardHeaderRef}
        action={
          description && (
            <CardActions
              className={classNames(classes.actions, isSmall && classes.collapseChildOverwrite)}
            >
              <IconButton
                className={classNames(
                  classes.expand,
                  classes.text,
                  classes.noise,
                  expanded && classes.expandOpen,
                )}
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
