const fs = require('fs');
const Web3 = require('web3');
const CONTRACTS = require("./src/manifest.json");

let DEPLOY_WALLET_ADDRESS;
let deployCnt = 0;
let errorCnt = 0;
const web3 = new Web3("ws://localhost:8545");

const handleDeployment = (contractName, deployedContract) => {
    CONTRACTS[contractName].address = deployedContract.options.address;
    deployCnt++;
    if (deployCnt + errorCnt == Object.keys(CONTRACTS).length) {
        fs.writeFileSync('./build/contracts.json', JSON.stringify(CONTRACTS));
        process.exit(0);
    }
};

const handleError = (e) => {
    console.log(e);
    errorCnt++;
    if (deployCnt + errorCnt == Object.keys(CONTRACTS).length) {
        process.exit(1);
    }
};

const deployContract = (contractName) => {
    CONTRACTS[contractName].abi = JSON.parse(fs.readFileSync(`./build/${contractName}.abi`).toString());
    CONTRACTS[contractName].bin = fs.readFileSync(`./build/${contractName}.bin`).toString();
    new web3.eth.Contract(CONTRACTS[contractName].abi)
        .deploy({data: CONTRACTS[contractName].bin, arguments: CONTRACTS[contractName].args || []})
        .send({
            from: DEPLOY_WALLET_ADDRESS,
            gas: 1500000,
            gasPrice: '30000000000000'
        }, console.log)
        .then(deployedContract => handleDeployment(contractName, deployedContract))
        .catch(handleError);
};

web3.eth.getAccounts().then(accounts => {
    DEPLOY_WALLET_ADDRESS = accounts[0];
    Object.keys(CONTRACTS).forEach(deployContract);
}).catch(() => process.exit(1));

