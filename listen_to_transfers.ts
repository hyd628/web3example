import { typesBundlePre900 } from "moonbeam-types-bundle";
import { ApiPromise, WsProvider } from "@polkadot/api";

// This script will listen to all GLMR transfers (Substrate & Ethereum)
// It can be adapted for Moonriver or Moonbase Alpha

const main = async () => {
  // Define the provider for Moonbeam
  const wsProvider = new WsProvider("wss://wss.api.moonbase.moonbeam.network");
  // Create the provider using Moonbeam types
  const polkadotApi = await ApiPromise.create({
    provider: wsProvider,
    typesBundle: typesBundlePre900 as any,
  });

  await polkadotApi.rpc.chain.subscribeFinalizedHeads(async (lastFinalizedHeader) => {
    const [{ block }, records] = await Promise.all([
      polkadotApi.rpc.chain.getBlock(lastFinalizedHeader.hash),
      polkadotApi.query.system.events.at(lastFinalizedHeader.hash),
    ]);

    block.extrinsics.forEach((extrinsic, index) => {
      const {
        method: { args, method, section },
      } = extrinsic;

      //console.log(args[0])
      //console.log(method)
      //console.log(section)

      const isEthereum = section == "ethereum" && method == "transact";

      //console.log(typeof args[0])
      //console.log(args[0])
      //var JSONtx = args[0].toHuman()
      //console.log(JSONtx)
      //var JSONtx1 = args[1].toJSON()
      //console.log(JSONtx1)
      //console.log(args[0][2])
      // Transfer do not include input data

      if (isEthereum) {
          var JSONtx1 = args[0].toJSON()
          //console.log(JSONtx1["legacy"]["input"])
          //console.log(JSONtx1)
          //console.log(JSONtx1["legacy"]["action"]["call"])
          console.log((args[0] as any).isLegacy)
          console.log((args[0] as any).asLegacy)
          console.log((args[0] as any).asLegacy.action.isCall)
          console.log((args[0] as any).asLegacy.input.length)

      }

      const isEthereumTransfer = true
        //isEthereum && (args[0] as any).input.length === 0 && (args[0] as any).action.isCall;

      // Retrieve all events for this extrinsic
      const events = records.filter(
        ({ phase }) => phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index)
      );

      // This hash will only exist if the transaction was executed through ethereum.
      let ethereumHash = "";

      if (isEthereum) {
        // Search for ethereum execution
        events.forEach(({ event }) => {
          if (event.section == "ethereum" && event.method == "Executed") {
            ethereumHash = event.data[2].toString();
          }
        });
      }

      // Search if it is a transfer
      events.forEach(({ event }) => {
        if (event.section == "balances" && event.method == "Transfer") {
          const from = event.data[0].toString();
          const to = event.data[1].toString();
          const balance = (event.data[2] as any).toBigInt();

          const substrateHash = extrinsic.hash.toString();

          console.log(`Transfer from ${from} to ${to} of ${balance} (block #${lastFinalizedHeader.number})`);
          console.log(`  - Triggered by extrinsic: ${substrateHash}`);
          if (isEthereum) {
            console.log(`  - Ethereum (isTransfer: ${isEthereumTransfer}) hash: ${ethereumHash}`);
          }
        }
      });
    });
  });
};

main();