const isFundExist = (fundName, availableFunds) => {
  return availableFunds.some((fund) => fund.name === fundName);
};

const getStockList = (fundName, availableFunds) => {
  const fund = availableFunds.find((fundInfo) => fundInfo.name === fundName);
  return fund.stocks;
};

const countOverlap = (ownedStocks, stocks) => {
  const overlapCount = ownedStocks.filter((investorStock) =>
    stocks.includes(investorStock)
  ).length;

  const overlap =
    ((2 * overlapCount) / (stocks.length + ownedStocks.length)) * 100;

  return `${overlap.toFixed(2)}%`;
};

const handleOverlapQuerry = (fundName, ownedFunds, availableFunds) => {
  const log = [];

  if (!isFundExist(fundName, availableFunds)) {
    return ["FUND_NOT_FOUND"];
  }

  const stocks = getStockList(fundName, availableFunds);
  ownedFunds.forEach((ownedFundName) => {
    const ownedStocks = getStockList(ownedFundName, availableFunds);
    const overlap = countOverlap(ownedStocks, stocks);

    log.push(`${fundName} ${ownedFundName} ${overlap}`);
  });

  return log;
};

const execute = (parsedCommands, commandLookup) => {
  parsedCommands.forEach(({ command, args }) => {
    commandLookup[command](args);
  });
};

const evaluatePortfolioQuerry = (parsedCommands, mutualFunds) => {
  const log = [];
  const ownedFunds = [];
  const availableFunds = [...mutualFunds];

  const addStock = (fundAndStock) => {
    const [fund, stock] = fundAndStock;

    availableFunds
      .filter((fundInfo) => fundInfo.name === fund)[0]
      .stocks.push(stock);
  };

  const commandLookup = {
    CURRENT_PORTFOLIO: (funds) => {
      ownedFunds.push(...funds);
    },
    CALCULATE_OVERLAP: ([fund]) => {
      const result = handleOverlapQuerry(fund, ownedFunds, availableFunds);
      if (result) {
        log.push(...result);
      }
    },
    ADD_STOCK: (fundAndStock) => addStock(fundAndStock),
  };

  execute(parsedCommands, commandLookup);
  return log.join("\n").trim();
};

module.exports = { evaluatePortfolioQuerry };
