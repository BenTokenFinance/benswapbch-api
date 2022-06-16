import BigNumber from "bignumber.js";
import { getContract } from "./web3";
import pokeben from "./abis/pokeben.json";
import pokebenraritysetting from "./abis/pokebenraritysetting.json";
import pokebennameext from "./abis/pokebennameext.json";
import pokebenitem from "./abis/pokebenitem.json";
import rarities from "./pokeben/rarities.json";
import abilities from "./pokeben/abilities.json";
import types from "./pokeben/types.json";
import bens from "./pokeben/bens.json";
import itemkinds from "./pokeben/itemkinds.json";
import itemsources from "./pokeben/itemsources.json";
import itemtypes from "./pokeben/itemtypes.json";

const pokebenContract = getContract(pokeben, '0xFDEd6cD4B88a24e00d9Ea242338367fe734CBff5');
const pokebenraritysettingContract = getContract(pokebenraritysetting, '0xCfA1A45d2C9590d93AA0403CD388F944D8322937');
const pokebenNftNameExtContract = getContract(pokebennameext, '0xfaf933c76E2ae21a63DF65bbD3888B3FB2Fc43Ae');

const pokebenItemContract = getContract(pokebenitem, '0x0E02257da06195cF43D6a574eFB1f8AeA69377Fe');

export const getPokeBenInfo = async (id: any) => {
  const info = await pokebenContract.methods.getPokeBenInfo(id).call();

  return info;
};

export const getPokeBenName = async (id: any) => {
  const name = await pokebenNftNameExtContract.methods.getName(id).call();

  return name;
};

export const getPokeBenItemInfo = async (id: any) => {
  const info = await pokebenItemContract.methods.getPokeBenItemInfo(id).call();

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

export const buildItemKindAttributes = (id: any) => {
  const kind = (itemkinds as any)[id];
  const attrs = [];
  // Type
  attrs.push({
      "trait_type": "Type",
      "value": (itemtypes as any)[kind.type]
  });
  if (kind.type === '1') {
    attrs.push(...buildAbilityScrollAttributes(kind));
  }

  return attrs;
}

export const buildAbilityScrollAttributes = (itemKind: any) => {
  const attrs = [];
  // Ability Scroll
  const ability = (abilities as any)[itemKind.data]
  attrs.push({
    "trait_type": "Ability",
    "value": ability.name
  },{
    "trait_type": "Ability Type",
    "value": (types as any)[ability.type]
  },{
    "trait_type": "Rarity",
    "value": (rarities as any)[ability.rarity]
  });
  if (ability.powerBoostBp) {
    attrs.push({
      "trait_type": "Ability Effect",
      "value": `Power: +${Number(ability.powerBoostBp)/100}%`
    })
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