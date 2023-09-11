class FundPortfolioController {
  #mutualFunds;
  #portfolio;

  constructor(mutualFunds, porfolio) {
    this.#mutualFunds = mutualFunds;
    this.#portfolio = porfolio;
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

  execute(commandsWithArgs) {
    const logs = [];
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
        logs.push(...result);
      }
    });

    return logs;
  }
}

module.exports = {
  FundPortfolioController,
};
