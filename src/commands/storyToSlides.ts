import { loadJsonFile, writeJsonFile } from "../lib/json.js";
import { getArgValue, repoPath } from "../lib/paths.js";

type ResearchOutput = {
  topic: string;
  audience: string;
  objective: string;
  interpretations?: Array<{ statement: string }>;
  facts: Array<{ statement: string }>;
};

export async function storyToSlidesCommand(args: string[]): Promise<void> {
  const researchPath = getArgValue(args, "--research");
  if (!researchPath) {
    throw new Error("Missing required argument: --research <path>");
  }

  const outStoryline = getArgValue(args, "--out-storyline") ?? repoPath("story", "outputs", "storyline.generated.json");
  const outSlides = getArgValue(args, "--out-slides") ?? repoPath("story", "outputs", "slides.generated.json");

  const research = await loadJsonFile<ResearchOutput>(researchPath);
  const primaryStatement = research.interpretations?.[0]?.statement ?? research.facts[0]?.statement ?? "Replace with primary claim";
  const firstFact = research.facts[0]?.statement ?? "Replace with factual support";
  const secondFact = research.facts[1]?.statement ?? "Clarify boundaries and governance requirements";

  const storyline = {
    deck_title: research.topic,
    audience: research.audience,
    narrative: {
      core_question: research.objective,
      chapters: [
        {
          id: "intro",
          title: "Deck Logic",
          question: "How should the discussion be staged for executive review?",
          slides: [
            {
              id: "agenda",
              claim: "The discussion must move from strategic shift to enterprise landing discipline.",
              role: "narrative staging",
              page_type_hint: "narrative_map"
            }
          ]
        },
        {
          id: "ch1",
          title: "Strategic Framing",
          question: research.objective,
          slides: [
            {
              id: "ch1_s01",
              claim: primaryStatement,
              role: "opening strategic claim",
              page_type_hint: "bottleneck_shift"
            }
          ]
        },
        {
          id: "summary",
          title: "Executive Summary",
          question: "What is the decision implication?",
          slides: [
            {
              id: "summary_s01",
              claim: "Enterprises should treat agents as a control-first execution layer, not unchecked autonomy.",
              role: "chapter summary",
              page_type_hint: "chapter_summary_signal"
            }
          ]
        }
      ]
    }
  };

  const slides = {
    deck_title: research.topic,
    theme_hint: "dark-enterprise-tech",
    slides: [
      {
        id: "cover",
        chapter: "intro",
        page_type_hint: "cover_orbit",
        title: research.topic,
        subtitle: research.objective,
        claim: primaryStatement,
        blocks: {
          story_points: ["Why now", "What changes", "How to land"]
        },
        notes: {
          audience_tone: "executive",
          visual_anchor: "orbit_core",
          must_emphasize: ["decision relevance", "control-first"]
        },
        layout_hints: {
          weight_center: "right-middle",
          density_level: "medium",
          avoid_symmetry: true
        }
      },
      {
        id: "agenda",
        chapter: "intro",
        page_type_hint: "narrative_map",
        title: "Deck Logic",
        subtitle: "Frame the shift, define the landing path, then make the control decision explicit",
        claim: "The discussion must move from strategic shift to enterprise landing discipline.",
        blocks: {
          dominant_chapter: "Why action-oriented agents matter now",
          supporting_chapters: [
            "How enterprise landing differs from consumer automation",
            "Why control-first architecture is the adoption boundary"
          ],
          decision_cue: "Strategic interest is real, but landing quality depends on controllability."
        },
        layout_hints: {
          weight_center: "center-middle",
          density_level: "medium",
          avoid_symmetry: true
        }
      },
      {
        id: "ch1_s01",
        chapter: "ch1",
        page_type_hint: "bottleneck_shift",
        title: "Strategic Framing",
        claim: primaryStatement,
        blocks: {
          primary_statement: primaryStatement,
          support_points: [firstFact, secondFact, "Controlled execution, not generic conversation quality, is the decision lever."]
        },
        layout_hints: {
          weight_center: "left-middle",
          density_level: "medium",
          avoid_symmetry: true
        }
      },
      {
        id: "summary_s01",
        chapter: "summary",
        page_type_hint: "chapter_summary_signal",
        title: "Executive Summary",
        claim: "Enterprises should treat agents as a control-first execution layer, not unchecked autonomy.",
        blocks: {
          summary: "Agents become valuable when they move from response quality to controlled execution quality.",
          implications: [
            "Research and story must stay structured for repeatable revision.",
            "Style should reinforce decision clarity, not decorate generic templates.",
            "Editable delivery is mandatory for enterprise review loops."
          ],
          decision_cue: "Build a narrow, editable, control-first MVP before expanding style families."
        },
        layout_hints: {
          weight_center: "left-middle",
          density_level: "medium",
          avoid_symmetry: true
        }
      }
    ]
  };

  await writeJsonFile(outStoryline, storyline);
  await writeJsonFile(outSlides, slides);
  console.log(`Wrote scaffold storyline to ${outStoryline}`);
  console.log(`Wrote scaffold slides to ${outSlides}`);
}
