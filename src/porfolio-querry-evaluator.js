const countOverlap = (ownedStocks, stocks) => {
  const overlapCount = ownedStocks.filter((stock) =>
    stocks.includes(stock)
  ).length;
  const overlap =
    ((2 * overlapCount) / (stocks.length + ownedStocks.length)) * 100;

  return `${overlap.toFixed(2)}%`;
};

const handleOverlapQuerry = (fundName, porfolio, availableFunds) => {
  if (!availableFunds[fundName]) {
    return ["FUND_NOT_FOUND"];
  }

  const stocks = availableFunds[fundName];

  return porfolio.map((ownedFundName) => {
    const ownedStocks = availableFunds[ownedFundName];
    const overlap = countOverlap(ownedStocks, stocks);

    return `${fundName} ${ownedFundName} ${overlap}`;
  });
};

const restructureFund = (fund) => {
  const restructuredFund = {};

  fund.forEach(({ name, stocks }) => {
    restructuredFund[name] = stocks;
  });

  return restructuredFund;
};

const addStock = (fund, stock, availableFunds) => {
  const availableFundsCopy = JSON.parse(JSON.stringify(availableFunds));
  availableFundsCopy[fund].push(stock);

  return availableFundsCopy;
};

const evaluatePortfolioQuerry = (parsedCommands, mutualFunds) => {
  const log = [];
  const porfolio = [];
  let funds = restructureFund(mutualFunds);

  const commandLookup = {
    CURRENT_PORTFOLIO: (fundList) => {
      porfolio.push(...fundList);
    },
    CALCULATE_OVERLAP: ([fund]) => {
      const result = handleOverlapQuerry(fund, porfolio, funds);
      log.push(...result);
    },
    ADD_STOCK: (fundAndStock) => {
      const [fund, stock] = fundAndStock;
      funds = addStock(fund, stock, funds);
    },
  };

  parsedCommands.forEach(({ command, args }) => {
    commandLookup[command](args);
  });

  return log.join("\n").trim();
};

module.exports = {
  evaluatePortfolioQuerry,
  addStock,
  restructureFund,
  countOverlap,
};
