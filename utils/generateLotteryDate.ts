// TODO: update start date and intervals

export const firstLottery = new Date(Date.UTC(2021, 9, 26, 0, 0, 0, 0)); 
export const secondLottery = new Date(Date.UTC(2021, 9, 26, 1, 0, 0, 0)); 
export const thirdLottery = new Date(Date.UTC(2021, 9, 26, 2, 0, 0, 0)); 
export const forthLottery = new Date(Date.UTC(2021, 9, 29, 2, 0, 0, 0)); 
export const numberOfTestLotteries = 3;
const hour = 60 * 60 * 1000;

const missedLotteryDraws = [150]

export const generateLotteryDate = (issueIndex: number): Date => {
  if (issueIndex == 0) return  new Date(firstLottery);
  else if (issueIndex == 1) return  new Date(secondLottery);
  else if (issueIndex == 2) return  new Date(thirdLottery);
  const lotteryDate = new Date(forthLottery);

  const missed = missedLotteryDraws.reduce((t, ii)=>{ return issueIndex>=ii ? t+1 : t; }, 0)

  lotteryDate.setTime(lotteryDate.getTime() + (issueIndex - numberOfTestLotteries + missed) * 72 * hour);
  
  return lotteryDate;
};
