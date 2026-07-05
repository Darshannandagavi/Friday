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