const ABSENCE_THRESHOLD_MS = 10_000;
const EMOTION_STABLE_THRESHOLD_MS = 8_000;
const MIN_MEANINGFUL_ABSENCE_MS = 3_000;

export function generateEvents(previous, current) {
  if (!previous.initialized) return []; // don't fire on the very first frame

  const now = Date.now();
  const events = [];

  if (!current.present && current.absentSince && !current.firedLeftAt) {
    if (now - current.absentSince >= ABSENCE_THRESHOLD_MS) {
      events.push({ type: "USER_LEFT", priority: 6, data: { awaySince: current.absentSince } });
      current.firedLeftAt = current.absentSince;
    }
  }

  if (current.present && !previous.present && previous.absentSince) {
    const awayMs = now - previous.absentSince;
    if (awayMs >= MIN_MEANINGFUL_ABSENCE_MS) {
      events.push({ type: "USER_RETURNED", priority: 7, data: { awayMs } });
    }
  }

  if (current.faceCount >= 2 && previous.faceCount < 2) {
    events.push({ type: "MULTIPLE_PEOPLE", priority: 4, data: { count: current.faceCount } });
  }

  if (
    current.present &&
    current.emotion &&
    current.emotionSince &&
    !current.firedEmotionStableAt &&
    now - current.emotionSince >= EMOTION_STABLE_THRESHOLD_MS
  ) {
    events.push({
      type: `EMOTION_STABLE_${current.emotion.toUpperCase()}`,
      priority: 5,
      data: { emotion: current.emotion, durationMs: now - current.emotionSince },
    });
    current.firedEmotionStableAt = current.emotionSince;
  }

  return events;
}