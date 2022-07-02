const got = require('got');
const fetch = require('node-fetch');
import { getWeb3 } from "./web3";

export const getBchPrice =  async () => {
    const body = await got("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=usd").json();
    return body;
};

export const getSep20Assets = async () => {
    const body = await got("https://asset.benswap.cash/tokens.json").json();
    return body;
}

export const getGraphNodesHealthUrls = async () => {
    const body = await got("https://asset.benswap.cash/graph_node_health_urls.json").json();
    return body;
}

const vrfServers = [
    "https://enclave0.vrf.cash:8081/",
    "https://enclave1.vrf.cash:8081/",
];

export const getVrf = async(server:any, hash:any) => {
    const response = await fetch(`${server}vrf?b=${hash}`);
    const body = await response.json();
    console.log(body);
    return body;
}

export const getVrfStatus = async () => {
    const web3 = getWeb3();
    const blockNumber = await web3.eth.getBlockNumber();
    console.log(blockNumber);
    const hash = (await web3.eth.getBlock(blockNumber)).hash;
    console.log(hash);
    const tasks:any = [];
    const status:any = {};

    if (hash) {
        vrfServers.forEach(vs=>{
            tasks.push(getVrf(vs, hash.substring(2)).then((d:any)=>{
                console.log("2",d);
                status[vs] = d;
            }));
        });
    }

    await Promise.all(tasks);

    return status;
}

export const getVrfServerHealth = async () => {
    const status = await getVrfStatus();
    const keys = Object.keys(status);
    if (keys.length !== vrfServers.length) return JSON.stringify({
        error: "Length Mismatch!",
        servers: vrfServers,
        status: status
    });
    for(let i=0; i<keys.length; i++) {
        const vs = keys[i];
        if (status[vs] && status[vs]?.PI) continue;
        else {
            return JSON.stringify({
                error: "Invalid VRF!",
                servers: vrfServers,
                status: status
            })
        }
    }

    return "healthy";
}
