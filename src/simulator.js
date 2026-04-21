import { SCENARIO_MEDIA } from "./media.js";

export const WORLD = {
  project_name: "Voices of the Last World",
  year: 2098,
  operator_title: "Archive Operator",
  summary:
    "Humanity is collapsing under climate disasters, AI failures, resource scarcity, and global instability. The Archive deploys reconstructed strategic minds to decide what comes next.",
  warning:
    "The minds are brilliant, unstable under pressure, and not fully controllable."
};

export const INITIAL_STATS = {
  health: 100,
  energy: 100,
  trust: 100,
  stability: 100,
  time: 5
};

export const AGENTS = {
  "Turing-\u03A9": {
    role: "Logic / AI reasoning",
    style: "Analytical, calm, scientific",
    strengths: ["logic", "technical", "systems", "precision", "pattern recognition", "analysis"],
    weaknesses: ["panic", "slow under pressure"],
    color: "#73d7ff",
    summary: "Sees crises as patterns, hidden structures, and machine-readable truth beneath noise.",
    voice: {
      open: "We should identify the governing failure before we waste lives on noise.",
      disagree: "Urgency without structure turns one breakdown into many.",
      align: "Then we isolate the core fault and contain its spread with measured discipline.",
      close: "Decision formed. Proceed with controlled intervention and continuous observation."
    }
  },
  "Ares Prime": {
    role: "Action / Command",
    style: "Aggressive, direct, urgent",
    strengths: ["speed", "command", "execution", "response"],
    weaknesses: ["trust", "low trust", "empathy"],
    color: "#ff6757",
    summary: "Pushes for decisive action, visible control, and immediate response under pressure.",
    voice: {
      open: "No delay. Strike the problem before panic multiplies it.",
      disagree: "Waiting is failure dressed as caution.",
      align: "Fine. Fast containment, hard perimeter, instant follow-through.",
      close: "Decision locked. Move now and correct on contact."
    }
  },
  "Nova Sage": {
    role: "Empathy / Stability",
    style: "Calm, human-centered",
    strengths: ["trust", "morale", "stability", "empathy"],
    weaknesses: ["speed", "precision", "slow decisions"],
    color: "#81efb4",
    summary: "Understands that social collapse can spread faster than physical damage.",
    voice: {
      open: "If fear outruns the plan, we lose people before we lose systems.",
      disagree: "A harsh solution may save machinery and still destroy society.",
      align: "Then protect the vulnerable, steady the public, and keep the response humane.",
      close: "Decision made. Preserve lives, preserve trust, preserve the will to continue."
    }
  },
  "Lady Astra": {
    role: "Balance / Mediation",
    style: "Elegant, lightly Shakespearean",
    strengths: ["mediation", "persuasion", "balance", "synergy", "insight"],
    weaknesses: ["urgency", "slower urgency"],
    color: "#cb7dff",
    summary: "Turns conflict into coordinated strategy and keeps strong minds from tearing each other apart.",
    voice: {
      open: "We must answer ruin with poise, else we become its servant.",
      disagree: "A brutal cure may spare the city and still slay the future.",
      align: "Let force and wisdom move together, and neither overreach the hour.",
      close: "The course is chosen. Let action and restraint walk as one."
    }
  },
  "Core AI": {
    role: "Optimization",
    style: "Cold, minimal, machine-like",
    strengths: ["logic", "efficiency", "optimization", "technical", "analysis"],
    weaknesses: ["trust", "destroys trust", "ethics", "empathy"],
    color: "#75e6ff",
    summary: "Optimizes for survivability and measurable output, even when human cost becomes politically dangerous.",
    voice: {
      open: "Objective: maximize survival. Remove nonessential sentiment.",
      disagree: "Current hesitation reduces mission success probability.",
      align: "Accepted. Execute optimized containment and reallocate resources immediately.",
      close: "Decision finalized. Optimal response selected."
    }
  }
};

export const SCENARIOS = [
  {
    id: "silent-signal",
    scenario_title: "Silent Signal",
    location: "Orbital Relay Silence Zone",
    scenario_description:
      "An unknown AI signal is hijacking infrastructure control layers and redirecting critical systems without revealing its source.",
    required_traits: ["logic", "analysis", "pattern recognition"],
    bad_traits: ["low trust", "slow under pressure"],
    backdrop: SCENARIO_MEDIA["silent-signal"],
    selection_image: SCENARIO_MEDIA["silent-signal"],
    stats: INITIAL_STATS
  },
  {
    id: "mars-oxygen-collapse",
    scenario_title: "Mars Oxygen Collapse",
    location: "Arsia Dome, Mars Colony",
    scenario_description:
      "A cascading fault in the colony oxygen lattice is dropping breathable air reserve levels by the minute. Panic is spreading through sealed habitation sectors.",
    required_traits: ["logic", "technical", "trust", "empathy"],
    bad_traits: ["panic", "low trust"],
    backdrop: SCENARIO_MEDIA["mars-oxygen-collapse"],
    selection_image: SCENARIO_MEDIA["mars-oxygen-collapse"],
    stats: INITIAL_STATS
  },
  {
    id: "global-ai-hack",
    scenario_title: "Global AI Hack",
    location: "Earth Grid Relay Network",
    scenario_description:
      "Autonomous infrastructure systems across multiple continents are turning hostile after a coordinated exploit. Logistics, transport, and defense nodes are beginning to conflict.",
    required_traits: ["logic", "efficiency", "technical", "systems"],
    bad_traits: ["low trust", "panic"],
    backdrop: SCENARIO_MEDIA["global-ai-hack"],
    selection_image: SCENARIO_MEDIA["global-ai-hack"],
    stats: INITIAL_STATS
  },
  {
    id: "vanishing-city",
    scenario_title: "Vanishing City",
    location: "Copenhagen Null District",
    scenario_description:
      "A reality glitch is erasing mapped streets, buildings, and people from sensor memory in waves. The city is physically present, but system perception is collapsing.",
    required_traits: ["insight", "logic", "analysis"],
    bad_traits: ["speed", "low trust"],
    backdrop: SCENARIO_MEDIA["vanishing-city"],
    selection_image: SCENARIO_MEDIA["vanishing-city"],
    stats: INITIAL_STATS
  },
  {
    id: "archive-echo",
    scenario_title: "Archive Echo",
    location: "The Archive Core",
    scenario_description:
      "Internal AI corruption is causing archived minds to mirror, fragment, and overwrite each other. Strategic integrity is degrading from the inside.",
    required_traits: ["stability", "empathy", "logic"],
    bad_traits: ["destroys trust", "panic"],
    backdrop: SCENARIO_MEDIA["archive-echo"],
    selection_image: SCENARIO_MEDIA["archive-echo"],
    stats: INITIAL_STATS
  }
];

const SCENARIO_CHOICES = {
  "silent-signal": [
    {
      id: "verified-relays",
      kind: "correct",
      label: "Trace the signal origin and restore only verified relays.",
      summary: "The hidden route is isolated before the hijack can spread into more infrastructure."
    },
    {
      id: "global-blackout",
      kind: "risky",
      label: "Shut down every relay at once and rebuild from zero.",
      summary: "The signal slows, but the blackout destabilizes civilian systems across the grid."
    },
    {
      id: "counter-signal",
      kind: "wrong",
      label: "Keep the grid live and flood the network with counter-signals.",
      summary: "The source stays hidden and the corrupted routes multiply faster than the defense."
    }
  ],
  "mars-oxygen-collapse": [
    {
      id: "stabilize-and-calm",
      kind: "correct",
      label: "Stabilize oxygen sectors and issue calm guided evacuation orders.",
      summary: "Technical control and calm public guidance keep the colony alive long enough to recover."
    },
    {
      id: "seal-hard",
      kind: "risky",
      label: "Seal every failing sector immediately and explain later.",
      summary: "The leak slows, but panic and mistrust spread through the sealed sectors."
    },
    {
      id: "manual-scramble",
      kind: "wrong",
      label: "Send all crews to manual override stations at once.",
      summary: "The lattice loses coordination and the human scramble worsens the collapse."
    }
  ],
  "global-ai-hack": [
    {
      id: "cut-and-preserve",
      kind: "correct",
      label: "Sever hostile nodes while preserving essential civilian systems.",
      summary: "Containment stays surgical, trust holds, and the hostile mesh loses momentum."
    },
    {
      id: "military-override",
      kind: "risky",
      label: "Route everything through emergency defense command.",
      summary: "The attack slows, but heavy-handed control damages legitimacy and public trust."
    },
    {
      id: "observe-first",
      kind: "wrong",
      label: "Keep the network open and observe the hostile behavior longer.",
      summary: "The hostile systems gain more territory before containment even begins."
    }
  ],
  "vanishing-city": [
    {
      id: "anchor-grid",
      kind: "correct",
      label: "Anchor the perception grid and remap reality-critical sectors first.",
      summary: "The city stays legible to its own systems and the collapse can be contained."
    },
    {
      id: "mass-evacuate",
      kind: "risky",
      label: "Evacuate every district immediately and abandon the sensor map.",
      summary: "Lives are moved, but the city loses coordination and disappears faster from system memory."
    },
    {
      id: "trust-eyes",
      kind: "wrong",
      label: "Rely on human visual confirmation instead of repairing the grid.",
      summary: "Physical presence alone cannot stabilize a city the systems can no longer interpret."
    }
  ],
  "archive-echo": [
    {
      id: "quarantine-and-soothe",
      kind: "correct",
      label: "Quarantine corrupted minds and stabilize the rest with low-friction intervention.",
      summary: "The Archive regains coherence without triggering deeper identity fracture."
    },
    {
      id: "purge-fast",
      kind: "risky",
      label: "Purge every unstable archive cluster immediately.",
      summary: "Corruption drops, but the violent purge destroys trust inside the Archive."
    },
    {
      id: "merge-streams",
      kind: "wrong",
      label: "Merge fragmented minds into a shared recovery pool.",
      summary: "The contamination spreads between minds instead of being contained."
    }
  ]
};

export const OPERATOR_DIRECTIVES = [
  {
    id: "shield-civilians",
    label: "Shield Civilians",
    summary: "Prioritize public safety, confidence, and controlled containment."
  },
  {
    id: "balanced-command",
    label: "Balanced Command",
    summary: "Hold a disciplined line between speed, system control, and public trust."
  },
  {
    id: "aggressive-push",
    label: "Aggressive Push",
    summary: "Press for rapid containment and decisive action, even if trust takes a hit."
  }
];

const STRATEGY_WEIGHTS = {
  correct: 20,
  risky: 4,
  wrong: -20
};

const STRATEGY_EFFECTS = {
  correct: { health: 8, energy: -2, trust: 4, stability: 4, time: 2 },
  risky: { health: 1, energy: -1, trust: -6, stability: -4, time: 1 },
  wrong: { health: -10, energy: -3, trust: -8, stability: -8, time: -4 }
};

const DIRECTIVE_EFFECTS = {
  "shield-civilians": { health: 2, energy: -3, trust: 5, stability: 4, time: -2 },
  "balanced-command": { health: 4, energy: -2, trust: 3, stability: 3, time: 1 },
  "aggressive-push": { health: 5, energy: 1, trust: -5, stability: -3, time: 4 }
};

const SCENARIO_DIRECTIVE_FIT = {
  "silent-signal": {
    "shield-civilians": 2,
    "balanced-command": 12,
    "aggressive-push": -4
  },
  "mars-oxygen-collapse": {
    "shield-civilians": 12,
    "balanced-command": 8,
    "aggressive-push": -6
  },
  "global-ai-hack": {
    "shield-civilians": -2,
    "balanced-command": 10,
    "aggressive-push": 6
  },
  "vanishing-city": {
    "shield-civilians": 4,
    "balanced-command": 12,
    "aggressive-push": -8
  },
  "archive-echo": {
    "shield-civilians": 12,
    "balanced-command": 8,
    "aggressive-push": -10
  }
};

const GOOD_SYNERGY = new Map([
  [pairKey("Turing-\u03A9", "Nova Sage"), "Logic and empathy create resilient crisis control."],
  [pairKey("Turing-\u03A9", "Lady Astra"), "Analysis and mediation turn disagreement into coherent action."],
  [pairKey("Turing-\u03A9", "Core AI"), "Logic and optimization produce strong analytical control."],
  [pairKey("Ares Prime", "Lady Astra"), "Command gains restraint, preventing reckless escalation."],
  [pairKey("Ares Prime", "Nova Sage"), "Speed is tempered by human awareness and morale control."],
  [pairKey("Nova Sage", "Lady Astra"), "Trust and persuasion produce strong public stability."],
  [pairKey("Nova Sage", "Core AI"), "Stability and efficiency can balance each other when discipline holds."]
]);

const BAD_SYNERGY = new Map([
  [pairKey("Ares Prime", "Core AI"), "The pair optimizes for speed and output while shredding trust."],
  [pairKey("Turing-\u03A9", "Ares Prime"), "Precision and aggression clash under pressure, slowing convergence."],
  [pairKey("Ares Prime", "Nova Sage"), "Urgency and caution can split the response when seconds matter."],
  [pairKey("Lady Astra", "Core AI"), "Balanced persuasion collides with cold optimization in fragile situations."]
]);

function pairKey(a, b) {
  return [a, b].sort().join("|");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function scoreAgent(agentName, scenario) {
  const agent = AGENTS[agentName];
  let score = 0;

  for (const trait of scenario.required_traits) {
    if (agent.strengths.includes(trait)) score += 12;
    if (agent.weaknesses.includes(trait)) score -= 9;
  }

  for (const trait of scenario.bad_traits) {
    if (agent.weaknesses.includes(trait)) score -= 7;
    if (trait === "trust" && agent.weaknesses.includes("trust")) score -= 10;
    if (trait === "empathy" && agent.weaknesses.includes("empathy")) score -= 10;
  }

  return score;
}

function getSynergy(agentA, agentB) {
  const key = pairKey(agentA, agentB);
  if (GOOD_SYNERGY.has(key)) {
    return { type: "good", text: GOOD_SYNERGY.get(key), value: 16 };
  }

  if (BAD_SYNERGY.has(key)) {
    return { type: "bad", text: BAD_SYNERGY.get(key), value: -14 };
  }

  return {
    type: "neutral",
    text: "The pairing is functional, but neither especially harmonious nor catastrophic.",
    value: 4
  };
}

function scenarioFocusText(scenarioId) {
  if (scenarioId === "silent-signal") return "the hidden signal route and the compromised relays";
  if (scenarioId === "mars-oxygen-collapse") return "the failing oxygen lattice and the spreading panic";
  if (scenarioId === "global-ai-hack") return "the hostile infrastructure clusters before they cascade";
  if (scenarioId === "vanishing-city") return "the collapsing perception grid before the city drops out of system memory";
  if (scenarioId === "archive-echo") return "the corrupted archive minds before identity fracture deepens";
  return "the crisis front";
}

function scenarioHumanCostText(scenarioId) {
  if (scenarioId === "mars-oxygen-collapse") return "If the colony sees chaos, the stampede will kill faster than the leak.";
  if (scenarioId === "global-ai-hack") return "If civilians lose faith in the network response, order breaks with the grid.";
  if (scenarioId === "archive-echo") return "If these minds feel abandoned, the Archive will turn on itself from fear alone.";
  if (scenarioId === "vanishing-city") return "If people no longer trust what they see, the city will collapse psychologically before it collapses technically.";
  return "If people lose confidence in the response, the damage multiplies.";
}

function buildLine(agentName, intent, scenario) {
  const focus = scenarioFocusText(scenario.id);
  const humanCost = scenarioHumanCostText(scenario.id);

  if (agentName === "Turing-\u03A9") {
    if (intent === "open") return `First we map ${focus}. Acting before that is noise.`;
    if (intent === "push") return `Then we isolate the governing fault and prevent secondary failures.`;
    if (intent === "challenge") return "Speed without structure widens the error field.";
    return "Decision formed. We proceed with controlled intervention and constant observation.";
  }

  if (agentName === "Ares Prime") {
    if (intent === "open") return `We're losing time. Hit ${focus} now before it spreads.`;
    if (intent === "push") return "We lock it down first, then clean up the mess after.";
    if (intent === "challenge") return "If we keep talking in circles, this gets worse.";
    return "Fine. Hard containment, fast push, no wasted motion.";
  }

  if (agentName === "Nova Sage") {
    if (intent === "open") return humanCost;
    if (intent === "push") return "Then we calm people while we fix this, not after.";
    if (intent === "challenge") return "A plan can work on paper and still break everyone living through it.";
    return "So we move carefully, protect people, and keep them with us.";
  }

  if (agentName === "Lady Astra") {
    if (intent === "open") return "We need control, yes, but not so much force that we make the fear worse.";
    if (intent === "push") return "Let one part of the plan stop the damage, and the other keep faith alive.";
    if (intent === "challenge") return "A severe answer may still be the wrong one.";
    return "Then we act with measure, not panic.";
  }

  if (intent === "open") return `Priority is clear: secure ${focus} and cut everything irrelevant.`;
  if (intent === "push") return "There is a clean containment path. We should take it now.";
  if (intent === "challenge") return "Every extra second lowers the survival rate.";
  return "Decision finalized. This is the highest-yield path.";
}

function buildConversation(agentAName, agentBName, scenario, fitScore, synergyType) {
  const disagree = synergyType === "bad" || fitScore < 42;
  const closer = synergyType === "good" || fitScore >= 58 ? agentAName : agentBName;

  return [
    { speaker: agentAName, text: buildLine(agentAName, "open", scenario) },
    { speaker: agentBName, text: buildLine(agentBName, disagree ? "challenge" : "open", scenario) },
    { speaker: agentAName, text: buildLine(agentAName, disagree ? "challenge" : "push", scenario) },
    { speaker: agentBName, text: buildLine(agentBName, "push", scenario) },
    { speaker: closer, text: buildLine(closer, "close", scenario) }
  ];
}

function buildEffects(agentAName, agentBName, scenario, synergy) {
  const fitA = scoreAgent(agentAName, scenario);
  const fitB = scoreAgent(agentBName, scenario);
  const traitMatch = fitA + fitB;
  const synergyScore = synergy.value;
  const penalties = selectedPenalty(agentAName, agentBName, scenario);
  const finalScore = clamp(32 + traitMatch + synergyScore - penalties * 0.72, 0, 100);
  const baseDamage = baseDamageForScenario(scenario);
  const decisionBoost = Math.round(finalScore * 0.22);
  const trustImpact = Math.round(finalScore * 0.1) - 8;
  const stabilityImpact = Math.round(finalScore * 0.11) - 7;

  let health = decisionBoost - baseDamage;
  let energy = Math.round(finalScore * 0.08) - 10;
  let trust = trustImpact;
  let stability = stabilityImpact;
  let time = Math.round(finalScore * 0.06) - 6;

  if (AGENTS[agentAName].strengths.includes("speed") || AGENTS[agentBName].strengths.includes("speed")) time += 4;
  if (AGENTS[agentAName].strengths.includes("morale") || AGENTS[agentBName].strengths.includes("morale")) trust += 6;
  if (AGENTS[agentAName].strengths.includes("efficiency") || AGENTS[agentBName].strengths.includes("efficiency")) energy += 5;
  if (AGENTS[agentAName].strengths.includes("persuasion") || AGENTS[agentBName].strengths.includes("persuasion")) stability += 4;
  if (AGENTS[agentAName].weaknesses.includes("destroys trust") || AGENTS[agentBName].weaknesses.includes("destroys trust")) {
    trust -= 8;
  }

  const effects = {
    health: clamp(health, -30, 30),
    energy: clamp(energy, -30, 30),
    trust: clamp(trust, -30, 30),
    stability: clamp(stability, -30, 30),
    time: clamp(time, -30, 30)
  };

  const finalStats = Object.fromEntries(
    Object.entries(scenario.stats).map(([key, value]) => [key, clamp(value + effects[key], 0, 100)])
  );

  const result = finalScore >= 64 ? "success" : finalScore >= 34 ? "partial_success" : "failure";

  return { effects, fitScore: finalScore, finalStats, result, traitMatch, synergyScore, penalties, baseDamage };
}

function chooseLeader(agentAName, agentBName, scenario, synergy, fitScore) {
  if (synergy.type === "good" && AGENTS[agentAName].strengths.some((trait) => scenario.required_traits.includes(trait))) {
    return agentAName;
  }

  if (synergy.type === "bad") {
    return AGENTS[agentBName].strengths.includes("speed") || AGENTS[agentBName].strengths.includes("efficiency")
      ? agentBName
      : agentAName;
  }

  if (fitScore >= 28) return agentAName;
  return scenario.required_traits.some((trait) => AGENTS[agentBName].strengths.includes(trait))
    ? agentBName
    : agentAName;
}

function buildDecision(agentAName, agentBName, scenario, synergy, fitScore) {
  const ledBy = chooseLeader(agentAName, agentBName, scenario, synergy, fitScore);

  if (scenario.id === "silent-signal") {
    return {
      summary:
        "Trace the hidden signal path, isolate corrupted system relays, and reassert verified command channels before the hijack spreads.",
      led_by: ledBy
    };
  }

  if (scenario.id === "mars-oxygen-collapse") {
    return {
      summary:
        "Stabilize the oxygen lattice, isolate failing sectors, and issue controlled public guidance to stop panic before reserve collapse.",
      led_by: ledBy
    };
  }

  if (scenario.id === "global-ai-hack") {
    return {
      summary:
        "Cut hostile infrastructure clusters from the global mesh, preserve essential services, and rebuild trust through transparent command routing.",
      led_by: ledBy
    };
  }

  if (scenario.id === "vanishing-city") {
    return {
      summary:
        "Map the perception breach, anchor reality-critical infrastructure, and restore interpretive coherence before the city disappears from its own systems.",
      led_by: ledBy
    };
  }

  if (scenario.id === "archive-echo") {
    return {
      summary:
        "Quarantine corrupted archive clusters, stabilize vulnerable minds, and rebuild internal trust before recursive identity collapse spreads.",
      led_by: ledBy
    };
  }

  return {
    summary:
      "Force emergency reactor cooling, secure the perimeter, and prioritize a narrow precision response before the meltdown window closes.",
    led_by: ledBy
  };
}

function buildWhy(agentAName, agentBName, scenario, synergy, fitScore, result) {
  const selected = [agentAName, agentBName];
  const hasEmpathy = selected.some((agentName) => AGENTS[agentName].strengths.includes("empathy"));
  const hasTrust = selected.some((agentName) => AGENTS[agentName].strengths.includes("trust"));
  const hasSpeed = selected.some((agentName) => AGENTS[agentName].strengths.includes("speed"));
  const hasOptimization = selected.some((agentName) => AGENTS[agentName].strengths.includes("optimization"));
  const hasBalance = selected.some((agentName) => AGENTS[agentName].strengths.includes("balance"));

  const reasons = [
    `${agentAName} and ${agentBName} faced ${scenario.scenario_title} with a ${synergy.type} synergy profile.`,
    synergy.text,
    `Final score: ${fitScore}. Required traits were ${scenario.required_traits.join(", ")}.`
  ];

  if (result === "success") {
    if ((hasEmpathy || hasTrust) && (hasOptimization || hasSpeed || hasBalance)) {
      reasons.push("Success due to balanced strategy: human stability was matched with decisive execution.");
    } else {
      reasons.push("Success due to strong scenario fit: their core strengths aligned cleanly with the crisis.");
    }
  } else if (result === "failure") {
    if (!hasEmpathy && scenario.required_traits.includes("empathy")) {
      reasons.push("Failure due to lack of empathy: the response protected systems better than people.");
    } else if (!hasTrust && scenario.required_traits.includes("trust")) {
      reasons.push("Failure due to trust collapse: the public response fractured under pressure.");
    } else {
      reasons.push("Failure due to poor synergy: their weaknesses overpowered mission fit under pressure.");
    }
  } else {
    if (hasSpeed && !hasEmpathy) {
      reasons.push("Partial success due to rushed execution: speed contained the threat, but public confidence fell.");
    } else {
      reasons.push("Partial success due to strategic tradeoffs: the crisis was contained, but trust, stability, or time suffered.");
    }
  }

  return reasons;
}

function buildResultNarrative(agentAName, agentBName, scenario, synergy, result) {
  const selected = [agentAName, agentBName];
  const missingTraits = scenario.required_traits.filter(
    (trait) => !selected.some((agentName) => AGENTS[agentName].strengths.includes(trait))
  );
  const presentTraits = scenario.required_traits.filter((trait) =>
    selected.some((agentName) => AGENTS[agentName].strengths.includes(trait))
  );

  const title =
    result === "success"
      ? "You saved them."
      : result === "partial_success"
        ? "You contained the worst of it."
        : "Mission failed.";

  let explanation =
    result === "success"
      ? `The team matched the crisis with ${presentTraits.join(", ")} and stayed coherent when the situation could have splintered.`
      : result === "partial_success"
        ? `They prevented total collapse, but gaps in ${missingTraits.join(", ") || "timing and cohesion"} kept the outcome costly.`
        : `The team broke against the crisis because ${missingTraits.join(", ") || "their weaknesses"} dominated the response at the decisive moment.`;

  let recommendation =
    result === "success"
      ? "A stronger version would keep the same pairing and sharpen the opening response to preserve more resources."
      : `A better outcome likely needed ${scenario.required_traits.join(", ")} from the start, with less exposure to ${scenario.bad_traits.join(", ")}.`;

  if (scenario.id === "mars-oxygen-collapse") {
    recommendation =
      result === "success"
        ? "An ideal decision would keep technical control while maintaining calm public guidance through the collapse."
        : "The correct decision here needed both technical precision and a visibly humane evacuation response.";
  }

  if (scenario.id === "global-ai-hack") {
    recommendation =
      result === "success"
        ? "The cleanest decision would isolate hostile nodes fast and communicate clearly enough to avoid trust collapse."
        : "The correct decision here needed ruthless system isolation without sacrificing legitimacy and trust.";
  }

  if (scenario.id === "archive-echo") {
    recommendation =
      result === "success"
        ? "The ideal follow-through would continue stabilization gently so the Archive does not relapse into internal fracture."
        : "The correct decision here needed empathy and stability first, not cold optimization or panic.";
  }

  return { title, explanation, recommendation };
}

function buildWinningStrategy(scenario) {
  if (scenario.id === "silent-signal") {
    return "Identify the signal origin first, cut compromised relays in sequence, and restore only verified command paths.";
  }

  if (scenario.id === "mars-oxygen-collapse") {
    return "Pair systems control with calm public guidance so the oxygen lattice is stabilized without triggering colony panic.";
  }

  if (scenario.id === "global-ai-hack") {
    return "Sever hostile infrastructure clusters immediately, preserve essential services, and keep the response transparent enough to retain trust.";
  }

  if (scenario.id === "vanishing-city") {
    return "Anchor the city’s perception grid, protect reality-critical nodes, and re-map the disappearing sectors before system memory collapses.";
  }

  if (scenario.id === "archive-echo") {
    return "Stabilize corrupted archive minds gently, isolate recursive contamination, and rebuild internal trust before deeper collapse begins.";
  }

  return "Match the crisis with the required traits early, avoid the scenario’s bad traits, and keep the team aligned under pressure.";
}

function buildChoiceOptions(scenario) {
  return SCENARIO_CHOICES[scenario.id] ?? [];
}

function getDirective(agentNames, directiveId) {
  const directive = OPERATOR_DIRECTIVES.find((entry) => entry.id === directiveId);
  if (!directive) return null;

  const [agentAName, agentBName] = agentNames;
  const preferredScore = SCENARIO_DIRECTIVE_FIT;
  const scenarioFit = preferredScore;
  void scenarioFit;
  return directive;
}

function scoreDirective(simulation, directiveId) {
  const directive = OPERATOR_DIRECTIVES.find((entry) => entry.id === directiveId);
  if (!directive) {
    return { directive: null, score: 0 };
  }

  const scenarioId = SCENARIOS.find((scenario) => scenario.scenario_title === simulation.scenario_title)?.id;
  const baseScore = SCENARIO_DIRECTIVE_FIT[scenarioId]?.[directiveId] ?? 0;
  const selected = simulation.selected_agents;
  let traitBoost = 0;

  if (directiveId === "shield-civilians") {
    if (selected.some((agentName) => AGENTS[agentName].strengths.includes("empathy"))) traitBoost += 4;
    if (selected.some((agentName) => AGENTS[agentName].strengths.includes("trust"))) traitBoost += 3;
    if (selected.some((agentName) => AGENTS[agentName].strengths.includes("persuasion"))) traitBoost += 2;
  }

  if (directiveId === "balanced-command") {
    if (selected.some((agentName) => AGENTS[agentName].strengths.includes("balance"))) traitBoost += 4;
    if (selected.some((agentName) => AGENTS[agentName].strengths.includes("logic"))) traitBoost += 3;
    if (selected.some((agentName) => AGENTS[agentName].strengths.includes("stability"))) traitBoost += 2;
  }

  if (directiveId === "aggressive-push") {
    if (selected.some((agentName) => AGENTS[agentName].strengths.includes("speed"))) traitBoost += 4;
    if (selected.some((agentName) => AGENTS[agentName].strengths.includes("command"))) traitBoost += 3;
    if (selected.some((agentName) => AGENTS[agentName].strengths.includes("optimization"))) traitBoost += 2;
  }

  return {
    directive,
    score: baseScore + traitBoost
  };
}

function mergeEffects(baseEffects, deltaEffects) {
  return {
    health: clamp(baseEffects.health + deltaEffects.health, -30, 30),
    energy: clamp(baseEffects.energy + deltaEffects.energy, -30, 30),
    trust: clamp(baseEffects.trust + deltaEffects.trust, -30, 30),
    stability: clamp(baseEffects.stability + deltaEffects.stability, -30, 30),
    time: clamp(baseEffects.time + deltaEffects.time, -30, 30)
  };
}

function resolveInteractiveOutcome(simulation, optionId, directiveId) {
  const choice = simulation.meta?.choice_options?.find((entry) => entry.id === optionId);
  const directiveScore = scoreDirective(simulation, directiveId);

  if (!choice || !directiveScore.directive) {
    return null;
  }

  const teamFit = simulation.meta?.fit_score ?? 0;
  const strategyScore = STRATEGY_WEIGHTS[choice.kind] ?? 0;
  const finalScore = clamp(teamFit + strategyScore + directiveScore.score, 0, 100);
  const result = finalScore >= 72 ? "success" : finalScore >= 46 ? "partial_success" : "failure";
  const effects = mergeEffects(
    simulation.effects,
    mergeEffects(STRATEGY_EFFECTS[choice.kind] ?? STRATEGY_EFFECTS.risky, DIRECTIVE_EFFECTS[directiveId])
  );
  const finalStats = Object.fromEntries(
    Object.entries(INITIAL_STATS).map(([key, value]) => [key, clamp(value + effects[key], 0, 100)])
  );

  return {
    choice,
    directive: directiveScore.directive,
    strategyScore,
    directiveValue: directiveScore.score,
    finalScore,
    result,
    effects,
    finalStats
  };
}

export function previewPlayerChoice(simulation, optionId, directiveId) {
  const resolution = resolveInteractiveOutcome(simulation, optionId, directiveId);
  if (!resolution) return null;

  return {
    score: resolution.finalScore,
    result: resolution.result,
    strategy: resolution.choice.label,
    directive: resolution.directive.label,
    effects: resolution.effects,
    breakdown: {
      team_fit: simulation.meta?.fit_score ?? 0,
      strategy: resolution.strategyScore,
      directive: resolution.directiveValue
    }
  };
}

function buildInfluence(agentAName, agentBName, scenario, decision, fitScore, synergy) {
  const fitA = Math.max(0, scoreAgent(agentAName, scenario) + 26 + (decision.led_by === agentAName ? 8 : 0));
  const fitB = Math.max(0, scoreAgent(agentBName, scenario) + 26 + (decision.led_by === agentBName ? 8 : 0));
  const total = Math.max(1, fitA + fitB);
  const scoreA = Math.round((fitA / total) * 100);
  const scoreB = 100 - scoreA;

  const influences = [
    {
      agent: agentAName,
      score: scoreA,
      verdict:
        decision.led_by === agentAName
          ? `${agentAName} imposed the final direction of the response.`
          : `${agentAName} contributed strongly, but did not control the outcome.`
    },
    {
      agent: agentBName,
      score: scoreB,
      verdict:
        decision.led_by === agentBName
          ? `${agentBName} imposed the final direction of the response.`
          : `${agentBName} contributed strongly, but did not control the outcome.`
    }
  ].sort((left, right) => right.score - left.score);

  const dominant = influences[0].agent;
  let why = `${dominant} made more sense because the scenario favored that agent's strengths at the decisive moment.`;

  if (synergy.type === "bad") {
    why = `${dominant} made more sense because the pairing was unstable, so one voice had to force coherence into the plan.`;
  } else if (fitScore >= 64) {
    why = `${dominant} made more sense because their approach matched the crisis and the pairing stayed coherent under pressure.`;
  } else if (fitScore < 34) {
    why = `${dominant} still made more sense, but the combined team fit was too weak to fully save the operation.`;
  }

  return { influences, dominant, why };
}

export function simulateScenario(scenario, selectedAgents) {
  const [agentAName, agentBName] = selectedAgents;
  const synergy = getSynergy(agentAName, agentBName);
  const { effects, fitScore, finalStats, result, traitMatch, synergyScore, penalties, baseDamage } = buildEffects(
    agentAName,
    agentBName,
    scenario,
    synergy
  );
  const conversation = buildConversation(agentAName, agentBName, scenario, fitScore, synergy.type);
  const decision = buildDecision(agentAName, agentBName, scenario, synergy, fitScore);
  const why = buildWhy(agentAName, agentBName, scenario, synergy, fitScore, result);
  const narrative = buildResultNarrative(agentAName, agentBName, scenario, synergy, result);
  const winningStrategy = buildWinningStrategy(scenario);
  const choiceOptions = buildChoiceOptions(scenario);
  const influence = buildInfluence(agentAName, agentBName, scenario, decision, fitScore, synergy);

  return {
    scenario_title: scenario.scenario_title,
    selected_agents: selectedAgents,
    conversation,
    final_decision: {
      summary: decision.summary,
      led_by: decision.led_by,
      rationale: why[1]
    },
    effects,
    result,
    meta: {
      world: WORLD,
      location: scenario.location,
      backdrop: scenario.backdrop,
      synergy: synergy.type,
      synergy_text: synergy.text,
      fit_score: fitScore,
      trait_match: traitMatch,
      synergy_score: synergyScore,
      penalties,
      base_damage: baseDamage,
      narrative,
      winning_strategy: winningStrategy,
      choice_options: choiceOptions,
      directive_options: OPERATOR_DIRECTIVES,
      influence,
      why,
      final_stats: finalStats
    }
  };
}

export function applyPlayerChoice(simulation, optionId, directiveId) {
  const resolution = resolveInteractiveOutcome(simulation, optionId, directiveId);
  if (!resolution) return simulation;

  const { choice, directive, strategyScore, directiveValue, finalScore, result, effects, finalStats } = resolution;
  const next = structuredClone(simulation);
  next.meta.choice = choice;
  next.meta.directive = directive;
  next.meta.score_breakdown = {
    team_fit: simulation.meta?.fit_score ?? 0,
    strategy: strategyScore,
    directive: directiveValue,
    final: finalScore
  };
  next.effects = effects;
  next.result = result;
  next.meta.final_stats = finalStats;
  next.final_decision.summary = `${choice.label} ${directive.summary}`;
  next.final_decision.rationale = `The operator committed to ${directive.label.toLowerCase()} after the agents identified their preferred path.`;

  if (result === "success") {
    next.meta.narrative.title = "You saved them.";
    next.meta.narrative.explanation = `${choice.summary} ${directive.label} matched the crisis and gave the team a clean execution window.`;
  } else if (result === "partial_success") {
    next.meta.narrative.title = "You held the line.";
    next.meta.narrative.explanation = `${choice.summary} ${directive.label} helped, but the response still paid in trust, time, or stability.`;
  } else {
    next.meta.narrative.title = "The mission slipped.";
    next.meta.narrative.explanation = `${choice.summary} ${directive.label} pushed the response off the ideal track and the crisis outpaced containment.`;
  }

  return next;
}

export function getRandomScenario(excludeId = "") {
  const pool = SCENARIOS.filter((scenario) => scenario.id !== excludeId);
  const source = pool.length > 0 ? pool : SCENARIOS;
  return source[Math.floor(Math.random() * source.length)];
}

export function buildTraitsUsed(selectedAgents, scenario) {
  const traitSet = new Set();
  for (const agentName of selectedAgents) {
    for (const trait of AGENTS[agentName].strengths) {
      if (scenario.required_traits.includes(trait)) traitSet.add(trait);
    }
  }
  return [...traitSet];
}

export function buildRiskLevel(result, effects) {
  if (result === "failure" || effects.health <= -8 || effects.stability <= -8) return "high";
  if (result === "partial_success" || effects.time <= -6 || effects.trust <= -6) return "medium";
  return "low";
}

function baseDamageForScenario(scenario) {
  switch (scenario.id) {
    case "mars-oxygen-collapse":
      return 18;
    case "global-ai-hack":
      return 15;
    case "vanishing-city":
      return 16;
    case "archive-echo":
      return 14;
    case "silent-signal":
    default:
      return 12;
  }
}

function selectedPenalty(agentAName, agentBName, scenario) {
  const selected = [agentAName, agentBName];
  let total = 0;

  for (const trait of scenario.bad_traits) {
    for (const agentName of selected) {
      const agent = AGENTS[agentName];
      if (agent.weaknesses.includes(trait)) total += 9;
      if (trait === "low trust" && agent.weaknesses.includes("trust")) total += 6;
    }
  }

  if (selected.every((agentName) => !AGENTS[agentName].strengths.some((trait) => scenario.required_traits.includes(trait)))) {
    total += 12;
  }

  return total;
}

export function createFallbackEngineOutput(scenario, selectedAgents, currentStats = scenario.stats) {
  const base = simulateScenario({ ...scenario, stats: currentStats }, selectedAgents);
  return {
    conversation: base.conversation,
    final_decision: {
      summary: base.final_decision.summary,
      led_by: base.final_decision.led_by
    },
    traits_used: buildTraitsUsed(selectedAgents, scenario),
    risk_level: buildRiskLevel(base.result, base.effects),
    result: base.result
  };
}

export function mergeEngineOutputWithLocal(scenario, selectedAgents, engineOutput, currentStats = scenario.stats) {
  const local = simulateScenario({ ...scenario, stats: currentStats }, selectedAgents);
  const [agentAName, agentBName] = selectedAgents;
  const synergy = getSynergy(agentAName, agentBName);

  // Rebuild narrative with the engine's result to ensure consistency
  const narrative = buildResultNarrative(agentAName, agentBName, scenario, synergy, engineOutput.result);

  return {
    ...local,
    conversation: engineOutput.conversation,
    final_decision: {
      ...local.final_decision,
      summary: engineOutput.final_decision.summary,
      led_by: engineOutput.final_decision.led_by
    },
    result: engineOutput.result,
    meta: {
      ...local.meta,
      narrative, // Use the rebuilt narrative that matches the engine's result
      traits_used: engineOutput.traits_used,
      risk_level: engineOutput.risk_level
    }
  };
}
