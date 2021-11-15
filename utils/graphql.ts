import { Exchange } from './apollo/client'
import { GLOBAL_DATA, ALL_TOKENS_SIMPLE } from './apollo/queries'

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

async function getTokenCount(block: string) {
    let count = 0;

    try {
        // fetch tokens
        const result = await Exchange.query({
            query: ALL_TOKENS_SIMPLE(block),
            fetchPolicy: 'cache-first',
        })
        count = result.data.tokens.length;
    } catch (e) {
        console.error(e);
    }
    
    return count || 0;
}

// DEX stats
export const getDexStats = async (block: string) => {
    const res: any = {};
    const tasks = [
        getGlobalData(block).then(data => {Object.assign(res, data)}),
        getTokenCount(block).then(count => {res.count = count;})
    ];
    await Promise.all(tasks);
    delete res.__typename;
    if (!res.factoryAddress) delete res.count;
    return res;
}
