# Homepage

My personal Website (currently containing my CV) build with React, Material-UI for React, NodeJS, and Typescript.

Currently hosted on Google App Engine for Python at [sebastian.wiendlocha.org](https://sebastian.wiendlocha.org).

License is MIT.

## Prerequisites

install [yarn](https://yarnpkg.com/en/), [nodeJS](https://nodejs.org/en/) and [python gcloud + python libraries](https://cloud.google.com/appengine/docs/standard/python/tools/using-local-server)

## Install:

`yarn setup`

## Build:

build static site for node and python webapp2 (Google App Engine) environment:

`yarn build`

## Run:

1. Start node or python backend for serving static files
   `yarn start:node` or
   `yarn start:python`

2. Start Dev server
   `cd app; yarn start`
