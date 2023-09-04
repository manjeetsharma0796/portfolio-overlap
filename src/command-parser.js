const parseCommands = (rawCommands) => {
  const commandsWithArgs = rawCommands.trim().split("\r\n");
  const parsedCommands = commandsWithArgs.map((commandWithArgs) => {
    const [command, ...args] = commandWithArgs.split(" ");
    return { command, args };
  });

  return parsedCommands;
};

module.exports = { parseCommands };
