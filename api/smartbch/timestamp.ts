import { NowRequest, NowResponse } from "@vercel/node";
import { getTimestampByBlock, getLatestBlock } from "../../utils/web3";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { block } = req.query;

    let blockNumber: any = block;
    let timestamp: any = 0;

    if (blockNumber === undefined) blockNumber = await getLatestBlock();

    const b = Number(blockNumber);
    if (!isNaN(b) && Number.isInteger(b) && b > 0) {
        try {
            timestamp = await getTimestampByBlock(b) || 0;
        } catch(e) {
            console.error(e);
        }
    }

    res.setHeader("content-type", "text/plain");
    res.send(timestamp);
};
