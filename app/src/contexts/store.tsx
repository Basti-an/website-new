/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Primitive } from "../utils";

export type Patch = Record<string, Primitive>;
type PatchStore = Record<string, Patch>;

export type PatchStoreContext = {
  // when patchName changes, all knobs and switch components save their current value via addToPatch
  patchName: string;
  setStorePatchName: (patch: string) => void;
  // by calling this function, all knobs and switch components load value from current patch
  setLoadPatchName: (patch: string) => void;
  // get current patch values
  getPatch: (patch: string) => Patch;

  addToPatch: (patch: string, key: string, value: Primitive) => void;
  resetPatch: (patch: string) => void;
};

const Store: PatchStore = {};

export const StoreContext = React.createContext<PatchStoreContext>({
  patchName: "initial-patch",
  setLoadPatchName: (_patch: string) => {},
  setStorePatchName: (_patch: string) => {},
  getPatch: (patch: string) => Store[patch],
  addToPatch: (patch: string, key: string, value: Primitive) => {
    if (!Store[patch]) {
      return;
    }
    Store[patch][key] = value;
  },
  resetPatch: (patch: string) => {
    Store[patch] = {};
  },
});
