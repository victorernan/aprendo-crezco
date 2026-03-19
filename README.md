# Aprendo y Crezco 📚

A web-based educational app inspired by the Kumon method, designed for 7-year-old girls. Progress is saved to the cloud and students must demonstrate mastery before advancing to the next level.

🌐 **Live app:** https://aprenderycrecer-58788.web.app

---

## What is it?

A mastery-based learning app where students answer 20 questions per session. They cannot advance to the next level until they achieve 80% accuracy. Failed questions are automatically re-queued at the end of each session until answered correctly.

## Subjects

**Mathematics** — 16 levels:
- Numbers up to 100 and place value
- Addition and subtraction (with and without carrying)
- Multiplication tables (2, 5, 10)
- Basic division
- Measurements (length, weight, time, money)
- Word problems
- Basic geometry
- Sequences and patterns

**Reading** — 10 levels (Spanish):
- Vowels and syllables
- Word recognition
- Text comprehension
- Synonyms and antonyms
- Vocabulary

## Features

- 🔐 Google login — progress saved to the cloud (Firebase)
- 🔁 Failed questions repeat until mastered
- 📊 Accuracy and time tracked per session
- 🔥 Daily streak counter
- ⏱️ Session timer
- 💾 Auto-save every 30 seconds
- 📱 Works on mobile, tablet and desktop

## Deployment

```bash
firebase deploy --only hosting
```

Changes pushed to the `main` branch are automatically deployed via GitHub Actions.

## Progression Rules

| Condition | Result |
|---|---|
| Accuracy ≥ 80% | Advance to next level |
| Accuracy < 80% | Repeat current level |
| Error rate > 20% | Level blocked |
| Failed question | Re-queued at end of session |