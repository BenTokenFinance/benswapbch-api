
import Web3 from "web3";
import BigNumber from "bignumber.js";
import bep20ABI from "./abis/bep20.json";
import { DEFAULT_RPC } from "./constants";

const providers = {
    56: 'https://bsc-dataseed.binance.org/', // BSC main net
    10000: DEFAULT_RPC,  //smartBCH mainnet
};

const Config = {
    tokens: {
        "BUSD": {
            name: "Binance USD",
            decimals: 18,
            56: {
                address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
                type: "native"
            },
            10000: {
                address: "0xbb1Fcb08961d7fc7ab58dC608A0448aa30E66269",
                type: "bridged"
            },
        },
        "EBEN": {
            name: "Green Ben",
            decimals: 18,
            56: {
                address: "0xbb036ccDe5feE48f011B9916646f3a341d7D490A",
                type: "bridged"
            },
            10000: {
                address: "0x77CB87b57F54667978Eb1B199b28a0db8C8E1c0B",
                type: "native"
            }
        },
        "GBEN": {
            name: "Golden Ben",
            decimals: 18,
            56: {
                address: "0x8173dDa13Fd405e5BcA84Bd7F64e58cAF4810A32",
                type: "native"
            },
            10000: {
                address: "0xbb9CEf7C582b0165A755bC89977dB5bAdbf36406",
                type: "bridged"
            }
        },
        "BTC": {
            name: "Bitcoin",
            decimals: 18,
            56: {
                address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
                type: "native"
            },
            10000: {
                address: "0xbbeF77270d6425E113e1E37f008cf141a9FC215A",
                type: "bridged"
            }
        },
        "ETH": {
            name: "Ether",
            decimals: 18,
            56: {
                address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
                type: "native"
            },
            10000: {
                address: "0xbb10B6D11db70f33417b08e0B87042275C933Bb9",
                type: "bridged"
            }
        },
        "BNB": {
            name: "Binance Coin",
            decimals: 18,
            56: {
                address: "0x0000000000000000000000000000000000000001",
                type: "native"
            },
            10000: {
                address: "0xbb7eED96c099546049179c6ACB4498926C437158",
                type: "bridged"
            }
        },
        "USDT": {
            name: "Tether USD",
            decimals: 18,
            56: {
                address: "0x55d398326f99059fF775485246999027B3197955",
                type: "native"
            },
            10000: {
                address: "0xbbb3700F33fCb64437Dc28A7Beb6b21f5cC76FB9",
                type: "bridged"
            }
        },
        "USDC": {
            name: "USD Coin",
            decimals: 18,
            56: {
                address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
                type: "native"
            },
            10000: {
                address: "0xbb2A35cc3e3dDb679fe30A82051633bC822e4191",
                type: "bridged"
            }
        },
        "USDP": {
            name: "Pax Dollar",
            decimals: 18,
            56: {
                address: "0xb3c11196A4f3b1da7c23d9FB0A3dDE9c6340934F",
                type: "native"
            },
            10000: {
                address: "0xbbEDC71c1e982c5416dEcc221B5c9DcA8ff49E94",
                type: "bridged"
            }
        },
        "TUSD": {
            name: "TrueUSD",
            decimals: 18,
            56: {
                address: "0x14016E85a25aeb13065688cAFB43044C2ef86784",
                type: "native"
            },
            10000: {
                address: "0xbb0c7462029C395F46c5ed6Bfb5870b6B5d4567B",
                type: "bridged"
            }
        }
    },
    chains: {
        56: {
            "name": "BNB Smart Chain",
            "shortName": "BSC",
            "symbol": "BSC",
            "bridge": "0xab24515e162593D6aa825abF4d5816e5025818B9",
            "multicall": "0x1ee38d535d541c55c9dae27b12edf090c608e6fb"
        },
        10000: {
            "name": "Smart Bitcoin Cash",
            "shortName": "smartBCH",
            "symbol": "sBCH",
            "bridge": "0xe35A42B384E7A2b26a6B2CE96BD1657572b601Ea",
            "multicall": "0x1b38EBAd553f218e2962Cb1C0539Abb5d6A37774"
        }
    }
}

export const getBridgeDetail = async() => {
    try {
        const chains = Object.keys(providers);
        const tokens = Object.keys(Config.tokens);

        const web3s = {};
        for(let i=0; i< chains.length; i++) {
            web3s[chains[i]] = new Web3(providers[chains[i]]);
        }

        const tokenResult = {};
        for(let i=0; i< tokens.length; i++) {
            const token = Object.assign({symbol: tokens[i]}, JSON.parse(JSON.stringify(Config.tokens[tokens[i]])));
            for(let j=0; j< chains.length; j++) {
                const chain = chains[j];
                if (token[chain]) {
                    const isNativeCoin = new BigNumber(token[chain].address).isLessThan(32);
                    if (isNativeCoin) {
                        token[chain].amount = new BigNumber(await web3s[chain].eth.getBalance(Config.chains[chain].bridge)).div(new BigNumber(10).pow(token.decimals)).toFixed();
                    } else {
                        const contract = new web3s[chain].eth.Contract(bep20ABI, token[chain].address);
                        if (token[chain].type === 'native') {
                            const amount = await contract.methods.balanceOf(Config.chains[chain].bridge).call();
                            token[chain].amount = new BigNumber(amount).div(new BigNumber(10).pow(token.decimals)).toFixed();
                        } else {
                            const amount = await contract.methods.totalSupply().call();
                            token[chain].amount = new BigNumber(amount).div(new BigNumber(10).pow(token.decimals)).toFixed();
                        }
                    }
                }
            }
            tokenResult[tokens[i]] = token;
        }

        const result = {};
        for(let i=0; i< chains.length; i++) {
            const native = {};
            const bridged = {};
            for(let j=0; j< tokens.length; j++) {
                const token = tokenResult[tokens[j]];
                if (token[chains[i]]) {
                    if (token[chains[i]].type === 'native') {
                        native[tokens[j]] = token[chains[i]].amount;
                    } else {
                        bridged[tokens[j]] = token[chains[i]].amount;
                    }
                }
            }
            result[Config.chains[chains[i]].shortName] = { 
                "Out": native, 
                "In": bridged 
            };
        }

        return result;
    } catch(e) {
        console.error(e);
    }

    return {};
}
