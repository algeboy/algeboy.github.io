---
layout: page
width: expand
title: MathChat
permalink: /MathChat/
description: Public Viewpoints on AI in mathematics and mathematics education.
---

<link rel="stylesheet" href="/assets/css/mathchat.css">

<div class="mathchat-page" markdown="1">

What are people saying about AI & Math?

[Add your own](#source-tool) · [People and sources](/MathChat/sources/) · [Join the discussion](#leave-a-message)



## Current viewpoint map

<div class="mathchat-plot-wrap">
{% include mathchat-viewpoint-map.html %}
</div>

<nav class="mathchat-chart-nav" aria-label="Chart pages"><span></span><span>1 / 5</span><a href="/MathChat/source-categories/" rel="next">Source categories →</a></nav>

<div id="viewpoint-key" class="mathchat-key" aria-label="Source category legend">
  <button type="button" data-filter="research" aria-pressed="true"><i style="background:#66c5b9"></i>Research mathematics</button>
  <button type="button" data-filter="education" aria-pressed="true"><i style="background:#f3bb4d"></i>Mathematics education</button>
  <button type="button" data-filter="governance" aria-pressed="true"><i style="background:#d981b2"></i>Governance</button>
  <button type="button" data-filter="baseline" aria-pressed="true"><i style="background:#9b8fe7"></i>Broad-AI baseline</button>
  <button type="button" data-filter="media" aria-pressed="true"><i style="background:var(--chalk-white)"></i>Math/science journalism &amp; podcasts</button>
  <span>Circle size = source reliability</span>
</div>

<div id="source-tool"></div>
<script src="/assets/js/mathchat-source-tool.js" defer></script>

<script src="/assets/js/mathchat-filters.js" defer></script>

On this first map, **hopeful** means that the source expects AI to have a net positive effect on mathematics or mathematics education—for example, by assisting discovery, explanation, accessibility, or formal verification. It does **not** simply mean “AI can do mathematics,” confidence in artificial general intelligence, or approval of every AI use. Conversely, an anxious score reflects concern about the net effect on learning, proof, research culture, or public institutions.

Each source is reviewed along three provisional dimensions:

1. **Outlook:** anxious (0) to hopeful (100)
2. **Evidence basis:** speculative (0) to data-supported (100)
3. **Source reliability:** lower (0) to higher (100), based on relevant expertise, transparency, methods, primary sourcing, and relevance



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

Please use the [author or source suggestion form](https://github.com/algeboy/MathChat/issues/new?template=author-suggestion.yml) to propose a specific source, challenge a score, or point to better evidence. Keep submissions tidy, polite, and apolitical. Source snapshots in the repository preserve links, access notes, and review summaries without republishing third-party articles.

## Leave a message

Questions, source leads, score challenges, and constructive corrections are welcome. Keep the discussion tidy, polite, and apolitical.

<style>
.mathchat-message-wall { padding:24px; border:3px dashed var(--chalk-white); border-radius:12px; background:rgba(16,58,43,.32); box-shadow:inset 0 0 22px rgba(0,0,0,.24); }
.mathchat-message-wall .giscus, .mathchat-message-wall .giscus-frame { width:100%; }
</style>

<div class="mathchat-message-wall" aria-label="MathChat public discussion board">
  <script src="https://giscus.app/client.js"
          data-repo="algeboy/algeboy.github.io"
          data-repo-id="R_kgDOLIw4gQ"
          data-category="General"
          data-category-id="DIC_kwDOLIw4gc4DELD0"
          data-mapping="specific"
          data-term="MathChat discussion board"
          data-strict="0"
          data-reactions-enabled="1"
          data-emit-metadata="0"
          data-input-position="top"
          data-theme="noborder_dark"
          data-lang="en"
          crossorigin="anonymous"
          async>
  </script>
</div>

The numbers are deliberately open to revision. They describe a particular source's argument, never an author's worth or status.

</div>
