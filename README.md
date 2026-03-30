# EQ Multiclass Theorycrafting

Interactive guide for EverQuest classic multiclass character builds — pick a race + 3 classes and see how they synergize.

Inspired by The Heroes' Journey EMU (2024–2025, RIP), which let players combine 3 EQ classes on a single character with 560 possible combinations.

**[Live Site →](https://dustywusty.github.io/eq-theory-crafting/)**

## Features

- **8 ranked multiclass builds** with detailed synergy breakdowns, ratings, and playstyle guides
- **14 classic EQ class reference** with abilities, strengths, weaknesses
- **13 race restriction matrix** showing which races can play which classes
- Race recommendations for multiclass builds

## Knowledge Layer

- Structured, source-tagged research now lives in `packages/shared/knowledge.ts` and `packages/shared/knowledge/`
- P99 spell data now lives in `packages/shared/spells.ts` and `packages/shared/spells.generated.ts`
- P99 zone data now lives in `packages/shared/zones.ts` and `packages/shared/zones.generated.ts`
- Use ruleset-aware facts instead of one giant markdown encyclopedia blob
- Working-memory summaries for agents live in `.context/eq-knowledge-summary.md` and `.context/eq-sourcing-rules.md`
- AA facts should stay tagged to AA-enabled rulesets like `luclin`, `eql`, or custom multiclass rulesets rather than original launch-era classic

## Local Development

```bash
npm install
npm run dev
```

## Built With

React + Vite, deployed on GitHub Pages.
