const { describe, it } = require("node:test");
const assert = require("assert");
const { myPortfolioApp } = require("../src/my-portfolio");

describe("myPortfolioApp", () => {
  it("should calculate overlap as half as half of the stocks exists", () => {
    const availableFunds = [
      {
        name: "ICICI_PRU_NIFTY_NEXT_50_INDEX",
        stocks: ["INFOSYS LIMITED", "INDRAPRASTHA GAS LIMITED"],
      },
      {
        name: "MIRAE_ASSET_EMERGING_BLUECHIP",
        stocks: ["INFOSYS LIMITED", "BHARTI AIRTEL LIMITED"],
      },
    ];
    const parsedCommands = [
      {
        command: "CURRENT_PORTFOLIO",
        args: ["ICICI_PRU_NIFTY_NEXT_50_INDEX"],
      },
      {
        command: "CALCULATE_OVERLAP",
        args: ["MIRAE_ASSET_EMERGING_BLUECHIP"],
      },
    ];

    const expected =
      "MIRAE_ASSET_EMERGING_BLUECHIP ICICI_PRU_NIFTY_NEXT_50_INDEX 50.00";

    assert.strictEqual(
      myPortfolioApp(parsedCommands, availableFunds),
      expected
    );
  });

  it("should handle non existing fund overlap calculation", () => {
    const availableFunds = [
      {
        name: "ICICI_PRU_NIFTY_NEXT_50_INDEX",
        stocks: ["INFOSYS LIMITED", "INDRAPRASTHA GAS LIMITED"],
      },
      {
        name: "MIRAE_ASSET_EMERGING_BLUECHIP",
        stocks: ["INFOSYS LIMITED", "BHARTI AIRTEL LIMITED"],
      },
    ];
    const parsedCommands = [
      {
        command: "CURRENT_PORTFOLIO",
        args: ["ICICI_PRU_NIFTY_NEXT_50_INDEX"],
      },
      {
        command: "CALCULATE_OVERLAP",
        args: ["MIRAE_ASSET_BLUECHIP"],
      },
    ];

    const expected = "CALCULATE_FUND_NOT_EXIST";

    assert.strictEqual(
      myPortfolioApp(parsedCommands, availableFunds),
      expected
    );
  });

  it("should be able to add fund", () => {
    const availableFunds = [
      {
        name: "ICICI_PRU_NIFTY_NEXT_50_INDEX",
        stocks: ["INFOSYS LIMITED", "INDRAPRASTHA GAS LIMITED"],
      },
      {
        name: "MIRAE_ASSET_EMERGING_BLUECHIP",
        stocks: ["INFOSYS LIMITED", "BHARTI AIRTEL LIMITED"],
      },
    ];

    const parsedCommands = [
      {
        command: "ADD_STOCK",
        args: ["MIRAE_BLUECHIP"],
      },
    ];

    const expected = "FUND_NOT_EXIST";

    assert.strictEqual(
      myPortfolioApp(parsedCommands, availableFunds),
      expected
    );
  });
});
