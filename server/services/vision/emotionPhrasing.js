// Confidence-aware phrasing for detected emotions.
// Shared by proactive vision remarks and reactive "can you see me?" chat answers.

const HIGH_CONFIDENCE = 0.75;
const MED_CONFIDENCE = 0.45;

const PHRASES = {
  happiness: { high: "laughing, or really happy", medium: "smiling", low: "a little pleased" },
  sadness: { high: "quite sad", medium: "a bit down", low: "slightly low" },
  anger: { high: "visibly frustrated or angry", medium: "a bit annoyed", low: "slightly tense" },
  surprise: { high: "very surprised", medium: "surprised", low: "mildly surprised" },
  fear: { high: "quite uneasy or afraid", medium: "a bit uneasy", low: "slightly on edge" },
  disgust: { high: "quite uncomfortable", medium: "a bit uncomfortable", low: "slightly bothered" },
  contempt: { high: "quite unimpressed", medium: "a bit unimpressed", low: "slightly skeptical" },
  neutral: { high: "calm and neutral", medium: "calm", low: "fairly neutral" },
};

export function describeEmotion(emotion, confidence = 0) {
  if (!emotion) return null;

  const tiers = PHRASES[emotion];
  if (!tiers) return `feeling ${emotion}`;

  if (confidence >= HIGH_CONFIDENCE) return tiers.high;
  if (confidence >= MED_CONFIDENCE) return tiers.medium;
  return tiers.low;
}