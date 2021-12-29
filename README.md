# Raids

### PreGame Commands

1. `cd proxy-client-app/ && npm run build-config` -> Build the game config.

- If `proxy-client-app` does not exist, you need to build it first by going into `proxy-client` and running `npm run build`.

2. `cd sapp/ && make build` -> Bundle the LUA files
3. `cd sapp/ && make deploy` -> Move the bundled LUA file into correct directory, and install config file in Halo CE server directory.
4. Start dedicated server.
