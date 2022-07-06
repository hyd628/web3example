const Web3 = require('web3');

/*
   -- Define Provider & Variables --
*/
// Provider
const providerRPC = {
   development: 'http://localhost:9933',
   moonbase: 'https://rpc.api.moonbase.moonbeam.network',
   ropsten: "https://ropsten.infura.io/v3/77509e6d9cfb47aaaf11f2f91dca36ef"
};

const account_from = {
   privateKey: '',
   address: '',
};
const addressTo = ''; // Change addressTo

const args = process.argv;
//console.log(args);

var web3 = null;

switch (args[3]) {
   case 'development':
      web3 = new Web3(providerRPC.development);
      break;
   case 'moonbase':
      web3 = new Web3(providerRPC.moonbase);
      break;
   case 'ropsten':
      web3 = new Web3(providerRPC.ropsten);
      break;
   default:
      console.log("network not supported")
      process.exit(1)
}

 //Change to correct network



/*
   -- Create and Deploy Transaction --
*/
const deploy = async () => {
   console.log(
      `Attempting to send transaction from ${account_from.address} to ${addressTo}`
   );

   const _nonce = await web3.eth.getTransactionCount(account_from.address);

   // Sign Tx with PK
   const createTransaction = await web3.eth.accounts.signTransaction(
      {
         gas: 21000,
         to: addressTo,
         nonce: _nonce,
         value: web3.utils.toWei('0.1', 'ether'),
      },
      account_from.privateKey
   );

   // Send Tx and Wait for Receipt
   const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
   );
   console.log(
      `Transaction successful with hash: ${createReceipt.transactionHash}`
   );
};

deploy();