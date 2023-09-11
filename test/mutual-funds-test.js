const { describe, it } = require("node:test");
const assert = require("assert");
const { MutualFunds } = require("../src/mutual-funds");

describe("MutualFunds", () => {
  describe("countOverlap", () => {
    // eslint-disable-next-line max-len
    it("should give zero overlap value, as provided funds have no overlap", () => {
      const funds = { ITC: ["COLGATE", "BRU"], UNI: ["BREW", "TAJ"] };
      const mutualFunds = new MutualFunds(funds);
      assert.strictEqual(mutualFunds.countOverlap("ITC", "UNI"), 0);
    });

    // eslint-disable-next-line max-len
    it("should give non zero overlap value, as provided funds have no overlap", () => {
      const funds = { ITC: ["COLGATE", "BRU"], UNI: ["BREW", "COLGATE"] };
      const mutualFunds = new MutualFunds(funds);
      assert.strictEqual(mutualFunds.countOverlap("ITC", "UNI"), 50);
    });
  });

  describe("addStock", () => {
    it("should add stock to the provided fund name", () => {
      const funds = { ITC: ["COLGATE", "BRU"], UNI: ["BREW", "COLGATE"] };
      const mutualFunds = new MutualFunds(funds);
      mutualFunds.addStock("ITC", "RED LABEL");

      const expectedFunds = mutualFunds.funds;

      assert.deepStrictEqual(
        { ITC: ["COLGATE", "BRU", "RED LABEL"], UNI: ["BREW", "COLGATE"] },
        expectedFunds
      );
    });
  });

  describe("isFundExist", () => {
    it("should give false when provided non existing fund name", () => {
      const funds = { ITC: ["COLGATE", "BRU"], UNI: ["BREW", "COLGATE"] };
      const mutualFunds = new MutualFunds(funds);

      assert.strictEqual(mutualFunds.doesFundExist("ITA"), false);
    });

    it("should give true when provided existing fund name", () => {
      const funds = { ITC: ["COLGATE", "BRU"], UNI: ["BREW", "COLGATE"] };
      const mutualFunds = new MutualFunds(funds);

      assert.strictEqual(mutualFunds.doesFundExist("ITC"), true);
    });
  });
});
