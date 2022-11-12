import { NowRequest, NowResponse } from "@vercel/node";
import { testArchive0 } from "../../utils/web3";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const healthy = await testArchive0();

    res.setHeader("content-type", "text/plain");
    res.send(healthy?"healthy":"unhealthy");
};
