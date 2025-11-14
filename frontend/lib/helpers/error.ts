export function shortenError(err: any, max = 160) {
  let msg = typeof err === "string" ? err : err?.message || "Unknown error";
  if (msg.length > max) {
    msg = msg.slice(0, max) + "…";
  }
  return msg;
}
