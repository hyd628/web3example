const Web3 = require('web3');

/*
   -- Define Provider & Variables --
*/
// Provider
const providerRPC = {
   moonriver: 'https://rpc.moonriver.moonbeam.network',
   moonbase: 'https://rpc.testnet.moonbeam.network',
};
const web3 = new Web3(providerRPC.moonriver); //Change to correct network

// Variables
const addressFrom = '0x2a27f17bc30a27362f0efd55fc3452f41c144d64';
const addressTo = '0x2a27f17bc30a27362f0efd55fc3452f41c144d64';
const addressTest = '0xaFFEB1d2046523aac8199fe2b929d122a27e7654 ';
/*
   -- Balance Call Function --
*/
const balances = async () => {
   const balanceFrom = 
      await web3.eth.getBalance(addressFrom);
   const balanceTo = web3.utils.fromWei(
      await web3.eth.getBalance(addressTo),
      'ether'
   );

   console.log(`The balance of ${addressFrom} is: ${balanceFrom} WEI`);
   console.log(`The balance of ${addressTo} is: ${balanceTo} ETH`);
};

balances();
console.log(web3.utils.isAddress(addressTo))
console.log(web3.utils.isAddress(addressTest))