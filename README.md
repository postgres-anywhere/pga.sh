# Site (pga.sh)

This is the technical documentation that will be hosted for the PGA project.

## Building

To build and serve the documentation locally, we can run a Hugo server in a Docker container:

```
./serve-locally.sh
```

To build the final HTML, run the following command:

```
./build.sh
```

The contents reside under build/.
The expected docs base URL is /docs/