/*
 * Freshman-comprehension study-time estimator.
 *
 * These constants are deliberately kept together so editors can tune the
 * expected time a first-year mathematics or computing student needs to
 * understand a page. They are not a measure of reading speed alone.
 */
(function(global) {
  'use strict';

  const FRESHMAN_COMPREHENSION_TIME = Object.freeze({
    proseWordsPerMinute: 145,
    secondsPerInlineMathExpression: 8,
    secondsPerDisplayMathBlock: 25,
    secondsPerCodeBlock: 30,
    secondsPerTable: 45,
    secondsPerExplanatoryFigure: 35,
    secondsPerWorkedExample: 75,
    secondsPerExercise: 180,
    secondsPerInteractiveActivity: 240,
    roundUpToMinutes: 5
  });

  const emptyMetrics = function() {
    return {
      proseWords: 0,
      inlineMathExpressions: 0,
      displayMathBlocks: 0,
      codeBlocks: 0,
      tables: 0,
      explanatoryFigures: 0,
      workedExamples: 0,
      exercises: 0,
      interactiveActivities: 0
    };
  };

  const calculateStudyTime = function(metrics, config) {
    const weights = config || FRESHMAN_COMPREHENSION_TIME;
    const values = Object.assign(emptyMetrics(), metrics || {});
    const readingSeconds =
      (values.proseWords / weights.proseWordsPerMinute * 60) +
      (values.inlineMathExpressions * weights.secondsPerInlineMathExpression) +
      (values.displayMathBlocks * weights.secondsPerDisplayMathBlock) +
      (values.codeBlocks * weights.secondsPerCodeBlock) +
      (values.tables * weights.secondsPerTable) +
      (values.explanatoryFigures * weights.secondsPerExplanatoryFigure) +
      (values.workedExamples * weights.secondsPerWorkedExample);
    const activitySeconds =
      (values.exercises * weights.secondsPerExercise) +
      (values.interactiveActivities * weights.secondsPerInteractiveActivity);
    const totalSeconds = readingSeconds + activitySeconds;
    const totalMinutes = Math.ceil(totalSeconds / 60 / weights.roundUpToMinutes) * weights.roundUpToMinutes;

    return {
      readingSeconds: readingSeconds,
      activitySeconds: activitySeconds,
      totalSeconds: totalSeconds,
      readingMinutes: Math.ceil(readingSeconds / 60),
      activityMinutes: Math.ceil(activitySeconds / 60),
      totalMinutes: totalMinutes
    };
  };

  // Explicit annotations take precedence. The remaining selectors recognize
  // Quarto callouts and the repository's existing teaching widgets.
  const READING_KIND_SELECTORS = {
    'worked-example': '[data-reading-kind="worked-example"], .callout-example, .callout[data-callout-family="example"]',
    exercise: '[data-reading-kind="exercise"], .callout-exercise, .callout[data-callout-family="exercise"]',
    interactive: '[data-reading-kind="interactive"], [data-webllm-widget="true"], .webllm-chat, .py-jl-widget, .quick-check, .logic-quiz, .branch-spin-widget',
    'explanatory-figure': '[data-reading-kind="explanatory-figure"]'
  };

  const EXCLUDED_CONTENT_SELECTOR = [
    '[data-reading-stats]', 'script', 'style', 'template', 'noscript', 'iframe',
    'object', 'embed', 'nav', '[role="navigation"]', '.page-navigation',
    '.quarto-title-block', '#title-block-header', '#TOC', '.toc', '.sidebar',
    '.sidebar-navigation', '[hidden]', '[aria-hidden="true"]', '.visually-hidden',
    '.sr-only', '.content-hidden', '[data-reading-exclude]'
  ].join(', ');

  const isVisible = function(element) {
    if (!element || element.nodeType !== 1) {
      return true;
    }
    for (let node = element; node && node.nodeType === 1; node = node.parentElement) {
      if (node.hidden || node.getAttribute('aria-hidden') === 'true' || node.matches(EXCLUDED_CONTENT_SELECTOR)) {
        return false;
      }
      if (global.getComputedStyle) {
        const style = global.getComputedStyle(node);
        if (style && (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse')) {
          return false;
        }
      }
    }
    return true;
  };

  const uniqueVisibleRoots = function(nodes) {
    const visible = Array.from(new Set(nodes)).filter(isVisible);
    return visible.filter(function(node) {
      return !visible.some(function(other) {
        return other !== node && other.contains(node);
      });
    });
  };

  const countVisibleRoots = function(content, selector) {
    return uniqueVisibleRoots(content.querySelectorAll(selector)).length;
  };

  const isDisplayMath = function(node) {
    return node.matches('.math.display, .katex-display, .MathJax_Display, mjx-container[display="true"], [data-math-display="true"]') ||
      node.closest('.math.display, .katex-display, .MathJax_Display, mjx-container[display="true"], [data-math-display="true"]') !== null;
  };

  const mathRoots = function(content) {
    return uniqueVisibleRoots(content.querySelectorAll(
      '.math, .katex, .katex-display, .MathJax, .MathJax_Display, mjx-container, [data-math-display="true"]'
    ));
  };

  const isInstructionalFigure = function(figure) {
    if (figure.matches('[data-reading-kind="explanatory-figure"]')) {
      return true;
    }
    if (figure.matches('.decorative, .icon, [aria-hidden="true"]') || figure.querySelector('[data-reading-decorative], img[alt=""]')) {
      return false;
    }
    const caption = figure.querySelector('figcaption');
    if (caption && (caption.textContent || '').trim()) {
      return true;
    }
    const image = figure.querySelector('img[alt]');
    return Boolean(image && (image.getAttribute('alt') || '').trim());
  };

  const countProseWords = function(content, math) {
    const mathSet = new Set(math);
    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
    let words = 0;
    let textNode = walker.nextNode();
    while (textNode) {
      const parent = textNode.parentElement;
      const isMathText = parent && Array.from(mathSet).some(function(root) {
        return root.contains(parent);
      });
      if (parent && !isMathText && isVisible(parent) && !parent.closest(EXCLUDED_CONTENT_SELECTOR + ', pre, code')) {
        const text = (textNode.nodeValue || '').trim();
        if (text) {
          words += text.split(/\s+/).filter(Boolean).length;
        }
      }
      textNode = walker.nextNode();
    }
    return words;
  };

  const countSpecialContent = function(content, kind) {
    const selector = READING_KIND_SELECTORS[kind];
    if (!selector) {
      return 0;
    }
    return uniqueVisibleRoots(content.querySelectorAll(selector)).filter(function(node) {
      // A worked example already carries its comprehension allowance. Nested
      // exercises or figures are not a second special item; an interactive
      // widget remains separate because it asks the student to do an activity.
      return kind === 'interactive' || !node.parentElement || !node.parentElement.closest(READING_KIND_SELECTORS['worked-example']);
    }).length;
  };

  const collectStudyMetrics = function(content) {
    const metrics = emptyMetrics();
    if (!content) {
      return metrics;
    }

    const math = mathRoots(content);
    metrics.proseWords = countProseWords(content, math);
    metrics.displayMathBlocks = math.filter(isDisplayMath).length;
    metrics.inlineMathExpressions = math.length - metrics.displayMathBlocks;
    metrics.codeBlocks = countVisibleRoots(content, 'pre');
    metrics.tables = countVisibleRoots(content, 'table');
    metrics.workedExamples = countSpecialContent(content, 'worked-example');
    metrics.exercises = countSpecialContent(content, 'exercise');
    metrics.interactiveActivities = countSpecialContent(content, 'interactive');
    metrics.explanatoryFigures = uniqueVisibleRoots(content.querySelectorAll('figure, .quarto-figure, [data-reading-kind="explanatory-figure"]'))
      .filter(function(figure) {
        return (!figure.parentElement || !figure.parentElement.closest(READING_KIND_SELECTORS['worked-example'])) && isInstructionalFigure(figure);
      }).length;
    return metrics;
  };

  global.BookStudyTime = Object.freeze({
    FRESHMAN_COMPREHENSION_TIME: FRESHMAN_COMPREHENSION_TIME,
    calculateStudyTime: calculateStudyTime,
    collectStudyMetrics: collectStudyMetrics,
    emptyMetrics: emptyMetrics
  });
})(typeof window !== 'undefined' ? window : globalThis);
