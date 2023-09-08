const formatLogs = (logs) => {
  const formatedLogs = logs
    .map((result) => {
      if ("error" in result) {
        return `${Object.values(result).join(" ")}`;
      }

      const { fundName, ownedFundName, overlap } = result;
      return `${fundName} ${ownedFundName} ${overlap.toFixed(2)}%`;
    })
    .join("\n");

  return formatedLogs;
};

module.exports = { formatLogs };
