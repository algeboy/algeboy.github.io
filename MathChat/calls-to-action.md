---
layout: page
width: expand
title: "Calls to action"
permalink: /MathChat/calls-to-action/
---

<link rel="stylesheet" href="/assets/css/mathchat.css">
<div class="mathchat-page" markdown="1">

{% assign topic_field = "call_to_action" %}
{% assign summary_field = "action_summary" %}
{% include mathchat-topic-chart.html %}

<nav class="mathchat-chart-nav" aria-label="Chart pages"><a href="/MathChat/source-categories/" rel="prev">← Source categories</a><span>3 / 5</span><a href="/MathChat/jobs-and-careers/" rel="next">Jobs and careers →</a></nav>

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

A call to action recommends something people or institutions should do, rather than merely predicting AI capabilities.

[People and sources](/MathChat/sources/) · [Classification data](/assets/data/mathchat-source-topics.csv)

</div>
