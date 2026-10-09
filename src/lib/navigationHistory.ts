/** Safari limits History API writes. Coalesce bursts without interrupting the UI. */
let writes: number[] = [];
let pending: unknown;
let timer: ReturnType<typeof setTimeout> | undefined;
function attempt(state: unknown, push: boolean) {
  const now = Date.now();
  writes = writes.filter((time) => now - time < 10_500);
  if (writes.length >= 60) return false;
  try {
    if (push) window.history.pushState(state, "");
    else window.history.replaceState(state, "");
    writes.push(now);
    return true;
  } catch {
    // A browser policy or a shared history budget may deny a write.
    // Navigation itself must continue to work.
    return false;
  }
}
export function writeNavigationHistory(state: unknown, push = false) {
  if (timer) clearTimeout(timer);
  pending = state;
  if (attempt(state, push)) {
    pending = undefined;
    return;
  }
  const flush = () => {
    if (pending === undefined) return;
    if (attempt(pending, false)) {
      pending = undefined;
      timer = undefined;
    } else timer = setTimeout(flush, 1000);
  };
  timer = setTimeout(flush, 1000);
}
export function cancelPendingHistory() {
  if (timer) clearTimeout(timer);
  timer = undefined;
  pending = undefined;
}
