import { Theme, makeStyles } from "@material-ui/core";

export const cvCardStyles = makeStyles((theme: Theme) => ({
  card: {
    transform: "translate3d(0, 0, 0)",
    WebkitTransform: "translate3d(0, 0, 0)",
    WebkitVackfaceVisibility: "hidden",
  },
  media: {
    height: "170px",
    margin: theme.spacing(4),
    marginBottom: "2rem",
    backgroundSize: "contain !important",
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
    alignSelf: "center !important",
    marginRight: "0 !important",
  },
  collapseParentShift: {
    marginRight: "-64px",
  },
}));
