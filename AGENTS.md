# Repository Guidelines

## Project Structure & Module Organization
Expo boots from `App.tsx`, which registers the navigation stack in `src/screens` (Scenarios, Agreement, GenerateOwn, Verify) and consumes deep-link config from `app.json`. Domain data stays close to consumers: `src/data/clauses.ts` keeps scenario copy, `src/utils/pdf.ts` handles PDF/QR logic, and shared native wrappers such as `src/components/SignaturePad.tsx` isolate WebView modules. Use `app/src/main/java/...` only for native tweaks when shipping a dev client, and run `start-app.sh` if you hit the macOS file-descriptor limit.

## Build, Test, and Development Commands
- `npm install` – install JavaScript dependencies defined in `package.json`.
- `npm run start` (alias `npx expo start`) – launch Metro + Expo DevTools; press `i`, `a`, or `w` for the respective targets.
- `npm run ios` / `npm run android` – build & install a dev client so modules like `expo-print` and `expo-file-system` work on device/simulator.
- `npx expo start --dev-client` – pair with the dev client when Expo Go lacks required native modules.

## Coding Style & Naming Conventions
Use TypeScript `.tsx` files with React function components and hooks, mirroring `src/screens/ScenariosScreen.tsx`. Stick to 2-space indentation, single quotes, and `const` by default. Screens/components stay PascalCase, hooks or utilities camelCase, and enums/constants uppercase. Keep styles in-file via `StyleSheet.create` until multiple screens truly share them. Run `npx expo lint` (or `npx eslint src --ext .ts,.tsx` once configured) plus your formatter before committing.

## Testing Guidelines
Automated tests are not yet committed, so add coverage as you touch modules. Use Jest with `jest-expo` and `@testing-library/react-native`, keeping specs in `src/__tests__/FeatureName.test.tsx`. For utilities (`src/utils/pdf.ts`, future helpers) mock `expo-print`, `expo-file-system`, and `expo-sharing` so runs stay deterministic. When UI flows change, pair automated checks with a brief `npm run ios` or `npm run android` smoke test.

## Commit & Pull Request Guidelines
History already follows Conventional Commits (`feat: …`, `docs: …`), so stick to `type(scope?): summary` in present tense (e.g., `feat(verify): add QR toast`). Pull requests should add a brief problem/solution recap, link the tracking issue, call out risks or rollbacks, and attach platform evidence when UI changes (screenshots or short captures). Run `npm run start` plus one platform target locally before asking for review.

## Security & Configuration Tips
Deep-link and branding config lives in `app.json` (`hotmess://verify`) and must match references in `src/utils/pdf.ts` whenever schemes change. `createAndShareAgreementPDF` writes to `FileSystem.cacheDirectory`, so clean up temp PDFs if you script multiple runs. Never commit real agreements or PII—keep parody copy in `src/data/clauses.ts` and strip debug names before pushing.
