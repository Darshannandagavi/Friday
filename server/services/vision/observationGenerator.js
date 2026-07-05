function formatDuration(ms) {
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds} seconds`;
  const minutes = Math.round(seconds / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

const EMOTION_PHRASES = {
  happiness: "smiling",
  sadness: "looking a bit down",
  anger: "looking upset",
  surprise: "looking surprised",
  fear: "looking uneasy",
  disgust: "looking uncomfortable",
  contempt: "looking unimpressed",
  neutral: "calm",
};

export function generateObservation(event) {
  switch (event.type) {
    case "USER_LEFT":
      return "The user has stepped away.";

    case "USER_RETURNED":
      return `The user just came back after being away for about ${formatDuration(event.data.awayMs)}.`;

    case "MULTIPLE_PEOPLE":
      return `There are now ${event.data.count} people in view.`;

    default:
      if (event.type.startsWith("EMOTION_STABLE_")) {
        const phrase = EMOTION_PHRASES[event.data.emotion] || `feeling ${event.data.emotion}`;
        return `The user has been ${phrase} for about ${formatDuration(event.data.durationMs)}.`;
      }
      return null;
  }
}