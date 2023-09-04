const { describe, it } = require("node:test");
const assert = require("assert");

const { UserPortfolio } = require("../src/user-portfolio");

describe("UserPortfolio", () => {
  describe("addFund", () => {
    it("should able to add fund to user portfolio", () => {
      const userPortfolio = new UserPortfolio();
      userPortfolio.addFund("AXIS_MIDCAP");

      assert.deepStrictEqual(userPortfolio.funds, ["AXIS_MIDCAP"]);
    });
  });
});
