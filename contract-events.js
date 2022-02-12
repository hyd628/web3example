const Web3 = require('web3');

var options = {
    keepAlive: true,
    withCredentials: false,
    timeout: 100000, // ms
};



const web3 = new Web3('wss://wss.testnet.moonbeam.network', options);

web3.eth.subscribe('logs', {
    address: '0x27d534718f4961ADD0a89896404Dc1833B018D83',
    topics: ['0x64f50d594c2a739c7088f9fc6785e1934030e17b52f1a894baec61b98633a59f']
}, (error, result) => {
    if (error)
        console.error(error);
})
    .on("connected", function (subscriptionId) {
        console.log(subscriptionId);
    })
    .on("data", function (log) {
        console.log(log);
    });