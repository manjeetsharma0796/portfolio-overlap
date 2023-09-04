class UserPortfolio {
  #funds;

  constructor() {
    this.#funds = [];
  }

  addFund(fundName) {
    this.#funds.push(fundName);
  }

  get funds() {
    return [...this.#funds];
  }
}

module.exports = { UserPortfolio };
