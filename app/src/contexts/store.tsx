import React from "react";
import { Primitive } from "../utils";

export type Patch = Record<string, Primitive>;
type PatchStore = Record<string, Patch>;

export type PatchStoreContext = {
  patchName: string;
  getPatch: (patch: string) => Patch;
  addToPatch: (patch: string, key: string, value: Primitive) => void;
  resetPatch: (patch: string) => void;
};

const Store: PatchStore = {};

export const StoreContext = React.createContext<PatchStoreContext>({
  patchName: "initial-patch",
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
