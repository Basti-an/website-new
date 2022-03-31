import React, { useEffect } from "react";
import Erebus from "../components/Erebus";

/**
 * Here I wrap the <Synth> component with a component that interacts with
 * the animated background image toggle of the main page
 */
interface WrappedSynthProps {
  setIsFlowing: (flowState: boolean) => void;
}

function WrappedSynth({ setIsFlowing }: WrappedSynthProps): JSX.Element {
  useEffect(() => {
    // toggle expensive background animation off to free resources for synth
    setIsFlowing(false);
  }, [setIsFlowing]);

  return <Erebus />;
}

export default WrappedSynth;
