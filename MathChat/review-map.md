---
layout: page
width: expand
title: "Current review map"
permalink: /MathChat/review-map/
description: Provisional scores and main contribution for every source in the MathChat review, each linked to the source itself.
---

<link rel="stylesheet" href="/assets/css/mathchat.css">
<div class="mathchat-page mathchat-review-map" markdown="1">

[← Viewpoint map](/MathChat/) · [People and sources](/MathChat/sources/) · [Add your own](/MathChat/#source-tool)

Every source in the current review, with its three provisional scores and the
contribution it makes to the map. Each name links to the source itself.

{% assign sources = site.data.mathchat_sources | sort: 'author_or_source' %}

<div class="mathchat-table-wrap" tabindex="0" role="region" aria-label="Review map table; scroll horizontally on small screens">
<table>
<thead><tr><th>Source</th><th class="num">Outlook</th><th class="num">Evidence basis</th><th class="num">Reliability</th><th>Main contribution</th></tr></thead>
<tbody>
{% for source in sources %}{% assign scores = site.data.mathchat_assessments | where: 'id', source.id | first %}<tr>
<td><a href="{{ source.url | escape }}" target="_blank" rel="noopener">{{ source.author_or_source | escape }}</a></td>
<td class="num">{{ scores.outlook_0_anxious_100_hopeful }}</td>
<td class="num">{{ scores.evidence_0_speculative_100_data_supported }}</td>
<td class="num">{{ scores.reliability_0_lower_100_higher }}</td>
<td>{{ source.main_contribution | escape }}</td>
</tr>
{% endfor %}</tbody>
</table>
</div>

Scores are provisional review judgments about a specific source's argument,
never a ranking of people. Outlook runs from anxious (0) to hopeful (100),
evidence basis from speculative (0) to data-supported (100), and source
reliability from lower (0) to higher (100).

[Methodology and scoring rubric](https://github.com/algeboy/MathChat/blob/main/docs/METHODOLOGY.md) · [Source ledger](https://github.com/algeboy/MathChat/blob/main/data/source-ledger.csv) · [Provisional assessments](https://github.com/algeboy/MathChat/blob/main/data/assessments.csv)

</div>
