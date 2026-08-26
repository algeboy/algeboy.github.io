  const initializeEnhancements = function() {
    const applyCodeWatermarks = function(root) {
      if (!root) {
        return;
      }

      const generic = new Set([
        'sourcecode', 'number-lines', 'numbersource', 'code-with-copy',
        'code-copy-outer-scaffold', 'code-annotation-code'
      ]);

      const aliases = {
        commonlisp: 'lisp',
        py: 'python',
        shell: 'bash',
        sh: 'bash',
        zsh: 'bash',
        yml: 'yaml',
        tex: 'latex'
      };

      const known = new Set([
        'python', 'lisp', 'scheme', 'clojure', 'bash', 'sh', 'zsh', 'powershell',
        'javascript', 'js', 'typescript', 'ts', 'java', 'c', 'cpp', 'c++',
        'go', 'rust', 'ruby', 'php', 'julia', 'r', 'lua', 'haskell',
        'html', 'css', 'json', 'yaml', 'yml', 'xml', 'sql', 'tex', 'latex',
        'mermaid', 'commonlisp'
      ]);

      const normalize = function(lang) {
        if (!lang) {
          return '';
        }
        const lowered = lang.toLowerCase();
        return aliases[lowered] || lowered;
      };

      const detectLanguage = function(classes) {
        let lang = '';

        const languagePrefixed = classes.find(function(className) {
          return className.startsWith('language-');
        });
        if (languagePrefixed) {
          lang = languagePrefixed.replace('language-', '');
        }

        if (!lang) {
          const plain = classes.find(function(className) {
            return known.has(className);
          });
          if (plain) {
            lang = plain;
          }
        }

        if (!lang) {
          const fallback = classes.find(function(className) {
            return !generic.has(className) && /^[a-z][a-z0-9_+\-]*$/.test(className);
          });
          if (fallback) {
            lang = fallback;
          }
        }

        return normalize(lang);
      };

      root.querySelectorAll('pre > code[class]').forEach(function(code) {
        const pre = code.closest('pre');
        if (!pre || pre.dataset.lang) {
          return;
        }

        const classes = Array.from(new Set(
          Array.from(code.classList).concat(Array.from(pre.classList))
        )).map(function(className) {
          return className.toLowerCase();
        });

        const lang = detectLanguage(classes);

        if (lang) {
          pre.dataset.lang = lang;
        }
      });

      root.querySelectorAll('pre.mermaid, div.mermaid').forEach(function(block) {
        if (!block.dataset.lang) {
          block.dataset.lang = 'mermaid';
        }
      });
    };

    const emojiAliases = {
      eye_roll: '🙄',
      face_palm: '🤦',
      shrug: '🤷',
      warning: '⚠️',
      light_bulb: '💡',
      check_mark: '✅',
      x_mark: '❌'
    };

    const applyEmojiAliases = function(root) {
      if (!root) {
        return;
      }

      const aliasPattern = /:([a-z0-9_+-]+):/gi;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const textNodes = [];

      while (walker.nextNode()) {
        const node = walker.currentNode;
        const parent = node.parentElement;

        if (!parent) {
          continue;
        }
        if (['CODE', 'PRE', 'SCRIPT', 'STYLE', 'TEXTAREA', 'SVG'].includes(parent.tagName)) {
          continue;
        }
        if (parent.closest('.mermaid, .sourceCode, .python-shaded')) {
          continue;
        }
        if (!node.nodeValue || node.nodeValue.indexOf(':') === -1) {
          continue;
        }

        textNodes.push(node);
      }

      textNodes.forEach(function(node) {
        if (!aliasPattern.test(node.nodeValue)) {
          aliasPattern.lastIndex = 0;
          return;
        }
        aliasPattern.lastIndex = 0;

        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match = aliasPattern.exec(node.nodeValue);
        let changed = false;

        while (match) {
          const start = match.index;
          const end = start + match[0].length;
          const aliasKey = match[1].toLowerCase();
          const icon = emojiAliases[aliasKey];

          if (!icon) {
            match = aliasPattern.exec(node.nodeValue);
            continue;
          }

          if (start > lastIndex) {
            fragment.appendChild(document.createTextNode(node.nodeValue.slice(lastIndex, start)));
          }

          fragment.appendChild(document.createTextNode(icon));
          lastIndex = end;
          changed = true;
          match = aliasPattern.exec(node.nodeValue);
        }

        if (!changed) {
          return;
        }

        if (lastIndex < node.nodeValue.length) {
          fragment.appendChild(document.createTextNode(node.nodeValue.slice(lastIndex)));
        }

        node.parentNode.replaceChild(fragment, node);
      });
    };

    const glossaryEntries = [
      {
        term: 'memoization',
        href: 'https://en.wikipedia.org/wiki/Memoization',
        tooltip: 'Memoization caches results so repeated calls with the same inputs can return faster.'
      },
      {
        term: 'recursion',
        href: 'https://en.wikipedia.org/wiki/Recursion_(computer_science)',
        tooltip: 'Recursion solves a problem by calling the same function on smaller inputs until a base case.'
      },
      {
        term: 'induction',
        href: 'https://en.wikipedia.org/wiki/Mathematical_induction',
        tooltip: 'Mathematical induction proves a statement for all natural numbers using a base case and an inductive step.'
      },
      {
        term: 'division algorithm',
        href: 'https://en.wikipedia.org/wiki/Euclidean_division',
        tooltip: 'For integers m and n > 0, there exist unique q and r with m = qn + r and 0 <= r < n.'
      },
      {
        term: 'quotient',
        href: 'https://en.wikipedia.org/wiki/Quotient',
        tooltip: 'In division, the quotient is the whole-number count of how many times the divisor fits.'
      },
      {
        term: 'remainder',
        href: 'https://en.wikipedia.org/wiki/Remainder',
        tooltip: 'The remainder is what is left after dividing when equal groups can no longer be formed.'
      },
      {
        term: 'commutative diagram',
        href: 'https://en.wikipedia.org/wiki/Commutative_diagram',
        tooltip: 'A commutative diagram shows that different paths of composed steps lead to the same result.'
      },
      {
        term: 'proof',
        href: 'https://en.wikipedia.org/wiki/Mathematical_proof',
        tooltip: 'A proof is a logically valid argument that establishes a mathematical claim.'
      },
      {
        term: 'algorithm',
        href: 'https://en.wikipedia.org/wiki/Algorithm',
        tooltip: 'An algorithm is a finite, precise sequence of steps for solving a class of problems.'
      },
      {
        term: 'curry-howard-lambek correspondence',
        href: 'https://en.wikipedia.org/wiki/Curry%E2%80%93Howard_correspondence',
        tooltip: 'This correspondence links proofs, programs, and categorical structure as different views of the same logic.'
      }
    ];

    // Exported for future expansion (e.g., adding terms in one place).
    window.bookGlossary = glossaryEntries;

    const applyGlossaryLinks = function(root) {
      if (!root || !glossaryEntries.length) {
        return;
      }

      const skipTags = new Set(['A', 'CODE', 'PRE', 'SCRIPT', 'STYLE', 'TEXTAREA', 'SVG']);
      // Chip labels are UI, not prose. Keep glossary autolinking out of both
      // the homepage circuit and reusable circuit/topic widgets so their
      // deliberately chosen display fonts and icons remain intact.
      const glossarySkipSelector = [
        '.home-circuit-board', '.home-circuit-unit', '.home-circuit-branch',
        '.home-circuit-cpu', '.home-circuit-author', '.home-circuit-memory-card',
        '.home-circuit-detail', '.topic-graph', '.circuit'
      ].join(', ');
      const terms = glossaryEntries
        .map(function(entry) { return entry.term; })
        .filter(Boolean)
        .sort(function(a, b) { return b.length - a.length; });

      if (!terms.length) {
        return;
      }

      const escapeRegex = function(text) {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      };

      const glossaryMap = new Map(
        glossaryEntries.map(function(entry) {
          return [entry.term.toLowerCase(), entry];
        })
      );

      const linkedTerms = new Set();
      const termRegex = new RegExp('\\b(' + terms.map(escapeRegex).join('|') + ')\\b', 'gi');
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const textNodes = [];

      while (walker.nextNode()) {
        const node = walker.currentNode;
        const parent = node.parentElement;

        if (!parent) {
          continue;
        }
        if (skipTags.has(parent.tagName)) {
          continue;
        }
        if (parent.closest('.mermaid, .sourceCode, .python-shaded')) {
          continue;
        }
        if (parent.closest(glossarySkipSelector)) {
          continue;
        }
        if (!node.nodeValue || !node.nodeValue.trim()) {
          continue;
        }

        textNodes.push(node);
      }

      textNodes.forEach(function(node) {
        if (!termRegex.test(node.nodeValue)) {
          termRegex.lastIndex = 0;
          return;
        }
        termRegex.lastIndex = 0;

        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match = termRegex.exec(node.nodeValue);
        let changed = false;

        while (match) {
          const matchedText = match[0];
          const lowerTerm = matchedText.toLowerCase();
          const entry = glossaryMap.get(lowerTerm);
          const start = match.index;
          const end = start + matchedText.length;

          if (!entry || linkedTerms.has(lowerTerm)) {
            match = termRegex.exec(node.nodeValue);
            continue;
          }

          if (start > lastIndex) {
            fragment.appendChild(document.createTextNode(node.nodeValue.slice(lastIndex, start)));
          }

          const link = document.createElement('a');
          link.href = entry.href;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.className = 'glossary-link';
          link.textContent = matchedText;
          link.title = entry.tooltip;
          link.setAttribute('aria-label', matchedText + ': ' + entry.tooltip);

          fragment.appendChild(link);
          linkedTerms.add(lowerTerm);
          lastIndex = end;
          changed = true;
          match = termRegex.exec(node.nodeValue);
        }

        if (!changed) {
          return;
        }

        if (lastIndex < node.nodeValue.length) {
          fragment.appendChild(document.createTextNode(node.nodeValue.slice(lastIndex)));
        }

        node.parentNode.replaceChild(fragment, node);
      });
    };

    const applyReadingStats = function(root) {
      // The homepage is itself a visual circuit navigator rather than a
      // reading page. A word-count banner competes with the board and reports
      // mostly component labels, so omit the reading chrome there.
      if (document.body.classList.contains('homepage')) {
        root.querySelectorAll('[data-reading-stats]').forEach(function(node) {
          node.remove();
        });
        return;
      }
      const contentArea = root.querySelector('main.content, #quarto-document-content, article, #quarto-content, .quarto-content') || root;
      if (!contentArea) {
        return;
      }

      let statsNode = root.querySelector('[data-reading-stats]');
      if (!statsNode) {
        statsNode = document.createElement('div');
        statsNode.className = 'reading-stats';
        statsNode.setAttribute('data-reading-stats', '');
        statsNode.setAttribute('aria-label', 'Reading statistics');
      }

      if (!window.BookStudyTime) {
        return;
      }

      const metrics = window.BookStudyTime.collectStudyMetrics(contentArea);
      const estimate = window.BookStudyTime.calculateStudyTime(metrics);
      const hasActivities = estimate.activitySeconds > 0;

      statsNode.innerHTML =
        '<span class="reading-stats__inner">' +
          '<span><span class="reading-stats__time">About ' + estimate.totalMinutes + ' minutes to study</span>' +
          (hasActivities
            ? '<br><span> ' + estimate.readingMinutes + ' minutes reading · ' + estimate.activityMinutes + ' additional minutes for activities</span>'
            : '') +
          '</span></span>';

      const pageNav = document.querySelector('nav.page-navigation');
      const insertTarget = pageNav && pageNav.parentNode ? pageNav.parentNode : contentArea;
      const titleBlock = contentArea.querySelector('header.quarto-title-block, header');

      if (pageNav && pageNav.parentNode) {
        insertTarget.insertBefore(statsNode, pageNav);
      } else if (titleBlock && titleBlock.parentNode && !statsNode.parentNode) {
        titleBlock.parentNode.insertBefore(statsNode, titleBlock.nextSibling);
      } else if (!statsNode.parentNode) {
        contentArea.insertBefore(statsNode, contentArea.firstChild);
      }
    };

    const lightbox = document.createElement('div');
    lightbox.className = 'quarto-image-lightbox';
    lightbox.innerHTML = '<button type="button" class="quarto-image-lightbox__close" aria-label="Close image">&times;</button><img alt="">';
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector('img');
    const closeLightbox = function() {
      lightbox.classList.remove('is-open');
      lightboxImage.removeAttribute('src');
      lightboxImage.removeAttribute('alt');
    };

    lightbox.addEventListener('click', function(event) {
      if (event.target === lightbox || event.target.classList.contains('quarto-image-lightbox__close')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        closeLightbox();
      }
    });

    document.addEventListener('click', function(event) {
      const image = event.target.closest('#quarto-content img, .quarto-content img, #quarto-document-content img');
      if (!image) {
        return;
      }

      event.preventDefault();
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt || '';
      lightbox.classList.add('is-open');
    });

    const getMermaidSource = function(block) {
      if (!block) {
        return '';
      }

      const directCode = block.querySelector(':scope > code');
      if (directCode) {
        return directCode.textContent || '';
      }

      return block.textContent || '';
    };

    const normalizeMermaidBlocks = function(root) {
      root.querySelectorAll('pre.sourceCode.mermaid, pre.mermaid').forEach(function(preBlock) {
        const source = getMermaidSource(preBlock).trim();
        const normalized = document.createElement('pre');
        normalized.className = 'mermaid';
        normalized.textContent = source;

        let replaceTarget = preBlock;
        const sourceContainer = preBlock.closest('.sourceCode');
        const copyScaffold = preBlock.closest('.code-copy-outer-scaffold');

        if (copyScaffold && copyScaffold.querySelector('pre') === preBlock) {
          replaceTarget = copyScaffold;
        } else if (sourceContainer && sourceContainer.querySelector('pre') === preBlock) {
          replaceTarget = sourceContainer;
        }

        replaceTarget.replaceWith(normalized);
      });
    };

    const buildMermaidTabs = function(root) {
      let mermaidCounter = 0;
      root.querySelectorAll('pre.mermaid, div.mermaid').forEach(function(block) {
        if (!block || block.closest('.panel-tabset') || block.closest('.mermaid-auto-tabset')) {
          return;
        }

        const source = getMermaidSource(block).trim();
        if (!source) {
          return;
        }

        mermaidCounter += 1;
        const instanceId = 'mermaid-auto-' + mermaidCounter;

        const wrapper = document.createElement('div');
        wrapper.className = 'panel-tabset nav-pills mermaid-auto-tabset';

        const tabs = document.createElement('ul');
        tabs.className = 'nav nav-tabs';
        tabs.setAttribute('role', 'tablist');

        const diagramTabItem = document.createElement('li');
        diagramTabItem.className = 'nav-item';
        diagramTabItem.setAttribute('role', 'presentation');

        const diagramTab = document.createElement('a');
        diagramTab.className = 'nav-link active';
        diagramTab.id = instanceId + '-diagram-tab';
        diagramTab.setAttribute('data-bs-toggle', 'tab');
        diagramTab.setAttribute('data-bs-target', '#' + instanceId + '-diagram');
        diagramTab.setAttribute('role', 'tab');
        diagramTab.setAttribute('aria-controls', instanceId + '-diagram');
        diagramTab.setAttribute('aria-selected', 'true');
        diagramTab.href = '';
        diagramTab.textContent = 'Diagram';
        diagramTabItem.appendChild(diagramTab);

        const sourceTabItem = document.createElement('li');
        sourceTabItem.className = 'nav-item';
        sourceTabItem.setAttribute('role', 'presentation');

        const sourceTab = document.createElement('a');
        sourceTab.className = 'nav-link';
        sourceTab.id = instanceId + '-source-tab';
        sourceTab.setAttribute('data-bs-toggle', 'tab');
        sourceTab.setAttribute('data-bs-target', '#' + instanceId + '-source');
        sourceTab.setAttribute('role', 'tab');
        sourceTab.setAttribute('aria-controls', instanceId + '-source');
        sourceTab.setAttribute('aria-selected', 'false');
        sourceTab.href = '';
        sourceTab.textContent = 'Source';
        sourceTabItem.appendChild(sourceTab);

        tabs.appendChild(diagramTabItem);
        tabs.appendChild(sourceTabItem);

        const tabContent = document.createElement('div');
        tabContent.className = 'tab-content nav-pills';

        const diagramPane = document.createElement('div');
        diagramPane.className = 'tab-pane active';
        diagramPane.id = instanceId + '-diagram';
        diagramPane.setAttribute('role', 'tabpanel');
        diagramPane.setAttribute('aria-labelledby', instanceId + '-diagram-tab');

        const diagramBlock = document.createElement('pre');
        diagramBlock.className = 'mermaid';
        diagramBlock.textContent = source;
        diagramPane.appendChild(diagramBlock);

        const sourcePane = document.createElement('div');
        sourcePane.className = 'tab-pane';
        sourcePane.id = instanceId + '-source';
        sourcePane.setAttribute('role', 'tabpanel');
        sourcePane.setAttribute('aria-labelledby', instanceId + '-source-tab');

        const sourcePre = document.createElement('pre');
        const sourceCode = document.createElement('code');
        sourceCode.className = 'language-mermaid';
        sourceCode.textContent = source;
        sourcePre.appendChild(sourceCode);
        sourcePane.appendChild(sourcePre);

        tabContent.appendChild(diagramPane);
        tabContent.appendChild(sourcePane);

        wrapper.appendChild(tabs);
        wrapper.appendChild(tabContent);

        block.replaceWith(wrapper);
      });
    };

    const cacheMermaidSource = function(root) {
      root.querySelectorAll('pre.mermaid, div.mermaid').forEach(function(block) {
        if (!block.dataset.mermaidSource) {
          block.dataset.mermaidSource = block.textContent;
        }
      });
    };

    const resetMermaidBlocks = function(root) {
      root.querySelectorAll('pre.mermaid[data-mermaid-source], div.mermaid[data-mermaid-source]').forEach(function(block) {
        block.removeAttribute('data-processed');
        block.textContent = block.dataset.mermaidSource;
      });
    };

    const prepareMermaidBlocks = function(root) {
      normalizeMermaidBlocks(root);
      buildMermaidTabs(root);
      cacheMermaidSource(root);
    };

    const renderMermaid = function(root) {
      prepareMermaidBlocks(root);
      if (!window.mermaid || typeof window.mermaid.run !== 'function') {
        return;
      }
      const nodes = root.querySelectorAll('pre.mermaid:not([data-processed]), div.mermaid:not([data-processed])');
      if (nodes.length === 0) {
        return;
      }
      window.mermaid.run({ nodes: Array.from(nodes), suppressErrors: true });
    };

    const collapseSidebarToCurrentPart = function() {
      const sidebar = document.querySelector('#quarto-sidebar');
      if (!sidebar) {
        return;
      }

      const partSections = Array.from(sidebar.querySelectorAll('ul.sidebar-section.depth1.collapse'));
      if (!partSections.length) {
        return;
      }

      const activeLink = sidebar.querySelector('a.sidebar-link.active');
      const activeSection = activeLink ? activeLink.closest('ul.sidebar-section.depth1.collapse') : null;

      partSections.forEach(function(section) {
        const isCurrentPart = activeSection === section;
        if (isCurrentPart) {
          section.classList.add('show');
        } else {
          section.classList.remove('show');
        }

        const sectionTarget = '#' + section.id;
        sidebar.querySelectorAll('[data-bs-target]').forEach(function(toggle) {
          if (toggle.getAttribute('data-bs-target') === sectionTarget) {
            toggle.setAttribute('aria-expanded', isCurrentPart ? 'true' : 'false');
          }
        });
      });
    };

    const linkPartHeadersToPartHomepages = function() {
      const sidebar = document.querySelector('#quarto-sidebar');
      if (!sidebar) {
        return;
      }

      const partHeaders = sidebar.querySelectorAll('li.sidebar-item-section > div.sidebar-item-container > a.sidebar-item-text.sidebar-link[data-bs-target]');
      partHeaders.forEach(function(partHeader) {
        const sectionSelector = partHeader.getAttribute('data-bs-target');
        if (!sectionSelector || !sectionSelector.startsWith('#')) {
          return;
        }

        const section = sidebar.querySelector(sectionSelector);
        if (!section) {
          return;
        }

        const firstChapterLink = section.querySelector('a.sidebar-item-text.sidebar-link[href]');
        if (!firstChapterLink) {
          return;
        }

        partHeader.setAttribute('href', firstChapterLink.getAttribute('href'));
        partHeader.removeAttribute('data-bs-toggle');
        partHeader.removeAttribute('data-bs-target');
        partHeader.removeAttribute('role');
        partHeader.removeAttribute('aria-expanded');
        partHeader.classList.remove('collapsed');
      });
    };

    let enhancementsHaveRun = false;

    const runEnhancements = function() {
      if (enhancementsHaveRun) {
        return;
      }
      enhancementsHaveRun = true;

      const contentRoot = document.querySelector('#quarto-content, .quarto-content, #quarto-document-content, main.content') || document.body;

      applyCodeWatermarks(contentRoot);
      applyEmojiAliases(contentRoot);
      applyGlossaryLinks(contentRoot);
      applyReadingStats(contentRoot);
      prepareMermaidBlocks(document);

      // Initialize mermaid when available. If loading fails,
      // source tabs still work for accessibility.
      if (window.mermaid && typeof window.mermaid.initialize === 'function') {
        window.mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          securityLevel: 'loose',
          themeVariables: {
            background: '#f7f3e8',
            primaryColor: '#f7f3e8',
            primaryTextColor: '#1f211d',
            primaryBorderColor: '#1f211d',
            secondaryColor: '#e5b52f',
            secondaryTextColor: '#1f211d',
            secondaryBorderColor: '#1f211d',
            tertiaryColor: '#d94b35',
            tertiaryTextColor: '#ffffff',
            tertiaryBorderColor: '#1f211d',
            lineColor: '#1f211d',
            textColor: '#1f211d',
            mainBkg: '#f7f3e8',
            nodeBorder: '#1f211d',
            clusterBkg: '#d9e4e5',
            clusterBorder: '#245a73',
            edgeLabelBackground: '#f7f3e8'
          }
        });
      }
      renderMermaid(document);
      linkPartHeadersToPartHomepages();
      collapseSidebarToCurrentPart();

      // Mermaid blocks inside hidden tab panels may need rendering
      // when the tab becomes visible.
      document.querySelectorAll('[data-bs-toggle="tab"], [data-bs-toggle="pill"]').forEach(function(tab) {
        tab.addEventListener('shown.bs.tab', function(event) {
          const targetSelector = event.target.getAttribute('data-bs-target');
          if (!targetSelector) {
            renderMermaid(document);
            return;
          }

          const pane = document.querySelector(targetSelector);
          if (pane) {
            resetMermaidBlocks(pane);
            renderMermaid(pane);
          }
        });
      });
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runEnhancements, { once: true });
    } else {
      runEnhancements();
    }

    window.addEventListener('load', runEnhancements, { once: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEnhancements, { once: true });
  } else {
    initializeEnhancements();
  }
