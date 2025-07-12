#!/usr/bin/env node

const WS = require('ws')

const socket = new WS(process.argv[2])

socket.on('message', function (data) {
  const m = JSON.parse(data)
  if (m.method === 'Console.messageAdded') {
    console.log(m.params.message.text)
  }
  if (!m.method && m.result) {
    console.log(m.result.result?.value)
  }
})

socket.on('open', function () {
  socket.send(JSON.stringify({
    id: 0,
    method: 'Console.enable'
  }))

  let id = 1

  process.stdin.on('data', function (data) {
    socket.send(JSON.stringify({
      id: id++,
      method: 'Runtime.evaluate',
      params: { expression: '' + data.toString().trim() }
    }))
  })
})
