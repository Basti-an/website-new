import { Theme, makeStyles } from "@material-ui/core";

export const cvStyles = makeStyles((theme: Theme) => ({
  yearContainer: {
    marginTop: theme.spacing(4) + 2,
    marginBottom: theme.spacing(3) + 2,
    color: theme.palette.primary.main,
  },
  year: {
    fontWeight: 300,
    color: "#fff",
    backdropFilter: "blur(18px)",
    borderRadius: "4px",
  },
  title: {
    marginRight: "auto",
    marginLeft: "auto",
    // fontSize: "1.5rem",
    fontStyle: "italic",
    marginBottom: "3rem",
    fontWeight: 400,
    color: theme.palette.primary.main,
  },
  grid: {
    paddingBottom: "1rem !important",
    paddingTop: "1rem !important",
  },
  spacer: {
    width: "100%",
    margin: "6rem 0",
  },
}));
