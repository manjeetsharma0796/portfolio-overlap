const isFundExist = (fundName, availableFunds) => {
  return availableFunds.some((fund) => fund.name === fundName);
};

const getStockList = (fundName, availableFunds) => {
  const fund = availableFunds.find((fundInfo) => fundInfo.name === fundName);
  return fund.stocks;
};

const calculateOverlap = ([fundName], ownedFunds, availableFunds) => {
  const log = [];

  if (!isFundExist(fundName, availableFunds)) {
    return ["FUND_NOT_FOUND"];
  }

  const stocks = getStockList(fundName, availableFunds);
  ownedFunds.forEach((investorFundName) => {
    const investorStocks = getStockList(investorFundName, availableFunds);

    const overlapCount = investorStocks.filter((investorStock) =>
      stocks.includes(investorStock)
    ).length;

    const overlap =
      ((2 * overlapCount) / (stocks.length + investorStocks.length)) * 100;

    log.push(`${fundName} ${investorFundName} ${overlap.toFixed(2)}%`);
  });

  return log;
};

const execute = (parsedCommands, commandLookup) => {
  parsedCommands.forEach(({ command, args }) => {
    commandLookup[command](args);
  });
};

const evaluatePortfolioQuerry = (parsedCommands, availableFunds) => {
  const log = [];
  const ownedFunds = [];

  const addStock = (fundAndStock) => {
    const [fund, stock] = fundAndStock;

    availableFunds.forEach((fundInfo) => {
      if (fundInfo.name === fund) {
        fundInfo.stocks.push(stock);
      }
    });
  };

  const commandLookup = {
    CURRENT_PORTFOLIO: (funds) => {
      ownedFunds.push(...funds);
    },
    CALCULATE_OVERLAP: (fund) => {
      const result = calculateOverlap(fund, ownedFunds, availableFunds);
      if (result) {
        log.push(...result);
      }
    },
    ADD_STOCK: (funds) => addStock(funds),
  };

  execute(parsedCommands, commandLookup);
  return log.join("\n").trim();
};

module.exports = { evaluatePortfolioQuerry };
