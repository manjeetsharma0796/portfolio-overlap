const countOverlap = (ownedStocks, stocks) => {
  const overlapCount = ownedStocks.filter((stock) =>
    stocks.includes(stock)
  ).length;
  const overlap =
    ((2 * overlapCount) / (stocks.length + ownedStocks.length)) * 100;

  return overlap;
};

const handleOverlapQuery = (fundName, portfolio, funds) => {
  if (!funds[fundName]) {
    return [{ error: "FUND_NOT_FOUND" }];
  }

  const stocks = funds[fundName];

  return portfolio.map((ownedFundName) => {
    const ownedStocks = funds[ownedFundName];
    const overlap = countOverlap(ownedStocks, stocks);

    return { fundName, ownedFundName, overlap };
  });
};

const commandLookup = {
  CURRENT_PORTFOLIO: (ownedFunds, portfolio) => {
    portfolio.push(...ownedFunds);
  },
  CALCULATE_OVERLAP: (fundNames, portfolio, funds) => {
    const [fundName] = fundNames;
    return handleOverlapQuery(fundName, portfolio, funds);
  },
  ADD_STOCK: (fundAndStock, _, funds) => {
    const [fundName, stock] = fundAndStock;
    funds[fundName].push(stock);
  },
};

const evaluatePortfolioQuery = (commandsWithArgs, funds) => {
  const portfolio = [];
  const logs = [];

  commandsWithArgs.forEach(({ command, args }) => {
    const result = commandLookup[command](args, portfolio, funds);

    if (result) {
      logs.push(...result);
    }
  });

  return logs;
};

module.exports = {
  evaluatePortfolioQuery,
  countOverlap,
  handleOverlapQuery,
};
