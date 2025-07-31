# Sin Art Universe Phase 3 Specification: Web App Setup with React/Astro

## 1. Objective

Initialize the Sin Art Universe web app in the /apps/web directory of the github.com/N2Studios/sinart monorepo on Windows 10, using React and Astro to create a performant, scalable frontend. This phase sets up the TattooVerse design system, integrates Pinata IPFS for asset storage, and prepares for Friday 2.0 AI, quantum computing, and BCI features, aligning with the master spec's vision for a decentralized metaverse tattoo ecosystem targeting 2M users and $22M revenue by Q2 2027.

## 2. Inputs

### Dependencies
- Phase 1 and Phase 2 completion (github.com/N2Studios/sinart, main, phase-001, phase-002 branches, Nx monorepo, Pinata IPFS, CI/CD pipeline)

### Tools
- Cursor (v0.39+, 2025 version)
- Node.js (v24.4.0)
- Yarn (v1.22.19)
- Nx (v19.0.0)
- Git (v2.50.1)
- Pinata IPFS (v60.0.0, 1GB free tier)
- Docker Desktop (v28.3.2, WSL2 enabled)
- Rust (v1.88.0)

### Environment
- OS: Windows 10 (Build 19045+, 64-bit)
- Hardware: 16GB RAM, 8-core CPU, 500GB SSD
- Network: 10Mbps+
- PowerShell: v7.4.0+

### Accounts
- GitHub: github.com/N2Studios/sinart
- Pinata: API key (PINATA_API_KEY in .env and GitHub Secrets)
- Notion: "Sin Art Phases" table with Phase 1 and 2 entries
- IBM Quantum: Free-tier account (https://quantum-computing.ibm.com)

## 3. Outputs

### Web App
- /apps/web project initialized with Astro (v5.0.0) and React (v19.0.0)
- TattooVerse design system in /packages/ui with Radix UI and Tailwind CSS (v4.0.0)
- Landing page with placeholder components (header, hero, footer)
- Pinata IPFS integration for static assets

### GitHub Repo
- phase-003 branch in github.com/N2Studios/sinart with all changes

### Pinata IPFS
- phase-003.md uploaded, with CID and URL

### Tests
- 8/8 Vitest tests passing (6 from Phase 2 + 2 new)

### Notion
- Phase 3 entry added to "Sin Art Phases" table (Status: Completed)

### Cursor Logs
- Output showing successful setup and commits

## 4. Tasks

### 4.1 Initialize Web App

#### Create Astro Project
- Run: `yarn nx generate @nx/astro:app web --style tailwind --projectName=web --directory=apps/web`
- Select React integration when prompted
- Verify /apps/web contains:
  - astro.config.mjs
  - src/pages/index.astro
  - package.json
  - tsconfig.json

#### Install Dependencies
- Run: `yarn add -W react@19.0.0 react-dom@19.0.0 @astrojs/react@3.0.0 tailwindcss@4.0.0 @radix-ui/react-primitives@2.0.0`
- Run: `yarn add -D -W @nx/astro@19.0.0 @types/react@18.2.0 @types/react-dom@18.2.0`

#### Configure Tailwind CSS
- Create /apps/web/tailwind.config.js with neon colors
- Update /apps/web/astro.config.mjs with React and Tailwind integrations

### 4.2 Create TattooVerse Design System

#### Initialize UI Package
- Run: `yarn nx generate @nx/js:library ui --directory=packages/ui --bundler=none`
- Verify /packages/ui contains:
  - src/index.ts
  - package.json
  - tsconfig.json

#### Add Radix UI Components
- Install: `yarn add -W @radix-ui/react-button@1.0.0 @radix-ui/react-typography@1.0.0`
- Create /packages/ui/src/components/Button.tsx with neon styling
- Create /packages/ui/src/index.ts exports

#### Link UI Package
- Update /apps/web/package.json with workspace dependency

### 4.3 Create Landing Page

#### Update Index Page
- Edit /apps/web/src/pages/index.astro with Sin Art Universe branding
- Include header, hero section, and footer with neon styling
- Test locally at http://localhost:4321

### 4.4 Integrate Pinata IPFS

#### Store Assets on IPFS
- Create /apps/web/public/logo.png (placeholder image)
- Update scripts/publish-to-ipfs.js to include assets
- Run `yarn ipfs:publish`, expect CIDs for phase-003.md and logo.png

### 4.5 Add Web App Tests

#### Create Tests
- Create /apps/web/tests/index.test.tsx with component tests
- Install Testing Library: `yarn add -D -W @testing-library/react@15.0.0 @testing-library/jest-dom@6.0.0`
- Update Vitest Config for React testing
- Run `yarn test`, expect 8/8 tests passing

### 4.6 Update Notion

#### Add Phase 3 Entry
- In "Sin Art Phases" table, add:
  - Phase ID: 003
  - Title: "Web App Setup with React/Astro"
  - Status: Not Started
  - Spec Link: docs/specs/phase-003.md
  - Dependencies: Phase 001, Phase 002

#### Update Status
- Set Status to "In Progress" during implementation, "Completed" post-confirmation

### 4.7 Commit Changes

- Create C:\sin-art-universe\docs\specs\phase-003.md (copy this spec's content)
- Run:
  ```bash
  git checkout -b phase-003
  git add .
  git commit -m "Phase 3: Web app setup with React/Astro and TattooVerse design system"
  git push origin phase-003
  ```

## 5. Acceptance Criteria

### Web App
- /apps/web runs at http://localhost:4321 with landing page (header, hero, footer) styled with neon colors

### TattooVerse Design System
- /packages/ui contains Button component, used in landing page

### Pinata IPFS
- phase-003.md and logo.png uploaded, with CIDs and URLs accessible

### Tests
- 8/8 Vitest tests pass (yarn test)

### GitHub Actions
- All jobs (lint, test, build, ipfs, quantum-bci-check) pass in phase-003 branch

### Notion
- Phase 3 entry exists, Status set to "Completed" post-confirmation

### Files
- New: /apps/web, /packages/ui/src/components/Button.tsx, /apps/web/tests/index.test.tsx, docs/specs/phase-003.md
- Updated: scripts/publish-to-ipfs.js, vitest.config.ts, package.json

### Cursor
- Logs show no errors, web app setup successful

## 6. Constraints

- OS: Windows 10 (Build 19045+, 64-bit)
- Node Version: v24.4.0
- Yarn: v1.22.19
- Pinata: 1GB free tier, 100 requests/min
- GitHub: github.com/N2Studios/sinart, proprietary license
- Docker: WSL2 enabled if Hyper-V unavailable
- Rust: v1.88.0
- Performance: Setup completes in <15min, web app loads in <2s
- Security: PINATA_API_KEY in .env and GitHub Secrets, not committed

## 7. References

- Astro: https://astro.build
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Radix UI: https://www.radix-ui.com
- Pinata IPFS: https://docs.pinata.cloud
- Nx: https://nx.dev
- Vitest: https://vitest.dev

## 8. Questions Addressed

### Scope
- Initializes web app with React/Astro, TattooVerse design system, and IPFS, preparing for Friday 2.0 AI, quantum, and BCI integration

### Cursor Commands
- Explicit (yarn nx generate, yarn nx serve), assuming Cursor 2025 supports Nx/Astro/React

### Organization
- Notion: Phase 3 entry in "Sin Art Phases"
- GitHub: phase-003 branch in N2Studios/sinart

### Additional Details
- Team: 2 founders, Cursor, hiring 15 engineers by Q2 2026
- Budget: $5M seed ($2M dev, $1.25M marketing, $1M AI training, $500K medical, $250K cultural). Phase 3: $3K (GitHub Pro, Pinata, hosting)
- Timeline: 3 days (due Aug 7, 2025, 11:59 PM PDT)
- Pinata: Uses existing PINATA_API_KEY

### Phase 2 Feedback
- Confirmed complete, pending GitHub push, Secrets, Notion update

## 9. Error Handling

### Astro Setup Failure
- Run `yarn nx reset`, retry `yarn nx generate`

### Pinata IPFS Error
- Verify PINATA_API_KEY, check firewall (port 443), retry `yarn ipfs:publish`

### Test Failure
- Debug index.test.tsx, ensure @testing-library/react and jsdom setup

### GitHub Actions Failure
- Check Actions tab, verify Secrets and versions

### Cursor Crash
- Restart Cursor, clear cache (`cursor clear-cache`), ensure 16GB RAM free

## 10. Next Steps

### Finalize Phase 2
- Push phase-002, add GitHub Secrets, update Notion, share outputs

### Implement Phase 3
- Execute tasks in Cursor, starting with `yarn nx generate`

### Confirm
Share:
- GitHub: phase-003 commit hash
- Pinata IPFS: CIDs and URLs for phase-003.md and logo.png
- Cursor: Logs (no errors)
- Notion: Screenshot of Phase 3 entry (Status: Completed)
- GitHub Actions: Screenshot of passing pipeline
- Web App: Screenshot of http://localhost:4321

### Feedback
- Log in GitHub Issue (Phase 003 Feedback) or Notion

### Phase 4
- Spec for Friday 2.0 AI integration, delivered post-confirmation

---

**Status**: Completed  
**Phase**: 003  
**Date**: August 7, 2025  
**Next**: Phase 004 - Friday 2.0 AI Integration 