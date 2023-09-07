const { describe, it } = require("node:test");
const assert = require("assert");
const fs = require("fs");

const {
  evaluatePortfolioQuery,
  addStock,
  restructureFund,
  countOverlap,
  handleOverlapQuery,
} = require("../src/porfolio-query-evaluator");
const { parseCommands, restructureFunds } = require("../src/parser");

describe("evaluatePortfolioQuery", () => {
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
    const structuredFunds = restructureFunds(funds);
    const rawCommands = fs.readFileSync(
      "./resource/sample-input/input1.txt",
      "utf-8"
    );
    const parsedCommands = parseCommands(rawCommands);

    assert.strictEqual(
      evaluatePortfolioQuery(parsedCommands, structuredFunds),
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
    const structuredFunds = restructureFunds(funds);
    const rawCommands = fs.readFileSync(
      "./resource/sample-input/input2.txt",
      "utf-8"
    );
    const parsedCommands = parseCommands(rawCommands);

    assert.strictEqual(
      evaluatePortfolioQuery(parsedCommands, structuredFunds),
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
    addStock(fund, stock, funds);

    const expectedFunds = {
      ICICI_PRU_INDEX: [
        "INDRAPRASTHA GAS LIMITED",
        "COLGATE - PALMOLIVE (INDIA) LIMITED",
        "NOCIL",
      ],
    };

    assert.deepStrictEqual(funds, expectedFunds);
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
    const restructuredFund = restructureFunds(funds);

    assert.deepStrictEqual(restructuredFund, expectedStructuredFund);
  });
});

describe("countOverlap", () => {
  it("should give overlap percentage as 0 of two stocks, none overlaps", () => {
    const ownedStocks = ["A"];
    const stocks = ["B"];
    const overlap = countOverlap(ownedStocks, stocks);

    assert.strictEqual(overlap, 0);
  });

  it("should be non zero percentage value given stocks,as it overlaps", () => {
    const ownedStocks = ["A", "B"];
    const stocks = ["B", "C"];
    const overlap = countOverlap(ownedStocks, stocks);

    assert.strictEqual(overlap, 50);
  });
});

describe("handleOverlapQuery", () => {
  it("should calculate overlap as half as half of the stocks exists", () => {
    const funds = {
      ICICI_PRU_NIFTY_NEXT_50_INDEX: [
        "INFOSYS LIMITED",
        "INDRAPRASTHA GAS LIMITED",
      ],

      MIRAE_ASSET_EMERGING_BLUECHIP: [
        "INFOSYS LIMITED",
        "BHARTI AIRTEL LIMITED",
      ],
    };
    const portfolio = ["ICICI_PRU_NIFTY_NEXT_50_INDEX"];
    const fundName = ["MIRAE_ASSET_EMERGING_BLUECHIP"];
    const expected = [
      "MIRAE_ASSET_EMERGING_BLUECHIP ICICI_PRU_NIFTY_NEXT_50_INDEX 50.00%",
    ];

    assert.deepStrictEqual(
      handleOverlapQuery(fundName, portfolio, funds),
      expected
    );
  });

  it("should handle non existing fund overlap calculation", () => {
    const funds = {
      ICICI_PRU_NIFTY_NEXT_50_INDEX: [
        "INFOSYS LIMITED",
        "INDRAPRASTHA GAS LIMITED",
      ],

      MIRAE_ASSET_EMERGING_BLUECHIP: [
        "INFOSYS LIMITED",
        "BHARTI AIRTEL LIMITED",
      ],
    };

    const porfolio = ["ICICI_PRU_NIFTY_NEXT_50_INDEX"];
    const fundName = ["MIRAE_ASSET_BLUECHIP"];

    const expected = ["FUND_NOT_FOUND"];

    assert.deepStrictEqual(
      handleOverlapQuery(fundName, porfolio, funds),
      expected
    );
  });
});
