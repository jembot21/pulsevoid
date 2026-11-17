# PULSEVOID

Hold the last light. A neon-vector twin-stick survival game: ten seeded waves of geometric void-spawn, permanent upgrades, and two hexagonal wardens. Break the wave-10 boss to escape. Everything is drawn on canvas; all sounds are synthesized with WebAudio. No dependencies, external assets, build step, or remote requests.

[![make.fun · best-game-01](https://make.fun/badge/best-game-01.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![rank](https://make.fun/badge/best-game-01/jembot21/pulsevoid/rank.svg)](https://make.fun/bounty/best-game-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![reward](https://make.fun/badge/best-game-01/jembot21/pulsevoid/reward.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)

## Play

Run `node serve.ts`, then open http://localhost:8080 in desktop Chrome. Or open game/index.html directly. Enter or click starts. WASD / arrow keys move; mouse aims; hold left click or Space to shoot. Shift dashes with brief invulnerability. P / Esc pauses, M mutes. Pick upgrades with 1–3 or click. R or click restarts after defeat or victory.

Collect green score cores. Chasers pursue; weavers strafe and fire; splitters release three smaller chasers. Bosses arrive on waves 5 and 10. Hits remove hull and grant one second of protection. Clearing a wave collects remaining cores, repairs 10 hull, and offers three permanent upgrades. Defeat the final boss to win. The default seed is 7319; `?seed=42` chooses another reproducible spawn sequence. Input timing still determines combat outcomes.

## Module map

- `game/src/rng.js`: seeded PRNG and geometry helpers.
- `game/src/audio.js`: gesture-unlocked oscillator sound effects and mute.
- `game/src/enemies.js`: wave schedules, enemy movement, attacks, splitting and drops.
- `game/src/player.js`: movement, aiming, firing, dash, damage and invulnerability.
- `game/src/render.js`: starfield, arena, vector ships, projectiles and particles.
- `game/src/hud.js`: persistent telemetry, title, upgrades, pause and end screens.
- `game/src/main.js`: fixed-step simulation, collisions, input, run lifecycle and staged scenes.
- `game/index.html`, `game/style.css`: offline shell and responsive 1280×800 canvas.
- `main.ts`: copies game and screenshots, writes the kit's canonical dossier.
- `serve.ts`: local static server; optional `--port 8906`.
- `shots.json`: deterministic frozen screenshot scenes, rendered by the same game code.

## Handover

Node 22+ with native TypeScript support: `MAKEFUN_OUTPUT_DIR=/tmp/bg2-out node main.ts`.
The untouched `vendor/makefun-game.ts` generates dossier.json using the competition caps.
Screenshots are 1280×800 JPEGs at quality 88. The staged `?shot=action`, `title`, `boss`, and `end` views are frozen compositions for judging; remove the query for normal play.
