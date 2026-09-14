/* Browser-local prepared-submission directory. */
(() => {
  const host = document.getElementById('mathchat-local-sources');
  if (!host) return;

  const text = (tag, value) => {
    const node = document.createElement(tag);
    node.textContent = value;
    return node;
  };

  const string = value => typeof value === 'string' ? value.trim() : '';
  const sourceTypes = {
    arxiv: 'arXiv',
    youtube: 'YouTube',
    website: 'Website',
    text: 'Personal statement'
  };

  const httpUrl = value => {
    try {
      const url = new URL(string(value));
      return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : '';
    } catch {
      return '';
    }
  };

  let entries = [];
  try {
    const saved = localStorage.getItem('mathchat-appendix-submissions');
    const parsed = saved ? JSON.parse(saved) : [];
    entries = Array.isArray(parsed) ? parsed.filter(entry => entry && typeof entry === 'object') : [];
  } catch {
    // A damaged local record should not prevent the page from loading.
  }

  const confirmed = entries.filter(entry => entry.consent === true || entry.submissionConfirmed === true);
  host.replaceChildren();

  if (!confirmed.length) {
    const empty = text('p', 'No confirmed prepared submissions are saved in this browser. ');
    const link = text('a', 'Prepare a source');
    link.href = '/MathChat/#source-tool';
    empty.append(link, '.');
    host.append(empty);
    return;
  }

  confirmed.forEach(entry => {
    const article = document.createElement('article');
    article.className = 'mathchat-source-entry';
    article.append(text('h3', string(entry.title) || 'Untitled source'));

    const submitter = text('p', 'Submitted by: ' + (string(entry.submitterName) || 'name not recorded'));
    article.append(submitter);

    const type = string(entry.sourceType) || (entry.arxiv ? 'arxiv' : entry.youtube ? 'youtube' : entry.sourceUrl ? 'website' : 'text');
    const sourceType = sourceTypes[type] || 'Source';
    article.append(text('p', 'Type: ' + sourceType));

    const sourceUrl = httpUrl(entry.sourceUrl) ||
      (type === 'arxiv' ? httpUrl(entry.arxiv && entry.arxiv.url) : '') ||
      (type === 'youtube' ? httpUrl(entry.youtube && entry.youtube.url) : '');
    if (sourceUrl) {
      const source = text('p', 'Source: ');
      const link = text('a', sourceUrl);
      link.href = sourceUrl;
      link.target = '_blank';
      link.rel = 'noopener';
      source.append(link);
      article.append(source);
    }

    if (type === 'arxiv' && entry.arxiv && Array.isArray(entry.arxiv.authors)) {
      const authors = entry.arxiv.authors.map(author => string(author && author.name)).filter(Boolean);
      if (authors.length) article.append(text('p', 'Authors: ' + authors.join(', ')));
    }
    if (type === 'youtube' && entry.youtube) {
      const channel = string(entry.youtube.channelName);
      if (channel) article.append(text('p', 'Channel: ' + channel));
    }

    const excerpt = string(entry.excerpt);
    if (type === 'text') {
      const details = document.createElement('details');
      details.append(text('summary', 'Read saved excerpt'));
      if (excerpt) { const paragraph = text('p', excerpt); paragraph.className = 'statement-excerpt'; details.append(paragraph); }
      article.append(details);
    } else if (excerpt) {
      article.append(text('p', 'Saved excerpt: ' + excerpt));
    }
    host.append(article);
  });
})();
