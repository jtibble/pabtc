PABTC [![Build Status](https://travis-ci.org/jtibble/pabtc.svg?branch=master)](https://travis-ci.org/jtibble/pabtc)
===

BTC Engine for Planetary Annihilation Tournaments

https://pa-btc.com


Look at the Github issues for information about existing (and planned) services: https://github.com/jtibble/pabtc/issues
Tests demonstrating existing services can be found at https://github.com/jtibble/pabtc/tree/master/service/api/test


-----

To Run REST API

1. Clone Project to your local machine

2. 'npm install' in project root

3. Install mongodb and run it on the default port ('mongod --dbpath C:\tmp')

4. Set the NODE_ENV system variable to 'local', 'dev', or 'prod'

5. Insert a fake document into a mongodb collection 'keys' like this (and as seen in the .travis.yml file: {key: 'asdf123'} 

6. 'node service/main.js' and the REST API will start on port 8080

To Run Tests

7. 'npm test'
