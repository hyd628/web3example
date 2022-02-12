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

const account_from = {
   privateKey: '5fb92d6e98884f76de468fa3f6278f8807c48bebc13595d45af5bdc4da702133',
   address: '0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac',
};
const addressTo = '0x44236223aB4291b93EEd10E4B511B37a398DEE55'; // Change addressTo

/*
   -- Create and Deploy Transaction --
*/
const deploy = async () => {
   console.log(
      `Attempting to send transaction from ${account_from.address} to ${addressTo}`
   );

   // Sign Tx with PK
   const createTransaction = await web3.eth.accounts.signTransaction(
      {
         gas: 50000,
         to: addressTo,
         value: web3.utils.toWei('0.00005', 'ether'),
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