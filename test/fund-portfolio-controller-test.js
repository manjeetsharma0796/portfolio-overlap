const { describe, it } = require("node:test");
const assert = require("assert");
const fs = require("fs");

const {
  FundPortfolioController,
} = require("../src/fund-portfolio-controller.js");
const { parseCommands, parseFunds } = require("../src/parser");
const { MutualFunds } = require("../src/mutual-funds");

describe("generateResult", () => {
  it("should generate log for existing funds", () => {
    const fundsJSON = fs.readFileSync("resource/mutual-funds.json", "utf-8");
    const funds = parseFunds(fundsJSON);
    const mutualFunds = new MutualFunds(funds);
    const rawCommands =
      "CURRENT_PORTFOLIO AXIS_BLUECHIP ICICI_PRU_BLUECHIP UTI_NIFTY_INDEX\r\n" +
      "CALCULATE_OVERLAP MIRAE_ASSET_EMERGING_BLUECHIP\r\n";

    const [portfolioInfo, ...commandsWithArgs] = parseCommands(rawCommands);
    const portfolio = [...portfolioInfo.args];
    const fundPortfolioController = new FundPortfolioController(
      mutualFunds,
      portfolio
    );

    const logs = fundPortfolioController.execute(commandsWithArgs);

    const expectedLogs = [
      {
        fundName: "MIRAE_ASSET_EMERGING_BLUECHIP",
        ownedFundName: "AXIS_BLUECHIP",
        overlap: 39.130434782608695,
      },
      {
        fundName: "MIRAE_ASSET_EMERGING_BLUECHIP",
        ownedFundName: "ICICI_PRU_BLUECHIP",
        overlap: 38.095238095238095,
      },
      {
        fundName: "MIRAE_ASSET_EMERGING_BLUECHIP",
        ownedFundName: "UTI_NIFTY_INDEX",
        overlap: 65.51724137931035,
      },
    ];

    assert.deepStrictEqual(logs, expectedLogs);
  });

  it("should able to generate message for non existing fund", () => {
    const fundsJSON = fs.readFileSync("resource/mutual-funds.json", "utf-8");
    const funds = parseFunds(fundsJSON);
    const mutualFunds = new MutualFunds(funds);

    const rawCommands =
      // eslint-disable-next-line max-len
      "CURRENT_PORTFOLIO UTI_NIFTY_INDEX AXIS_MIDCAP PARAG_PARIKH_FLEXI_CAP\r\n" +
      "CALCULATE_OVERLAP ICICI_PRU_NIFTY_NEXT_50_INDEX\r\n" +
      "CALCULATE_OVERLAP NIPPON_INDIA_PHARMA_FUND\r\n" +
      "ADD_STOCK AXIS_MIDCAP NOCIL\r\n";

    const [portfolioInfo, ...commandsWithArgs] = parseCommands(rawCommands);
    const portfolio = [...portfolioInfo.args];
    const fundPortfolioController = new FundPortfolioController(
      mutualFunds,
      portfolio
    );

    const logs = fundPortfolioController.execute(commandsWithArgs);

    const expectedLogs = [
      {
        fundName: "ICICI_PRU_NIFTY_NEXT_50_INDEX",
        ownedFundName: "UTI_NIFTY_INDEX",
        overlap: 20.37037037037037,
      },
      {
        fundName: "ICICI_PRU_NIFTY_NEXT_50_INDEX",
        ownedFundName: "AXIS_MIDCAP",
        overlap: 14.814814814814813,
      },
      {
        fundName: "ICICI_PRU_NIFTY_NEXT_50_INDEX",
        ownedFundName: "PARAG_PARIKH_FLEXI_CAP",
        overlap: 7.4074074074074066,
      },
      { error: "FUND_NOT_FOUND" },
    ];

    assert.deepStrictEqual(logs, expectedLogs);
  });
});
