const GLOBAL_COOLDOWN_MS = 60_000;      // don't speak again too soon after any remark
const EVENT_COOLDOWN_MS = 5 * 60_000;   // don't repeat the same kind of remark too often
const MIN_PRIORITY_TO_SPEAK = 4;

const sessionCooldowns = new Map();

function getCooldown(sessionId) {
  if (!sessionCooldowns.has(sessionId)) {
    sessionCooldowns.set(sessionId, { isSpeaking: false, lastSpokenAt: 0, lastEventSpokenAt: {} });
  }
  return sessionCooldowns.get(sessionId);
}

export function canSpeak(sessionId, event, { isUserTalking = false } = {}) {
  const c = getCooldown(sessionId);
  const now = Date.now();

  if (c.isSpeaking) return false;
  if (isUserTalking) return false;
  if (event.priority < MIN_PRIORITY_TO_SPEAK) return false;
  if (now - c.lastSpokenAt < GLOBAL_COOLDOWN_MS) return false;
  if (now - (c.lastEventSpokenAt[event.type] || 0) < EVENT_COOLDOWN_MS) return false;

  return true;
}

export function markSpeaking(sessionId, isSpeaking) {
  getCooldown(sessionId).isSpeaking = isSpeaking;
}

export function markSpoken(sessionId, event) {
  const c = getCooldown(sessionId);
  const now = Date.now();
  c.lastSpokenAt = now;
  c.lastEventSpokenAt[event.type] = now;
}