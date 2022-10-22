import { NowRequest, NowResponse } from "@vercel/node";
import { getLotteryTicketData } from "../utils/lotteryUtils";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { id } = req.query;
    const data = await getLotteryTicketData(id);
    res.json(data);
};
