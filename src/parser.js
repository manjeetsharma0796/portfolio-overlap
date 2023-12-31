const parseCommands = (rawCommands) => {
  const commandsWithArgs = rawCommands.trim().split("\r\n");
  const parsedCommands = commandsWithArgs.map((commandWithArgs) => {
    const [command, ...args] = commandWithArgs.split(" ");
    return { command, args };
  });

  return parsedCommands;
};

const parseFunds = (fundsJSON) => {
  const { funds } = JSON.parse(fundsJSON);

  return funds.reduce((restructuredFunds, { name, stocks }) => {
    restructuredFunds[name] = stocks;
    return restructuredFunds;
  }, {});
};

module.exports = { parseCommands, parseFunds };
