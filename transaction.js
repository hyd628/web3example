const Web3 = require('web3');

/*
   -- Define Provider & Variables --
*/
// Provider
const providerRPC = {
   moonriver: 'https://rpc.api.moonriver.moonbeam.network',
   moonbase: 'https://rpc.api.moonbase.moonbeam.network',
};
const web3 = new Web3(providerRPC.moonriver); //Change to correct network

const account_from = {
   privateKey: '',
   address: '0xbCE85847d4EE95DA1cF34c9e7415E253b0Dc36c3',
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
         maxPriorityFeePerGas: 50000,
         to: addressTo,
         value: web3.utils.toWei('0.00005', 'ether'),
         type: "0x02"
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