import BigNumber from "bignumber.js";
import { getContract } from "./web3";
import pokeben from "./abis/pokeben.json";
import pokebenraritysetting from "./abis/pokebenraritysetting.json";
import pokebennameext from "./abis/pokebennameext.json";
import pokebenitem from "./abis/pokebenitem.json";
import pokebenhero from "./abis/pokebenhero.json";
import pokebenabilityext from "./abis/pokebenabilityext.json";
import rarities from "./pokeben/rarities.json";
import abilities from "./pokeben/abilities.json";
import types from "./pokeben/types.json";
import bens from "./pokeben/bens.json";
import itemkinds from "./pokeben/itemkinds.json";
import itemsources from "./pokeben/itemsources.json";
import itemtypes from "./pokeben/itemtypes.json";
import heroparttypes from "./pokeben/heroparttypes.json";
import heroparts from "./pokeben/heroparts.json";

const pokebenContract = getContract(pokeben, '0xFDEd6cD4B88a24e00d9Ea242338367fe734CBff5');
const pokebenraritysettingContract = getContract(pokebenraritysetting, '0xCfA1A45d2C9590d93AA0403CD388F944D8322937');
const pokebenNftNameExtContract = getContract(pokebennameext, '0xfaf933c76E2ae21a63DF65bbD3888B3FB2Fc43Ae');
const pokebenItemContract = getContract(pokebenitem, '0x335bF14Af7c6b2993434bB700AF0f1Afcf27d782');
const pokebenAbilityExtContract = getContract(pokebenabilityext, '0x23662b10e4067480A39d337BA08ac898B90b7F80');
const pokebenHeroContract = getContract(pokebenhero, '0x014da337dd4e097935797602332a4649c3F436c1');

const pokebenTestContract = getContract(pokeben, '0x366825cF69C2Ff4e8669A8a57B01923Df3a3b727');
const pokebenItemTestContract = getContract(pokebenitem, '0xd86d4e2E514cA95867e0057d741c2e6C0F88AD91');
const pokebenHeroTestContract = getContract(pokebenhero, '0x5Bca0bC667C081355Fa89AA676a0c38dc42b9a1B');

export const getPokeBenInfo = async (id: any) => {
  const info = await pokebenContract.methods.getPokeBenInfo(id).call();

  return info;
}

export const getPokeBenTestInfo = async (id: any) => {
  const info = await pokebenTestContract.methods.getPokeBenInfo(id).call();

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

export const getPokeBenItemTestInfo = async (id: any) => {
  const info = await pokebenItemTestContract.methods.getPokeBenItemInfo(id).call();

  return info;
}

export const getPokeBenAbilities = async (id: any) => {
  const as = await pokebenAbilityExtContract.methods.getAbilities(id).call();

  return as;
}

export const getPokeBenHeroInfo = async (id: any) => {
  const info:any = {};
  const tasks: any = [];

  tasks.push(pokebenHeroContract.methods.getHeroParts(id, 7).call().then((parts:any)=>{info.parts=parts;}));
  tasks.push(pokebenHeroContract.methods.getHeroStats(id, 7).call().then((stats:any)=>{info.stats=stats;}));
  tasks.push(pokebenHeroContract.methods.getName(id).call().then((name:any)=>{info.name=name;}));

  await Promise.all(tasks);

  return info;
}

export const getPokeBenHeroTestInfo = async (id: any) => {
  const info:any = {};
  const tasks: any = [];

  tasks.push(pokebenHeroTestContract.methods.getHeroParts(id, 7).call().then((parts:any)=>{info.parts=parts;}));
  tasks.push(pokebenHeroTestContract.methods.getHeroStats(id, 7).call().then((stats:any)=>{info.stats=stats;}));
  tasks.push(pokebenHeroTestContract.methods.getName(id).call().then((name:any)=>{info.name=name;}));

  await Promise.all(tasks);

  return info;
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

export const getPokeBenTestRawData = async(id:any) => {
  const rawData: any = {abilities: []};
  const tasks: any = [];

  tasks.push(getPokeBenTestInfo(id).then(info=>{rawData.info = info;}));

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
  const aAdded:any = {};
  let aNumber = 1;
  for (let i=0; i<aLength; i++) {
    if ((loadedAbilities?.length||0)>i && loadedAbilities[i]>0) {
      if (!aAdded[loadedAbilities[i]]) {
        attrs.push({
          "trait_type": `Ability ${aNumber++}`,
          "value": (abilities as any)[loadedAbilities[i]].name
        });
        aAdded[loadedAbilities[i]] = true;
      }
    } else if ((ben.abilities?.length||0) > i) {
      attrs.push({
        "trait_type": `Ability ${aNumber++}`,
        "value": (abilities as any)[ben.abilities[i]].name
      });
    }
  }

  return attrs;
}

export const buildItemKindAttributes = (id: any, data: any) => {
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
  if (kind.type === '2') {
    attrs.push(...buildHeroPartAttributes(kind, data));
  }

  return attrs;
}

export const getItemKindImg = (id: any) => {
  const kind = (itemkinds as any)[id];
  if (kind.type === '1') {
    return `https://asset.benswap.cash/games/pokebenitem/${id}/560.png`
  }
  if (kind.type === "2") {
    return `https://asset.benswap.cash/games/pokebenitem/${id}/preview.png`
  }
  return "";
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

const HEROSTATSNAMES = ["","Agility","Wrath","Strength","Versatility","Resilience","Luck"];

export const buildHeroPartAttributes = (itemKind: any, data: any) => {
  const value = Number(data);
  const attrs = [];
  // Hero Part
  const heropart = (heroparts as any)[itemKind.data];
  attrs.push({
    "trait_type": "Hero Part Type",
    "value": (heroparttypes as any)[heropart.type]
  },{
    "trait_type": "Rarity",
    "value": (rarities as any)[heropart.rarity]
  });
  if (value > 0) {
    if (HEROSTATSNAMES[heropart.type]) {
      attrs.push({
        "trait_type": HEROSTATSNAMES[heropart.type],
        "value": `${data}`
      });
    }
  }
  return attrs;
}

export const buildHeroMetadata = (id:any, parts: any, stats:any, name:any) => {
  const attrs:any = [];
  let url = "https://api2.benswap.cash/pokebenhero/image";
  if (parts.some((p:any)=> p>0 )) {
    url = `${url}?${parts.map((v:any, i:any)=>{ return v>0?`${(i + 9).toString(36)}=${v}` : "" }).filter((s:string)=>!!s).join(`&`)}`;
  }

  // Head
  attrs.push({
    "trait_type": "Head",
    "value": parts[1] > 0 ? (heroparts as any)[parts[1]].name : "Lop Ears"
  });
  // Face
  if (parts[2] > 0) {
    attrs.push({
      "trait_type": "Face",
      "value": (heroparts as any)[parts[2]].name
    });
  }
  // Body
  if (parts[3] > 0) {
    attrs.push({
      "trait_type": "Body",
      "value": (heroparts as any)[parts[3]].name
    });
  }
  // Colors
  if (parts[4] > 0) {
    let colors = (heroparts as any)[parts[4]];
    ["Color 1","Color 2","Color 3","Color 4"].forEach(c=>{
      if (colors[c]) {
        attrs.push({
          "trait_type": c,
          "value": colors[c]
        });
      }
    })
  } else {
    attrs.push({
      "trait_type": "Color 1",
      "value": "Metallic Copper"
    },{
      "trait_type": "Color 2",
      "value": "Apricot"
    },{
      "trait_type": "Color 3",
      "value": "Brown Rust"
    },{
      "trait_type": "Color 4",
      "value": "Yellow Orange"
    });
  }
  // Clothes
  attrs.push({
    "trait_type": "Clothes",
    "value": parts[5] > 0 ? (heroparts as any)[parts[5]].name : "None"
  });
  // Background
  attrs.push({
    "trait_type": "Background",
    "value": parts[6] > 0 ? (heroparts as any)[parts[6]].name : "None"
  });

  // Stats
  HEROSTATSNAMES.forEach((n:any,i:any)=>{
    if (n && stats[i] && Number(stats[i])>0) {
      attrs.push({
        "trait_type": n,
        "value": stats[i]
      });
    }
  })

  return {
    name: `${name || "PokéBenHero"} #${id}`,
    description: "PokéBen - An NFT-based game on BenSwap.Cash.",
    attributes: attrs,
    image: url
  };
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
