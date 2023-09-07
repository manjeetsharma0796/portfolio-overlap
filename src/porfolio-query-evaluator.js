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
    return ["FUND_NOT_FOUND"];
  }

  const stocks = funds[fundName];

  return portfolio.map((ownedFundName) => {
    const ownedStocks = funds[ownedFundName];
    const overlap = countOverlap(ownedStocks, stocks);

    return `${fundName} ${ownedFundName} ${overlap.toFixed(2)}%`;
  });
};

const addStock = (fundName, stock, funds) => {
  funds[fundName].push(stock);
};

const commandLookup = {
  CURRENT_PORTFOLIO: (ownedFunds, porfolio) => {
    porfolio.push(...ownedFunds);
  },
  CALCULATE_OVERLAP: (fundNames, porfolio, log, funds) => {
    const [fundName] = fundNames;
    const result = handleOverlapQuery(fundName, porfolio, funds);
    log.push(...result);
  },
  ADD_STOCK: (fundAndStock, _, __, funds) => {
    const [fundName, stock] = fundAndStock;
    addStock(fundName, stock, funds);
  },
};

const evaluatePortfolioQuery = (commandsWithArgs, funds) => {
  const log = [];
  const porfolio = [];

  commandsWithArgs.forEach(({ command, args }) => {
    commandLookup[command](args, porfolio, log, funds);
  });

  return log.join("\n").trim();
};

module.exports = {
  evaluatePortfolioQuery,
  addStock,
  countOverlap,
  handleOverlapQuery,
};
