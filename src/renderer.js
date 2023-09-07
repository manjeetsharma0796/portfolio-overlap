const displayLog = (logs, renderer = console.log) => {
  const logsText = logs
    .map((result) => {
      if ("error" in result) {
        return `${Object.values(result).join(" ")}`;
      }

      const { fundName, ownedFundName, overlap } = result;
      return `${fundName} ${ownedFundName} ${overlap.toFixed(2)}%`;
    })
    .join("\n");

  renderer(logsText);
};

module.exports = { displayLog };
