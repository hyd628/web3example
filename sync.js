const Web3 = require('web3');


var options = {
    keepAlive: true,
    withCredentials: false,
    timeout: 500000, // ms
};

const web3 = new Web3('wss://wss.api.moonbeam.network', options);

var subscription = web3.eth.subscribe('syncing', function(error, sync){
    if (!error)
        console.log(sync);
})
.on("connected", function (subscriptionId) {
    console.log(subscriptionId);
})
.on("data", function (log) {
    console.log(log);
})
.on("changed", function(isSyncing){
    if(isSyncing) {
        // stop app operation
    } else {
        // regain app operation
    }
});
