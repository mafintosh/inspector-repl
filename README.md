# inspector-repl

Quick and dirty inspector repl

```
npm install -g inspector-repl
kill -SIGUSR1 pid
inspector-repl ws://... # from above
console.trace() # get trace
heapdump # Get a heapdump out
heapdump /my/location.heapdump # write a heapdump to the specified location
profiler # Get a CPU profile out
profiler 10 my/location.cpuprofile # Write a CPU profile of specified length (in ms) to the specified location
```

## Bare usage

Bare processes do not log anything when receiving the SIGUSR1 signal, but by default it will be listening on `localhost:9229`, so connect with `inspector-repl ws://localhost:9229`.

