import { NowRequest, NowResponse } from "@vercel/node";
import { getDexStats } from "../../utils/graphql";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
  const { block } = req.query;

  const result = await getDexStats(block as string);
  result.warning = '"totalVolumeUsd" only tracks USD volume after block 820000. It is suggested that "totalVolumeBch" being used instead.'

  res.json(result);
};
