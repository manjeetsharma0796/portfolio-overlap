const parseCommands = (rawCommands) => {
  const commandsWithArgs = rawCommands.trim().split("\r\n");
  const parsedCommands = commandsWithArgs.map((commandWithArgs) => {
    const [command, ...args] = commandWithArgs.split(" ");
    return { command, args };
  });

  return parsedCommands;
};

const restructureFunds = (funds) => {
  const restructuredFund = {};

  funds.forEach(({ name, stocks }) => {
    restructuredFund[name] = stocks;
  });

  return restructuredFund;
};

module.exports = { parseCommands, restructureFunds };
