class PortfolioManager {
  #funds;
  #portfolio;
  #logs;

  constructor(funds, porfolio) {
    this.#funds = funds;
    this.#portfolio = porfolio;
    this.#logs = [];
  }

  #countOverlap(ownedStocks, stocks) {
    const overlapCount = ownedStocks.filter((stock) =>
      stocks.includes(stock)
    ).length;
    const overlap =
      ((2 * overlapCount) / (stocks.length + ownedStocks.length)) * 100;

    return overlap;
  }

  #handleOverlapQuery(fundName) {
    if (!this.#funds[fundName]) {
      return [{ error: "FUND_NOT_FOUND" }];
    }

    const stocks = this.#funds[fundName];

    return this.#portfolio.map((ownedFundName) => {
      const ownedStocks = this.#funds[ownedFundName];
      const overlap = this.#countOverlap(ownedStocks, stocks);

      return { fundName, ownedFundName, overlap };
    });
  }

  generateResult(commandsWithArgs) {
    const commandLookup = {
      CALCULATE_OVERLAP: (fundNames) => {
        const [fundName] = fundNames;
        return this.#handleOverlapQuery(fundName);
      },
      ADD_STOCK: (fundAndStock) => {
        const [fundName, stock] = fundAndStock;
        this.#funds[fundName].push(stock);
      },
    };
    
    commandsWithArgs.forEach(({ command, args }) => {
      const result = commandLookup[command](args);

      if (result) {
        this.#logs.push(...result);
      }
    });

    return this.#logs;
  }
}

module.exports = {
  PortfolioManager,
};
