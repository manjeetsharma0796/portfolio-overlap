const { describe, it } = require("node:test");
const assert = require("assert");
const { parseCommands, parseFunds } = require("../src/parser");

describe("commandParser", () => {
  it("should parse command", () => {
    const rawCommands = "CURRENT_PORTFOLIO AS_BP I_P_B U_N_INDEX";
    const commands = parseCommands(rawCommands);

    assert.deepStrictEqual(commands, [
      {
        command: "CURRENT_PORTFOLIO",
        args: ["AS_BP", "I_P_B", "U_N_INDEX"],
      },
    ]);
  });

  it("should parse commands", () => {
    const rawCommands =
      "CURRENT_PORTFOLIO AS_BP I_P_B U_N_INDEX\r\nADD_STOCK AXIS_BLUECHIP TCS";
    const commands = parseCommands(rawCommands);

    assert.deepStrictEqual(commands, [
      {
        command: "CURRENT_PORTFOLIO",
        args: ["AS_BP", "I_P_B", "U_N_INDEX"],
      },
      {
        command: "ADD_STOCK",
        args: ["AXIS_BLUECHIP", "TCS"],
      },
    ]);
  });
});

describe("parseFunds", () => {
  it("should restructure single fund", () => {
    const fundsJSON = JSON.stringify({
      funds: [
        {
          name: "ICICI_PRU_NIFTY_NEXT_50_INDEX",
          stocks: ["INDRAPRASTHA GAS LIMITED"],
        },
      ],
    });

    const funds = parseFunds(fundsJSON);
    const expectedFunds = {
      ICICI_PRU_NIFTY_NEXT_50_INDEX: ["INDRAPRASTHA GAS LIMITED"],
    };

    assert.deepStrictEqual(funds, expectedFunds);
  });

  it("should restructure provided funds", () => {
    const fundsJSON = JSON.stringify({
      funds: [
        {
          name: "ICICI_PRU_NIFTY_NEXT_50_INDEX",
          stocks: [
            "INDRAPRASTHA GAS LIMITED",
            "COLGATE - PALMOLIVE (INDIA) LIMITED",
          ],
        },
      ],
    });
    const expectedStructuredFund = {
      ICICI_PRU_NIFTY_NEXT_50_INDEX: [
        "INDRAPRASTHA GAS LIMITED",
        "COLGATE - PALMOLIVE (INDIA) LIMITED",
      ],
    };
    const funds = parseFunds(fundsJSON);

    assert.deepStrictEqual(funds, expectedStructuredFund);
  });
});
