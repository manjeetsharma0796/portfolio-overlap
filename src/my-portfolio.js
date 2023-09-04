const myPortfolioApp = (parsedCommands, availableFunds) => {
  const log = [];
  const investorPortfolio = [];

  const createPortfolio = (funds) => {
    funds.forEach((fund) => investorPortfolio.push(fund));
  };

  const getStockList = (fundName) => {
    const fund = availableFunds.find((fundInfo) => fundInfo.name === fundName);
    return fund.stocks;
  };

  const calculateOverlap = ([fundName]) => {
    const stocks = getStockList(fundName);

    investorPortfolio.forEach((investorFundName) => {
      const investorStocks = getStockList(investorFundName);

      const commonStockCount = investorStocks.filter((investorStock) =>
        stocks.includes(investorStock)
      ).length;

      const overlap =
        ((2 * commonStockCount) / (stocks.length + investorStocks.length)) *
        100;

      log.push(`${fundName} ${investorFundName} ${overlap.toFixed(2)}`);
    });
  };

  const commandLookup = {
    CURRENT_PORTFOLIO: (funds) => {
      createPortfolio(funds);
    },
    CALCULATE_OVERLAP: (fund) => {
      calculateOverlap(fund);
    },
    ADD_STOCK: () => {},
  };

  const execute = () => {
    parsedCommands.forEach(({ command, args }) => {
      log.push(commandLookup[command](args));
    });
  };

  execute(parsedCommands);

  return log.join("\n").trim();
};

module.exports = { myPortfolioApp };
