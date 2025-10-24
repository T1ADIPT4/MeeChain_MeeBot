## Quick orientation

This repo implements the MeeChain Quest System: a TypeScript React + Node codebase that verifies quests, mints badges on a primary blockchain, and automatically falls back to a secondary chain if minting fails. Focus files:

- Orchestration: `src/QuestManager.ts`
- Verification logic: `src/verifiers/questVerifier.ts`, `src/verifiers/TTSQuestVerifier.ts`
- Minting & fallback: `src/minting/badgeMinter.ts`
- Registry / network config: `config/deploy-registry.json`, `src/config/registryLoader.ts`
- Logging: `src/utils/logger.ts`
- Dev UI entry: `dev-app/vite.config.ts`, `dev-app/src/main.tsx`, `pages/*`, `components/*`

## How to run & test (exact commands)

- Install deps: `npm install`
- Run dev UI: `npm run dev` (Vite using `dev-app/vite.config.ts`, opens at port 5173)
- Build TypeScript: `npm run build` (uses `tsc`, outDir `./dist`)
- Run tests: `npm test` (Jest)
- Run preview build: `npm run preview`

Deployment & registry scripts (no top-level npm scripts are guaranteed for these; use ts-node or the compiled JS):

- Simulate deploy: `npx ts-node scripts/deploy.ts Badge --network polygon` or run the compiled JS `node scripts/deploy.js Badge --network polygon`
- Validate registry: `npx ts-node scripts/validateRegistry.ts` or `node scripts/validateRegistry.js`
- Update registry programmatically: `npx ts-node scripts/updateRegistry.ts --help`

Examples to copy/paste:

`npx ts-node scripts/deploy.ts Quest --network ethereum --simulate`

## Project-specific patterns and conventions (do this, not generic advice)

- Fallback-first resilience: primary minting happens from `badgeMinter.mintBadge(...)`; on exception `QuestManager` calls `fallbackMintBadge(...)` and sets `fallback: true` on the returned result. See `src/QuestManager.ts` for the exact control flow and event names (`badge-mint-failed`, `badge-fallback-minted`).
- Event-driven debugging: code instruments every step with `logEvent(eventType, context, level?)` in `src/utils/logger.ts`. Use these event names in tests and UI (`badge-minted`, `badge-mint-failed`, `quest-verification-start`, etc.).
- Config-as-file: contract addresses and chain metadata are read from `config/deploy-registry.json` via `src/config/registryLoader.ts`. Scripts update this JSON and its `lastUpdated` timestamp. Treat this file as the single source of truth for chain addresses.
- Mock vs production implementations: many modules have simulated behavior (e.g., in `src/minting/badgeMinter.ts` and `src/verifiers/questVerifier.ts`). Real blockchain integration examples are documented in `INTEGRATION.md` under `minting/web3BadgeMinter.ts`. Replace mocks with those implementations when wiring to live services.
- UI aliasing: Vite aliases map `@pages`, `@components`, `@hooks`, `@utils` to repo folders (see `dev-app/vite.config.ts`). Follow those aliases when adding front-end imports.

## Integration points / external dependencies

- Web3: production minting uses ethers / RPC providers (examples in `INTEGRATION.md`).
- Firebase: optional DB integration shown in `INTEGRATION.md` (Firestore examples). The verifier has mock in-memory stores—switch to DB-backed verifiers when integrating.
- TTS: TTS quests are a specialized verifier `src/verifiers/TTSQuestVerifier.ts` and UI components use MeeBot sprite + TTS hooks (see `components/MeeBot.tsx`).

## Files & tests to inspect first when changing flow

- `src/QuestManager.ts` — main success/fallback flow and event names
- `src/minting/badgeMinter.ts` — primary / fallback mint interfaces and test helpers (setPrimaryMintingStatus)
- `src/verifiers/questVerifier.ts` — how progress is stored/queried (in-memory by default)
- `src/utils/logger.ts` — log shape and helper getters used by UI tests
- `config/deploy-registry.json` — sample networks: `ethereum`, `polygon`, `arbitrum`
- `tests/` — concrete examples of expected behaviour (see `tests/ttsQuest.test.ts`, `tests/deployRegistry.test.ts`)

## Safety & repo conventions

- Secrets: the repo contains OAuth JSON files (for example `meechainmeebot-v1.apps.googleusercontent.com.json`). Do NOT print, check in, or modify secrets in PRs. If you must create test credentials, add them to `.env` and do not commit.
- TypeScript-first: prefer edits that compile (`npm run build`) and add/update tests under `tests/` to document behavior.
- Minimal diffs: when replacing mocks with live integrations, keep the same exported function signatures so orchestration (`QuestManager`) and tests remain unchanged.

## Minimal contract for a code change

- Inputs: maintain function signatures in `src/QuestManager.ts` and `src/minting/*` (userId, questId, optional network)
- Outputs: return the same result shape: `{ success: boolean, reason?: string, tx?: BadgeTransaction, fallback?: boolean }`
- Error modes: emit `logEvent(...)` with level `warn`/`error` and rethrow only when appropriate; callers rely on boolean success and `reason` strings.

---

If anything above is unclear or you want me to add short examples for a specific file (e.g., convert `badgeMinter` to ethers usage), tell me which file and I will update this guidance.
