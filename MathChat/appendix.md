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

<style>.mathchat-appendix-entry{border:2px dashed var(--chalk-white);border-radius:.6rem;padding:1rem;margin:1rem 0;background:rgba(26,74,58,.38)}.mathchat-appendix-note{color:var(--chalk-dust)}.mathchat-author-profile{border-left:3px solid var(--chalk-white);padding-left:.8rem;margin-top:1rem}</style>
<script>const entries=JSON.parse(localStorage.getItem('mathchat-appendix-submissions')||'[]'),root=document.getElementById('entries'),text=(tag,value)=>{const n=document.createElement(tag);n.textContent=value;return n};if(!entries.length)root.innerHTML='<p>No local appendix submissions yet. <a href="/MathChat/score-your-source/">Score a source</a> to prepare one.</p>';entries.forEach(e=>{const d=document.createElement('article');d.className='mathchat-appendix-entry';d.append(text('h2',e.title));const scores=document.createElement('p');scores.innerHTML=`<strong>Provisional scores:</strong> outlook ${e.outlook}; evidence ${e.evidence}; reliability ${e.reliability}.`;d.append(scores);if(e.submitterName)d.append(text('p',`Submitted by: ${e.submitterName}`));d.append(Object.assign(text('p',e.excerpt),{className:'mathchat-appendix-note'}));if(e.arxiv){const profile=document.createElement('section');profile.className='mathchat-author-profile';profile.append(text('h3','arXiv snapshot'));const link=document.createElement('a');link.href=e.arxiv.url;link.target='_blank';link.rel='noopener';link.textContent=`arXiv:${e.arxiv.id}`;const source=document.createElement('p');source.append(link);if(e.arxiv.primaryCategory)source.append(` · ${e.arxiv.primaryCategory}`);profile.append(source);if(e.scoredTextLength)profile.append(text('p',`Score input: complete arXiv HTML paper (${e.scoredTextLength.toLocaleString()} characters).`));profile.append(Object.assign(text('p',e.arxiv.summary),{className:'mathchat-appendix-note'}));const authors=document.createElement('p');authors.append(document.createTextNode('Author profiles: '));e.arxiv.authors.forEach((author,i)=>{if(i)authors.append(', ');const a=document.createElement('a');a.href=author.profileUrl;a.target='_blank';a.rel='noopener';a.textContent=author.name;authors.append(a);if(author.affiliation)authors.append(` (${author.affiliation})`)});profile.append(authors);d.append(profile)}root.append(d)});</script>
