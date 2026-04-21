import { AGENTS, createFallbackEngineOutput } from "./simulator.js";
import { normalizeAgentName } from "./voice.js";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "openai/gpt-oss-20b";

function buildAgentSummary(agentName) {
  const agent = AGENTS[agentName];
  return [
    `${agentName}`,
    `Role: ${agent.role}`,
    `Style: ${agent.style}`,
    `Strengths: ${agent.strengths.join(", ")}`,
    `Weaknesses: ${agent.weaknesses.join(", ")}`
  ].join("\n");
}

export function buildSimulationPrompt({ selectedAgents, scenario, currentStats }) {
  return `
You are the simulation core for Archive Protocol: Voices of the Last World.

Generate only structured JSON matching the requested schema.

World year: 2098
Scenario title: ${scenario.scenario_title}
Scenario description: ${scenario.scenario_description}
Required traits: ${scenario.required_traits.join(", ")}
Bad traits: ${scenario.bad_traits.join(", ")}

Selected agents:
${selectedAgents.map(buildAgentSummary).join("\n\n")}

Current stats:
health: ${currentStats.health}
energy: ${currentStats.energy}
trust: ${currentStats.trust}
stability: ${currentStats.stability}
time: ${currentStats.time}

Rules:
- Conversation must be 4 to 6 lines.
- Each line should sound distinct to the speaker.
- The two agents must disagree at least once.
- The discussion should feel like realistic crisis reasoning, not game flavor text.
- Keep the lines concrete, scenario-aware, and pressure-driven.
- The final decision is autonomous.
- Determine which agent led the final decision.
- Respect the game logic: finalScore = traitMatch + synergy - penalties.
- Outcome thresholds: score >= 70 => success, score >= 40 => partial_success, otherwise failure.
- traits_used should include relevant strengths actually used in the solution.
- risk_level must be one of low, medium, or high.
- result must be one of success, partial_success, or failure.
- CRITICAL: Use the EXACT agent names in the speaker field. Valid names are: ${selectedAgents.map(name => `"${name}"`).join(", ")}. Do NOT use variations, abbreviations, or different capitalization.
`.trim();
}

function buildResponseSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["conversation", "final_decision", "traits_used", "risk_level", "result"],
    properties: {
      conversation: {
        type: "array",
        minItems: 4,
        maxItems: 6,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["speaker", "text"],
          properties: {
            speaker: { type: "string" },
            text: { type: "string" }
          }
        }
      },
      final_decision: {
        type: "object",
        additionalProperties: false,
        required: ["summary", "led_by"],
        properties: {
          summary: { type: "string" },
          led_by: { type: "string" }
        }
      },
      traits_used: {
        type: "array",
        items: { type: "string" }
      },
      risk_level: {
        type: "string",
        enum: ["low", "medium", "high"]
      },
      result: {
        type: "string",
        enum: ["success", "partial_success", "failure"]
      }
    }
  };
}

export async function runSimulationEngine({ selectedAgents, scenario, currentStats }) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    return {
      engine: "local",
      output: createFallbackEngineOutput(scenario, selectedAgents, currentStats)
    };
  }

  const response = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: "You generate structured simulation outputs for a multi-agent strategy game."
        },
        {
          role: "user",
          content: buildSimulationPrompt({ selectedAgents, scenario, currentStats })
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "archive_protocol_simulation",
          strict: true,
          schema: buildResponseSchema()
        }
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Groq returned no structured content.");
  }

  const parsedOutput = JSON.parse(content);

  // Normalize speaker names in conversation to ensure they match known agent names
  if (parsedOutput.conversation) {
    parsedOutput.conversation = parsedOutput.conversation.map(line => ({
      ...line,
      speaker: normalizeAgentName(line.speaker)
    }));
  }

  // Normalize the led_by field in final_decision
  if (parsedOutput.final_decision?.led_by) {
    parsedOutput.final_decision.led_by = normalizeAgentName(parsedOutput.final_decision.led_by);
  }

  return {
    engine: "groq",
    output: parsedOutput
  };
}
