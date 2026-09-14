---
layout: page
width: expand
title: "When the sources appeared"
permalink: /MathChat/source-timing/
---

<link rel="stylesheet" href="/assets/css/mathchat.css">
<div class="mathchat-page" markdown="1">
{% assign dates = site.data.mathchat_source_timing %}
{% assign cutoffs = site.data.mathchat_timing_cutoffs %}
{% assign early = dates | where: 'before_summer', 'before' | size %}
{% assign preannouncement = dates | where: 'before_announcement', 'before' | size %}

{{ early }} before summer · {{ preannouncement }} before the announcement

<div class="mathchat-plot-wrap" tabindex="0" role="region" aria-label="Publication dates; scroll horizontally on small screens">
{% assign chart_height = dates.size | times: 30 | plus: 100 %}
<svg class="mathchat-topic-chart mathchat-timing-chart" data-source-count="{{ dates.size }}" viewBox="0 0 1100 {{ chart_height }}" role="img" aria-labelledby="timing-title timing-desc">
<title id="timing-title">Source publication dates relative to summer and the Navier–Stokes announcement</title>
<desc id="timing-desc">Each source has two independent comparisons. A filled yellow circle means before the cutoff, a blue ring means on or after, and a question mark means the available date is too broad to decide.</desc>
<text x="16" y="30">Source</text><text x="450" y="30" text-anchor="middle">Date recorded</text>
<text x="700" y="26" text-anchor="middle">Before summer</text><text x="700" y="49" text-anchor="middle">{{ cutoffs.summer_start }}</text>
<text x="960" y="26" text-anchor="middle">Before Navier–Stokes</text><text x="960" y="49" text-anchor="middle">{{ cutoffs.announcement_date }}</text>
{% assign sources = site.data.mathchat_sources | sort: 'author_or_source' %}
{% for source in sources %}
{% assign timing = dates | where: 'id', source.id | first %}
{% assign y = forloop.index0 | times: 30 | plus: 85 %}
<g class="timing-source" data-source="{{ source.id }}" data-summer="{{ timing.before_summer }}" data-announcement="{{ timing.before_announcement }}">
<line class="topic-row" x1="16" x2="1080" y1="{{ y | plus: 12 }}" y2="{{ y | plus: 12 }}" />
<text x="16" y="{{ y | plus: 5 }}">{{ source.author_or_source | escape }}</text>
<text x="450" y="{{ y | plus: 5 }}" text-anchor="middle"><title>{{ timing.date_basis | escape }}</title>{{ timing.date_display | escape }}</text>
{% assign keys = 'before_summer,before_announcement' | split: ',' %}
{% for key in keys %}
{% if key == 'before_summer' %}{% assign x = 700 %}{% assign cutoff = cutoffs.summer_start %}{% else %}{% assign x = 960 %}{% assign cutoff = cutoffs.announcement_date %}{% endif %}
{% if timing[key] == 'before' %}<circle class="topic-recorded" cx="{{ x }}" cy="{{ y }}" r="7"><title>{{ source.author_or_source | escape }}: before {{ cutoff }}</title></circle>
{% elsif timing[key] == 'on_or_after' %}<circle class="timing-after" cx="{{ x }}" cy="{{ y }}" r="7"><title>{{ source.author_or_source | escape }}: on or after {{ cutoff }}</title></circle>
{% else %}<text class="timing-unknown" x="{{ x }}" y="{{ y | plus: 6 }}" text-anchor="middle"><title>{{ source.author_or_source | escape }}: available date spans {{ cutoff }}; uncertain</title>?</text>{% endif %}
{% endfor %}
</g>
{% endfor %}
</svg>
</div>

<nav class="mathchat-chart-nav" aria-label="Chart pages"><a href="/MathChat/jobs-and-careers/" rel="prev">← Jobs and careers</a><span>5 / 5</span><a href="/MathChat/">Back to first chart ↺</a></nav>

<p class="mathchat-timing-key"><span>● Before</span> · <span>○ On or after</span> · <span>? Date uncertain</span></p>

[People and sources](/MathChat/sources/) · [Date data](/assets/data/mathchat-source-timing.csv)

## Reading this chart

The comparisons are independent: a source before summer is also before the later announcement. “Before summer” uses **{{ cutoffs.summer_start }}**. The announcement cutoff is **{{ cutoffs.announcement_date }}**, the date of the [{{ cutoffs.announcement_label }}]({{ cutoffs.announcement_url }}). A source dated on a cutoff day is counted as on or after it.

Dates come from the source ledger, narrowed where a consistent date appears in the source URL. URL-derived dates are inferences, not independently verified publication timestamps. A year-only record covers that entire year; a month-only record covers that entire month. A question mark means that interval straddles the cutoff. It does not mean the source appeared later. A broad collection can span both sides of a cutoff.

<details><summary>Date provenance for each source</summary>
<ul>
{% for source in sources %}{% assign timing = dates | where: 'id', source.id | first %}
<li><a href="/MathChat/sources/#source-{{ source.id }}">{{ source.author_or_source | escape }}</a>: {{ timing.date_display }} — {{ timing.date_basis | escape }}</li>
{% endfor %}
</ul>
</details>
</div>
