import { filterStyles } from "../../../jss/synth";
import Knob from "../components/knob";
import MoogWasmFilter from "../../../classes/synth/moogWasmFilter";

const useStyles = filterStyles;

const filterDescription =
  "The filter is used to cut away frequencies from the oscillators signal. Try playing around with the cutoff knob to get a feeling for how it works.";

const resonanceDescription =
  "The resonance is the amount of filter signal that is fed back into the filter - creating a feedback around the cutoff frequency.";

interface IFilterProps {
  filter: MoogWasmFilter | undefined;
}

export default function FilterModule({ filter }: IFilterProps): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.plate} title={filterDescription}>
      <div className={classes.topplate} />
      <div className={classes.headertext}>VCF</div>
      <div className={classes.freqKnob}>
        <Knob
          onChange={(value: number) => {
            // filter.frequency.rampTo(value, 0);
            // window.erebus.wasmMoogFilter?.port.postMessage({ cutoff: value });
            filter?.frequency.rampTo(value, 0);
          }}
          min={20}
          max={20000}
          initial={70}
          isBig
          name="vcf-cutoff"
        />
      </div>
      <div className={classes.text}>Cutoff</div>
      <div className={classes.bottomplate}>resonance</div>
      <div className={classes.resKnob} title={resonanceDescription}>
        <Knob
          onChange={(value: number) => {
            // filter.filter.Q.value = value;
            filter?.filter.port.postMessage({
              resonance: value,
            });
          }}
          min={0.1}
          max={0.99}
          initial={0.3}
          isLinear
          name="vcf-resonance"
        />
      </div>
    </div>
  );
}
