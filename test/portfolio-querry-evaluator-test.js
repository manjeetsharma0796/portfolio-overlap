const { describe, it } = require("node:test");
const assert = require("assert");
const fs = require("fs");

const {
  evaluatePortfolioQuerry,
  addStock,
  restructureFund,
  countOverlap,
} = require("../src/porfolio-querry-evaluator");
const { parseCommands } = require("../src/command-parser");

describe("evaluatePortfolioQuerry", () => {
  it("should calculate overlap as half as half of the stocks exists", () => {
    const mutualFunds = [
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
      "MIRAE_ASSET_EMERGING_BLUECHIP ICICI_PRU_NIFTY_NEXT_50_INDEX 50.00%";

    assert.strictEqual(
      evaluatePortfolioQuerry(parsedCommands, mutualFunds),
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

    const expected = "FUND_NOT_FOUND";

    assert.strictEqual(
      evaluatePortfolioQuerry(parsedCommands, availableFunds),
      expected
    );
  });

  it("should able to meet output for sample input 1", () => {
    const expectedOutput = `MIRAE_ASSET_EMERGING_BLUECHIP AXIS_BLUECHIP 39.13%
MIRAE_ASSET_EMERGING_BLUECHIP ICICI_PRU_BLUECHIP 38.10%
MIRAE_ASSET_EMERGING_BLUECHIP UTI_NIFTY_INDEX 65.52%
MIRAE_ASSET_LARGE_CAP AXIS_BLUECHIP 43.75%
MIRAE_ASSET_LARGE_CAP ICICI_PRU_BLUECHIP 44.62%
MIRAE_ASSET_LARGE_CAP UTI_NIFTY_INDEX 95.00%
MIRAE_ASSET_EMERGING_BLUECHIP AXIS_BLUECHIP 38.71%
MIRAE_ASSET_EMERGING_BLUECHIP ICICI_PRU_BLUECHIP 38.10%
MIRAE_ASSET_EMERGING_BLUECHIP UTI_NIFTY_INDEX 65.52%`;

    const { funds } = JSON.parse(
      fs.readFileSync("resource/mutual-funds.json", "utf-8")
    );
    const rawCommands = fs.readFileSync(
      "./resource/sample_input/input1.txt",
      "utf-8"
    );
    const parsedCommands = parseCommands(rawCommands);

    assert.strictEqual(
      evaluatePortfolioQuerry(parsedCommands, funds),
      expectedOutput
    );
  });

  it("should able to meet output for sample input 2", () => {
    const expectedOutput = `ICICI_PRU_NIFTY_NEXT_50_INDEX UTI_NIFTY_INDEX 20.37%
ICICI_PRU_NIFTY_NEXT_50_INDEX AXIS_MIDCAP 14.81%
ICICI_PRU_NIFTY_NEXT_50_INDEX PARAG_PARIKH_FLEXI_CAP 7.41%
FUND_NOT_FOUND
ICICI_PRU_NIFTY_NEXT_50_INDEX UTI_NIFTY_INDEX 20.37%
ICICI_PRU_NIFTY_NEXT_50_INDEX AXIS_MIDCAP 14.68%
ICICI_PRU_NIFTY_NEXT_50_INDEX PARAG_PARIKH_FLEXI_CAP 7.32%`;

    const { funds } = JSON.parse(
      fs.readFileSync("resource/mutual-funds.json", "utf-8")
    );
    const rawCommands = fs.readFileSync(
      "./resource/sample_input/input2.txt",
      "utf-8"
    );
    const parsedCommands = parseCommands(rawCommands);

    assert.strictEqual(
      evaluatePortfolioQuerry(parsedCommands, funds),
      expectedOutput
    );
  });
});

describe("addStock", () => {
  it("should add stock to provided fund", () => {
    const funds = {
      ICICI_PRU_INDEX: [
        "INDRAPRASTHA GAS LIMITED",
        "COLGATE - PALMOLIVE (INDIA) LIMITED",
      ],
    };

    const fund = "ICICI_PRU_INDEX";
    const stock = "NOCIL";
    const updatedFunds = addStock(fund, stock, funds);

    const expectedFunds = {
      ICICI_PRU_INDEX: [
        "INDRAPRASTHA GAS LIMITED",
        "COLGATE - PALMOLIVE (INDIA) LIMITED",
        "NOCIL",
      ],
    };

    assert.deepStrictEqual(updatedFunds, expectedFunds);
  });
});

describe("restructureFund", () => {
  it("should restructure funds list", () => {
    const funds = [
      {
        name: "ICICI_PRU_NIFTY_NEXT_50_INDEX",
        stocks: [
          "INDRAPRASTHA GAS LIMITED",
          "COLGATE - PALMOLIVE (INDIA) LIMITED",
        ],
      },
    ];
    const expectedStructuredFund = {
      ICICI_PRU_NIFTY_NEXT_50_INDEX: [
        "INDRAPRASTHA GAS LIMITED",
        "COLGATE - PALMOLIVE (INDIA) LIMITED",
      ],
    };
    const restructuredFund = restructureFund(funds);

    assert.deepStrictEqual(restructuredFund, expectedStructuredFund);
  });
});

describe("countOverlap", () => {
  it("should give overlap percentage as 0 of two stocks, none overlaps", () => {
    const ownedStocks = ["A"];
    const stocks = ["B"];
    const overlap = countOverlap(ownedStocks, stocks);

    assert.strictEqual(overlap, "0.00%");
  });

  it("should be non zero percentage value given stocks,as it overlaps", () => {
    const ownedStocks = ["A", "B"];
    const stocks = ["B", "C"];
    const overlap = countOverlap(ownedStocks, stocks);

    assert.strictEqual(overlap, "50.00%");
  });
});
