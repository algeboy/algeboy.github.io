---
layout: page
width: expand
title: "Jobs and careers"
permalink: /MathChat/jobs-and-careers/
---

<link rel="stylesheet" href="/assets/css/mathchat.css">
<div class="mathchat-page" markdown="1">

{% assign topic_field = "jobs_careers" %}
{% assign summary_field = "career_summary" %}
{% include mathchat-topic-chart.html %}

<nav class="mathchat-chart-nav" aria-label="Chart pages"><a href="/MathChat/calls-to-action/" rel="prev">← Calls to action</a><span>4 / 5</span><a href="/MathChat/source-timing/" rel="next">Source timing →</a></nav>

## Recorded positions

<div class="mathchat-topic-notes">
{% for topic in site.data.mathchat_source_topics %}
{% if topic[topic_field] == "recorded" %}
{% assign source = site.data.mathchat_sources | where: "id", topic.id | first %}
<article><h3><a href="/MathChat/sources/#source-{{ topic.id }}">{{ source.author_or_source | escape }}</a></h3><p>{{ topic[summary_field] | escape }}</p><p class="note"><a href="{{ topic.basis_url | escape }}" target="_blank" rel="noopener">Source used</a> · {{ topic.review_basis | escape }}</p></article>
{% endif %}
{% endfor %}
</div>

## Reading this chart

“Recorded” means an explicit position is captured in the current review. “Not yet recorded” means the review does not establish a position on this topic; it does not mean the source has no opinion. These are provisional source-level classifications, not judgments of people.

Jobs and careers covers employment, professional roles, training for work, and career prospects. Discussion of research methods alone is not treated as an employment forecast. The older scope-only concern-coverage count did not assess these judgments.

[People and sources](/MathChat/sources/) · [Classification data](/assets/data/mathchat-source-topics.csv)

</div>
