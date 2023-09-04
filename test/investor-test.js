const { describe, it } = require("node:test");
const assert = require("assert");

const { Investor } = require("../src/investor");

describe("Investor", () => {
  describe("addFund", () => {
    it("should able to add fund to investor's portfolio", () => {
      const investor = new Investor();
      investor.addFund("AXIS_MIDCAP");

      assert.deepStrictEqual(investor.funds, ["AXIS_MIDCAP"]);
    });
  });
});
