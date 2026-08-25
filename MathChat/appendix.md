---
layout: page
width: expand
title: "Appendix: submitted sources"
permalink: /MathChat/appendix/
description: Locally prepared MathChat appendix submissions.
---

<p><a href="/MathChat/">← Viewpoint map</a></p>
<p>This page shows consented entries prepared in this browser. They are not public additions to the project until a maintainer reviews and commits them. No source is uploaded merely by being scored.</p>
<div id="entries"></div>

<style>.mathchat-appendix-entry{border:2px dashed var(--chalk-white);border-radius:.6rem;padding:1rem;margin:1rem 0;background:rgba(26,74,58,.38)}.mathchat-appendix-note{color:var(--chalk-dust)}</style>
<script>const entries=JSON.parse(localStorage.getItem('mathchat-appendix-submissions')||'[]'),root=document.getElementById('entries');if(!entries.length)root.innerHTML='<p>No local appendix submissions yet. <a href="/MathChat/score-your-source/">Score a source</a> to prepare one.</p>';entries.forEach(e=>{const d=document.createElement('article');d.className='mathchat-appendix-entry';d.innerHTML=`<h2></h2><p><strong>Provisional scores:</strong> outlook ${e.outlook}; evidence ${e.evidence}; reliability ${e.reliability}.</p><p class="mathchat-appendix-note"></p>`;d.querySelector('h2').textContent=e.title;d.querySelector('.mathchat-appendix-note').textContent=e.excerpt;root.append(d)});</script>
