const { describe, it } = require("node:test");
const assert = require("assert");
const { formatLogs } = require("../src/log-formatter");

describe("renderer", () => {
  it("should format provided logs into lines", () => {
    const logs = [
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
    ];

    const formattedLogs = formatLogs(logs);
    const expectedFormat = `MIRAE_ASSET_EMERGING_BLUECHIP AXIS_BLUECHIP 39.13%
MIRAE_ASSET_EMERGING_BLUECHIP ICICI_PRU_BLUECHIP 38.10%`;

    assert.strictEqual(formattedLogs, expectedFormat);
  });

  it("should format error info", () => {
    const logs = [
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

    const formattedLogs = formatLogs(logs);

    const expectedFormat = `ICICI_PRU_NIFTY_NEXT_50_INDEX UTI_NIFTY_INDEX 20.37%
ICICI_PRU_NIFTY_NEXT_50_INDEX AXIS_MIDCAP 14.81%
ICICI_PRU_NIFTY_NEXT_50_INDEX PARAG_PARIKH_FLEXI_CAP 7.41%
FUND_NOT_FOUND`;
    assert.strictEqual(formattedLogs, expectedFormat);
  });
});
