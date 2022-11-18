import { NowRequest, NowResponse } from "@vercel/node";
import { getBchHistoryPrices } from "../../utils/others";

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const body = await getBchHistoryPrices();
    try {
        const prices = body.prices;
        const timestamp = Date.now();
        const msInHour = 3600 * 1000;
        const msInDay = msInHour * 24;
        const data: any = {};
        let days = 7, hours = 23;
        prices.forEach((p:any) => {
            if (days>0) {
                if (p[0]>= timestamp - days*msInDay) {
                    data[days+"d"] = p[1];
                    days--;
                }
            } else if (hours > 0) {
                if (p[0]>= timestamp - hours*msInHour) {
                    data[hours+"h"] = p[1];
                    hours--;
                }
            }
        });
        res.json(data);
    } catch(e) {
        res.json({error: e});
    }
};
