import Web3 from "web3";
import { RPC } from "./constants";

const BSC_NODE_RPC = [
  RPC["uat"]
];

const BSC_ARCHIVE_NODE_RPC = [
  RPC["uat"]
];

export const getWeb3 = (archive = false): Web3 => {
  const provider: string = archive
    ? BSC_ARCHIVE_NODE_RPC[Math.floor(Math.random() * BSC_ARCHIVE_NODE_RPC.length)]
    : BSC_NODE_RPC[Math.floor(Math.random() * BSC_NODE_RPC.length)];

  return new Web3(new Web3.providers.HttpProvider(provider, { timeout: 30000 }));
};

export const getContract = (abi: any, address: string, archive = false) => {
  const web3: Web3 = getWeb3(archive);

  return new web3.eth.Contract(abi, address);
};

export const getLatestBlock = async (archive = false) => {
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
