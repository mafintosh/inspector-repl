#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const WS = require('ws')
const b4a = require('b4a')

const socket = new WS(process.argv[2])

let heapdumpLocation = null
let heapdumpMessageId = -1

socket.on('message', function (data) {
  const m = JSON.parse(data)
  if (m.method === 'Console.messageAdded') {
    console.log(m.params.message.text)
  } else if (m.method === 'HeapProfiler.addHeapSnapshotChunk') {
    fs.appendFileSync(heapdumpLocation, m.params.chunk)
  } else if (!m.method && m.result) {
    if (m.id === heapdumpMessageId) {
      console.log(`Heapdump finished at ${heapdumpLocation}`)
    } else {
      console.log(m.result.result?.value)
    }
  }
})

socket.on('open', function () {
  socket.send(JSON.stringify({
    id: 0,
    method: 'Console.enable'
  }))

  socket.send(JSON.stringify({
    id: 1,
    method: 'HeapProfiler.enable'
  }))

  let id = 2

  process.stdin.on('data', function (data) {
    if (b4a.toString(data).trim() === 'heapdump') {
      const heapdumpId = new Date(Date.now()).toISOString().split('.')[0].replaceAll(':', '-')
      heapdumpLocation = path.resolve(`inspector-repl-${heapdumpId}.heapsnapshot`)
      heapdumpMessageId = id
      console.log(`Creating heapdump at ${heapdumpLocation}`)

      socket.send(JSON.stringify({
        id: id++,
        method: 'HeapProfiler.takeHeapSnapshot',
      }))

      return
    }
    socket.send(JSON.stringify({
      id: id++,
      method: 'Runtime.evaluate',
      params: { expression: '' + data.toString().trim() }
    }))
  })
})
