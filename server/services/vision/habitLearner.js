// Learns slow, recurring patterns from events instead of storing every event.
import { saveMemory } from "../memory/memoryManager.js";

const MIN_SAMPLES = 5;
const HABIT_TYPES = new Set(["USER_LEFT"]); // extend as new habit-worthy events are added

const logs = new Map(); // sessionId -> { eventType: [timestamps] }

function getLog(sessionId) {
  if (!logs.has(sessionId)) logs.set(sessionId, {});
  return logs.get(sessionId);
}

function averageTimeOfDay(timestamps) {
  const minutes = timestamps.map((t) => {
    const d = new Date(t);
    return d.getHours() * 60 + d.getMinutes();
  });
  const avg = minutes.reduce((a, b) => a + b, 0) / minutes.length;
  const h = Math.floor(avg / 60);
  const m = Math.round(avg % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export async function recordEventForHabits(sessionId, event) {
  if (!HABIT_TYPES.has(event.type)) return;

  const log = getLog(sessionId);
  log[event.type] = log[event.type] || [];
  log[event.type].push(Date.now());

  if (log[event.type].length < MIN_SAMPLES) return;

  const recent = log[event.type].slice(-14);
  const avgTime = averageTimeOfDay(recent);

  await saveMemory(sessionId, {
    action: "update",
    content: `The user usually leaves around ${avgTime}.`,
    category: "habit",
    importance: 6,
  });
}