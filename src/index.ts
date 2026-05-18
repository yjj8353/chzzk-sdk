export interface PingResult {
  ok: true;
  timestamp: number;
}

export function ping(): PingResult {
  return {
    ok: true,
    timestamp: Date.now(),
  };
}
