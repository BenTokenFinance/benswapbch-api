import { NowRequest, NowResponse } from "@vercel/node";
import { getAllLotteries, getIssueIndex, getRates, LotteryHistory } from "../utils/lotteryUtils";
import { ceilDecimal } from "../utils/mathUtils";

export const lotteryHistory = async (): Promise<
  | Array<LotteryHistory>
  | {
      error?: string;
      errorMessage?: string;
      maxLotteryNumber?: number;
    }
> => {
  const issueIndex = await getIssueIndex();
  if (typeof issueIndex !== "number") {
    throw new Error("IssueIndex not a number");
  }
  const allLotteries = await getAllLotteries(issueIndex - 1);
  const history: Array<LotteryHistory> = allLotteries.map(
    (x): LotteryHistory => {
      const rate = getRates(x.issueIndex);
      return {
        lotteryNumber: x.issueIndex,
        poolSize: ceilDecimal(x.numbers2[0], 2),
        won: ceilDecimal(
          (x.numbers2[1]>0? (x.numbers2[0] / 100) * rate.jackpot : 0) + 
          (x.numbers2[2]>0? (x.numbers2[0] / 100) * rate.match3 : 0) + 
          (x.numbers2[3]>0? (x.numbers2[0] / 100) * rate.match2 : 0)
        , 2),
        burned: ceilDecimal((x.numbers2[0] / 100) * rate.burn, 2),
      };
    }
  );
  return history;
};

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  try {
    const data = await lotteryHistory();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ error: "internal server error" });
  }
};
