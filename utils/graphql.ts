import { Exchange } from './apollo/client'
import { GLOBAL_DATA } from './apollo/queries'

async function getGlobalData(block: string) {
    let data: any = {}

    try {
        // fetch the global data
        const result = await Exchange.query({
            query: GLOBAL_DATA(block),
            fetchPolicy: 'cache-first',
        })
        data = result.data.benSwapFactories[0];
    } catch (e) {
        console.error(e);
    }
    
    return data || {};
}

// DEX stats
export const getDexStats = async (block: string) => {
    const res = await getGlobalData(block);
    delete res.__typename;
    return res;
}
