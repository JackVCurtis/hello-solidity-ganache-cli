const fs = require('fs');
const Web3 = require('web3');
const web3 = new Web3("ws://localhost:8545");

const contracts = JSON.parse(fs.readFileSync('./build/contracts.json').toString());
const greeter = new web3.eth.Contract(
    contracts.Greeter.abi,
    contracts.Greeter.address    
);

test('Greeting is initialized', async () => {
    const greeting = await greeter.methods.greet().call();
    expect(greeting).toBe('Hola');
})

afterAll(() => {
    web3.currentProvider.connection.close();
})
