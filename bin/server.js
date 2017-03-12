#!/usr/bin/env node

const express = require('express'),
      bodyParser = require('body-parser'),
      IPFS = require('ipfs-api'),
      OrbitDB = require('orbit-db'),
      storage = require('node-persist')

const DB_NAME = 'coconut'

const app = express()
const ipfs = new IPFS()
const orbitdb = new OrbitDB(ipfs)
const store = orbitdb.feed(DB_NAME)

storage.initSync()

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  let password = req.query.password
  storage.getItem(password)
    .then(res.send.bind(res))
    .catch(errorHandler)
})

app.post('/', (req, res) => {
  let password = req.body.password
  let hash = req.body.hash
  storage.setItem(password, hash).catch(errorHandler)
  //store.sync(hash).catch(errorHandler)
  res.end()
})

function errorHandler(error) {
  if (error) {
    console.error(error)
  }
}

app.listen(9000, () => {
  console.log('Server running on port 9000.')
})

// vim: sw=2

