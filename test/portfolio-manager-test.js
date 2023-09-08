const { describe, it } = require("node:test");
const assert = require("assert");
const fs = require("fs");

const {
  evaluatePortfolioQuery,
  countOverlap,
  handleOverlapQuery,
} = require("../src/portfolio-manager");
const { parseCommands, parseFunds } = require("../src/parser");
const { displayLog } = require("../src/renderer");

describe("evaluatePortfolioQuery", () => {
  it("should able to meet output for sample input 1", () => {
    const fundsJSON = fs.readFileSync("resource/mutual-funds.json", "utf-8");
    const funds = parseFunds(fundsJSON);

    const rawCommands = fs.readFileSync(
      "./resource/sample-input/input1.txt",
      "utf-8"
    );
    const commands = parseCommands(rawCommands);
    const logs = evaluatePortfolioQuery(commands, funds);

    let output = "";
    const renderer = (text) => {
      output = text;
    };

    displayLog(logs, renderer);

    const expectedOutput = `MIRAE_ASSET_EMERGING_BLUECHIP AXIS_BLUECHIP 39.13%
MIRAE_ASSET_EMERGING_BLUECHIP ICICI_PRU_BLUECHIP 38.10%
MIRAE_ASSET_EMERGING_BLUECHIP UTI_NIFTY_INDEX 65.52%
MIRAE_ASSET_LARGE_CAP AXIS_BLUECHIP 43.75%
MIRAE_ASSET_LARGE_CAP ICICI_PRU_BLUECHIP 44.62%
MIRAE_ASSET_LARGE_CAP UTI_NIFTY_INDEX 95.00%
MIRAE_ASSET_EMERGING_BLUECHIP AXIS_BLUECHIP 38.71%
MIRAE_ASSET_EMERGING_BLUECHIP ICICI_PRU_BLUECHIP 38.10%
MIRAE_ASSET_EMERGING_BLUECHIP UTI_NIFTY_INDEX 65.52%`;

    assert.deepStrictEqual(output, expectedOutput);
  });

  it("should able to meet output for sample input 2", () => {
    const fundsJSON = fs.readFileSync("resource/mutual-funds.json", "utf-8");
    const funds = parseFunds(fundsJSON);

    const rawCommands = fs.readFileSync(
      "./resource/sample-input/input2.txt",
      "utf-8"
    );
    const commands = parseCommands(rawCommands);
    const logs = evaluatePortfolioQuery(commands, funds);

    let output = "";
    const renderer = (text) => {
      output = text;
    };

    displayLog(logs, renderer);

    const expectedOutput = `ICICI_PRU_NIFTY_NEXT_50_INDEX UTI_NIFTY_INDEX 20.37%
ICICI_PRU_NIFTY_NEXT_50_INDEX AXIS_MIDCAP 14.81%
ICICI_PRU_NIFTY_NEXT_50_INDEX PARAG_PARIKH_FLEXI_CAP 7.41%
FUND_NOT_FOUND
ICICI_PRU_NIFTY_NEXT_50_INDEX UTI_NIFTY_INDEX 20.37%
ICICI_PRU_NIFTY_NEXT_50_INDEX AXIS_MIDCAP 14.68%
ICICI_PRU_NIFTY_NEXT_50_INDEX PARAG_PARIKH_FLEXI_CAP 7.32%`;

    assert.deepStrictEqual(output, expectedOutput);
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
    const fundName = "MIRAE_ASSET_EMERGING_BLUECHIP";
    const expected = [
      {
        fundName: "MIRAE_ASSET_EMERGING_BLUECHIP",
        ownedFundName: "ICICI_PRU_NIFTY_NEXT_50_INDEX",
        overlap: 50,
      },
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

    const portfolio = ["ICICI_PRU_NIFTY_NEXT_50_INDEX"];
    const fundName = "MIRAE_ASSET_BLUECHIP";

    const expected = [{ error: "FUND_NOT_FOUND" }];

    assert.deepStrictEqual(
      handleOverlapQuery(fundName, portfolio, funds),
      expected
    );
  });
});
