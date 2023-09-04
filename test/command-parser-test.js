const { describe, it } = require("node:test");
const assert = require("assert");
const { parseCommands } = require("../src/command-parser");

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
