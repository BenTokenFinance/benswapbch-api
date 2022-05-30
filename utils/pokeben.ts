import BigNumber from "bignumber.js";
import { getContract } from "./web3";
import pokeben from "./abis/pokeben.json";
import rarities from "./pokeben/rarities.json";
import abilities from "./pokeben/abilities.json";
import types from "./pokeben/types.json";
import bens from "./pokeben/bens.json";

const contract = getContract(pokeben, '0xB4Eb7fA99B5B86dC8a8aD01b0ad00610A562A1E6');

export const getPokeBenInfo = async (id: any) => {
  const info = await contract.methods.getPokeBenInfo(id).call();

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