# Homepage 🏠

My personal Website (currently containing my CV and a fully featured semi-modular WebAudio Synthesizer) build with React, Material-UI for React, NodeJS, and Typescript ❤️.

[sebastian.wiendlocha.org](https://sebastian.wiendlocha.org).

## Prerequisites

- [yarn](https://yarnpkg.com/en/)
- [nodeJS](https://nodejs.org/en/)
- optionally (for deploying or GAE local python server), [python gcloud + python libraries](https://cloud.google.com/appengine/docs/standard/python/tools/using-local-server)

## Install:

`yarn setup`

## Run:

`yarn start`

### Build:

build static site for node and python webapp2 (Google App Engine) environment:

`yarn build`

## next todos:

- compile wasm moog filter that accepts frequency as input instead of [0,1]
- refactor wasm moog filter integration to work like the normal filter.ts
- implement erebus.init(filterType?: "webaudio" | "wasm-moog")
