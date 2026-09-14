---
layout: page
width: expand
title: People and sources
permalink: /MathChat/sources/
description: People, publications, and source material used in the MathChat viewpoint map.
---

<link rel="stylesheet" href="/assets/css/mathchat.css">
<div class="mathchat-page mathchat-source-directory" markdown="1">

[← Viewpoint map](/MathChat/) · [Add your own source](/MathChat/#source-tool)

{{ site.data.mathchat_sources.size }} entries from the [source ledger](https://github.com/algeboy/MathChat/blob/main/data/source-ledger.csv), listed alphabetically.



<div class="mathchat-source-list">
{% assign sources = site.data.mathchat_sources | sort: 'author_or_source' %}
{% for source in sources %}
<article class="mathchat-source-entry" id="source-{{ source.id | escape }}">
  <h3>{{ source.author_or_source | escape }}</h3>
  <p class="mathchat-source-kind">{% if source.url contains 'arxiv.org/' %}arXiv{% elsif source.url contains 'youtube.com/' or source.url contains 'youtu.be/' %}YouTube{% elsif source.source_type contains 'personal' or source.source_type contains 'statement' %}Personal statement{% else %}Website{% endif %} · {{ source.source_type | escape }} · {{ source.published | escape }}</p>
  <p><a href="{{ source.url | escape }}" target="_blank" rel="noopener">{{ source.title | escape }}</a></p>
  <p class="mathchat-source-scope">{{ source.scope | escape }}</p>
  <details><summary>Review note</summary><p>{{ source.notes | escape }}</p></details>
</article>
{% endfor %}
</div>

## Your prepared submissions

<div id="mathchat-local-sources"></div>
<noscript>Enable JavaScript to view submissions saved in this browser. The current map’s source list above is available without JavaScript.</noscript>

[Review your submission details](/MathChat/appendix/) · [Add a source](/MathChat/#source-tool)

## About these sources

<details><summary>About attribution and review</summary><p>A listing may name an author, speaker, interviewer, or publication; it does not imply that every claim in a linked interview is theirs. Scores describe the source’s argument, not the person. These are source references, not verbatim quotations. Review notes identify broad links, indirect evidence, and material that was unavailable during review.</p></details>

Website links, YouTube videos, arXiv papers, and personal statements prepared in this browser appear below. They are private previews, separate from the sources used in the current public map. A maintainer must review a submission before it can be included in the map and its public source ledger.

For personal text or an uploaded file, the existing submission tool saves only a short excerpt. The full file is not uploaded or published.

</div>
<script src="/assets/js/mathchat-source-directory.js" defer></script>
