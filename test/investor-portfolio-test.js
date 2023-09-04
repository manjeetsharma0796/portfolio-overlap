const { describe, it } = require("node:test");
const assert = require("assert");

const { InvestorPortfolio } = require("../src/investor-portfolio");

describe("InvestorPortfolio", () => {
  describe("addFund", () => {
    it("should able to add fund to investor's portfolio", () => {
      const investorPortfolio = new InvestorPortfolio();
      investorPortfolio.addFund("AXIS_MIDCAP");

      assert.deepStrictEqual(investorPortfolio.funds, ["AXIS_MIDCAP"]);
    });
  });
});
