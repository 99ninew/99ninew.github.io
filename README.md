# Jiani Wang's academic homepage

A local static homepage based on the official HTML version of [Minimal Light](https://github.com/yaoyao-liu/minimal-light), upstream commit `dd114c3fef2d97adc1c6b6d46901e0d96ab83a7c`.

## Preview and edit

Open `index.html` in a modern browser. No build, package installation, or Jekyll server is required. Fonts and images are local; external paper and social links need an internet connection. This update has not been published.

- `index.html`: About Me, Research Interests, News, Publications, Selected Projects, Beyond Research, and contact links.
- `assets/css/style.css` and `publications.css`: original theme styles.
- `assets/css/content.css`: typography, profile, publication, and project layout.
- `assets/css/motion.css`: motion recipes and reading-tool styles.
- `assets/js/name-toggle.js`: English/Chinese name switching.
- `assets/js/reading.js`: current-section navigation and figure dialogs.
- `assets/fonts/`: local Source Serif 4 and the Source Han Serif subset for 王佳妮, plus theme fonts and their licenses.
- `assets/img/`: profile photo and publication figures.
- `assets/files/`: local project reports, including the cleaned Nanochat-MoE PDF opened by its Report link.

Research descriptions, author order, venue labels, and outgoing links are edited directly in the HTML. The figure dialog reads each publication's existing title, summary, image, and links so they only need updating in one place.

The desktop layout uses a centered grid up to 1080 px wide with a sticky profile column. The type scale separates the English name (28 px), section headings (24 px), paper and project titles (18 px), body text (16 px), and secondary metadata (12–15 px). Below 960 px the profile stacks above the content; narrow screens use 15 px body text and 22 px section headings. News dates align in their own column on wider screens and stack above each item on phones.

## Publish with GitHub Pages

Create a public repository named `99ninew.github.io` under the `99ninew` account. Upload `index.html`, `assets/`, `.nojekyll`, `.gitignore`, and `LICENSE` to its root. Keep the `assets/` directory structure intact. On macOS, press Command + Shift + . in Finder to show the dotfiles.

In the repository, choose **Settings → Pages → Deploy from a branch → main → /(root) → Save**. GitHub will publish the homepage at `https://99ninew.github.io/`. The empty `.nojekyll` file tells Pages to serve these static files directly. Do not upload the local `output/` directory; it contains working previews and exports. Future changes must also be uploaded or pushed to the repository's `main` branch to update the live site.

Official instructions: [GitHub Pages quickstart](https://docs.github.com/en/pages/quickstart) and [publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Reading interactions

- The EN / 中 control below the name selects its language. Names cross-blur in place using Text swap soft; their fonts and the heading's centered width stay fixed. Reduced motion makes the change immediate.
- The sidebar indicates the section currently being read. On small screens its six links form a fixed bottom navigation bar with two rows and reserved space at the end of the page.
- Click a publication figure to enlarge it in a native dialog. Escape, the close button, or clicking the backdrop closes it and restores focus to the original preview. Tab and Shift+Tab cycle through dialog controls. Original images remain available through a full-size link.
- Reduced-motion preferences disable animated navigation, hover movement, and dialog transitions. Without JavaScript, section links, publication links, and full-size figure links still work.

## Motion sources and checks

The sliding navigation indicator and modal transitions use the free [Transitions.dev skill](https://github.com/Jakubantalik/transitions.dev/tree/main/skills/transitions-dev) recipes: [Tabs sliding](https://github.com/Jakubantalik/transitions.dev/blob/main/skills/transitions-dev/16-tabs-sliding.md) and [Modal open / close](https://github.com/Jakubantalik/transitions.dev/blob/main/skills/transitions-dev/06-modal.md). Original recipe CSS is kept at the top of `motion.css`; adaptations follow it. Navigation retains link semantics and uses `aria-current`, rather than representing document sections as ARIA tabs. Timing comes from shared CSS variables: 250 ms for navigation/modal opening, 150 ms for closing and small feedback.

The name uses [Text swap soft](https://github.com/Jakubantalik/transitions.dev/blob/main/skills/transitions-dev/34-text-swap-soft.md), with a 200 ms cross-blur and a fixed heading width to preserve centering. Each overlapping span keeps its own language and font. The outgoing text is hidden from assistive technology and the live region announces the settled name. The language selector reuses the 250 ms sliding-indicator timing. Name-specific keyboard, rapid-click, reduced-motion, font, and mobile checks are recorded in `output/name-switch-checks.json`.

The official `transitions-agent@0.11.2` scanner was run locally against the page and its CSS/JS before and after the changes. It reports no findings in the new reading/motion files. Its remaining findings concern legacy theme rules, including selectors unused on this page; the overall score is not a measure of this page's accessibility.

Browser checks covered 320–1440 px widths, section navigation, publication anchors, figure links, focus restoration, keyboard dismissal, dark mode, reduced motion, and JavaScript-disabled fallbacks. Preview images and the check summary are in `output/reading-*`.

## License

The upstream theme is CC0-1.0; see `LICENSE`. Font licenses are in `assets/fonts/`. The Transitions.dev license is in `assets/licenses/transitions-dev.txt`. Personal content and paper figures are not relicensed by the theme license.

## 中文使用说明

双击 `index.html` 即可本地预览；修改后刷新浏览器。正文和链接在 HTML 中编辑，排版在 `content.css`，新增导航和图表交互在 `motion.css`、`reading.js`。无需安装依赖，也无需启动 Jekyll。本次修改仅保存到本地。
