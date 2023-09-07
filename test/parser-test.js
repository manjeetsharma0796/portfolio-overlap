const { describe, it } = require("node:test");
const assert = require("assert");
const { parseCommands, restructureFunds } = require("../src/parser");

describe("commandParser", () => {
  it("should parse command", () => {
    const rawCommands = "CURRENT_PORTFOLIO AS_BP I_P_B U_N_INDEX";
    const parsedCommands = parseCommands(rawCommands);

    assert.deepStrictEqual(parsedCommands, [
      {
        command: "CURRENT_PORTFOLIO",
        args: ["AS_BP", "I_P_B", "U_N_INDEX"],
      },
    ]);
  });

  it("should parse commands", () => {
    const rawCommands =
      "CURRENT_PORTFOLIO AS_BP I_P_B U_N_INDEX\r\nADD_STOCK AXIS_BLUECHIP TCS";
    const parsedCommands = parseCommands(rawCommands);

    assert.deepStrictEqual(parsedCommands, [
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

describe("restructureFunds", () => {
  it("should restructure funds into fund name with stocks", () => {
    const funds = [
      {
        name: "ICICI_PRU_NIFTY_NEXT_50_INDEX",
        stocks: ["INDRAPRASTHA GAS LIMITED"],
      },
    ];

    const structuredFunds = restructureFunds(funds);
    const expectedFunds = {
      ICICI_PRU_NIFTY_NEXT_50_INDEX: ["INDRAPRASTHA GAS LIMITED"],
    };

    assert.deepStrictEqual(structuredFunds, expectedFunds);
  });
});
