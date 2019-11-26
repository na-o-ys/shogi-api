export function parse(words: string[]) {
  let result = { pv: [], raw_string: ["info", ...words].join(" ") };
  let command = null;
  words.forEach(word => {
    switch (word) {
      case "score":
        return;
      case "lowerbound":
        result["lowerbound"] = true;
        return;
      case "upperbound":
        result["upperbound"] = true;
        return;
      case "cp":
        command = "score_cp";
        return;
      case "mate":
        command = "score_mate";
        return;
    }
    switch (command) {
      case null:
        command = word;
        return;
      case "pv":
        result["pv"].push(word);
        return;
      default:
        result[command] = parseInt(word);
        command = null;
    }
  });
  return result;
}

export function selectBestPv(infoList: any[]) {
  return infoList.reduce((bestinfo, info) => {
    const depth = bestinfo["depth"] || 0;
    const seldepth = bestinfo["seldepth"] || 0;
    const curr_depth = info["depth"] || 0;
    const curr_seldepth = info["seldepth"] || 0;
    if (
      depth < curr_depth ||
      (depth == curr_depth && seldepth < curr_seldepth)
    ) {
      return info;
    }
    return bestinfo;
  });
}
