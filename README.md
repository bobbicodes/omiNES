# omiNES

JavaScript NES emulator optimized for simplicity and readability

## Rationale

I found a great article, [Golfing a NES emulator in JS](https://xem.github.io/articles/nes.html) but I'm torn about it because I really can't get behind the whole "golfing" thing. But the author is right about one thing, [JSNES](https://github.com/bfirsh/jsnes) is a nice achievement but the React-based UI is obscenely huge, and the project is flawed in many ways. So I wanted to make something like [jsnes-lite](https://github.com/xem/jsnes-lite) but forked it at a point where he'd gotten rid of the nonsense but before it was made so tiny to be incomprehensible and thus impossible to extend. I also improved the sound by making the triangle channel like the real NES, and created proper ES6 modules.

## Usage

Unfortunately, it only seems to run well on Chrome/Chromium.

Live demo: https://bobbicodes.github.io/omiNES/

Controls are arrow keys, X, C, Esc, Enter. Configure in [main.js](https://github.com/bobbicodes/omiNES/blob/fae05c45f43bbd38deae37a7549e139917fe122f/main.js#L93).

Currently only [mapper 0](https://www.nesdev.org/wiki/NROM) (NROM) is implemented. See [here](https://nesdir.github.io/mapper0.html) for compatible games.

### Running locally (develop)

```
npm i
npm run dev
```

### Production build

```
npm run build
npm run preview
```
