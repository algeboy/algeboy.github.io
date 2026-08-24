(() => {
  const plot = document.getElementById('viewpoint-map');
  const key = document.getElementById('viewpoint-key');
  if (!plot || !key) return;

  const labels = {
    education: ['Su', 'Economist', 'Conrad Wolfram', 'Yahoo', 'Lanier'],
    research: ['Bessis', 'Williamson', 'Tao', 'Weinreich', 'Gowers', 'Avigad', 'Tsimerman', 'Riehl'],
    governance: ['Leiden'],
    baseline: ['AI Snake Oil', 'LeCun', 'Marcus', 'S. Wolfram'],
    media: ['Carroll', 'Jaimungal', 'Hossenfelder', 'Keating', 'Quanta: Cepelewicz', 'Quanta: Strogatz']
  };

  const points = [...plot.querySelectorAll('[data-category]')];
  const labelNodes = [...plot.querySelectorAll('.point-label text')];
  labelNodes.forEach((node) => {
    const category = Object.entries(labels).find(([, names]) => names.includes(node.textContent))?.[0];
    if (category) node.dataset.category = category;
  });

  const nodes = [...points, ...labelNodes.filter((node) => node.dataset.category)];
  const visible = new Set([...key.querySelectorAll('[data-filter]')].map((button) => button.dataset.filter));

  const refresh = () => {
    nodes.forEach((node) => {
      node.style.display = visible.has(node.dataset.category) ? '' : 'none';
      node.style.opacity = '';
    });
  };

  key.querySelectorAll('[data-filter]').forEach((button) => {
    const category = button.dataset.filter;

    button.addEventListener('mouseenter', () => {
      nodes.forEach((node) => {
        if (visible.has(node.dataset.category)) {
          node.style.opacity = node.dataset.category === category ? '1' : '.18';
        }
      });
    });

    button.addEventListener('mouseleave', refresh);

    button.addEventListener('click', () => {
      const isVisible = button.getAttribute('aria-pressed') === 'true';
      button.setAttribute('aria-pressed', String(!isVisible));
      if (isVisible) visible.delete(category);
      else visible.add(category);
      refresh();
    });
  });
})();
