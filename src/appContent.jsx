import { CHARACTER_MEDIA } from "./media.js";

export const roster = Object.entries(CHARACTER_MEDIA).map(([name, media]) => ({ name, ...media }));

export const fallbackAgents = ["Nova Sage", "Lady Astra"];

export const INTRO_STORYLINE =
  "Year 2098. Climate collapse, rogue systems, and resource wars have pushed civilization to the edge. In the final hour, uploaded minds from The Archive awaken to debate, decide, and determine who survives the last world.";

export const ONBOARDING_PROMPT =
  "Operator, identify yourself. The Archive will address you directly. Enter your name and your ElevenLabs key to continue the crisis response.";

export function buildGreeting(name) {
  return `Operator ${name}, your link to the Archive is now established. Global crisis theaters are active. Choose carefully. The minds you deploy will decide who survives this hour.`;
}

export function buildResultNarration(simulation, scenarioTitle) {
  const status =
    simulation.result === "success"
      ? "Mission success."
      : simulation.result === "partial_success"
        ? "Mission compromised."
        : "Mission failed.";

  return `${status} ${scenarioTitle}. ${simulation.meta.narrative.explanation}`;
}

export function getRosterEntry(name) {
  return roster.find((entry) => entry.name === name);
}
