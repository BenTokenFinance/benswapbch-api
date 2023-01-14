import Web3 from "web3";
import bep20ABI from "./abis/bep20.json";
import { RPC, RPC_ARCHIVE, EBEN } from "./constants";

const BSC_NODE_RPC = [
  RPC["fountainhead"]
];

const BSC_ARCHIVE_NODE_RPC = [
  RPC_ARCHIVE["0"]
];

export const getWeb3 = (archive = false): Web3 => {
  const provider: string = archive
    ? BSC_ARCHIVE_NODE_RPC[Math.floor(Math.random() * BSC_ARCHIVE_NODE_RPC.length)]
    : BSC_NODE_RPC[Math.floor(Math.random() * BSC_NODE_RPC.length)];

  return new Web3(new Web3.providers.HttpProvider(provider, { timeout: 30000 }));
};

export const testArchive0 = async () => {
  try {
    const archive0 = new Web3(new Web3.providers.HttpProvider(RPC_ARCHIVE["0"], { timeout: 30000 }));
    const ebenContract = new archive0.eth.Contract(bep20ABI as any, EBEN);
    const t = await ebenContract.methods.totalSupply().call(undefined, 1000000);
    return t === '9805717530504406453374070';
  } catch(e) {
    console.error(e);
  }
  return false;
}

export const getContract = (abi: any, address: string, archive = false) => {
  const web3: Web3 = getWeb3(archive);

  return new web3.eth.Contract(abi, address);
};

export const getLatestBlock = async () => {
  const web3: Web3 = getWeb3(false);
  return web3.eth.getBlockNumber();
};

export const getLatestBlockByRpcUrl = async (url: string) => {
  const web3 = new Web3(new Web3.providers.HttpProvider(url, { timeout: 30000 }));
  return web3.eth.getBlockNumber();
}

export const getLastestBlocksFromAllRpcs = async () => {
  const result:any = {};
  const tasks = Object.keys(RPC).map(function(key, index) {
      return getLatestBlockByRpcUrl((RPC as any)[key]).then((block)=>{
          result[key] = {
              block: block
          };
      }).catch(console.error);
  });
  await Promise.all(tasks);
  return result;
}

export const getTimestampByBlock = async(block: number) => {
  const web3: Web3 = getWeb3(false);
  return (await web3.eth.getBlock(block)).timestamp;
}
