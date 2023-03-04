import BigNumber from "bignumber.js";
import { getContract } from "./web3";
import pokeben from "./abis/pokeben.json";
import pokebenraritysetting from "./abis/pokebenraritysetting.json";
import pokebennameext from "./abis/pokebennameext.json";
import pokebenitem from "./abis/pokebenitem.json";
import pokebenabilityext from "./abis/pokebenabilityext.json";
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
const pokebenItemContract = getContract(pokebenitem, '0x335bF14Af7c6b2993434bB700AF0f1Afcf27d782');
const pokebenAbilityExtContract = getContract(pokebenabilityext, '0x23662b10e4067480A39d337BA08ac898B90b7F80');

export const getPokeBenInfo = async (id: any) => {
  const info = await pokebenContract.methods.getPokeBenInfo(id).call();

  return info;
}

export const getPokebenTotalSupply = async() => {
  const supply = await pokebenContract.methods.totalSupply().call();

  return supply;
}

export const getPokebenItemTotalSupply = async() => {
  const supply = await pokebenItemContract.methods.totalSupply().call();

  return supply;
}

export const getPokeBenName = async (id: any) => {
  const name = await pokebenNftNameExtContract.methods.getName(id).call();

  return name;
}

export const getPokeBenItemInfo = async (id: any) => {
  const info = await pokebenItemContract.methods.getPokeBenItemInfo(id).call();

  return info;
}

export const getPokeBenAbilities = async (id: any) => {
  const as = await pokebenAbilityExtContract.methods.getAbilities(id).call();

  return as;
}

export const getPokeBenRawData = async(id:any) => {
  const rawData: any = {};
  const tasks: any = [];

  tasks.push(getPokeBenInfo(id).then(info=>{rawData.info = info;}));
  tasks.push(getPokeBenName(id).then(name=>{rawData.name = name;}));
  tasks.push(getPokeBenAbilities(id).then(abs=>{rawData.abilities = abs;}));

  await Promise.all(tasks);

  return rawData;
}

export const buildKindAttributes = (id: any, loadedAbilities: any) => {
  const ben = (bens as any)[id];
  const attrs = [];
  // Kind
  attrs.push({
      "trait_type": "Kind",
      "value": `#${getPokeBenKindId(id)} ${ben.name}`
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
  const aLength = Math.max(loadedAbilities?.length || 0, ben.abilities?.length || 0);
  let aNumber = 1;
  for (let i=0; i<aLength; i++) {
    if ((loadedAbilities?.length||0)>i && loadedAbilities[i]>0) {
      attrs.push({
        "trait_type": `Ability ${aNumber++}`,
        "value": (abilities as any)[loadedAbilities[i]].name
      });
    } else if ((ben.abilities?.length||0) > i) {
      attrs.push({
        "trait_type": `Ability ${aNumber++}`,
        "value": (abilities as any)[ben.abilities[i]].name
      });
    }
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

export const getPokeBenKindId = (id:any) => {
  const n = Number(id);
  const t = Math.floor(n / 10000);
  const y = n % 10000;

  if (t === 5) {
      return `${y}-MX`;
  }

  return y;
}
