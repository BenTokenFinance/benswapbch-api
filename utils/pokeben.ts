import BigNumber from "bignumber.js";
import { getContract } from "./web3";
import pokeben from "./abis/pokeben.json";
import pokebenraritysetting from "./abis/pokebenraritysetting.json";
import rarities from "./pokeben/rarities.json";
import abilities from "./pokeben/abilities.json";
import types from "./pokeben/types.json";
import bens from "./pokeben/bens.json";

const pokebenContract = getContract(pokeben, '0xFDEd6cD4B88a24e00d9Ea242338367fe734CBff5');
const pokebenraritysettingContract = getContract(pokebenraritysetting, '0xCfA1A45d2C9590d93AA0403CD388F944D8322937');

export const getPokeBenInfo = async (id: any) => {
  const info = await pokebenContract.methods.getPokeBenInfo(id).call();

  return info;
};

export const buildKindAttributes = (id: any) => {
  const ben = (bens as any)[id];
  const attrs = [];
  // Kind
  attrs.push({
      "trait_type": "Kind",
      "value": `#${id} ${ben.name}`
  });
  // Rarity
  attrs.push({
      "trait_type": "Rarity",
      "value": (rarities as any)[ben.rarity]
  });
  // Types
  if (ben.types && ben.types.length) {
      ben.types.forEach((t:any, i:any) => {
          attrs.push({
              "trait_type": `Type ${i+1}`,
              "value": (types as any)[t]
          });
      });
  }
  // Abilities
  if (ben.abilities && ben.abilities.length) {
      ben.abilities.forEach((a:any, i:any) => {
          attrs.push({
              "trait_type": `Ability ${i+1}`,
              "value": (abilities as any)[a].name
          });
      });
  }

  return attrs;
}

export const getRaritySettings = async () => {
  const settings: any = {};
  const tasks: any = [];
  const length = Object.keys(rarities).length;

  for (var i=0; i<length; i++) {
    const j = i;
    tasks.push(
      pokebenraritysettingContract.methods.getKindsByRarity(i).call().then((arr: any)=> {
        settings[j] = arr;
      })
    );
  }

  await Promise.all(tasks);

  return settings;
}