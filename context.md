# Project Context

You are helping with an existing software project.

## Instructions

1. First understand the project architecture before answering.
2. Do not modify unrelated files.
3. Reuse the existing project structure and coding style.
4. Make only the minimum required changes.
5. Mention every file that needs to be modified.
6. If additional files are required, ask only for those files.

---

## Project Structure

```text
├── .gitignore
├── README.md
├── client
│   ├── .gitignore
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── vite.config.js
├── ml-server
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   ├── routes
│   │   ├── __init__.py
│   │   ├── health.py
│   │   └── vision.py
│   ├── services
│   │   ├── __init__.py
│   │   ├── emotion_service.py
│   │   ├── face_service.py
│   │   └── live_vision.py
│   ├── skills
│   │   ├── __init__.py
│   │   ├── emotion
│   │   │   ├── __init__.py
│   │   │   ├── detector.py
│   │   │   ├── labels.py
│   │   │   ├── postprocess.py
│   │   │   └── preprocess.py
│   │   └── face_detection
│   │       ├── __init__.py
│   │       ├── decoder.py
│   │       ├── detector.py
│   │       ├── draw.py
│   │       ├── postprocess.py
│   │       ├── preprocess.py
│   │       └── utils.py
│   ├── tests
│   │   ├── emotion_test.py
│   │   └── face_test.py
│   └── utils
│       ├── image.py
│       └── logger.py
└── server
    ├── config
    │   └── db.js
    ├── controllers
    │   ├── chatController.js
    │   ├── ttsController.js
    │   └── visionController.js
    ├── ml
    │   ├── camera
    │   │   └── frameProcessor.js
    │   ├── emotion
    │   │   ├── emotionModel.js
    │   │   ├── inference.js
    │   │   ├── inspectModel.js
    │   │   ├── labels.json
    │   │   ├── preprocess.js
    │   │   └── test.js
    │   ├── faceDetection
    │   │   ├── constants.js
    │   │   ├── cropFace.js
    │   │   ├── debugDraw.js
    │   │   ├── decoder.js
    │   │   ├── faceDetector.js
    │   │   ├── inference.js
    │   │   ├── inspectModel.js
    │   │   ├── postprocess.js
    │   │   ├── preprocess.js
    │   │   └── test.js
    │   ├── pipeline.js
    │   └── utils
    │       ├── image.js
    │       ├── math.js
    │       └── tensor.js
    ├── models
    │   ├── Conversation.js
    │   └── Memory.js
    ├── package.json
    ├── routes
    │   ├── chatRoutes.js
    │   ├── ttsRoutes.js
    │   └── visionRoutes.js
    ├── server.js
    └── services
        ├── chat
        │   ├── chatServices.js
        │   └── conversationManager.js
        ├── llm
        │   └── grok.js
        ├── memory
        │   ├── memoryExtractor.js
        │   └── memoryManager.js
        ├── prompt
        │   └── promptBuilder.js
        ├── vision
        │   └── visionService.js
        └── voice
            └── elevenlabsService.js
```

===============================================================================
FILE: .gitignore
===============================================================================

```text
```

===============================================================================
FILE: client/.gitignore
===============================================================================

```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

===============================================================================
FILE: client/eslint.config.js
===============================================================================

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
```

===============================================================================
FILE: client/index.html
===============================================================================

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>client</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

===============================================================================
FILE: client/package.json
===============================================================================

```json
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "framer-motion": "^12.42.2",
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.3",
    "eslint": "^10.6.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.3",
    "globals": "^17.7.0",
    "vite": "^8.1.1"
  }
}
```

===============================================================================
FILE: client/README.md
===============================================================================

```md
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
```

===============================================================================
FILE: client/src/App.css
===============================================================================

```css
```

===============================================================================
FILE: client/src/App.jsx
===============================================================================

```jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------------------------
// Mathematical waveform animation for TTS (no audio context needed)
// ---------------------------------------------------------------------------

const TTS_BAR_WEIGHTS = [0.72, 0.88, 1.05, 1.05, 0.88, 0.72];
const IDLE_HEIGHT = 48;
const PEAK_RANGE = 140;

function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [inputMode, setInputMode] = useState(null);
  const [showResponse, setShowResponse] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(
    () => localStorage.getItem("friday-speaker") === "true",
  );
  const [levels, setLevels] = useState([48, 48, 48, 48, 48, 48]);

  const sessionId = useRef(
    localStorage.getItem("friday-session") || crypto.randomUUID(),
  );

  useEffect(() => {
    localStorage.setItem("friday-session", sessionId.current);
  }, []);

  useEffect(() => {
    localStorage.setItem("friday-speaker", String(speakerOn));
  }, [speakerOn]);

  const recognitionRef = useRef(null);
  const inputRef = useRef(null);
  const responseContainerRef = useRef(null);

  const micStreamRef = useRef(null);
  const micAudioCtxRef = useRef(null);
  const micRafRef = useRef(null);

  // TTS animation refs - using mathematical waveform only
  const ttsRafRef = useRef(null);
  const ttsStartTimeRef = useRef(0);
  const currentHeightsRef = useRef([48, 48, 48, 48, 48, 48]);
  const barsRef = useRef([]);
  const speechUtteranceRef = useRef(null);
  const speechVoicesRef = useRef([]);
  const isSpeakingRef = useRef(false);

  // Load voices when they become available
  useEffect(() => {
    // Get voices immediately if available
    const availableVoices = window.speechSynthesis.getVoices();
    if (availableVoices.length > 0) {
      speechVoicesRef.current = availableVoices;
    }

    // Listen for voice changes
    const handleVoicesChanged = () => {
      speechVoicesRef.current = window.speechSynthesis.getVoices();
    };

    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
        setMessage(transcriptText);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        stopMicVisualizer();
        if (message.trim()) {
          sendMessage();
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (responseContainerRef.current && showResponse) {
      responseContainerRef.current.scrollTop =
        responseContainerRef.current.scrollHeight;
    }
  }, [response, showResponse]);

  useEffect(() => {
    return () => {
      stopMicVisualizer();
      stopTTSPlayback();
      if (speechUtteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatResponse = (text) => {
    return text
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/^#+\s/gm, "")
      .trim();
  };

  const animateLevels = useCallback((analyser, rafRef) => {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const chunkSize = Math.max(1, Math.floor(bufferLength / 6));

    const tick = () => {
      analyser.getByteFrequencyData(dataArray);
      const newLevels = Array.from({ length: 6 }, (_, i) => {
        const start = i * chunkSize;
        let sum = 0;
        for (let j = start; j < start + chunkSize; j++) sum += dataArray[j] || 0;
        const avg = sum / chunkSize;
        return 48 + (avg / 255) * 140;
      });
      setLevels(newLevels);
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  }, []);

  const startMicVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      micAudioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.6;
      source.connect(analyser);
      animateLevels(analyser, micRafRef);
    } catch (err) {
      console.error("Mic visualizer error:", err);
    }
  };

  const stopMicVisualizer = () => {
    if (micRafRef.current) cancelAnimationFrame(micRafRef.current);
    micRafRef.current = null;
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current = null;
    if (micAudioCtxRef.current) {
      micAudioCtxRef.current.close().catch(() => {});
      micAudioCtxRef.current = null;
    }
    setLevels([48, 48, 48, 48, 48, 48]);
  };

  // Pure mathematical waveform animation for TTS
  const startTTSVisualizer = useCallback(() => {
    isSpeakingRef.current = true;
    currentHeightsRef.current = [48, 48, 48, 48, 48, 48];
    barsRef.current.forEach((el) => {
      if (el) {
        el.style.height = `${IDLE_HEIGHT}px`;
        el.style.boxShadow = 'none';
      }
    });

    const tick = () => {
      if (!isSpeakingRef.current) return;

      const elapsed = (Date.now() - ttsStartTimeRef.current) / 1000;
      
      // Generate a realistic speech-like waveform using multiple sine waves
      // and noise to simulate speech patterns
      const speechPattern = 
        Math.sin(elapsed * 2.5) * 0.4 + // Base rhythm
        Math.sin(elapsed * 4.7 + 0.5) * 0.3 + // Faster variation
        Math.sin(elapsed * 1.2 + 1.2) * 0.2 + // Slower modulation
        (Math.sin(elapsed * 8.3) * 0.1 + 0.5) * 0.2; // Noise-like variation

      // Normalize to 0-1 range with some envelope shaping
      const normalized = Math.max(0, Math.min(1, 
        (speechPattern + 0.8) / 1.6 * 0.9 + 0.1
      ));

      // Apply some randomness for natural feel
      const randomFactor = 0.85 + Math.sin(elapsed * 13.7 + 2.3) * 0.15;
      const finalAmplitude = normalized * randomFactor;

      currentHeightsRef.current = currentHeightsRef.current.map((h, i) => {
        const target = IDLE_HEIGHT + finalAmplitude * PEAK_RANGE * TTS_BAR_WEIGHTS[i];
        // Fast attack, slower release
        const rate = target > h ? 0.35 : 0.12;
        return h + (target - h) * rate;
      });

      currentHeightsRef.current.forEach((h, i) => {
        const el = barsRef.current[i];
        if (el) {
          el.style.height = `${h}px`;
          // Glow effect based on height
          const intensity = Math.max(0, (h - IDLE_HEIGHT) / PEAK_RANGE);
          const glowIntensity = Math.min(0.8, intensity * 0.6);
          el.style.boxShadow = `0 0 ${20 + glowIntensity * 60}px ${10 + glowIntensity * 30}px rgba(255, 255, 255, ${glowIntensity * 0.5})`;
        }
      });

      ttsRafRef.current = requestAnimationFrame(tick);
    };

    tick();
  }, []);

  const stopTTSPlayback = () => {
    isSpeakingRef.current = false;
    
    if (ttsRafRef.current) {
      cancelAnimationFrame(ttsRafRef.current);
      ttsRafRef.current = null;
    }
    
    // Stop speech synthesis
    if (speechUtteranceRef.current) {
      window.speechSynthesis.cancel();
      speechUtteranceRef.current = null;
    }

    setIsSpeaking(false);

    currentHeightsRef.current = [48, 48, 48, 48, 48, 48];
    barsRef.current.forEach((el) => {
      if (el) {
        el.style.height = `${IDLE_HEIGHT}px`;
        el.style.boxShadow = 'none';
      }
    });
    setLevels([48, 48, 48, 48, 48, 48]);
  };

  const playTTS = (text) => {
    if (!text.trim()) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    stopTTSPlayback();

    try {
      setIsSpeaking(true);
      isSpeakingRef.current = true;

      // Create speech utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;

      // Find Google UK English Female voice
      const voices = speechVoicesRef.current;
      const preferredVoice = voices.find(v => 
        v.name === "Google UK English Female" || 
        v.name.includes("Google UK English Female")
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log("Using voice:", preferredVoice.name);
      } else {
        // Fallback to any Google voice or English voice
        const fallbackVoice = voices.find(v => 
          v.name.includes("Google") || 
          v.lang.startsWith("en")
        );
        if (fallbackVoice) {
          utterance.voice = fallbackVoice;
          console.log("Using fallback voice:", fallbackVoice.name);
        } else {
          console.warn("No Google voice found, using default voice");
        }
      }

      utterance.onstart = () => {
        // Start animation when speech starts
        ttsStartTimeRef.current = Date.now();
        startTTSVisualizer();
      };

      utterance.onend = () => {
        stopTTSPlayback();
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        stopTTSPlayback();
      };

      speechUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("TTS playback error:", error);
      setIsSpeaking(false);
      isSpeakingRef.current = false;
    }
  };

  const toggleListening = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
      stopMicVisualizer();
      setInputMode(null);
    } else {
      stopTTSPlayback();
      setTranscript("");
      setMessage("");
      setResponse("");
      setShowResponse(false);
      setInputMode("voice");
      recognitionRef.current?.start();
      setIsListening(true);
      startMicVisualizer();
    }
  };

  const toggleSpeaker = () => {
    setSpeakerOn((prev) => {
      const next = !prev;
      if (!next) stopTTSPlayback();
      return next;
    });
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit(e);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setResponse("");
    setShowResponse(false);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: sessionId.current,
          message,
        }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        setResponse(formatResponse(fullResponse));
      }

      if (speakerOn && fullResponse.trim()) {
        playTTS(formatResponse(fullResponse));
      }
    } catch (error) {
      setResponse("Sorry, I couldn't process that request.");
    } finally {
      setLoading(false);
      setInputMode(null);
    }
  };

  const startTextInput = () => {
    setInputMode("text");
    setMessage("");
    setResponse("");
    setShowResponse(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const toggleResponseView = () => {
    setShowResponse(!showResponse);
  };

  const showWaveform = isListening || isSpeaking;

  return (
    <div
      style={{
        backgroundColor: "#000",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        fontFamily:
          "'SF Pro Display', -apple-system, BlinkMacSystemFont, Arial, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)",
        }}
      >
        <div style={{ color: "#fff", fontSize: "18px", fontWeight: 500, letterSpacing: "0.5px" }}>
          Friday
        </div>
        {response && (
          <button
            onClick={toggleResponseView}
            style={{
              background: "none",
              border: `1px solid ${showResponse ? "#0a84ff" : "rgba(255,255,255,0.2)"}`,
              color: showResponse ? "#0a84ff" : "#fff",
              padding: "6px 16px",
              borderRadius: "20px",
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.3s",
              fontFamily: "inherit",
              letterSpacing: "0.3px",
            }}
          >
            {showResponse ? "Hide Response" : "View Response"}
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div
        ref={responseContainerRef}
        style={{
          flex: 1,
          overflowY: showResponse ? "auto" : "hidden",
          overflowX: "hidden",
          padding: "80px 20px 120px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: showResponse && response ? "flex-start" : "center",
        }}
      >
        {/* Waveform - always centered when visible */}
        <AnimatePresence>
          {showWaveform && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                height: "80px",
                marginBottom: "40px",
              }}
            >
              {levels.map((h, i) => (
                <div
                  key={i}
                  ref={(el) => (barsRef.current[i] = el)}
                  style={{
                    width: "48px",
                    height: isSpeaking ? undefined : `${h}px`,
                    backgroundColor: "#ffffff",
                    borderRadius: "24px",
                    opacity: 0.85,
                    transition: isSpeaking
                      ? "background-color 0.3s, box-shadow 0.1s"
                      : "height 90ms linear, background-color 0.3s",
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transcript during voice input */}
        <AnimatePresence>
          {isListening && transcript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                color: "#fff",
                fontSize: "15px",
                textAlign: "center",
                maxWidth: "500px",
                fontWeight: 300,
                letterSpacing: "0.3px",
                opacity: 0.6,
                marginBottom: "20px",
              }}
            >
              {transcript}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Response Content */}
        <AnimatePresence>
          {showResponse && response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                color: "#fff",
                fontSize: "16px",
                maxWidth: "650px",
                width: "100%",
                fontWeight: 300,
                letterSpacing: "0.3px",
                lineHeight: "1.8",
                whiteSpace: "pre-wrap",
                paddingBottom: "20px",
              }}
            >
              {response.split("\n").map((line, index) => {
                if (line.match(/^\d+\.\s/)) {
                  return (
                    <div
                      key={index}
                      style={{ marginBottom: "8px", paddingLeft: "4px" }}
                    >
                      {line}
                    </div>
                  );
                }
                if (line.includes(":") && line.length < 60) {
                  return (
                    <div
                      key={index}
                      style={{
                        fontWeight: 500,
                        marginTop: "16px",
                        marginBottom: "8px",
                        fontSize: "17px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {line}
                    </div>
                  );
                }
                if (line.trim() === "") {
                  return <div key={index} style={{ height: "8px" }} />;
                }
                return (
                  <div key={index} style={{ marginBottom: "2px" }}>
                    {line}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                color: "#fff",
                opacity: 0.4,
                fontSize: "14px",
                fontWeight: 300,
                letterSpacing: "1px",
              }}
            >
              Thinking...
            </motion.div>
          )}
        </AnimatePresence>

        {/* Initial State */}
        {!response && !loading && !isListening && !isSpeaking && !inputMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              color: "#fff",
              opacity: 0.3,
              fontSize: "16px",
              fontWeight: 300,
              letterSpacing: "0.5px",
            }}
          >
            Tap mic or keyboard to start
          </motion.div>
        )}
      </div>

      {/* Fixed Bottom Input Section */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#000",
          padding: "20px 20px 30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          zIndex: 2,
        }}
      >
        {/* Text Input */}
        <AnimatePresence>
          {inputMode === "text" && (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onSubmit={handleTextSubmit}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                maxWidth: "460px",
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                  padding: "10px 0",
                  color: "#fff",
                  fontSize: "16px",
                  outline: "none",
                  fontFamily: "inherit",
                  fontWeight: 300,
                  letterSpacing: "0.3px",
                }}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  opacity: message.trim() ? 1 : 0.2,
                  transition: "opacity 0.2s",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Control Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {/* Mic Button */}
          <motion.button
            onClick={toggleListening}
            disabled={loading}
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              border: `2px solid ${isListening ? "#ff3b30" : "rgba(255, 255, 255, 0.25)"}`,
              backgroundColor: isListening ? "rgba(255,59,48,0.1)" : "transparent",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: loading ? 0.2 : 1,
              outline: "none",
              transition: "all 0.3s",
            }}
            whileHover={!loading ? { scale: 1.1 } : {}}
            whileTap={!loading ? { scale: 0.9 } : {}}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isListening ? "#ff3b30" : "#fff"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </motion.button>

          {/* Keyboard Button */}
          <motion.button
            onClick={startTextInput}
            disabled={loading || isListening}
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              border: `2px solid ${inputMode === "text" ? "#0a84ff" : "rgba(255, 255, 255, 0.25)"}`,
              backgroundColor: inputMode === "text" ? "rgba(10,132,255,0.1)" : "transparent",
              cursor: loading || isListening ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: loading || isListening ? 0.2 : 1,
              outline: "none",
              transition: "all 0.3s",
            }}
            whileHover={!loading && !isListening ? { scale: 1.1 } : {}}
            whileTap={!loading && !isListening ? { scale: 0.9 } : {}}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={inputMode === "text" ? "#0a84ff" : "#fff"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M6 16h.01M10 16h.01M14 16h.01" />
            </svg>
          </motion.button>

          {/* Speaker Toggle Button */}
          <motion.button
            onClick={toggleSpeaker}
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              border: `2px solid ${speakerOn ? "#0a84ff" : "rgba(255, 255, 255, 0.25)"}`,
              backgroundColor: speakerOn ? "rgba(10,132,255,0.1)" : "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              outline: "none",
              transition: "all 0.3s",
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={speakerOn ? "Voice replies on" : "Voice replies off"}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={speakerOn ? "#0a84ff" : "#fff"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              {speakerOn ? (
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
              ) : (
                <line x1="23" y1="9" x2="17" y2="15" />
              )}
              {speakerOn ? null : <line x1="17" y1="9" x2="23" y2="15" />}
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default App;
```

===============================================================================
FILE: client/src/index.css
===============================================================================

```css
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}
```

===============================================================================
FILE: client/src/main.jsx
===============================================================================

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

===============================================================================
FILE: client/vite.config.js
===============================================================================

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
```

===============================================================================
FILE: ml-server/app.py
===============================================================================

```python
from flask import Flask
from flask_cors import CORS
from services.live_vision import live_vision_bp
from routes.health import health_bp
from routes.vision import vision_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(health_bp)
app.register_blueprint(vision_bp)

app.register_blueprint(live_vision_bp)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
```

===============================================================================
FILE: ml-server/config.py
===============================================================================

```python
```

===============================================================================
FILE: ml-server/requirements.txt
===============================================================================

```text
```

===============================================================================
FILE: ml-server/routes/health.py
===============================================================================

```python
from flask import Blueprint, jsonify

health_bp = Blueprint("health", __name__)

@health_bp.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "Friday ML Server"
    })
```

===============================================================================
FILE: ml-server/routes/vision.py
===============================================================================

```python
from flask import Blueprint, jsonify
from flask import request
vision_bp = Blueprint("vision", __name__, url_prefix="/vision")


@vision_bp.route("/face", methods=["POST"])
def detect_face():
    return jsonify({
        "message": "Face detector not implemented yet"
    })


@vision_bp.route("/emotion", methods=["POST"])
def detect_emotion():
    return jsonify({
        "message": "Emotion detector not implemented yet"
    })
    


from services.face_service import detect_face

vision_bp = Blueprint(
    "vision",
    __name__,
    url_prefix="/vision"
)


@vision_bp.route("/face", methods=["POST"])
def face():

    file = request.files["image"]

    result = detect_face(file.read())

    return jsonify(result)
```

===============================================================================
FILE: ml-server/routes/__init__.py
===============================================================================

```python
```

===============================================================================
FILE: ml-server/services/emotion_service.py
===============================================================================

```python
```

===============================================================================
FILE: ml-server/services/face_service.py
===============================================================================

```python
import cv2
import numpy as np

from skills.face_detection.detector import inference


def detect_face(image_bytes):

    img = np.frombuffer(image_bytes, np.uint8)

    image = cv2.imdecode(img, cv2.IMREAD_COLOR)

    outputs, w, h = inference(image)

    return {
        "width": w,
        "height": h
    }
```

===============================================================================
FILE: ml-server/services/live_vision.py
===============================================================================

```python
import time
import threading

import cv2
from flask import Blueprint, jsonify, Response

from skills.face_detection.detector import inference as detect_faces
from skills.emotion.detector import inference as detect_emotion

live_vision_bp = Blueprint("live_vision", __name__)


class LiveVisionWorker:
    def __init__(self, camera_index=0):
        self.camera_index = camera_index
        self.cap = None
        self.thread = None
        self.running = False
        self.lock = threading.Lock()
        self.latest_result = {"faces": [], "timestamp": None}
        self.latest_frame = None

    def start(self):
        with self.lock:
            if self.running:
                return False

            # CAP_DSHOW avoids slow camera init on Windows
            self.cap = cv2.VideoCapture(self.camera_index, cv2.CAP_DSHOW)

            if not self.cap.isOpened():
                self.cap = None
                raise RuntimeError(f"Cannot open camera index {self.camera_index}")

            self.running = True
            self.thread = threading.Thread(target=self._run, daemon=True)
            self.thread.start()

        return True

    def stop(self):
        with self.lock:
            self.running = False

        if self.thread is not None:
            self.thread.join(timeout=2)

        if self.cap is not None:
            self.cap.release()
            self.cap = None

    def _run(self):
        while True:
            with self.lock:
                if not self.running:
                    break

            ret, frame = self.cap.read()

            if not ret:
                time.sleep(0.05)
                continue

            try:
                faces, width, height = detect_faces(frame)
            except Exception as e:
                faces = []
                print("Face detection error:", e)

            results = []
            annotated = frame.copy()

            for face in faces:
                box = face["box"]

                emotion = None
                try:
                    emotion = detect_emotion(frame, box)
                except Exception as e:
                    print("Emotion detection error:", e)

                results.append({
                    "box": box,
                    "landmarks": face.get("landmarks", []),
                    "score": face.get("score"),
                    "emotion": emotion["label"] if emotion else None,
                    "confidence": emotion["confidence"] if emotion else None,
                })

                x1, y1, x2, y2 = int(box["x1"]), int(box["y1"]), int(box["x2"]), int(box["y2"])
                cv2.rectangle(annotated, (x1, y1), (x2, y2), (0, 0, 255), 2)

                for p in face.get("landmarks", []):
                    cv2.circle(annotated, (int(p["x"]), int(p["y"])), 3, (0, 255, 0), -1)

                if emotion:
                    label_text = f"{emotion['label']} {emotion['confidence']:.2f}"
                    cv2.putText(
                        annotated,
                        label_text,
                        (x1, max(0, y1 - 10)),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.6,
                        (255, 255, 0),
                        2,
                    )

            with self.lock:
                self.latest_result = {
                    "faces": results,
                    "timestamp": time.time(),
                }
                self.latest_frame = annotated

            time.sleep(0.03)  # cap ~30fps, raise this if CPU is struggling

    def get_result(self):
        with self.lock:
            return self.latest_result

    def get_frame(self):
        with self.lock:
            return None if self.latest_frame is None else self.latest_frame.copy()


worker = LiveVisionWorker()


@live_vision_bp.route("/vision/start", methods=["POST"])
def start_vision():
    try:
        started = worker.start()
    except RuntimeError as e:
        return jsonify({"status": "error", "message": str(e)}), 500

    if not started:
        return jsonify({"status": "already_running"}), 200

    return jsonify({"status": "started"}), 200


@live_vision_bp.route("/vision/stop", methods=["POST"])
def stop_vision():
    worker.stop()
    return jsonify({"status": "stopped"}), 200


@live_vision_bp.route("/vision/status", methods=["GET"])
def get_status():
    return jsonify({"running": worker.running}), 200


@live_vision_bp.route("/vision/result", methods=["GET"])
def get_result():
    return jsonify(worker.get_result()), 200


def _mjpeg_generator():
    while True:
        frame = worker.get_frame()

        if frame is None:
            time.sleep(0.05)
            continue

        ok, buffer = cv2.imencode(".jpg", frame)
        if not ok:
            continue

        frame_bytes = buffer.tobytes()

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n"
        )


@live_vision_bp.route("/vision/stream")
def video_stream():
    return Response(
        _mjpeg_generator(),
        mimetype="multipart/x-mixed-replace; boundary=frame",
    )
```

===============================================================================
FILE: ml-server/services/__init__.py
===============================================================================

```python
```

===============================================================================
FILE: ml-server/skills/emotion/detector.py
===============================================================================

```python
import os
import onnxruntime as ort

from .preprocess import preprocess
from .postprocess import decode_emotion

MODEL = os.path.join(
    os.path.dirname(__file__),
    "model",
    "emotion-ferplus.onnx"
)

session = ort.InferenceSession(
    MODEL,
    providers=["CPUExecutionProvider"]
)

print("Emotion Model Loaded")


def inference(image, box):
    tensor = preprocess(image, box)

    if tensor is None:
        return None

    outputs = session.run(
        None,
        {session.get_inputs()[0].name: tensor}
    )

    result = decode_emotion(outputs[0])

    return result
```

===============================================================================
FILE: ml-server/skills/emotion/labels.py
===============================================================================

```python
EMOTION_LABELS = [
    "neutral",
    "happiness",
    "surprise",
    "sadness",
    "anger",
    "disgust",
    "fear",
    "contempt",
]
```

===============================================================================
FILE: ml-server/skills/emotion/postprocess.py
===============================================================================

```python
import numpy as np

from .labels import EMOTION_LABELS


def softmax(scores):
    scores = scores - np.max(scores)
    exp = np.exp(scores)
    return exp / np.sum(exp)


def decode_emotion(raw_output):
    scores = raw_output.reshape(-1)
    probs = softmax(scores)

    best_idx = int(np.argmax(probs))

    return {
        "label": EMOTION_LABELS[best_idx],
        "confidence": float(probs[best_idx]),
        "scores": {
            EMOTION_LABELS[i]: float(probs[i])
            for i in range(len(EMOTION_LABELS))
        },
    }
```

===============================================================================
FILE: ml-server/skills/emotion/preprocess.py
===============================================================================

```python
import cv2
import numpy as np

INPUT_SIZE = 64


def crop_face(image, box, margin=0.2):
    h, w = image.shape[:2]

    x1, y1, x2, y2 = box["x1"], box["y1"], box["x2"], box["y2"]
    bw, bh = x2 - x1, y2 - y1

    # Add a small margin around the face box so chin/forehead aren't clipped
    x1 -= bw * margin
    y1 -= bh * margin
    x2 += bw * margin
    y2 += bh * margin

    x1 = max(0, int(x1))
    y1 = max(0, int(y1))
    x2 = min(w, int(x2))
    y2 = min(h, int(y2))

    return image[y1:y2, x1:x2]


def preprocess(image, box):
    face = crop_face(image, box)

    if face.size == 0:
        return None

    gray = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
    resized = cv2.resize(gray, (INPUT_SIZE, INPUT_SIZE))

    # FER+ expects raw float32 pixel values, NOT normalized to 0-1
    tensor = resized.astype(np.float32)
    tensor = np.expand_dims(tensor, axis=0)   # channel dim -> (1, 64, 64)
    tensor = np.expand_dims(tensor, axis=0)   # batch dim   -> (1, 1, 64, 64)

    return tensor
```

===============================================================================
FILE: ml-server/skills/emotion/__init__.py
===============================================================================

```python
from .detector import inference

__all__ = ["inference"]
```

===============================================================================
FILE: ml-server/skills/face_detection/decoder.py
===============================================================================

```python
import numpy as np

STRIDES = [8, 16, 32]
NUM_ANCHORS = 2
INPUT_SIZE = 640

anchor_cache = {}


def generate_anchors(stride):

    if stride in anchor_cache:
        return anchor_cache[stride]

    feature_size = INPUT_SIZE // stride

    anchors = []

    for y in range(feature_size):
        for x in range(feature_size):

            cx = x * stride
            cy = y * stride

            for _ in range(NUM_ANCHORS):

                anchors.append({
                    "x": cx,
                    "y": cy
                })

    anchor_cache[stride] = anchors

    return anchors


def decode_box(anchor, bbox, stride):
    left = bbox[0] * stride
    top = bbox[1] * stride
    right = bbox[2] * stride
    bottom = bbox[3] * stride

    return {
        "x1": float(anchor["x"] - left),
        "y1": float(anchor["y"] - top),
        "x2": float(anchor["x"] + right),
        "y2": float(anchor["y"] + bottom),
        "width": float(left + right),
        "height": float(top + bottom),
    }


def decode_landmarks(anchor, kps, stride):
    landmarks = []
    for i in range(5):
        landmarks.append({
            "x": float(anchor["x"] + kps[i * 2] * stride),
            "y": float(anchor["y"] + kps[i * 2 + 1] * stride),
        })
    return landmarks


def decode_scrfd(outputs, original_width, original_height, scale, threshold=0.5):
    output_map = {
        "score_8": outputs[0],
        "score_16": outputs[1],
        "score_32": outputs[2],
        "bbox_8": outputs[3],
        "bbox_16": outputs[4],
        "bbox_32": outputs[5],
        "kps_8": outputs[6],
        "kps_16": outputs[7],
        "kps_32": outputs[8],
    }

    detections = []

    for stride in STRIDES:
        scores = output_map[f"score_{stride}"].reshape(-1)
        boxes = output_map[f"bbox_{stride}"].reshape(-1, 4)
        kps = output_map[f"kps_{stride}"].reshape(-1, 10)

        anchors = generate_anchors(stride)

        for i in range(len(scores)):
            score = float(scores[i])
            if score < threshold:
                continue

            box = decode_box(anchors[i], boxes[i], stride)
            landmarks = decode_landmarks(anchors[i], kps[i], stride)

            # Undo the letterbox scale (single uniform factor — no distortion)
            box["x1"] /= scale
            box["x2"] /= scale
            box["width"] /= scale
            box["y1"] /= scale
            box["y2"] /= scale
            box["height"] /= scale

            for p in landmarks:
                p["x"] /= scale
                p["y"] /= scale

            # Clamp to original image bounds
            box["x1"] = max(0, min(box["x1"], original_width))
            box["x2"] = max(0, min(box["x2"], original_width))
            box["y1"] = max(0, min(box["y1"], original_height))
            box["y2"] = max(0, min(box["y2"], original_height))

            detections.append({
                "score": score,
                "box": box,
                "landmarks": landmarks,
            })

    return detections
```

===============================================================================
FILE: ml-server/skills/face_detection/detector.py
===============================================================================

```python
import os
import onnxruntime as ort

from .preprocess import preprocess
from .decoder import decode_scrfd
from .postprocess import non_max_suppression

MODEL = os.path.join(
    os.path.dirname(__file__),
    "model",
    "scrfd_500m_bnkps.onnx"
)

session = ort.InferenceSession(
    MODEL,
    providers=["CPUExecutionProvider"]
)

print("SCRFD Loaded")


def inference(image):
    tensor, width, height, scale = preprocess(image)

    outputs = session.run(
        None,
        {session.get_inputs()[0].name: tensor}
    )

    detections = decode_scrfd(outputs, width, height, scale)
    detections = non_max_suppression(detections)

    return detections, width, height
```

===============================================================================
FILE: ml-server/skills/face_detection/draw.py
===============================================================================

```python
import cv2


def draw_faces(image, detections):

    img = image.copy()

    for face in detections:

        b = face["box"]

        cv2.rectangle(
            img,
            (int(b["x1"]), int(b["y1"])),
            (int(b["x2"]), int(b["y2"])),
            (0, 0, 255),
            2,
        )

        for p in face["landmarks"]:

            cv2.circle(
                img,
                (int(p["x"]), int(p["y"])),
                3,
                (0, 255, 0),
                -1,
            )

    cv2.imwrite("result.jpg", img)

    print("Saved result.jpg")
```

===============================================================================
FILE: ml-server/skills/face_detection/postprocess.py
===============================================================================

```python
def iou(a, b):

    x1 = max(a["x1"], b["x1"])
    y1 = max(a["y1"], b["y1"])
    x2 = min(a["x2"], b["x2"])
    y2 = min(a["y2"], b["y2"])

    inter = max(0.0, x2 - x1) * max(0.0, y2 - y1)

    area_a = (a["x2"] - a["x1"]) * (a["y2"] - a["y1"])
    area_b = (b["x2"] - b["x1"]) * (b["y2"] - b["y1"])

    union = area_a + area_b - inter

    if union <= 0:
        return 0

    return inter / union


def non_max_suppression(detections, threshold=0.45):

    detections = sorted(
        detections,
        key=lambda x: x["score"],
        reverse=True
    )

    result = []

    while detections:

        best = detections.pop(0)

        result.append(best)

        detections = [
            d
            for d in detections
            if iou(best["box"], d["box"]) < threshold
        ]

    return result
```

===============================================================================
FILE: ml-server/skills/face_detection/preprocess.py
===============================================================================

```python
import cv2
import numpy as np

INPUT_SIZE = 640


def preprocess(image):
    h, w = image.shape[:2]

    # Preserve aspect ratio — resize so the longer side = INPUT_SIZE
    scale = INPUT_SIZE / max(h, w)
    new_w = int(round(w * scale))
    new_h = int(round(h * scale))

    resized = cv2.resize(image, (new_w, new_h))

    # Pad onto a black 640x640 canvas (top-left aligned, no centering needed)
    canvas = np.zeros((INPUT_SIZE, INPUT_SIZE, 3), dtype=np.uint8)
    canvas[:new_h, :new_w] = resized

    rgb = cv2.cvtColor(canvas, cv2.COLOR_BGR2RGB)
    rgb = rgb.astype(np.float32) / 255.0

    tensor = np.transpose(rgb, (2, 0, 1))
    tensor = np.expand_dims(tensor, axis=0)

    return tensor, w, h, scale
```

===============================================================================
FILE: ml-server/skills/face_detection/utils.py
===============================================================================

```python
```

===============================================================================
FILE: ml-server/skills/face_detection/__init__.py
===============================================================================

```python
```

===============================================================================
FILE: ml-server/skills/__init__.py
===============================================================================

```python
```

===============================================================================
FILE: ml-server/tests/emotion_test.py
===============================================================================

```python
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import cv2

print("Step 1: imports starting")

from skills.face_detection.detector import inference as detect_faces
from skills.face_detection.draw import draw_faces
from skills.emotion.detector import inference as detect_emotion

print("Step 2: imports done")

image = cv2.imread("surprise4.jpg")
print("Step 3: image loaded:", image is not None)

faces, width, height = detect_faces(image)
print("Step 4: faces detected:", len(faces))

for face in faces:
    emotion = detect_emotion(image, face["box"])

    if emotion:
        face["emotion"] = emotion["label"]
        face["emotion_confidence"] = emotion["confidence"]

        print(
            f"Face @ ({int(face['box']['x1'])}, {int(face['box']['y1'])}) "
            f"-> {emotion['label']} ({emotion['confidence']:.2f})"
        )
    else:
        print("Face detected but emotion crop failed (empty region)")

draw_faces(image, faces)
print("Step 5: done")
```

===============================================================================
FILE: ml-server/tests/face_test.py
===============================================================================

```python
import cv2

from skills.face_detection.detector import inference
from skills.face_detection.draw import draw_faces

image = cv2.imread("sad.jpg")

faces, width, height = inference(image)

print(faces)

draw_faces(image, faces)
```

===============================================================================
FILE: ml-server/utils/image.py
===============================================================================

```python
```

===============================================================================
FILE: ml-server/utils/logger.py
===============================================================================

```python
```

===============================================================================
FILE: README.md
===============================================================================

```md
```

===============================================================================
FILE: server/config/db.js
===============================================================================

```js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
```

===============================================================================
FILE: server/controllers/chatController.js
===============================================================================

```js
import { streamResponse } from "../services/chat/chatServices.js";

export const chat = async (req, res) => {

    try {

        const { sessionId, message } = req.body;

        await streamResponse({
            sessionId,
            message,
            res,
        });

    } catch (err) {

        console.error(err);

        res.status(500).send("Something went wrong");

    }

};
```

===============================================================================
FILE: server/controllers/ttsController.js
===============================================================================

```js
import { generateSpeech } from "../services/voice/elevenlabsService.js";

export const textToSpeech = async (req, res) => {
  const { text } = req.body;

  if (!text?.trim()) {
    return res.status(400).json({
      error: "Missing text",
    });
  }

  try {
    const audio = await generateSpeech(text);

    res.setHeader("Content-Type", "audio/mpeg");
    res.send(audio);
  } catch (err) {
    console.error("ElevenLabs Error:", err.message);

    res.status(500).json({
      error: "TTS failed",
    });
  }
};
```

===============================================================================
FILE: server/controllers/visionController.js
===============================================================================

```js
```

===============================================================================
FILE: server/ml/camera/frameProcessor.js
===============================================================================

```js
```

===============================================================================
FILE: server/ml/emotion/emotionModel.js
===============================================================================

```js
import fs from "fs";

import sharp from "sharp";

import { preprocess } from "./preprocess.js";
import { runEmotion } from "./inference.js";

const labels = JSON.parse(
    fs.readFileSync(
        "./ml/emotion/labels.json",
        "utf8"
    )
);

export async function detectEmotion(faceBuffer) {

    const tensor = await preprocess(faceBuffer);

    const outputs = await runEmotion(tensor);

    const scores =
        outputs["Plus692_Output_0"].data;

    let best = 0;

    for (let i = 1; i < scores.length; i++) {

        if (scores[i] > scores[best])

            best = i;

    }

    return {

        emotion: labels[best],

        confidence: Number(scores[best].toFixed(4)),

        scores: labels.reduce((obj, label, i) => {

            obj[label] = Number(scores[i].toFixed(4));

            return obj;

        }, {})

    };

}
```

===============================================================================
FILE: server/ml/emotion/inference.js
===============================================================================

```js
import * as ort from "onnxruntime-node";
import path from "path";

const session = await ort.InferenceSession.create(
    path.join(
        process.cwd(),
        "ml",
        "emotion",
        "model",
        "emotion-ferplus-12-int8.onnx"
    )
);

console.log("✅ Emotion model loaded");

export async function runEmotion(tensor) {

    return session.run({
        Input3: tensor
    });

}
```

===============================================================================
FILE: server/ml/emotion/inspectModel.js
===============================================================================

```js
import * as ort from "onnxruntime-node";
import path from "path";

const session = await ort.InferenceSession.create(
    path.join(
        process.cwd(),
        "ml",
        "emotion",
        "model",
        "emotion-ferplus-12-int8.onnx"
    )
);

console.log(session.inputNames);
console.log(session.outputNames);

console.log(session.inputMetadata);
console.log(session.outputMetadata);
```

===============================================================================
FILE: server/ml/emotion/labels.json
===============================================================================

```json
[
  "neutral",
  "happiness",
  "surprise",
  "sadness",
  "anger",
  "disgust",
  "fear",
  "contempt"
]
```

===============================================================================
FILE: server/ml/emotion/preprocess.js
===============================================================================

```js
import sharp from "sharp";
import * as ort from "onnxruntime-node";

const SIZE = 64;

export async function preprocess(faceBuffer) {

    const { data } = await sharp(faceBuffer)
        .resize(SIZE, SIZE)
        .grayscale()
        .raw()
        .toBuffer({ resolveWithObject: true });

    const input = new Float32Array(SIZE * SIZE);

    for (let i = 0; i < data.length; i++) {

        input[i] = (data[i] / 255 - 0.5) / 0.5;

    }

    return new ort.Tensor(
        "float32",
        input,
        [1, 1, SIZE, SIZE]
    );
}
```

===============================================================================
FILE: server/ml/emotion/test.js
===============================================================================

```js
import fs from "fs";

import { detectFaces } from "../faceDetection/faceDetector.js";
import { detectEmotion } from "./emotionModel.js";
import { cropFace } from "../faceDetection/cropFace.js";

const img = fs.readFileSync("./test.jpg");

const faces = await detectFaces(img);

const face = await cropFace(img, faces[0]);

fs.writeFileSync("face.jpg", face);

const emotion = await detectEmotion(face);

console.log(emotion);
```

===============================================================================
FILE: server/ml/faceDetection/constants.js
===============================================================================

```js
```

===============================================================================
FILE: server/ml/faceDetection/cropFace.js
===============================================================================

```js
import sharp from "sharp";

export async function cropFace(imageBuffer, face) {
  return sharp(imageBuffer)
    .extract({
      left: Math.round(face.box.x1),
      top: Math.round(face.box.y1),
      width: Math.round(face.box.width),
      height: Math.round(face.box.height),
    })
    .jpeg()
    .toBuffer();
}
```

===============================================================================
FILE: server/ml/faceDetection/debugDraw.js
===============================================================================

```js
import sharp from "sharp";

export async function drawDetection(inputBuffer, detections) {

    const image = sharp(inputBuffer);

    const meta = await image.metadata();

    let svg = `
    <svg width="${meta.width}" height="${meta.height}">
    `;

    for (const face of detections) {

        svg += `
        <rect
            x="${face.box.x1}"
            y="${face.box.y1}"
            width="${face.box.width}"
            height="${face.box.height}"
            fill="none"
            stroke="red"
            stroke-width="3"
        />
        `;

        for (const p of face.landmarks) {

            svg += `
            <circle
                cx="${p.x}"
                cy="${p.y}"
                r="3"
                fill="lime"
            />
            `;
        }
    }

    svg += `</svg>`;

    await image
        .composite([
            {
                input: Buffer.from(svg),
                top: 0,
                left: 0,
            },
        ])
        .toFile("result.jpg");

    console.log("Saved result.jpg");
}
```

===============================================================================
FILE: server/ml/faceDetection/decoder.js
===============================================================================

```js
const STRIDES = [8, 16, 32];
const NUM_ANCHORS = 2;
const INPUT_SIZE = 640;

const anchorCache = {};

function generateAnchors(stride) {
  if (anchorCache[stride]) return anchorCache[stride];

  const featureSize = INPUT_SIZE / stride;

  const anchors = [];

  for (let y = 0; y < featureSize; y++) {
    for (let x = 0; x < featureSize; x++) {
      const cx = (x + 0.5) * stride;
      const cy = (y + 0.5) * stride;

      // SCRFD 2-anchor model
      for (let a = 0; a < NUM_ANCHORS; a++) {
        anchors.push({
          x: cx,
          y: cy,
        });
      }
    }
  }

  anchorCache[stride] = anchors;
  return anchors;
}

function decodeBox(anchor, bbox, stride) {
  const left = bbox[0] * stride;
  const top = bbox[1] * stride;
  const right = bbox[2] * stride;
  const bottom = bbox[3] * stride;

  return {
    x1: anchor.x - left,
    y1: anchor.y - top,
    x2: anchor.x + right,
    y2: anchor.y + bottom,
    width: left + right,
    height: top + bottom,
  };
}

function decodeLandmarks(anchor, kps, stride) {
  const landmarks = [];

  for (let i = 0; i < 5; i++) {
    landmarks.push({
      x: anchor.x + kps[i * 2] * stride,
      y: anchor.y + kps[i * 2 + 1] * stride,
    });
  }

  return landmarks;
}

export function decodeSCRFD(outputs, threshold = 0.5) {
  const detections = [];

  for (const stride of STRIDES) {
    const scores = outputs[`score_${stride}`].data;
    const boxes = outputs[`bbox_${stride}`].data;
    const kps = outputs[`kps_${stride}`].data;

    const anchors = generateAnchors(stride);

    for (let i = 0; i < scores.length; i++) {
      const score = scores[i];

      if (score < threshold) continue;

      const box = decodeBox(
        anchors[i],
        boxes.subarray(i * 4, i * 4 + 4),
        stride
      );

      const landmarks = decodeLandmarks(
        anchors[i],
        kps.subarray(i * 10, i * 10 + 10),
        stride
      );

      detections.push({
        score,
        box,
        landmarks,
      });
    }
  }

  return detections;
}
```

===============================================================================
FILE: server/ml/faceDetection/faceDetector.js
===============================================================================

```js
import { preprocess } from "./preprocess.js";
import { runInference } from "./inference.js";
import { decodeSCRFD } from "./decoder.js";
import { nonMaxSuppression } from "./postprocess.js";

export async function detectFaces(imageBuffer) {

  const {
    tensor,
    scale,
    padX,
    padY,
    originalWidth,
    originalHeight
  } = await preprocess(imageBuffer);

  const outputs = await runInference(tensor);

  let detections = decodeSCRFD(outputs);

  detections = nonMaxSuppression(detections);

  for (const face of detections) {

    face.box.x1 = (face.box.x1 - padX) / scale;
    face.box.y1 = (face.box.y1 - padY) / scale;

    face.box.x2 = (face.box.x2 - padX) / scale;
    face.box.y2 = (face.box.y2 - padY) / scale;

    face.box.x1 = Math.max(0, Math.min(face.box.x1, originalWidth));
    face.box.y1 = Math.max(0, Math.min(face.box.y1, originalHeight));

    face.box.x2 = Math.max(0, Math.min(face.box.x2, originalWidth));
    face.box.y2 = Math.max(0, Math.min(face.box.y2, originalHeight));

    face.box.width = face.box.x2 - face.box.x1;
    face.box.height = face.box.y2 - face.box.y1;

    for (const point of face.landmarks) {

      point.x = (point.x - padX) / scale;
      point.y = (point.y - padY) / scale;
    }
  }

  return detections;
}
```

===============================================================================
FILE: server/ml/faceDetection/inference.js
===============================================================================

```js
import * as ort from "onnxruntime-node";
import path from "path";

let session;

export async function loadModel() {
  if (session) return session;

  session = await ort.InferenceSession.create(
    path.join(
      process.cwd(),
      "ml",
      "faceDetection",
      "model",
      "scrfd_500m_bnkps.onnx"
    ),
    {
      executionProviders: ["cpu"]
    }
  );

  console.log("✅ SCRFD Loaded");

  return session;
}

export async function runInference(tensor) {
  const model = await loadModel();

  const outputs = await model.run({
    "input.1": tensor
  });

  return outputs;
}
```

===============================================================================
FILE: server/ml/faceDetection/inspectModel.js
===============================================================================

```js
import * as ort from "onnxruntime-node";
import path from "path";

const modelPath = path.resolve(
  "./ml/faceDetection/model/scrfd_500m_bnkps.onnx"
);

async function inspect() {
  const session = await ort.InferenceSession.create(modelPath);

  console.log("\n=== INPUTS ===");
  console.log(session.inputNames);

  console.log("\n=== OUTPUTS ===");
  console.log(session.outputNames);

  console.log("\n=== INPUT METADATA ===");
  console.log(session.inputMetadata);

  console.log("\n=== OUTPUT METADATA ===");
  console.log(session.outputMetadata);
}

inspect();
```

===============================================================================
FILE: server/ml/faceDetection/postprocess.js
===============================================================================

```js
function iou(a, b) {

  const x1 = Math.max(a.x1, b.x1);
  const y1 = Math.max(a.y1, b.y1);

  const x2 = Math.min(a.x2, b.x2);
  const y2 = Math.min(a.y2, b.y2);

  const inter =
    Math.max(0, x2 - x1) *
    Math.max(0, y2 - y1);

  const areaA =
    (a.x2 - a.x1) *
    (a.y2 - a.y1);

  const areaB =
    (b.x2 - b.x1) *
    (b.y2 - b.y1);

  return inter / (areaA + areaB - inter);
}

export function nonMaxSuppression(
  detections,
  threshold = 0.45
) {
  detections.sort((a, b) => b.score - a.score);

  const result = [];

  while (detections.length) {

    const best = detections.shift();

    result.push(best);

    detections = detections.filter(
      d => iou(best.box, d.box) < threshold
    );
  }

  return result;
}
```

===============================================================================
FILE: server/ml/faceDetection/preprocess.js
===============================================================================

```js
import sharp from "sharp";
import * as ort from "onnxruntime-node";

const INPUT_SIZE = 640;

export async function preprocess(imageBuffer) {

  const image = sharp(imageBuffer);

  const metadata = await image.metadata();

  const originalWidth = metadata.width;
  const originalHeight = metadata.height;

  const scale = Math.min(
    INPUT_SIZE / originalWidth,
    INPUT_SIZE / originalHeight
  );

  const resizedWidth = Math.round(originalWidth * scale);
  const resizedHeight = Math.round(originalHeight * scale);

  const padX = Math.floor((INPUT_SIZE - resizedWidth) / 2);
  const padY = Math.floor((INPUT_SIZE - resizedHeight) / 2);

  const { data } = await image
    .resize(resizedWidth, resizedHeight)
    .extend({
      top: padY,
      bottom: INPUT_SIZE - resizedHeight - padY,
      left: padX,
      right: INPUT_SIZE - resizedWidth - padX,
      background: { r: 0, g: 0, b: 0 }
    })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const floatData = new Float32Array(3 * INPUT_SIZE * INPUT_SIZE);

  for (let y = 0; y < INPUT_SIZE; y++) {
    for (let x = 0; x < INPUT_SIZE; x++) {

      const pixel = (y * INPUT_SIZE + x) * 3;

      floatData[y * INPUT_SIZE + x] =
        data[pixel] / 255;

      floatData[INPUT_SIZE * INPUT_SIZE + y * INPUT_SIZE + x] =
        data[pixel + 1] / 255;

      floatData[2 * INPUT_SIZE * INPUT_SIZE + y * INPUT_SIZE + x] =
        data[pixel + 2] / 255;
    }
  }

  return {

    tensor: new ort.Tensor(
      "float32",
      floatData,
      [1, 3, INPUT_SIZE, INPUT_SIZE]
    ),

    scale,

    padX,
    padY,

    originalWidth,
    originalHeight
  };
}
```

===============================================================================
FILE: server/ml/faceDetection/test.js
===============================================================================

```js
import fs from "fs";
import { detectFaces } from "./faceDetector.js";
import { drawDetection } from "./debugDraw.js";

const img = fs.readFileSync("./test.jpg");

const faces = await detectFaces(img);

console.log(faces);

await drawDetection(img, faces);
```

===============================================================================
FILE: server/ml/pipeline.js
===============================================================================

```js
import { detectFaces } from "./faceDetection/faceDetector.js";
import { cropFace } from "./faceDetection/cropFace.js";
import { detectEmotion } from "./emotion/emotionModel.js";

export async function analyzeFrame(imageBuffer) {

    const faces = await detectFaces(imageBuffer);

    const results = [];

    for (const face of faces) {

        const crop = await cropFace(imageBuffer, face);

        const emotion = await detectEmotion(crop);

        results.push({

            ...face,

            emotion

        });

    }

    return {

        people: faces.length,

        faces: results,

        timestamp: Date.now()

    };

}
```

===============================================================================
FILE: server/ml/utils/image.js
===============================================================================

```js
```

===============================================================================
FILE: server/ml/utils/math.js
===============================================================================

```js
```

===============================================================================
FILE: server/ml/utils/tensor.js
===============================================================================

```js
```

===============================================================================
FILE: server/models/Conversation.js
===============================================================================

```js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },

    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Conversation", conversationSchema);
```

===============================================================================
FILE: server/models/Memory.js
===============================================================================

```js
import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "other",
    },

    importance: {
      type: Number,
      default: 5,
    },

    embedding: {
      type: [Number],
      default: [],
    },

    accessCount: {
      type: Number,
      default: 0,
    },

    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Memory", memorySchema);
```

===============================================================================
FILE: server/package.json
===============================================================================

```json
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "axios": "^1.18.1",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "mongoose": "^9.7.3",
    "onnxruntime-node": "^1.27.0",
    "openai": "^6.45.0",
    "sharp": "^0.35.3",
    "socket.io": "^4.8.3"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}
```

===============================================================================
FILE: server/routes/chatRoutes.js
===============================================================================

```js
import express from "express";
import { chat } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", chat);

export default router;
```

===============================================================================
FILE: server/routes/ttsRoutes.js
===============================================================================

```js
import express from "express";
import { textToSpeech } from "../controllers/ttsController.js";

const ttsRouter = express.Router();

ttsRouter.post("/", textToSpeech);

export default ttsRouter;
```

===============================================================================
FILE: server/routes/visionRoutes.js
===============================================================================

```js
```

===============================================================================
FILE: server/server.js
===============================================================================

```js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import chatRoutes from "./routes/chatRoutes.js";
import connectDB from "./config/db.js";
import ttsRouter from "./routes/ttsRoutes.js";
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoutes);
app.use("/api/tts", ttsRouter);


app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});





```

===============================================================================
FILE: server/services/chat/chatServices.js
===============================================================================

```js
import client from "../llm/grok.js";
import { buildPrompt } from "../prompt/promptBuilder.js";
import { saveMessage } from "./conversationManager.js";
import { extractMemory } from "../memory/memoryExtractor.js";
import { saveMemory } from "../memory/memoryManager.js";

export const streamResponse = async ({ sessionId, message, res }) => {
  const messages = await buildPrompt(sessionId, message);

  const stream = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    stream: true,
    messages,
  });

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();

  let assistantResponse = "";

  for await (const chunk of stream) {
    const token = chunk.choices?.[0]?.delta?.content;

    if (!token) continue;

    assistantResponse += token;
    res.write(token);
  }

  // Save conversation
  await saveMessage(sessionId, "user", message);
  await saveMessage(sessionId, "assistant", assistantResponse);

  // Respond immediately
  res.end();

  // Background memory extraction
  (async () => {
    try {
      const memories = await extractMemory({
        userMessage: message,
        assistantResponse,
      });

      if (!memories?.length) return;

      await Promise.all(
        memories.map((memory) =>
          saveMemory(sessionId, memory)
        )
      );
    } catch (err) {
      console.error("Memory extraction error:", err);
    }
  })();
};
```

===============================================================================
FILE: server/services/chat/conversationManager.js
===============================================================================

```js
import Conversation from "../../models/Conversation.js";

// Get the last N messages
export const getRecentMessages = async (sessionId, limit = 10) => {
  const conversation = await Conversation.findOne({ sessionId });

  if (!conversation) return [];

  return conversation.messages
    .slice(-limit)
    .map(({ role, content }) => ({
      role,
      content,
    }));
};

// Save a single message
export const saveMessage = async (sessionId, role, content) => {
  let conversation = await Conversation.findOne({ sessionId });

  if (!conversation) {
    conversation = await Conversation.create({
      sessionId,
      messages: [],
    });
  }

  conversation.messages.push({
    role,
    content,
  });

  await conversation.save();
};

// Delete an entire conversation
export const clearConversation = async (sessionId) => {
  await Conversation.deleteOne({ sessionId });
};
```

===============================================================================
FILE: server/services/llm/grok.js
===============================================================================

```js
import dotenv from "dotenv";
dotenv.config();


import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export default client;
```

===============================================================================
FILE: server/services/memory/memoryExtractor.js
===============================================================================

```js
import client from "../llm/grok.js";

export const extractMemory = async ({
  userMessage,
  assistantResponse,
}) => {
  const completion =
    await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      temperature: 0,

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",
          content: `
You are Friday's memory engine.

Your ONLY job is to decide what should be stored as long-term memory.

The conversation contains:
- User message
- Assistant response

Use BOTH messages for context.

Store ONLY information that is likely to remain useful in future conversations.

Examples:
- Name
- Age
- Occupation
- Education
- Skills
- Preferences
- Favorite things
- Current project
- Long-term goals
- Languages
- Location
- Important relationships

DO NOT STORE:

- Greetings
- Questions
- Temporary tasks
- Requests
- Current mood
- Short-term plans
- Facts about yourself (the assistant)

Each memory must contain:

action
content
category
importance

Actions:

create
update

If nothing should be stored return

{
  "memories":[]
}

Example:

{
  "memories":[
    {
      "action":"create",
      "content":"Name: Darshan Nandagavi",
      "category":"personal",
      "importance":10
    },
    {
      "action":"create",
      "content":"Favorite programming language: JavaScript",
      "category":"preference",
      "importance":9
    }
  ]
}

Return ONLY valid JSON.
`,
        },

        {
          role: "user",
          content: JSON.stringify({
            userMessage,
            assistantResponse,
          }),
        },
      ],
    });

  try {
    const result = JSON.parse(
      completion.choices[0].message.content
    );

    return result.memories || [];
  } catch (err) {
    console.error("Memory parse error:", err);
    return [];
  }
};
```

===============================================================================
FILE: server/services/memory/memoryManager.js
===============================================================================

```js
import Memory from "../../models/Memory.js";
import { generateEmbedding } from "../embeddings/embeddingService.js";

export const saveMemory = async (sessionId, memory) => {
  if (!memory) return;

  if (memory.action === "ignore") return;

  const embedding = await generateEmbedding(memory.content);

  // CREATE
  if (memory.action === "create") {

    const exists = await Memory.findOne({
      sessionId,
      content: memory.content,
    });

    if (exists) return;

    await Memory.create({
      sessionId,
      content: memory.content,
      category: memory.category,
      importance: memory.importance,
      embedding,
    });

    return;
  }

  // UPDATE
  if (memory.action === "update") {

    const existing = await Memory.findOne({
      sessionId,
      category: memory.category,
    });

    if (existing) {

      existing.content = memory.content;
      existing.importance = memory.importance;
      existing.embedding = embedding;

      await existing.save();

      return;
    }

    await Memory.create({
      sessionId,
      content: memory.content,
      category: memory.category,
      importance: memory.importance,
      embedding,
    });
  }
};

export const getMemories = async (sessionId) => {
  return await Memory.find({ sessionId })
    .sort({ importance: -1 })
    .limit(20);
};

// export const searchMemories = async (
//   sessionId,
//   embedding,
//   limit = 5
// ) => {
//   const results = await Memory.aggregate([
//     {
//       $vectorSearch: {
//         index: "memory_index",
//         path: "embedding",
//         queryVector: embedding,
//         numCandidates: 100,
//         limit: 20,
//       },
//     },
//     {
//       $match: {
//         sessionId,
//       },
//     },
//     {
//       $limit: limit,
//     },
//     {
//       $project: {
//         _id: 1,
//         content: 1,
//         category: 1,
//         importance: 1,
//         score: {
//           $meta: "vectorSearchScore",
//         },
//       },
//     },
//   ]);

//   const filtered = results.filter(
//     (memory) => memory.score >= 0.75
//   );

//   await updateMemoryAccess(
//     filtered.map((memory) => memory._id)
//   );

//   return filtered;
// };

export const updateMemoryAccess = async (memoryIds) => {
  if (!memoryIds.length) return;

  await Memory.updateMany(
    {
      _id: { $in: memoryIds },
    },
    {
      $inc: {
        accessCount: 1,
      },
      $set: {
        lastAccessed: new Date(),
      },
    }
  );
};

export const searchMemories = async (
  embedding,
  limit = 5
) => {
  const results = await Memory.aggregate([
    {
      $vectorSearch: {
        index: "memory_index",
        path: "embedding",
        queryVector: embedding,
        numCandidates: 100,
        limit: 20,
      },
    },
    {
      $project: {
        _id: 1,
        content: 1,
        category: 1,
        importance: 1,
        accessCount: 1,
        score: {
          $meta: "vectorSearchScore",
        },
      },
    },
  ]);

  console.log("===== VECTOR SCORES =====");

  results.forEach((m) => {
    console.log(m.score, "-", m.content);
  });

  const filtered = results.filter(
    (m) => m.score >= 0.75
  );

  console.log("AFTER FILTER", filtered);

  await updateMemoryAccess(
    filtered.map((m) => m._id)
  );

  console.log(
    "RETURNING:",
    filtered.slice(0, limit)
  );

  return filtered.slice(0, limit);
};
```

===============================================================================
FILE: server/services/prompt/promptBuilder.js
===============================================================================

```js
import { getRecentMessages } from "../chat/conversationManager.js";
import { searchMemories } from "../memory/memoryManager.js";
import { generateEmbedding } from "../embeddings/embeddingService.js";

export const buildPrompt = async (sessionId, message) => {
  // Last few conversation messages
  const history = await getRecentMessages(sessionId);

  // Generate embedding for current query
  const embedding = await generateEmbedding(message);
  console.log("Embedding length:", embedding.length);
  console.log("First 5 values:", embedding.slice(0, 5));
  // Semantic search
  let memories = [];

  if (embedding) {
    memories = await searchMemories(embedding);
  }

  console.log("\n========= SEARCH RESULTS =========");
  console.log(
    memories.map((m) => ({
      score: m.score,
      category: m.category,
      content: m.content,
    })),
  );

  // Build memory context
  const memoryContext =
    memories.length > 0
      ? memories
          .map((memory) => `[${memory.category}] ${memory.content}`)
          .join("\n")
      : "None";

  return [
    {
      role: "system",
      content: `
You are Friday, a highly intelligent personal AI assistant.

You have long-term memory about the user.

Use the memories below ONLY if they are relevant to the current conversation.

Never force memories into unrelated answers.

If the user contradicts an old memory, trust the latest information.

----------------------------------------

Relevant User Memories

${memoryContext}

----------------------------------------

Respond naturally and conversationally.
      `,
    },

    ...history,

    {
      role: "user",
      content: message,
    },
  ];
};
```

===============================================================================
FILE: server/services/vision/visionService.js
===============================================================================

```js
```

===============================================================================
FILE: server/services/voice/elevenlabsService.js
===============================================================================

```js
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = "hpp4J3VqNfWAUOO0d1Us";

export const generateSpeech = async (text) => {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return Buffer.from(await response.arrayBuffer());
};
```

-------------------------------------------------------------------------------

Generated by ctx

Total Files: 79
