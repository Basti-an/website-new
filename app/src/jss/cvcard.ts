import { Theme, makeStyles } from "@material-ui/core";

export const cvCardStyles = makeStyles((theme: Theme) => ({
  card: {
    zIndex: 1000,
    transformStyle: "preserve-3d",
    willChange: "transform, filter",
    transformOrigin: "center",
  },
  media: {
    transformStyle: "preserve-3d",
    height: "170px",
    margin: theme.spacing(4),
    marginBottom: "2rem",
    backgroundSize: "contain !important",
  },
  noMargin: {
    height: `${170 + theme.spacing(4)}px`,
    paddingBottom: "2rem",
    margin: 0,
    backgroundSize: "cover !important",
  },
  cardContent: {
    transformStyle: "preserve-3d",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  cardHeader: {
    transformStyle: "preserve-3d",
    backgroundColor: theme.palette.primary.main,
    height: "100%",
  },
  text: {
    transformStyle: "preserve-3d",
    // color: `${theme.palette.primary.contrastText}`,
    transform: "translateZ(40px)",
    color: "transparent !important",
    "& > span": {
      color: "#fff !important",
    },
  },
  title: {
    fontWeight: 700,
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
    zIndex: 0,
  },
  noise: {
    willChange: "transform, filter",
    width: "100%",
    height: "100%",
    padding: 8,
    background: `linear-gradient(red, transparent),linear-gradient(to top left, lime, transparent),linear-gradient(to top right, blue, transparent), url("data:image/svg+xml,%3Csvg viewBox='0 0 400 310' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    filter: "contrast(0%) brightness(200%)",
    backgroundBlendMode: "saturation",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: 234,
    backgroundRepeat: "no-repeat",
    opacity: 0,
    top: 0,
    mixBlendMode: "color-dodge",
    backgroundBlendMode: "color-dodge",
    backgroundPosition: "50% 50%",
    backgroundSize: "300% 300%",
    backgroundImage: `linear-gradient(115deg,transparent 0%,#efb2fb 25%,transparent 47%,transparent 53%,#acc6f8 66%,transparent 100%),linear-gradient(115deg,transparent 20%,#ec9bb6 36%,#ccac6f 43%,#69e4a5 50%,#8ec5d6 57%,#b98cce 64%,transparent 80%)`,
    filter: "brightness(.5) contrast(1)",
    zIndex: 1,
  },
}));
