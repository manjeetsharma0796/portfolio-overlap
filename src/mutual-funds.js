class MutualFunds {
  #funds;

  constructor(funds) {
    this.#funds = JSON.parse(JSON.stringify(funds));
  }

  countOverlap(fundName, ownedFundName) {
    const stocks = this.#funds[fundName];
    const ownedStocks = this.#funds[ownedFundName];

    const overlapCount = ownedStocks.filter((stock) =>
      stocks.includes(stock)
    ).length;
    const overlap =
      ((2 * overlapCount) / (stocks.length + ownedStocks.length)) * 100;

    return overlap;
  }

  addStock(fundName, stockName) {
    this.#funds[fundName].push(stockName);
  }

  doesFundExist(fundName) {
    return fundName in this.#funds;
  }

  get funds() {
    const funds = JSON.parse(JSON.stringify(this.#funds));

    return funds;
  }
}

module.exports = { MutualFunds };
