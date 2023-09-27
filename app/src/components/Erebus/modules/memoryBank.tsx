import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../../contexts/store";
import { memoryBankStyles } from "../../../jss/synth";

const useStyles = memoryBankStyles;

const defaultPatches = {
  default:
    '{"erebus-knobs-lfo-rate":0.6,"erebus-knobs-lfo-amplitude":0.3,"erebus-switches-lfo-waveform":false,"erebus-knobs-delay-time":0.5,"erebus-knobs-delay-feedback":0.25,"erebus-knobs-osc-mix": 15,"erebus-knobs-osc-OSC 1-tuning":500,"erebus-switches-osc-octave-left":-1,"erebus-switches-osc-octave-right":-1,"erebus-knobs-osc-OSC 2-tuning":510,"erebus-knobs-osc-1-glide":1,"erebus-switches-osc-waveform-left":-1,"erebus-switches-osc-waveform-right":1,"erebus-knobs-osc-2-glide":1,"erebus-knobs-vcf-cutoff":70,"erebus-knobs-vcf-resonance":7,"erebus-knobs-vca-output":150,"erebus-knobs-vca-attack":0.01,"erebus-knobs-vca-release":0.42,"erebus-knobs-adsr-a":1,"erebus-knobs-adsr-d":1.42,"erebus-knobs-adsr-s":1.5,"erebus-knobs-adsr-r":1.7,"erebus-knobs-adsr-depth":0.4,"erebus-knobs-outputs-ENV-scaling":0.8,"erebus-knobs-outputs-LFO-scaling":0.8,"erebus-knobs-outputs-LFO2-scaling":0.8,"erebus-outputs-LFO-connectedWith":2,"erebus-outputs-LFO2-connectedWith":5}',
  castles:
    '{"erebus-knobs-lfo-rate":0.6,"erebus-knobs-lfo-amplitude":0.3964285714285714,"erebus-switches-lfo-waveform":false,"erebus-knobs-delay-time":0.223872113856834,"erebus-knobs-delay-feedback":0.33464285714285713,"erebus-knobs-delay-wet":0.11071428571428571,"erebus-knobs-osc-mix":20.357142857142858,"erebus-knobs-osc-OSC 1-tuning":496.42857142857144,"erebus-switches-osc-octave-left":-1,"erebus-switches-osc-octave-right":1,"erebus-knobs-osc-OSC 2-tuning":500,"erebus-knobs-osc-1-glide":1,"erebus-switches-osc-waveform-left":-1,"erebus-switches-osc-waveform-right":1,"erebus-knobs-osc-2-glide":1,"erebus-knobs-vcf-cutoff":331.76584715160124,"erebus-knobs-vcf-resonance":5.145583248450762,"erebus-knobs-vca-output":150,"erebus-knobs-vca-attack":0.01,"erebus-knobs-vca-release":0.42,"erebus-knobs-adsr-a":2.8565736250567033,"erebus-knobs-adsr-d":1.42,"erebus-knobs-adsr-s":1.5,"erebus-knobs-adsr-r":1.7,"erebus-knobs-adsr-depth":0.7,"erebus-knobs-outputs-ENV-scaling":0.32857142857142857,"erebus-knobs-outputs-LFO-scaling":0.6964285714285714,"erebus-knobs-outputs-LFO2-scaling":0.28214285714285714,"erebus-outputs-ENV-connectedWith":4,"erebus-outputs-LFO-connectedWith":2,"erebus-outputs-LFO2-connectedWith":5}',
  uboot:
    '{"erebus-knobs-lfo-rate":6.539830578818348,"erebus-knobs-lfo-amplitude":0.8142857142857143,"erebus-switches-lfo-waveform":true,"erebus-knobs-delay-time":0.38206992853222144,"erebus-knobs-delay-feedback":0.40214285714285714,"erebus-knobs-delay-wet":0.22857142857142856,"erebus-knobs-osc-mix":27.500000000000004,"erebus-knobs-osc-OSC 1-tuning":500,"erebus-switches-osc-octave-left":0,"erebus-switches-osc-octave-right":1,"erebus-knobs-osc-OSC 2-tuning":500,"erebus-knobs-osc-1-glide":1,"erebus-switches-osc-waveform-left":1,"erebus-switches-osc-waveform-right":1,"erebus-knobs-osc-2-glide":1,"erebus-knobs-vcf-cutoff":31.271916611281252,"erebus-knobs-vcf-resonance":19.239801441324843,"erebus-knobs-vca-output":120.69999999999999,"erebus-knobs-vca-attack":0.01,"erebus-knobs-vca-release":0.42,"erebus-knobs-adsr-a":4,"erebus-knobs-adsr-d":1.7338092654411672,"erebus-knobs-adsr-s":1.5642857142857143,"erebus-knobs-adsr-r":1.7,"erebus-knobs-adsr-depth":0.9964285714285714,"erebus-knobs-outputs-ENV-scaling":0.7785714285714286,"erebus-knobs-outputs-LFO-scaling":0.8,"erebus-knobs-outputs-LFO2-scaling":0.8,"erebus-outputs-ENV-connectedWith":4,"erebus-outputs-LFO-connectedWith":2,"erebus-outputs-LFO2-connectedWith":1}',
  bassdrum:
    '{"erebus-knobs-lfo-rate":0.6,"erebus-knobs-lfo-amplitude":0.22857142857142856,"erebus-switches-lfo-waveform":false,"erebus-knobs-delay-time":0.13117683340132472,"erebus-knobs-delay-feedback":0.27035714285714285,"erebus-knobs-delay-wet":0.11071428571428571,"erebus-knobs-osc-OSC 1-tuning":500,"erebus-switches-osc-octave-left":-1,"erebus-switches-osc-octave-right":-1,"erebus-knobs-osc-1-glide":1,"erebus-switches-osc-waveform-left":-1,"erebus-switches-osc-waveform-right":0,"erebus-knobs-osc-2-glide":1,"erebus-knobs-vcf-cutoff":90.14482919562938,"erebus-knobs-vcf-resonance":6.826061163185524,"erebus-knobs-vca-output":142.07500000000002,"erebus-knobs-vca-attack":0.010000000000000005,"erebus-knobs-vca-release":0.8707228600679164,"erebus-knobs-adsr-a":1,"erebus-knobs-adsr-d":1.5783242024474502,"erebus-knobs-adsr-s":1.3892857142857142,"erebus-knobs-adsr-r":1.28921086088214,"erebus-knobs-adsr-depth":0.25357142857142856,"erebus-knobs-outputs-ENV-scaling":0.8392857142857143,"erebus-knobs-outputs-LFO-scaling":0.20357142857142857,"erebus-knobs-outputs-LFO2-scaling":0.07142857142857142,"erebus-outputs-ENV-connectedWith":0}',
  growl:
    '{"erebus-knobs-lfo-rate":0.6,"erebus-knobs-lfo-amplitude":0.22857142857142856,"erebus-switches-lfo-waveform":false,"erebus-knobs-delay-time":0.13117683340132472,"erebus-knobs-delay-feedback":0.27035714285714285,"erebus-knobs-delay-wet":0.11071428571428571,"erebus-knobs-osc-mix":36.07142857142857,"erebus-knobs-osc-OSC 1-tuning":500,"erebus-switches-osc-octave-left":-1,"erebus-switches-osc-octave-right":-1,"erebus-knobs-osc-OSC 2-tuning":510.71428571428567,"erebus-knobs-osc-1-glide":1,"erebus-switches-osc-waveform-left":-1,"erebus-switches-osc-waveform-right":1,"erebus-knobs-osc-2-glide":1,"erebus-knobs-vcf-cutoff":305.81831989313855,"erebus-knobs-vcf-resonance":5.015068046830907,"erebus-knobs-vca-output":142.07500000000002,"erebus-knobs-vca-attack":0.04424058881750878,"erebus-knobs-vca-release":0.809332994255307,"erebus-knobs-adsr-a":1.160129386160163,"erebus-knobs-adsr-d":1.6579457579979706,"erebus-knobs-adsr-s":1.4535714285714285,"erebus-knobs-adsr-r":4.209217113231554,"erebus-knobs-adsr-depth":0.7892857142857143,"erebus-knobs-outputs-ENV-scaling":0.5642857142857143,"erebus-knobs-outputs-LFO-scaling":0.20357142857142857,"erebus-knobs-outputs-LFO2-scaling":0.07142857142857142,"erebus-outputs-ENV-connectedWith":5,"erebus-outputs-LFO-connectedWith":1,"erebus-outputs-LFO2-connectedWith":3}',
  swirl:
    '{"erebus-knobs-lfo-rate":0.6,"erebus-knobs-lfo-amplitude":0.3,"erebus-switches-lfo-waveform":false,"erebus-knobs-delay-time":0.5,"erebus-knobs-delay-feedback":0.25,"erebus-knobs-osc-mix":50,"erebus-knobs-osc-OSC 1-tuning":500,"erebus-switches-osc-octave-left":0,"erebus-switches-osc-octave-right":-1,"erebus-knobs-osc-OSC 2-tuning":510,"erebus-knobs-osc-1-glide":1,"erebus-switches-osc-waveform-left":1,"erebus-switches-osc-waveform-right":1,"erebus-knobs-osc-2-glide":1,"erebus-knobs-vcf-cutoff":56.82260526681803,"erebus-knobs-vcf-resonance":19.239801441324843,"erebus-knobs-vca-output":130.675,"erebus-knobs-vca-attack":0.01,"erebus-knobs-vca-release":0.42,"erebus-knobs-adsr-a":3.0015637003300233,"erebus-knobs-adsr-d":1.42,"erebus-knobs-adsr-s":1.5,"erebus-knobs-adsr-r":1.7,"erebus-knobs-adsr-depth":0.8642857142857143,"erebus-knobs-outputs-ENV-scaling":0.575,"erebus-knobs-outputs-LFO-scaling":0.8,"erebus-knobs-outputs-LFO2-scaling":0.8,"erebus-outputs-ENV-connectedWith":4,"erebus-outputs-LFO-connectedWith":2,"erebus-outputs-LFO2-connectedWith":3}',
  o8: '{"erebus-knobs-lfo-rate":0.6,"erebus-knobs-lfo-amplitude":0.3,"erebus-switches-lfo-waveform":false,"erebus-knobs-delay-time":0.5,"erebus-knobs-delay-feedback":0.25,"erebus-knobs-osc-mix":50,"erebus-switches-osc-octave-left":-1,"erebus-switches-osc-octave-right":-1,"erebus-knobs-osc-OSC 2-tuning":510,"erebus-knobs-osc-1-glide":1,"erebus-switches-osc-waveform-left":-1,"erebus-switches-osc-waveform-right":0,"erebus-knobs-osc-2-glide":1,"erebus-knobs-vcf-cutoff":92.62542485472468,"erebus-knobs-vcf-resonance":10.564584336907226,"erebus-knobs-vca-output":150,"erebus-knobs-vca-attack":0.01,"erebus-knobs-vca-release":0.7522713892445291,"erebus-knobs-adsr-a":1,"erebus-knobs-adsr-d":1.1853259871995527,"erebus-knobs-adsr-s":1.282142857142857,"erebus-knobs-adsr-r":1.1898297172551797,"erebus-knobs-adsr-depth":0.4,"erebus-knobs-outputs-ENV-scaling":0.8,"erebus-knobs-outputs-LFO-scaling":0.8,"erebus-knobs-outputs-LFO2-scaling":0.8,"erebus-outputs-ENV-connectedWith":0}',
};

// interface MemoryBankProps {}

interface PatchSelectorProps {
  patches: string[];
  setLoadPatch: (patchName: string) => void;
  setSelectedPatch: (patchName: string) => void;
}

function getPatchNameList(): string[] {
  const patches = localStorage.getItem("erebus-patches");

  if (patches === null) {
    localStorage.setItem("erebus-patches", JSON.stringify([]));
    return [];
  }

  return JSON.parse(patches) as string[];
}

function addToLocalStoragePatchList(patchName: string) {
  const patches = getPatchNameList();
  localStorage.setItem("erebus-patches", JSON.stringify([...patches, patchName]));
}

function PatchSelector({
  patches,
  setLoadPatch,
  setSelectedPatch,
}: PatchSelectorProps): JSX.Element {
  const classes = useStyles();
  const handlePatchSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    window.erebus.vca.ampEnv.triggerRelease();
    // changes loadPatch in synth.tsx, initiating loading of patch values by other components through <LoadContext>
    setLoadPatch(value);
    setSelectedPatch(value);
  };

  return (
    <select
      className={classes.select}
      name="patch-selector"
      id="erebus-patch-selector"
      onChange={handlePatchSelect}
      onKeyPress={(e) => {
        e.preventDefault();
      }}
    >
      {patches.map((patchName: string) => {
        return <option value={patchName}>{patchName}</option>;
      })}
    </select>
  );
}

export default function MemoryBank(): JSX.Element {
  const classes = useStyles();
  const [newPatchName, setNewPatchName] = useState("");
  const [patches, setPatches] = useState(getPatchNameList());
  const storePatch = useContext(StoreContext);
  const { setStorePatchName, setLoadPatchName } = storePatch;
  const [selectedPatch, setSelectedPatch] = useState("initital-patch");

  const changeNewPatchName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewPatchName(value);
  };

  const onSave = () => {
    if (newPatchName === "initial-patch") {
      return;
    }

    let savePatchName = newPatchName;
    const { resetPatch, getPatch } = storePatch;

    if (!newPatchName) {
      // save patch under currently selected patch
      savePatchName = selectedPatch;
      resetPatch(savePatchName);
    }

    // triggers knobs to save their values under the patch name
    setStorePatchName(savePatchName);

    // give all components time to save their values before committing values to localStorage
    setTimeout(() => {
      localStorage.setItem(
        `erebus-patches-${savePatchName}`,
        JSON.stringify(getPatch(savePatchName)),
      );
    }, 1000);

    if (patches.indexOf(savePatchName) !== -1) {
      return;
    }

    addToLocalStoragePatchList(savePatchName);
    setPatches([...patches, savePatchName]);
  };

  useEffect(() => {
    /* initiate default patches if patchlist is empty */
    if (patches.length === 0) {
      console.log("loading initial patches to localStorage");
      const defaultPatchNames = Object.keys(defaultPatches);

      Object.entries(defaultPatches).forEach(([key, value]) => {
        localStorage.setItem(`erebus-patches-${key}`, value);
        addToLocalStoragePatchList(key);
      });

      setPatches(defaultPatchNames);
    }
  }, [patches]);

  return (
    <div className={classes.plate}>
      <p className={classes.headerText}>Memory Bank</p>

      <PatchSelector {...{ patches, setLoadPatch: setLoadPatchName, setSelectedPatch }} />
      <div className={classes.flex}>
        <p className={classes.headerText}>Save patch</p>
        <input
          type="text"
          placeholder="patch name"
          value={newPatchName}
          onChange={changeNewPatchName}
          className={classes.patchNameInput}
        />
        <button onClick={onSave} type="button" className={classes.newPatchButton}>
          Save
        </button>
      </div>
    </div>
  );
}
