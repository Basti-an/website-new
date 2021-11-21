import React, { useState } from "react";

import { StoreContext } from "./store";
import { LoadContext } from "./load";
import { Primitive } from "../utils";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MemoryStoreProps {}

const Store: Record<string, Record<string, Primitive>> = {};

function MemoryStoreProvider({ children }: React.PropsWithChildren<MemoryStoreProps>): JSX.Element {
  // every time storePatch is changed, all knobs/switches/outputs save their current values Store[storePatch]
  // adter that values are persisted to localStorage
  const [storePatchName, setStorePatchName] = useState<string>("initial-patch");
  // every time loadPatch is changed, all knobs/switches/outputs change their value to the values stored in localStorage
  const [loadPatchName, setLoadPatchName] = useState<string>("initial-patch");

  const MemoryStore = {
    patchName: storePatchName,
    setStorePatchName,
    setLoadPatchName,
    getPatch: (name: string) => Store[name],
    resetPatch: (name: string) => {
      Store[name] = {};
    },
    addToPatch: (patch: string, key: string, value: Primitive) => {
      if (!Store[patch]) {
        Store[patch] = {};
      }
      Store[patch][key] = value;
    },
  };

  return (
    <StoreContext.Provider value={MemoryStore}>
      <LoadContext.Provider value={loadPatchName}>{children}</LoadContext.Provider>
    </StoreContext.Provider>
  );
}

export default MemoryStoreProvider;
