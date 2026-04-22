import React, { useEffect, useMemo, useRef, useState } from "react";
import { buildResultNarration, fallbackAgents, getRosterEntry, INTRO_STORYLINE, roster } from "./appContent.jsx";
import { AUDIO, BACKGROUNDS, VIDEOS } from "./media.js";
import { runSimulationEngine } from "./engine.js";
import {
  BackgroundAudioControls,
  DebateScreen,
  IntroScreen,
  ScenarioScreen,
  SelectionScreen
} from "./GameScreens.jsx";
import {
  SCENARIOS,
  applyPlayerChoice,
  mergeEngineOutputWithLocal,
  simulateScenario
} from "./simulator.js";
import {
  estimateSpeechDurationMs,
  setElevenLabsApiKey,
  speakAgentLine,
  stopVoicePlayback
} from "./voice.js";

export default function App() {
  const [introStage, setIntroStage] = useState(0);
  const [introAudioEnabled, setIntroAudioEnabled] = useState(false);
  const [bgmMuted, setBgmMuted] = useState(false);
  const [bgmVolume, setBgmVolume] = useState(0.055);
  const [phase, setPhase] = useState("scenario");
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(() => SCENARIOS[0]);
  const [selectedScenario, setSelectedScenario] = useState(() => SCENARIOS[0]);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [activeVoiceIndex, setActiveVoiceIndex] = useState(-1);
  const [browserFallback, setBrowserFallback] = useState("");
  const [selectedChoiceId, setSelectedChoiceId] = useState("");
  const [selectedDirectiveId, setSelectedDirectiveId] = useState("");
  const [selectedExecutionId, setSelectedExecutionId] = useState("");
  const [debateStage, setDebateStage] = useState("idle");
  const [decisionBusy, setDecisionBusy] = useState(false);
  const [typedDialogue, setTypedDialogue] = useState("");
  const [hoveredCharacter, setHoveredCharacter] = useState("");
  const [debateMessages, setDebateMessages] = useState([]);
  const [introStoryText, setIntroStoryText] = useState("");
  const [simulation, setSimulation] = useState(() => simulateScenario(SCENARIOS[0], fallbackAgents));

  const introVideoRef = useRef(null);
  const ambientAudioRef = useRef(null);
  const typingIntervalRef = useRef(null);
  const debateRunTokenRef = useRef(0);
  const activePreviewCharacterRef = useRef("");
  const previewTokenRef = useRef(0);
  const previewAudioRef = useRef(null);
  const resultNarratedRef = useRef("");

  const introVisible = introStage < 2;
  const activeScenario = phase === "scenario" ? currentScenario : selectedScenario;
  const simulationAgents = selectedAgents.length === 2 ? selectedAgents : fallbackAgents;
  const activeDebateRoster = selectedAgents.length === 2 ? selectedAgents : simulation.selected_agents;
  const activeLine = activeVoiceIndex >= 0 ? simulation.conversation[activeVoiceIndex] : null;
  const appBackground = phase === "scenario" ? BACKGROUNDS.app : activeScenario.backdrop || BACKGROUNDS.app;
  const operatorLabel = "Operator";

  const fallbackPreview = useMemo(
    () => simulateScenario(activeScenario, simulationAgents),
    [activeScenario, simulationAgents]
  );

  const choiceOptions = simulation.meta?.choice_options ?? [];
  const toolOptions = simulation.meta?.tool_options ?? [];
  const executionOptions = simulation.meta?.execution_options ?? [];
  const lastDebateMessage = debateMessages[debateMessages.length - 1];
  const showActiveTypingBubble =
    Boolean(activeLine && typedDialogue) &&
    (!lastDebateMessage ||
      lastDebateMessage.speaker !== activeLine.speaker ||
      lastDebateMessage.text !== activeLine.text);
  const shouldPlayAmbient =
    !introVisible &&
    !hoveredCharacter &&
    (phase === "scenario" || phase === "selection");

  useEffect(() => {
    if (!introVisible || !introVideoRef.current) return;

    const video = introVideoRef.current;
    video.muted = !introAudioEnabled;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise.catch(() => {});
    }
  }, [introStage, introAudioEnabled, introVisible]);

  useEffect(() => {
    const audio = ambientAudioRef.current;
    if (!audio) return;

    audio.volume = bgmMuted ? 0 : bgmVolume;

    if (shouldPlayAmbient && !bgmMuted) {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch(() => {});
      }
      return;
    }

    audio.pause();
    audio.currentTime = 0;
  }, [bgmMuted, bgmVolume, shouldPlayAmbient]);

  useEffect(() => {
    if (!introVisible) {
      setIntroStoryText("");
      return undefined;
    }

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setIntroStoryText(INTRO_STORYLINE.slice(0, index));
      if (index >= INTRO_STORYLINE.length) {
        window.clearInterval(timer);
      }
    }, 20);

    return () => window.clearInterval(timer);
  }, [introVisible]);

  useEffect(() => {
    if (phase === "selection" || phase === "scenario") {
      setSimulation(fallbackPreview);
    }
  }, [fallbackPreview, phase]);

  useEffect(() => {
    if (phase !== "debate") {
      setTypedDialogue("");
      setDebateMessages([]);
      setDebateStage("idle");
      setDecisionBusy(false);
      return undefined;
    }

    if (debateStage !== "opening") return undefined;

    const token = ++debateRunTokenRef.current;
    setActiveVoiceIndex(-1);
    setBrowserFallback("");
    setTypedDialogue("");
    setDebateMessages([]);

    const revealLine = (speaker, text) =>
      new Promise((resolve) => {
        if (typingIntervalRef.current) {
          window.clearInterval(typingIntervalRef.current);
        }

        setTypedDialogue("");

        if (!text) {
          resolve();
          return;
        }

        let charIndex = 0;
        const durationMs = estimateSpeechDurationMs(speaker, text);
        const lineDelay = Math.max(26, Math.min(74, durationMs / Math.max(text.length, 1)));

        typingIntervalRef.current = window.setInterval(() => {
          if (debateRunTokenRef.current !== token) {
            window.clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
            resolve();
            return;
          }

          charIndex += 1;
          setTypedDialogue(text.slice(0, charIndex));

          if (charIndex >= text.length) {
            window.clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
            resolve();
          }
        }, lineDelay);
      });

    const runOpening = async () => {
      // Operator / system lines are text-only (no voice).

      const openingLines = simulation.conversation.slice(0, 2);
      for (const line of openingLines) {
        if (debateRunTokenRef.current !== token) return;
        const speakerIndex = activeDebateRoster.indexOf(line.speaker);
        setActiveVoiceIndex(speakerIndex);
        setTypedDialogue("");

        try {
          const [result] = await Promise.all([
            speakAgentLine(line.speaker, line.text),
            revealLine(line.speaker, line.text)
          ]);
          if (result?.provider === "browser" && result?.reason && result.reason !== "playback_failed") {
            setBrowserFallback(result.reason);
          }
          if (debateRunTokenRef.current !== token) return;
        } catch {
          if (debateRunTokenRef.current !== token) return;
        }

        setDebateMessages((current) => [...current, line]);
        await new Promise((resolve) => window.setTimeout(resolve, 350));
      }

      if (debateRunTokenRef.current === token) {
        setActiveVoiceIndex(-1);
        setTypedDialogue("");
        setDebateStage("strategy");
      }
    };

    void runOpening();

    return () => {
      debateRunTokenRef.current += 1;
      if (typingIntervalRef.current) {
        window.clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      stopVoicePlayback();
    };
  }, [phase, simulation, debateStage, activeDebateRoster]);

  useEffect(() => () => stopVoicePlayback(), []);

  useEffect(() => {
    if (phase === "selection") return undefined;
    activePreviewCharacterRef.current = "";
    previewTokenRef.current += 1;
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
      previewAudioRef.current = null;
    }
    stopVoicePlayback();
    return undefined;
  }, [phase]);

  useEffect(() => {
    if (phase !== "debate" || debateStage !== "result") return undefined;
    const narrationKey = `${simulation.result}:${simulation.final_decision.summary}`;
    if (resultNarratedRef.current === narrationKey) return undefined;
    resultNarratedRef.current = narrationKey;

    const narrate = async () => {
      // Result narration is text-only (no voice).
    };

    void narrate();
    return () => {
      stopVoicePlayback();
    };
  }, [phase, debateStage, simulation, selectedScenario]);

  useEffect(() => {
    const envApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (envApiKey) {
      setElevenLabsApiKey(envApiKey);
    }
  }, []);

  function toggleAgent(name) {
    setSelectedAgents((current) => {
      if (current.includes(name)) {
        return current.length === 1 ? current : current.filter((entry) => entry !== name);
      }

      if (current.length < 2) {
        return [...current, name];
      }

      return [current[1], name];
    });
  }

  function confirmScenario() {
    activePreviewCharacterRef.current = "";
    previewTokenRef.current += 1;
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
      previewAudioRef.current = null;
    }
    stopVoicePlayback();
    setSelectedScenario(currentScenario);
    setPhase("selection");
  }

  function selectScenario(scenario) {
    setCurrentScenario(scenario);
    const nextIndex = SCENARIOS.findIndex((entry) => entry.id === scenario.id);
    if (nextIndex >= 0) {
      setScenarioIndex(nextIndex);
    }
  }

  function moveScenario(direction) {
    const nextIndex = (scenarioIndex + direction + SCENARIOS.length) % SCENARIOS.length;
    setScenarioIndex(nextIndex);
    setCurrentScenario(SCENARIOS[nextIndex]);
  }

  async function runSimulation() {
    try {
      const response = await runSimulationEngine({
        selectedAgents,
        scenario: selectedScenario,
        currentStats: selectedScenario.stats
      });

      setSimulation(
        mergeEngineOutputWithLocal(selectedScenario, selectedAgents, response.output, selectedScenario.stats)
      );
    } catch {
      setSimulation(fallbackPreview);
    }

    setSelectedChoiceId("");
    setSelectedDirectiveId("");
    setSelectedExecutionId("");
    setBrowserFallback("");
    setDebateStage("opening");
    resultNarratedRef.current = "";
    setPhase("debate");
  }

  function deployAgents() {
    if (selectedAgents.length !== 2) return;
    activePreviewCharacterRef.current = "";
    previewTokenRef.current += 1;
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
      previewAudioRef.current = null;
    }
    stopVoicePlayback();
    void runSimulation();
  }

  function restartMission() {
    activePreviewCharacterRef.current = "";
    previewTokenRef.current += 1;
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
      previewAudioRef.current = null;
    }
    stopVoicePlayback();
    setPhase("scenario");
    setCurrentScenario(SCENARIOS[0]);
    setSelectedScenario(SCENARIOS[0]);
    setSelectedAgents([]);
    setSelectedChoiceId("");
    setSelectedDirectiveId("");
    setSelectedExecutionId("");
    setHoveredCharacter("");
    setBrowserFallback("");
    setScenarioIndex(0);
    setDebateStage("idle");
    resultNarratedRef.current = "";
  }

  async function playFollowupLines(lines) {
    const token = ++debateRunTokenRef.current;

    const revealLine = (speaker, text) =>
      new Promise((resolve) => {
        if (typingIntervalRef.current) {
          window.clearInterval(typingIntervalRef.current);
        }

        setTypedDialogue("");
        let charIndex = 0;
        const durationMs = estimateSpeechDurationMs(speaker, text);
        const lineDelay = Math.max(26, Math.min(74, durationMs / Math.max(text.length, 1)));

        typingIntervalRef.current = window.setInterval(() => {
          if (debateRunTokenRef.current !== token) {
            window.clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
            resolve();
            return;
          }

          charIndex += 1;
          setTypedDialogue(text.slice(0, charIndex));
          if (charIndex >= text.length) {
            window.clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
            resolve();
          }
        }, lineDelay);
      });

    for (const line of lines) {
      const speakerIndex = activeDebateRoster.indexOf(line.speaker);
      setActiveVoiceIndex(speakerIndex);
      setTypedDialogue("");
      try {
        const [result] = await Promise.all([
          speakAgentLine(line.speaker, line.text),
          revealLine(line.speaker, line.text)
        ]);
        if (result?.provider === "browser" && result?.reason && result.reason !== "playback_failed") {
          setBrowserFallback(result.reason);
        }
      } catch {}
      setDebateMessages((current) => [...current, line]);
      await new Promise((resolve) => window.setTimeout(resolve, 320));
    }

    setActiveVoiceIndex(-1);
    setTypedDialogue("");
  }

  function buildStrategyResponse(choice) {
    const [left, right] = activeDebateRoster;
    const lead = simulation.final_decision.led_by;
    const support = lead === left ? right : left;
    if (choice.kind === "correct") {
      return [
        { speaker: lead, text: "I’m mapping the quickest safe path and issuing the first commands." },
        { speaker: support, text: "I’m watching for blowback and keeping the response stable as we move." }
      ];
    }
    if (choice.kind === "risky") {
      return [
        { speaker: left, text: "I’m pushing the risky play, but I’m setting guardrails to prevent a cascade." },
        { speaker: right, text: "I’m tightening control loops and preparing a fallback if it spikes." }
      ];
    }
    return [
      { speaker: left, text: "I’m containing the damage first so this doesn’t spiral." },
      { speaker: right, text: "I’m building a backup route so we can recover if the first move fails." }
    ];
  }

  function buildDirectiveResponse(directiveId) {
    const [left, right] = activeDebateRoster;
    const lead = simulation.final_decision.led_by;
    const support = lead === left ? right : left;
    const opener = (() => {
      if (directiveId === "shield-civilians") return "I’m stabilizing civilians and keeping trust from collapsing.";
      if (directiveId === "balanced-command") return "I’m coordinating a disciplined response so control doesn’t slip.";
      return "I’m driving rapid containment and forcing the threat to retreat.";
    })();

    return [
      { speaker: lead, text: opener },
      { speaker: support, text: "I’m backing you up—monitoring the weak points and keeping the team aligned." }
    ];
  }

  async function handleStrategyChoice(choiceId) {
    if (decisionBusy) return;
    const choice = choiceOptions.find((entry) => entry.id === choiceId);
    if (!choice) return;
    setDecisionBusy(true);
    setSelectedChoiceId(choiceId);
    setDebateMessages((current) => [...current, { speaker: "Operator", text: `Decision: ${choice.label}` }]);
    await playFollowupLines(buildStrategyResponse(choice));
    setDebateStage("tool");
    setDecisionBusy(false);
  }

  async function handleDirectiveChoice(directiveId) {
    if (decisionBusy || !selectedChoiceId) return;
    const tool = toolOptions.find((entry) => entry.id === directiveId);
    if (!tool) return;
    setDecisionBusy(true);
    setSelectedDirectiveId(directiveId);
    activePreviewCharacterRef.current = "";
    previewTokenRef.current += 1;
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
      previewAudioRef.current = null;
    }
    stopVoicePlayback();
    setDebateMessages((current) => [...current, { speaker: "Operator", text: `Tool: ${tool.tool.label}` }]);
    setSelectedDirectiveId(directiveId);
    await playFollowupLines(buildDirectiveResponse(directiveId));
    setDebateStage("execute");
    setDecisionBusy(false);
  }

  function buildExecutionResponse(executionId, result) {
    const [left, right] = activeDebateRoster;
    const opener = (() => {
      if (executionId === "careful-rollout") return "I’m rolling it out step-by-step to avoid new failures.";
      if (executionId === "split-teams") return "I’m splitting the team—parallel actions to save time.";
      return "I’m going all-in—maximum pressure until it breaks.";
    })();

    const closer = (() => {
      if (result === "success") return "I’m confirming systems are stable and locking in the win.";
      if (result === "partial_success") return "I’m patching what’s still bleeding so we don’t lose the aftermath.";
      return "I’m pulling what we can from the wreckage and stopping secondary collapse.";
    })();

    return [
      { speaker: left, text: opener },
      { speaker: right, text: closer }
    ];
  }

  async function handleExecutionChoice(executionId) {
    if (decisionBusy || !selectedChoiceId || !selectedDirectiveId) return;
    const executionOptions = simulation.meta?.execution_options ?? [];
    const execution = executionOptions.find((entry) => entry.id === executionId);
    if (!execution) return;
    setDecisionBusy(true);
    setSelectedExecutionId(executionId);
    setDebateMessages((current) => [...current, { speaker: "Operator", text: `Finish: ${execution.label}` }]);
    const nextSimulation = applyPlayerChoice(simulation, selectedChoiceId, selectedDirectiveId, executionId);
    setSimulation(nextSimulation);
    await playFollowupLines(buildExecutionResponse(executionId, nextSimulation.result));
    setDebateStage("result");
    setDecisionBusy(false);
  }

  function handleCharacterHover(agentName) {
    setHoveredCharacter(agentName);

    if (phase !== "selection") return;
    if (activePreviewCharacterRef.current === agentName) return;

    const rosterEntry = getRosterEntry(agentName);
    activePreviewCharacterRef.current = agentName;
    previewTokenRef.current += 1;
    const token = previewTokenRef.current;
    stopVoicePlayback();
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
      previewAudioRef.current = null;
    }

    if (rosterEntry?.previewAudio) {
      const audio = new Audio(rosterEntry.previewAudio);
      audio.preload = "auto";
      previewAudioRef.current = audio;
      audio.onended = () => {
        if (previewAudioRef.current === audio) {
          previewAudioRef.current = null;
        }
        if (previewTokenRef.current === token) {
          activePreviewCharacterRef.current = "";
          setHoveredCharacter("");
        }
      };
      audio.onerror = () => {
        if (previewAudioRef.current === audio) {
          previewAudioRef.current = null;
        }
        if (previewTokenRef.current === token) {
          activePreviewCharacterRef.current = "";
          setHoveredCharacter("");
        }
      };
      void audio.play().catch(() => {});
      return;
    }

    void speakAgentLine(agentName, `${agentName}.`).finally(() => {
      if (previewTokenRef.current !== token) return;
      activePreviewCharacterRef.current = "";
    });
  }

  function handleCharacterBlur() {
    setHoveredCharacter("");
    activePreviewCharacterRef.current = "";
    previewTokenRef.current += 1;
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current.currentTime = 0;
      previewAudioRef.current = null;
    }
    stopVoicePlayback();
  }

  return (
    <main className="app-shell">
      <audio ref={ambientAudioRef} src={AUDIO.ambient} loop preload="auto" />

      {!introVisible ? (
        <BackgroundAudioControls
          bgmMuted={bgmMuted}
          bgmVolume={bgmVolume}
          onToggleMute={() => setBgmMuted((value) => !value)}
          onVolumeChange={(event) => {
            const value = Number(event.target.value);
            setBgmVolume(value);
            if (value > 0 && bgmMuted) {
              setBgmMuted(false);
            }
          }}
        />
      ) : null}

      {introVisible ? (
        <IntroScreen
          introVideoRef={introVideoRef}
          introAudioEnabled={introAudioEnabled}
          introStoryText={introStoryText}
          introVideo={VIDEOS.intro}
          onToggleIntroAudio={() => setIntroAudioEnabled((value) => !value)}
          onSkipIntro={() => setIntroStage(2)}
          onIntroEnded={() => setIntroStage(2)}
        />
      ) : null}

      <div className="background-layer" style={{ "--app-background": `url(${appBackground})` }} />
      <div className="background-grid" />

      <section className={`game-shell ${phase === "debate" ? "full-bleed" : ""}`}>
        {phase === "scenario" ? (
          <ScenarioScreen
            operatorLabel={operatorLabel}
            currentScenario={currentScenario}
            scenarioIndex={scenarioIndex}
            scenarios={SCENARIOS}
            onMoveScenario={moveScenario}
            onSelectScenario={selectScenario}
            onContinue={confirmScenario}
          />
        ) : null}

        {phase === "selection" ? (
          <SelectionScreen
            operatorLabel={operatorLabel}
            selectedScenario={selectedScenario}
            roster={roster}
            selectedAgents={selectedAgents}
            hoveredCharacter={hoveredCharacter}
            onToggleAgent={toggleAgent}
            onHoverCharacter={handleCharacterHover}
            onBlurCharacter={handleCharacterBlur}
            onDeploy={deployAgents}
          />
        ) : null}

        {phase === "debate" ? (
          <DebateScreen
            selectedScenario={selectedScenario}
            activeDebateRoster={activeDebateRoster}
            activeLine={activeLine}
            debateMessages={debateMessages}
            showActiveTypingBubble={showActiveTypingBubble}
            typedDialogue={typedDialogue}
            getRosterEntry={getRosterEntry}
            debateStage={debateStage}
            choiceOptions={choiceOptions}
            toolOptions={toolOptions}
            executionOptions={executionOptions}
            simulation={simulation}
            decisionBusy={decisionBusy}
            onChooseStrategy={handleStrategyChoice}
            onChooseTool={handleDirectiveChoice}
            onChooseExecution={handleExecutionChoice}
            onRestart={restartMission}
            browserFallback={browserFallback}
          />
        ) : null}

      </section>
    </main>
  );
}
