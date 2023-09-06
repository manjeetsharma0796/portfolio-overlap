const countOverlap = (ownedStocks, stocks) => {
  const overlapCount = ownedStocks.filter((stock) =>
    stocks.includes(stock)
  ).length;
  const overlap =
    ((2 * overlapCount) / (stocks.length + ownedStocks.length)) * 100;

  return overlap;
};

const handleOverlapQuery = (fundName, portfolio, availableFunds) => {
  if (!availableFunds[fundName]) {
    return ["FUND_NOT_FOUND"];
  }

  const stocks = availableFunds[fundName];

  return portfolio.map((ownedFundName) => {
    const ownedStocks = availableFunds[ownedFundName];
    const overlap = countOverlap(ownedStocks, stocks);

    return `${fundName} ${ownedFundName} ${overlap.toFixed(2)}%`;
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
  const availableFundsCopy = availableFunds;
  availableFundsCopy[fund].push(stock);

  return availableFundsCopy;
};

const commandLookup = {
  CURRENT_PORTFOLIO: (fundList, porfolio) => {
    porfolio.push(...fundList);
  },
  CALCULATE_OVERLAP: (fund, porfolio, log, funds) => {
    const result = handleOverlapQuery([fund], porfolio, funds);
    log.push(...result);
  },
  ADD_STOCK: (fundAndStock, _, __, funds) => {
    const [fund, stock] = fundAndStock;
    addStock(fund, stock, funds);
  },
};

const evaluatePortfolioQuery = (parsedCommands, mutualFunds) => {
  const log = [];
  const porfolio = [];
  const funds = restructureFund(mutualFunds);

  parsedCommands.forEach(({ command, args }) => {
    commandLookup[command](args, porfolio, log, funds);
  });

  return log.join("\n").trim();
};

module.exports = {
  evaluatePortfolioQuery,
  addStock,
  restructureFund,
  countOverlap,
  handleOverlapQuery
};
