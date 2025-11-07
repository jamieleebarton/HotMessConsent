# HotMessConsent (HotMessSign)

Ridiculously official, totally-not-legally-binding e‑signature parody for iOS and Android. Generate joke “Consent/NDA” agreements, sign on screen, export an official‑looking PDF with stamps, watermark, and a parody certificate page (with QR that opens an in‑app Verify screen). Flip to Meme Mode to auto-capture a shareable image with punchlines and taglines.

Key vibes: DocuSign parody meets chaotic meme factory. For laughs only — nothing here is legal advice or legally binding.

Features
- Cross‑platform (Expo/React Native): iOS + Android
- Scenarios + randomizer: First Date, After 2 Drinks, Sleepover, Netflix & Chill; “Spin the Wheel of Clauses”
- Roast personalization: name-based jokey clauses for instant-share punchlines
- Typed names + initials: faux official inputs shown under signatures
- “Adopt signature” step: pretend-serious flow before drawing
- Sign here stickers: bright yellow “SIGN HERE ▶” labels
- PDF export + share: fake stamp, watermark, and a Certificate of Completion (parody)
- QR on certificate: opens in‑app Verify screen via deep link
- Meme Mode: theme flip, “Make it a Meme” capture + share, caption auto-copied
- Deluxe Pack (mock): future upsell hooks for celebrity/extra clause packs

Getting Started
1) Prereqs
- Node 18+, npm
- iOS: Xcode + Simulator; Android: Android Studio + Emulator

2) Install
- npm install

3) Run (Metro + device)
- Start: npx expo start
- iOS (sim): npm run ios (or press i)
- Android (emulator): npm run android (or press a)

If Expo Go can’t load native modules (e.g., expo-print), use a dev client:
- npx expo run:ios or npx expo run:android
- Then: npx expo start --dev-client

Deep Linking (Verify QR)
- Scheme: hotmess://
- Verify path: hotmess://verify?envelope=HM-XXXX
- Test on iOS sim: npx uri-scheme open "hotmess://verify?envelope=HM-TEST" --ios
- Test on Android emu: npx uri-scheme open "hotmess://verify?envelope=HM-TEST" --android

How To Use (Happy Path)
- Pick a scenario, toggle “Include Deluxe,” tap “Spin the Wheel of Clauses”
- Enter Names + Initials for Party A/B
- Tap “Adopt & Continue,” then draw signatures (Save each)
- Tap “Review & Finish” → “Finish & Generate PDF” to share
- Optional: switch to Meme Mode → “Make it a Meme” to share an image

Meme Mode + Instant Share
- Switch modes at the bottom of Agreement screen
- “Make it a Meme” captures the doc view and opens the share sheet
- Caption pre-copied to clipboard (paste into TikTok/Reels/IG)

File Map (Where Things Live)
- App entry + linking: App.tsx
- Scenario/Agreement UI: src/screens/ScenariosScreen.tsx, src/screens/AgreementScreen.tsx
- Verify screen (parody): src/screens/VerifyScreen.tsx
- Clauses + roasts + taglines: src/data/clauses.ts
- Signature pad: src/components/SignaturePad.tsx
- PDF + certificate + QR: src/utils/pdf.ts
- Expo config (scheme): app.json

Notes & Limitations
- Legal: This is comedy. Documents are explicitly “Totally Not Legally Binding.”
- QR generation: Uses a public QR API for convenience; requires network. We can switch to an offline generator (e.g., react-native-qrcode-svg) later.
- Signature capture: react-native-signature-canvas (WebView) — works best with a dev client.

Viral Hooks (Built‑in)
- Roast personalization with names
- Random punchlines for instant screenshots
- Meme Mode with watermark and share caption
- Fake‑serious DocuSign aesthetic for contrast

Roadmap Ideas
- In‑app purchases: Deluxe/Couples/AI Roast Mode
- AI roast clause generator (zodiac, name, vibe)
- Dedicated Meme Templates screen (story sizes, stickers)
- Offline QR generation and short link fallback
- Real deep link verification page (web + app)

License
- No license specified yet. All content is intended for humor. Do not use for legal purposes.
