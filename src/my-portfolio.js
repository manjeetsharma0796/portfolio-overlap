const myPortfolioApp = (parsedCommands, availableFunds) => {
  const log = [];
  const ownedFunds = [];

  const createPortfolio = (funds) => {
    funds.forEach((fund) => {
      ownedFunds.push(fund);
    });
  };

  const getStockList = (fundName) => {
    const fund = availableFunds.find((fundInfo) => fundInfo.name === fundName);
    return fund.stocks;
  };

  const isFundExist = (fundName) => {
    return availableFunds.some((fund) => fund.name === fundName);
  };

  const calculateOverlap = ([fundName]) => {
    if (!isFundExist(fundName)) {
      log.push("CALCULATE_FUND_NOT_EXIST");
      return;
    }

    const stocks = getStockList(fundName);
    ownedFunds.forEach((investorFundName) => {
      const investorStocks = getStockList(investorFundName);

      const overlapCount = investorStocks.filter((investorStock) =>
        stocks.includes(investorStock)
      ).length;

      const overlap =
        ((2 * overlapCount) / (stocks.length + investorStocks.length)) * 100;

      log.push(`${fundName} ${investorFundName} ${overlap.toFixed(2)}%`);
    });
  };

  const addStock = (funds) => {
    for (const fund of funds) {
      if (!isFundExist(fund)) {
        log.push("FUND_NOT_EXIST");
        return;
      }

      ownedFunds.push(fund);
    }
  };

  const commandLookup = {
    CURRENT_PORTFOLIO: (funds) => createPortfolio(funds),
    CALCULATE_OVERLAP: (fund) => calculateOverlap(fund),
    ADD_STOCK: (funds) => addStock(funds),
  };

  const execute = () => {
    parsedCommands.forEach(({ command, args }) => {
      commandLookup[command](args);
    });
  };

  execute(parsedCommands);

  return log.join("\n").trim();
};

module.exports = { myPortfolioApp };
