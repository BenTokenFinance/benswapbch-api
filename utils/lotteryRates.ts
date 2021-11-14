export interface Rates {
  burn: number;
  jackpot: number;
  match3: number;
  match2: number;
  match1?: number;
}

export const ratesV2: Rates = {
  burn: 3,
  jackpot: 70,
  match3: 20,
  match2: 7,
};