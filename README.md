# Homepage

My personal Website (currently containing my CV) build with React, Material-UI for React, NodeJS and Python.

Currently hosted on Google App Engine for Python at [sebastian.wiendlocha.org](https://sebastian.wiendlocha.org).

License is MIT.

## Features

- Simple React frontend, fully responsive, implementing Material-UI
- configured for local use (via localhost) and production use (provided you use HTTPS)
- Front- and Backend served from single instance, either NodeJS or Python (Google App Engine)
- Python GAE Backend currently written in 0 lines of Python code
## Prerequisites

install [yarn](https://yarnpkg.com/en/), [nodeJS](https://nodejs.org/en/) and [python gcloud + python libraries](https://cloud.google.com/appengine/docs/standard/python/tools/using-local-server)

## Install:

`yarn setup`

## Build:

build static site for node and python webapp2 (Google App Engine) environment:

`yarn build`

## Run:

Start dev-server:
`yarn start`

Start node or python backend:
`yarn start:node`
`yarn start:python`
