class PortfolioManager {
  #mutualFunds;
  #portfolio;
  #logs;

  constructor(mutualFunds, porfolio) {
    this.#mutualFunds = mutualFunds;
    this.#portfolio = porfolio;
    this.#logs = [];
  }

  #handleOverlapQuery(fundName) {
    if (!this.#mutualFunds.doesFundExist(fundName)) {
      return [{ error: "FUND_NOT_FOUND" }];
    }

    return this.#portfolio.map((ownedFundName) => {
      const overlap = this.#mutualFunds.countOverlap(fundName, ownedFundName);
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
        this.#mutualFunds.addStock(fundName, stock);
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
