// Internal-only per-session vision state. Never sent to the LLM directly.

const sessions = new Map();

function getDefaultState() {
  return {
    initialized: false,
    present: false,
    faceCount: 0,
    emotion: null,
    emotionConfidence: 0,
    emotionSince: null,
    lastSeenAt: null,
    absentSince: null,
    presentSince: null,
    firedEmotionStableAt: null,
    firedLeftAt: null,
  };
}

export function getState(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, getDefaultState());
  }
  return sessions.get(sessionId);
}

export function resetState(sessionId) {
  sessions.set(sessionId, getDefaultState());
}

export function updateState(sessionId, frameResult) {
  const state = getState(sessionId);
  const now = frameResult.timestamp || Date.now();

  const previous = { ...state };

  const faceCount = frameResult.people || 0;
  const isPresent = faceCount > 0;

  const dominantFace =
    faceCount > 0
      ? [...frameResult.faces].sort(
          (a, b) => (b.emotion?.confidence || 0) - (a.emotion?.confidence || 0)
        )[0]
      : null;

  const emotion = dominantFace?.emotion?.emotion || null;
  const emotionConfidence = dominantFace?.emotion?.confidence || 0;

  if (isPresent) {
    state.lastSeenAt = now;
    if (!state.present) {
      state.presentSince = now;
      state.absentSince = null;
      state.firedLeftAt = null;
    }
  } else if (state.present) {
    state.absentSince = now;
    state.presentSince = null;
  }

  state.present = isPresent;
  state.faceCount = faceCount;

  if (emotion && emotion !== state.emotion) {
    state.emotion = emotion;
    state.emotionSince = now;
    state.firedEmotionStableAt = null;
  }
  state.emotionConfidence = emotionConfidence;

  state.initialized = true; // set after snapshotting `previous`

  return { previous, current: state };
}



export function getStateSummary(sessionId) {
  const state = getState(sessionId);

  return {
    initialized: state.initialized,
    present: state.present,
    faceCount: state.faceCount,
    emotion: state.emotion,
    emotionConfidence: state.emotionConfidence,
    lastSeenAt: state.lastSeenAt,
  };
}