---
layout: page
width: expand
title: MathChat
permalink: /MathChat/
description: A transparent map of viewpoints on AI in mathematics and mathematics education.
---

## AI and mathematics: a transparent viewpoint map

MathChat compares published viewpoints on artificial intelligence in mathematics and mathematics education. It is a discussion tool for students, faculty, and departments—not a ranking of people or a prediction of AI capability.

<style>
.mathchat-plot-wrap { overflow-x: auto; margin: 1.5rem 0 2rem; }
.mathchat-plot { display: block; width: 100%; min-width: 760px; height: auto; }
.mathchat-plot .grid { stroke: rgba(255,255,255,.18); stroke-width: 1; }
.mathchat-plot .frame { fill: none; stroke: var(--chalk-white); stroke-width: 1.25; }
.mathchat-plot .axis-label { fill: var(--chalk-white); font: 15px system-ui, sans-serif; }
.mathchat-plot .tick { fill: var(--chalk-white); font: 12px system-ui, sans-serif; }
.mathchat-plot .point { stroke: var(--chalk-white); stroke-width: 2; opacity: .94; }
.mathchat-plot .point-label { fill: var(--chalk-white); font: 12px system-ui, sans-serif; paint-order: stroke; stroke: #1f2625; stroke-width: 3px; stroke-linejoin: round; }
.mathchat-key { display: flex; flex-wrap: wrap; gap: .55rem 1rem; margin: .4rem 0 1rem; }
.mathchat-key span { white-space: nowrap; }
.mathchat-key i { display: inline-block; width: .8rem; height: .8rem; margin-right: .3rem; border-radius: 50%; vertical-align: -.05rem; }
#current-review-map + table th:last-child,
#current-review-map + table td:last-child { padding-left: 1.25rem; }
</style>

## Current viewpoint map

<div class="mathchat-plot-wrap">
<svg class="mathchat-plot" viewBox="0 0 920 560" role="img" aria-labelledby="plot-title plot-desc">
  <title id="plot-title">AI and mathematics viewpoints</title>
  <desc id="plot-desc">A scatter plot. The horizontal axis is evidence basis from speculative to data-supported. The vertical axis is outlook from anxious to hopeful. Circle size represents provisional source reliability.</desc>
  <rect class="frame" x="105" y="40" width="735" height="400" />
  <g class="grid">
    <line x1="105" y1="40" x2="105" y2="440" /><line x1="289" y1="40" x2="289" y2="440" /><line x1="473" y1="40" x2="473" y2="440" /><line x1="656" y1="40" x2="656" y2="440" /><line x1="840" y1="40" x2="840" y2="440" />
    <line x1="105" y1="440" x2="840" y2="440" /><line x1="105" y1="340" x2="840" y2="340" /><line x1="105" y1="240" x2="840" y2="240" /><line x1="105" y1="140" x2="840" y2="140" /><line x1="105" y1="40" x2="840" y2="40" />
  </g>
  <g class="tick" text-anchor="middle"><text x="105" y="465">0</text><text x="289" y="465">25</text><text x="473" y="465">50</text><text x="656" y="465">75</text><text x="840" y="465">100</text></g>
  <g class="tick" text-anchor="end"><text x="92" y="444">0</text><text x="92" y="344">25</text><text x="92" y="244">50</text><text x="92" y="144">75</text><text x="92" y="44">100</text></g>
  <text class="axis-label" x="472" y="520" text-anchor="middle">Evidence basis: speculative (0) → data-supported (100)</text>
  <text class="axis-label" x="25" y="240" text-anchor="middle" transform="rotate(-90 25 240)">Outlook: anxious (0) → hopeful (100)</text>
  <!-- Education sources -->
  <g fill="#f3bb4d"><circle class="point" cx="362" cy="112" r="10"><title>Francis Su — outlook 82, evidence 35, reliability 60</title></circle><circle class="point" cx="737" cy="328" r="11"><title>The Economist — outlook 28, evidence 86, reliability 72</title></circle><circle class="point" cx="605" cy="152" r="11"><title>Conrad Wolfram — outlook 72, evidence 68, reliability 78</title></circle><circle class="point" cx="620" cy="320" r="9"><title>Yahoo report — outlook 30, evidence 70, reliability 55</title></circle><circle class="point" cx="370" cy="200" r="10"><title>Jaron Lanier — outlook 60, evidence 36, reliability 64</title></circle></g>
  <!-- Research mathematics sources -->
  <g fill="#66c5b9"><circle class="point" cx="384" cy="224" r="10"><title>David Bessis — outlook 54, evidence 38, reliability 68</title></circle><circle class="point" cx="561" cy="128" r="12"><title>Geordie Williamson — outlook 78, evidence 62, reliability 80</title></circle><circle class="point" cx="678" cy="196" r="13"><title>Terence Tao — outlook 61, evidence 78, reliability 88</title></circle><circle class="point" cx="458" cy="392" r="10"><title>Max Weinreich — outlook 12, evidence 48, reliability 65</title></circle><circle class="point" cx="708" cy="208" r="13"><title>Timothy Gowers — outlook 58, evidence 82, reliability 90</title></circle><circle class="point" cx="664" cy="184" r="13"><title>Jeremy Avigad — outlook 64, evidence 76, reliability 88</title></circle><circle class="point" cx="509" cy="88" r="11"><title>Jacob Tsimerman — outlook 88, evidence 55, reliability 76</title></circle><circle class="point" cx="737" cy="216" r="13"><title>Emily Riehl — outlook 56, evidence 86, reliability 90</title></circle></g>
  <!-- Governance and broad-AI baselines -->
  <g fill="#d981b2"><circle class="point" cx="634" cy="344" r="12"><title>Leiden Declaration — outlook 24, evidence 72, reliability 82</title></circle></g>
  <g fill="#9b8fe7"><circle class="point" cx="678" cy="288" r="12"><title>AI Snake Oil — outlook 38, evidence 78, reliability 82</title></circle><circle class="point" cx="583" cy="180" r="12"><title>Yann LeCun — outlook 65, evidence 65, reliability 84</title></circle><circle class="point" cx="583" cy="312" r="12"><title>Gary Marcus — outlook 32, evidence 65, reliability 84</title></circle><circle class="point" cx="509" cy="128" r="11"><title>Stephen Wolfram — outlook 78, evidence 55, reliability 74</title></circle></g>
  <!-- Math/science journalism and podcasts -->
  <g fill="var(--chalk-white)"><circle class="point" cx="664" cy="184" r="12"><title>Jordana Cepelewicz / Quanta — outlook 64, evidence 76, reliability 82</title></circle><circle class="point" cx="620" cy="200" r="12"><title>Steven Strogatz / Quanta — outlook 60, evidence 70, reliability 84</title></circle><circle class="point" cx="502" cy="220" r="11"><title>Sean Carroll / Mindscape — outlook 55, evidence 54, reliability 76</title></circle><circle class="point" cx="509" cy="136" r="10"><title>Curt Jaimungal / Theories of Everything — outlook 76, evidence 55, reliability 70</title></circle><circle class="point" cx="436" cy="208" r="10"><title>Sabine Hossenfelder — outlook 58, evidence 45, reliability 64</title></circle><circle class="point" cx="531" cy="196" r="11"><title>Brian Keating / Into the Impossible — outlook 61, evidence 58, reliability 74</title></circle></g>
  <g class="point-label"><text x="375" y="105">Su</text><text x="748" y="342">Economist</text><text x="615" y="142">Conrad Wolfram</text><text x="630" y="325">Yahoo</text><text x="345" y="193">Lanier</text><text x="397" y="218">Bessis</text><text x="514" y="236">Carroll</text><text x="517" y="130">Jaimungal</text><text x="447" y="204">Hossenfelder</text><text x="542" y="192">Keating</text><text x="574" y="121">Williamson</text><text x="691" y="191">Tao</text><text x="471" y="407">Weinreich</text><text x="721" y="204">Gowers</text><text x="677" y="176">Avigad</text><text x="672" y="171">Quanta: Cepelewicz</text><text x="609" y="214">Quanta: Strogatz</text><text x="521" y="82">Tsimerman</text><text x="750" y="213">Riehl</text><text x="647" y="359">Leiden</text><text x="691" y="303">AI Snake Oil</text><text x="596" y="174">LeCun</text><text x="430" y="123">S. Wolfram</text><text x="548" y="306">Marcus</text></g>
</svg>
</div>

On this first map, **hopeful** means that the source expects AI to have a net positive effect on mathematics or mathematics education—for example, by assisting discovery, explanation, accessibility, or formal verification. It does **not** simply mean “AI can do mathematics,” confidence in artificial general intelligence, or approval of every AI use. Conversely, an anxious score reflects concern about the net effect on learning, proof, research culture, or public institutions.

<div class="mathchat-key" aria-label="Source category legend">
  <span><i style="background:#66c5b9"></i>Research mathematics</span>
  <span><i style="background:#f3bb4d"></i>Mathematics education</span>
  <span><i style="background:#d981b2"></i>Governance</span>
  <span><i style="background:#9b8fe7"></i>Broad-AI baseline</span>
  <span><i style="background:var(--chalk-white)"></i>Math/science journalism &amp; podcasts</span>
  <span>Circle size = source reliability</span>
</div>

Each source is reviewed along three provisional dimensions:

1. **Outlook:** anxious (0) to hopeful (100)
2. **Evidence basis:** speculative (0) to data-supported (100)
3. **Source reliability:** lower (0) to higher (100), based on relevant expertise, transparency, methods, primary sourcing, and relevance

The numbers are deliberately open to revision. They describe a particular source's argument, never an author's worth or status.

## AI openness by source category

This strip plot avoids treating categories as a numerical axis. Rows show the source's primary public role for this review; horizontal position shows openness to AI use. Categories describe source context, not motive or argument quality.

<div class="mathchat-plot-wrap">
<svg class="mathchat-plot" viewBox="0 0 920 390" role="img" aria-labelledby="category-plot-title category-plot-desc">
  <title id="category-plot-title">AI openness by source category</title>
  <desc id="category-plot-desc">Sources are grouped into educator, journalist, and AI-industry rows, and positioned horizontally by openness to AI use.</desc>
  <rect class="frame" x="185" y="40" width="655" height="240" />
  <g class="grid"><line x1="185" y1="40" x2="185" y2="280" /><line x1="349" y1="40" x2="349" y2="280" /><line x1="513" y1="40" x2="513" y2="280" /><line x1="676" y1="40" x2="676" y2="280" /><line x1="840" y1="40" x2="840" y2="280" /><line x1="185" y1="120" x2="840" y2="120" /><line x1="185" y1="200" x2="840" y2="200" /></g>
  <g class="tick" text-anchor="middle"><text x="185" y="305">0</text><text x="349" y="305">25</text><text x="513" y="305">50</text><text x="676" y="305">75</text><text x="840" y="305">100</text></g>
  <g class="axis-label" text-anchor="end"><text x="170" y="85">Educator</text><text x="170" y="165">Journalist</text><text x="170" y="245">AI industry</text></g>
  <text class="axis-label" x="513" y="355" text-anchor="middle">Openness to AI use: reject (0) → actively embrace (100)</text>
  <g fill="#f3bb4d"><circle class="point" cx="611" cy="75" r="8"><title>Francis Su — 65</title></circle><circle class="point" cx="499" cy="95" r="8"><title>David Bessis — 48</title></circle><circle class="point" cx="709" cy="75" r="9"><title>Geordie Williamson — 80</title></circle><circle class="point" cx="643" cy="95" r="10"><title>Terence Tao — 70</title></circle><circle class="point" cx="218" cy="75" r="8"><title>Max Weinreich — 5</title></circle><circle class="point" cx="480" cy="75" r="9"><title>Leiden Declaration — 45</title></circle><circle class="point" cx="578" cy="95" r="10"><title>Timothy Gowers — 60</title></circle><circle class="point" cx="643" cy="75" r="10"><title>Jeremy Avigad — 70</title></circle><circle class="point" cx="774" cy="95" r="8"><title>Jacob Tsimerman — 90</title></circle><circle class="point" cx="611" cy="95" r="10"><title>Emily Riehl — 65</title></circle></g>
  <g fill="var(--chalk-white)"><circle class="point" cx="447" cy="155" r="9"><title>The Economist — 40</title></circle><circle class="point" cx="414" cy="175" r="7"><title>Yahoo report — 35</title></circle><circle class="point" cx="447" cy="175" r="9"><title>AI Snake Oil — 40</title></circle><circle class="point" cx="643" cy="155" r="9"><title>Jordana Cepelewicz / Quanta — 70</title></circle><circle class="point" cx="611" cy="175" r="9"><title>Steven Strogatz / Quanta — 65</title></circle><circle class="point" cx="545" cy="155" r="8"><title>Sean Carroll / Mindscape — 55</title></circle><circle class="point" cx="676" cy="175" r="8"><title>Curt Jaimungal — 75</title></circle><circle class="point" cx="545" cy="175" r="8"><title>Sabine Hossenfelder — 55</title></circle><circle class="point" cx="611" cy="155" r="8"><title>Brian Keating — 65</title></circle></g>
  <g fill="#9b8fe7"><circle class="point" cx="774" cy="235" r="8"><title>Conrad Wolfram — 90</title></circle><circle class="point" cx="709" cy="255" r="9"><title>Yann LeCun — 80</title></circle><circle class="point" cx="611" cy="235" r="8"><title>Jaron Lanier — 65</title></circle><circle class="point" cx="447" cy="255" r="9"><title>Gary Marcus — 40</title></circle><circle class="point" cx="788" cy="255" r="8"><title>Stephen Wolfram — 92</title></circle></g>
</svg>
</div>

The category assignments and openness scores are reviewable in [openness-by-category.csv](https://github.com/algeboy/MathChat/blob/main/data/openness-by-category.csv).

## Openness and teaching-scale map

This view separates a source's openness to AI use from its teaching or learner-audience scale. The vertical axis describes the scale of educational reach, not the quality of teaching. Colors retain the source categories shown above; hover a point for its source and scores.

<div class="mathchat-plot-wrap">
<svg class="mathchat-plot" viewBox="0 0 920 560" role="img" aria-labelledby="teaching-plot-title teaching-plot-desc">
  <title id="teaching-plot-title">AI openness and teaching scale</title>
  <desc id="teaching-plot-desc">A scatter plot. The horizontal axis is openness to AI use from rejection to active embrace. The vertical axis is teaching or learner-audience scale from few or no directly taught students to a large learner or public audience. Circle size represents provisional source reliability.</desc>
  <rect class="frame" x="105" y="40" width="735" height="400" />
  <g class="grid">
    <line x1="105" y1="40" x2="105" y2="440" /><line x1="289" y1="40" x2="289" y2="440" /><line x1="473" y1="40" x2="473" y2="440" /><line x1="656" y1="40" x2="656" y2="440" /><line x1="840" y1="40" x2="840" y2="440" />
    <line x1="105" y1="440" x2="840" y2="440" /><line x1="105" y1="340" x2="840" y2="340" /><line x1="105" y1="240" x2="840" y2="240" /><line x1="105" y1="140" x2="840" y2="140" /><line x1="105" y1="40" x2="840" y2="40" />
  </g>
  <g class="tick" text-anchor="middle"><text x="105" y="465">0</text><text x="289" y="465">25</text><text x="473" y="465">50</text><text x="656" y="465">75</text><text x="840" y="465">100</text></g>
  <g class="tick" text-anchor="end"><text x="92" y="444">0</text><text x="92" y="344">25</text><text x="92" y="244">50</text><text x="92" y="144">75</text><text x="92" y="44">100</text></g>
  <text class="axis-label" x="472" y="520" text-anchor="middle">Openness to AI use: reject (0) → actively embrace (100)</text>
  <text class="axis-label" x="25" y="240" text-anchor="middle" transform="rotate(-90 25 240)">Teaching or learner-audience scale: few/none (0) → large (100)</text>
  <g fill="#f3bb4d"><circle class="point" cx="583" cy="300" r="10"><title>Francis Su — openness 65, teaching scale 35</title></circle><circle class="point" cx="399" cy="100" r="11"><title>The Economist — openness 40, teaching scale 85</title></circle><circle class="point" cx="767" cy="60" r="11"><title>Conrad Wolfram — openness 90, teaching scale 95</title></circle><circle class="point" cx="362" cy="120" r="9"><title>Yahoo report — openness 35, teaching scale 80</title></circle><circle class="point" cx="583" cy="260" r="10"><title>Jaron Lanier — openness 65, teaching scale 45</title></circle></g>
  <g fill="#66c5b9"><circle class="point" cx="458" cy="340" r="10"><title>David Bessis — openness 48, teaching scale 25</title></circle><circle class="point" cx="693" cy="340" r="12"><title>Geordie Williamson — openness 80, teaching scale 25</title></circle><circle class="point" cx="620" cy="240" r="13"><title>Terence Tao — openness 70, teaching scale 50</title></circle><circle class="point" cx="142" cy="360" r="10"><title>Max Weinreich — openness 5, teaching scale 20</title></circle><circle class="point" cx="546" cy="320" r="13"><title>Timothy Gowers — openness 60, teaching scale 30</title></circle><circle class="point" cx="620" cy="320" r="13"><title>Jeremy Avigad — openness 70, teaching scale 30</title></circle><circle class="point" cx="767" cy="360" r="11"><title>Jacob Tsimerman — openness 90, teaching scale 20</title></circle><circle class="point" cx="583" cy="300" r="13"><title>Emily Riehl — openness 65, teaching scale 35</title></circle></g>
  <g fill="#d981b2"><circle class="point" cx="436" cy="220" r="12"><title>Leiden Declaration — openness 45, teaching scale 55</title></circle></g>
  <g fill="#9b8fe7"><circle class="point" cx="399" cy="160" r="12"><title>AI Snake Oil — openness 40, teaching scale 70</title></circle><circle class="point" cx="693" cy="280" r="12"><title>Yann LeCun — openness 80, teaching scale 40</title></circle><circle class="point" cx="399" cy="220" r="12"><title>Gary Marcus — openness 40, teaching scale 55</title></circle><circle class="point" cx="781" cy="120" r="11"><title>Stephen Wolfram — openness 92, teaching scale 80</title></circle></g>
  <g fill="var(--chalk-white)"><circle class="point" cx="620" cy="120" r="12"><title>Jordana Cepelewicz / Quanta — openness 70, teaching scale 80</title></circle><circle class="point" cx="583" cy="100" r="12"><title>Steven Strogatz / Quanta — openness 65, teaching scale 85</title></circle><circle class="point" cx="509" cy="120" r="11"><title>Sean Carroll / Mindscape — openness 55, teaching scale 80</title></circle><circle class="point" cx="656" cy="100" r="10"><title>Curt Jaimungal / Theories of Everything — openness 75, teaching scale 85</title></circle><circle class="point" cx="509" cy="100" r="10"><title>Sabine Hossenfelder — openness 55, teaching scale 85</title></circle><circle class="point" cx="583" cy="140" r="11"><title>Brian Keating / Into the Impossible — openness 65, teaching scale 75</title></circle></g>
</svg>
</div>

The complete provisional scores and rationales are in [teaching-scale-openness.csv](https://github.com/algeboy/MathChat/blob/main/data/teaching-scale-openness.csv).

## Openness and documented context

This small map is a disclosure tool, not a judgment of motivation or bias. It includes only sources with a documented AI-industry role or an explicit public-interest/environmental-safeguard context. Other sources are omitted rather than assigned a presumed position.

<div class="mathchat-plot-wrap">
<svg class="mathchat-plot" viewBox="0 0 920 560" role="img" aria-labelledby="context-plot-title context-plot-desc">
  <title id="context-plot-title">AI openness and documented institutional context</title>
  <desc id="context-plot-desc">A scatter plot of six sources. The horizontal axis is openness to AI use from rejection to active embrace. The vertical axis is documented context from a direct AI-industry role to public-interest or environmental safeguards raised by the source.</desc>
  <rect class="frame" x="105" y="40" width="735" height="400" />
  <g class="grid">
    <line x1="105" y1="40" x2="105" y2="440" /><line x1="289" y1="40" x2="289" y2="440" /><line x1="473" y1="40" x2="473" y2="440" /><line x1="656" y1="40" x2="656" y2="440" /><line x1="840" y1="40" x2="840" y2="440" />
    <line x1="105" y1="440" x2="840" y2="440" /><line x1="105" y1="340" x2="840" y2="340" /><line x1="105" y1="240" x2="840" y2="240" /><line x1="105" y1="140" x2="840" y2="140" /><line x1="105" y1="40" x2="840" y2="40" />
  </g>
  <g class="tick" text-anchor="middle"><text x="105" y="465">0</text><text x="289" y="465">25</text><text x="473" y="465">50</text><text x="656" y="465">75</text><text x="840" y="465">100</text></g>
  <g class="tick" text-anchor="end"><text x="92" y="444">0</text><text x="92" y="344">25</text><text x="92" y="244">50</text><text x="92" y="144">75</text><text x="92" y="44">100</text></g>
  <text class="axis-label" x="472" y="520" text-anchor="middle">Openness to AI use: reject (0) → actively embrace (100)</text>
  <text class="axis-label" x="25" y="240" text-anchor="middle" transform="rotate(-90 25 240)">Documented context: AI-industry role (0) → public-interest/environmental safeguards (100)</text>
  <g fill="#9b8fe7"><circle class="point" cx="693" cy="420" r="12"><title>Yann LeCun — openness 80, documented AI-industry role 5</title></circle><circle class="point" cx="583" cy="360" r="10"><title>Jaron Lanier — openness 65, documented AI-industry role 20</title></circle><circle class="point" cx="399" cy="340" r="12"><title>Gary Marcus — openness 40, documented AI-industry role 25</title></circle><circle class="point" cx="399" cy="180" r="12"><title>AI Snake Oil — openness 40, public-interest context 65</title></circle><circle class="point" cx="781" cy="420" r="11"><title>Stephen Wolfram — openness 92, documented AI-industry role 5</title></circle></g>
  <g fill="#f3bb4d"><circle class="point" cx="767" cy="380" r="11"><title>Conrad Wolfram — openness 90, documented AI-industry role 15</title></circle></g>
  <g fill="#d981b2"><circle class="point" cx="436" cy="120" r="12"><title>Leiden Declaration — openness 45, public-interest/environmental safeguards 80</title></circle></g>
  <g class="point-label"><text x="705" y="414">LeCun</text><text x="595" y="354">Lanier</text><text x="411" y="334">Marcus</text><text x="411" y="174">AI Snake Oil</text><text x="779" y="374">Conrad Wolfram</text><text x="793" y="414">Stephen Wolfram</text><text x="448" y="114">Leiden</text></g>
</svg>
</div>

The evidence links and scoring limits are in [context-openness.csv](https://github.com/algeboy/MathChat/blob/main/data/context-openness.csv).

## What the map currently suggests

* There is no simple pro-AI/anti-AI divide. Several optimistic sources also insist on verification, disclosure, and human responsibility.
* The clearest empirical concern in this collection is educational: AI can improve visible homework performance while weakening unaided performance. That supports careful course and assessment design, not a blanket ban.
* Research-mathematics sources focus on a different risk: generated claims and proofs may outpace the community's ability to verify, understand, attribute, and teach them.
* The broadest common ground is conditional adoption: use AI for explanation, exploration, routine tasks, and formal assistance; preserve independent practice and require transparent checking for consequential mathematical claims.

## Current review map

| Source | Outlook | Evidence basis | Reliability | Main contribution |
|---|---:|---:|---:|---|
| Stephen Wolfram | 78 | 55 | 74 | Computation-augmented AI: pair generative models with exact computation. |
| Conrad Wolfram | 72 | 68 | 78 | Mathematics-education reform for the AI age. |
| Geordie Williamson | 78 | 62 | 80 | AI may contribute to mathematical discovery. |
| Max Weinreich | 12 | 48 | 65 | Argues against AI-generated mathematics. |
| Jacob Tsimerman | 88 | 55 | 76 | Strongly future-facing research-mathematics forecast. |
| Terence Tao | 61 | 78 | 88 | Conditional analysis of mathematical values, verification, and practice. |
| Steven Strogatz (Quanta) | 60 | 70 | 84 | Podcast interview on black-box models, uncertainty, and statistical reasoning. |
| Francis Su | 82 | 35 | 60 | Humanistic case for mathematics and learning. |
| Emily Riehl | 56 | 86 | 90 | Tests and verification for meaningful AI contribution to mathematics. |
| Gary Marcus | 32 | 65 | 84 | LLM reasoning can be brittle; plausible output is not robust abstraction. |
| Yann LeCun | 65 | 65 | 84 | Broad-AI baseline: limits of current language models and future architectures. |
| Leiden Declaration | 24 | 72 | 82 | Governance, responsibility, and peer-review proposals. |
| Jaron Lanier | 60 | 36 | 64 | Immersive mathematical visualization, paired with cautions about treating learners as data. |
| Brian Keating | 61 | 58 | 74 | Tao interview on AI as a complementary research tool requiring verification. |
| Curt Jaimungal | 76 | 55 | 70 | Yang-Hui He interview on AI-assisted mathematical discovery and its limits. |
| Sabine Hossenfelder | 58 | 45 | 64 | Explainer on claimed AI mathematics breakthroughs; full transcript pending public access. |
| Timothy Gowers | 58 | 82 | 90 | Separates verified mathematical progress from AI hype. |
| The Economist | 28 | 86 | 72 | Reports recent evidence on AI use and secondary-school learning. |
| Jordana Cepelewicz (Quanta) | 64 | 76 | 82 | Quanta's reported synthesis of AI-assisted proof and changing mathematical practice. |
| Sean Carroll | 55 | 54 | 76 | Podcast discussion of neural-network mathematics and the limits of data-hungry models. |
| David Bessis | 54 | 38 | 68 | Mathematical understanding matters beyond theorem production. |
| Jeremy Avigad | 64 | 76 | 88 | Formalization, proof, and responsible mathematical practice. |
| AI Snake Oil | 38 | 78 | 82 | Evidence-oriented education baseline, not mathematics-specific. |
| Yahoo report | 30 | 70 | 55 | Secondary reporting on student-learning evidence. |

## Explore, challenge, or extend the review

The complete public record includes the source ledger, scoring methodology, prompt and model-assisted review record, contribution guide, and a small interactive HTML version of the map.

[Open the MathChat review repository on GitHub](https://github.com/algeboy/MathChat){: .uk-button }

### A note on evidence

“Evidence basis” is not a measure of author prestige. It asks whether the source's central claim is directly supported by relevant data, transparent methods, primary sources, and appropriate caution about uncertainty and causation. A thoughtful philosophical essay can be valuable while still scoring lower on this particular axis.

### Add an author or correct the map

Please use the [author or source suggestion form](https://github.com/algeboy/MathChat/issues/new?template=author-suggestion.yml) to propose a specific source, challenge a score, or point to better evidence. Source snapshots in the repository preserve links, access notes, and review summaries without republishing third-party articles.
