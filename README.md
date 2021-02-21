# ganache-cli and solidity
No external dependencies.
To start: `git clone`, `npm install`, `npm run start`;

Compile contracts with `npm run compile`. Contracts must be in `./src/contracts` and must be registered in `./src/manifest.json` with their local constructor args.

After starting and compiling, you can deploy contracts to the local node with `npm run deploy`.

Run tests against the local node with `npm test`;