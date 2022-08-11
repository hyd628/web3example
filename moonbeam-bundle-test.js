import { typesBundlePre900 } from "moonbeam-types-bundle";
import { ApiPromise, WsProvider } from "@polkadot/api";


// This script will listen to all MOVRs transfers (Substrate & Ethereum)

const main = async () => {
    // Define the provider
    const wsProvider = new WsProvider("wss://wss.api.moonbase.moonbeam.network");

    // Create the provider using Moonbeam types
    const polkadotApi = await ApiPromise.create({
        provider: wsProvider,
        typesBundle: typesBundlePre900,
        types: {
            EthTransaction: "LegacyTransaction"
        }
    });


    // returns SignedBlock
    // returns Hash
    const blockHash = await polkadotApi.rpc.chain.getBlockHash(6601);
    // returns SignedBlock
    const signedBlock = await polkadotApi.rpc.chain.getBlock(blockHash);
    const apiAt = await polkadotApi.at(signedBlock.block.header.hash);
    const allRecords = await apiAt.query.system.events();

    signedBlock.block.extrinsics.forEach(({ method: { method, section } }, index) => {
        // filter the specific events based on the phase and then the
        // index of our extrinsic in the block
        const events = allRecords
            .filter(({ phase }) =>
                phase.isApplyExtrinsic &&
                phase.asApplyExtrinsic.eq(index)
            )
            .map(({ event }) => `${event.section}.${event.method}`);

        console.log(`${section}.${method}:: ${events.join(', ') || 'no events'}`);
    });

    //console.log(signedBlock);

    signedBlock.block.extrinsics.forEach((ex, index) => {
        // the extrinsics are decoded by the API, human-like view
        console.log(index, ex.toHuman());


        const { isSigned, meta, method: { args, method, section } } = ex;

        // explicit display of name, args & documentation
        //console.log(`${section}.${method}(${args.map((a) => a.toString()).join(', ')})`);
        //console.log(meta.documentation.map((d) => d.toString()).join('\n'));

        // signer/nonce info
        if (isSigned) {
            console.log(`signer=${ex.signer.toString()}, nonce=${ex.nonce.toString()}`);
        }
    });
    
};

main();