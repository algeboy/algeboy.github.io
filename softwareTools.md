---
layout: page
title: Software / Tools
permalink: /softwareTools/
---

<style>
/* Software Tools Tile Layout */
.software-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding: 20px 0;
    width: 80%;
    max-width: 80%;
    margin: 0 auto;
}

@media (max-width: 1024px) {
    .software-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 640px) {
    .software-grid {
        grid-template-columns: 1fr;
    }
}

.software-tile {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    border: 2px solid var(--chalk-blue, #64b5f6);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
    cursor: pointer;
}

.software-tile:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.tile-header {
    padding: 20px 20px 15px 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    gap: 15px;
}

.tile-icon {
    width: 60px;
    height: 60px;
    background: var(--chalk-blue, #64b5f6);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2em;
    color: white;
    flex-shrink: 0;
}

.tile-title {
    font-size: 1.4em;
    font-weight: bold;
    color: #333;
    margin: 0;
}

.tile-body {
    padding: 20px;
}

.tile-description {
    color: #666;
    line-height: 1.6;
    margin-bottom: 20px;
    min-height: 60px;
}

.tile-footer {
    padding: 15px 20px;
    background: #f8f9fa;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.tile-people {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.person-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    object-fit: cover;
}

.tile-link {
    color: var(--chalk-blue, #64b5f6);
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9em;
}

.tile-link:hover {
    text-decoration: underline;
}

.loading-message {
    text-align: center;
    padding: 40px;
    color: var(--chalk-white, #fff);
    font-size: 1.2em;
}
</style>

<div class="software-grid" id="software_and_tools">
  <div class="loading-message">Loading Software and Tools...</div>
</div>

<script src="/uploads/js/axios.min.js"></script>
<script>
// Updated software tools display with tile layout
let softwareListElem = document.getElementById("software_and_tools");

let getRepos = () => {
  // Fetch both thetensor-space repos and the specific Glassbox repo
  Promise.all([
    axios.get("https://api.github.com/orgs/thetensor-space/repos"),
    axios.get("https://api.github.com/repos/algeboy/Glassbox")
  ])
    .then(([tensorRepos, glassboxRepo]) => {
      // Combine the data - tensorRepos.data is array, glassboxRepo.data is single object
      const allRepos = [...tensorRepos.data, glassboxRepo.data];
      
      // Custom ordering: OpenDleto, TensorSpace, Glassbox, then the rest
      const priorityOrder = ['OpenDleto', 'TensorSpace', 'Glassbox'];
      
      // Sort repositories with priority order first
      const sortedData = allRepos.sort((a, b) => {
        const aIndex = priorityOrder.indexOf(a.name);
        const bIndex = priorityOrder.indexOf(b.name);
        
        // If both are in priority list, sort by priority order
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        // If only a is in priority list, put it first
        if (aIndex !== -1) return -1;
        // If only b is in priority list, put it first
        if (bIndex !== -1) return 1;
        // If neither is in priority list, sort alphabetically
        return a.name.localeCompare(b.name);
      });

      softwareListElem.innerHTML = sortedData.map((repo, id) => {
        // Generate icon based on repo name or type
        let icon = getRepoIcon(repo.name, repo.language);
        
        return `
          <div class="software-tile" onclick="window.open('${repo.html_url}#readme', '_blank')">
            <div class="tile-header">
              <div class="tile-icon">${icon}</div>
              <h3 class="tile-title">${repo.name}</h3>
            </div>
            <div class="tile-body">
              <div class="tile-description" id="${repo.name}-${id}-description">
                ${repo.description || 'A software tool from the Tensor Space collection.'}
              </div>
            </div>
            <div class="tile-footer">
              <div class="tile-people" id="${repo.name}-${id}-contributors-list">
                <!-- Contributors will be loaded here -->
              </div>
              <a href="${repo.html_url}#readme" class="tile-link" target="_blank">View Details →</a>
            </div>
          </div>
        `;
      }).join("");

      sortedData.forEach((repo, id) => {
        getRepoReadmeSnippet(repo, id);
        getRepoContributors(repo, id);
      });
    })
    .catch(() => {
      softwareListElem.innerHTML = '<div class="loading-message">Failed to load software tools. Please reload page.</div>';
    });
}

// Generate appropriate icon for repository
function getRepoIcon(name, language) {
  const iconMap = {
    'python': '🐍',
    'javascript': '📱',
    'typescript': '📘',
    'java': '☕',
    'c': '⚙️',
    'c++': '🔧',
    'julia': '🔮',
    'sage': '🧮',
    'magma': '🎯',
    'gap': '🔗'
  };
  
  // Check language first
  if (language && iconMap[language.toLowerCase()]) {
    return iconMap[language.toLowerCase()];
  }
  
  // Check name patterns
  const nameLower = name.toLowerCase();
  if (nameLower.includes('tensor') || nameLower.includes('algebra')) return '🧮';
  if (nameLower.includes('matrix') || nameLower.includes('linear')) return '📊';
  if (nameLower.includes('compute') || nameLower.includes('calc')) return '⚙️';
  if (nameLower.includes('data') || nameLower.includes('analysis')) return '📈';
  if (nameLower.includes('graph') || nameLower.includes('plot')) return '📊';
  if (nameLower.includes('web') || nameLower.includes('site')) return '🌐';
  
  // Default icon
  return '💻';
}

let getRepoReadmeSnippet = (repo, id) => {
  let repoElem = document.getElementById(`${repo.name}-${id}-description`);

  axios.get(`https://raw.githubusercontent.com/${repo.full_name}/master/README.md`)
    .then(({ data }) => {
      let cleanText = data
        .replace(/\!\[.*\]\(.*\)/gi, "")
        .replace(/\[.*\]\(.*\)/gi, "")
        .replace(/_/gi, "")
        .replace(/\*/gi, "")
        .replace(/\#/gi, "")
        .trim();
      
      repoElem.innerHTML = cleanText.substring(0, 180) + (cleanText.length > 180 ? "..." : "");
    })
    .catch(() => {
      repoElem.innerHTML = repo.description || 'A software tool from the Tensor Space collection.';
    });
}

let getRepoContributors = (repo, id) => {
  let contributorsElem = document.getElementById(`${repo.name}-${id}-contributors-list`);

  axios.get(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/contributors`)
    .then(({ data }) => {
      const MAX_CONTRIBUTORS = 3; // Limit to 3 for better layout
      let myData = data.slice(0, MAX_CONTRIBUTORS);

      let contributorsHTML = myData.map(user => {
        return `<img class="person-icon" src="${user.avatar_url}" alt="${user.login}" title="${user.login}">`;
      }).join("");

      contributorsElem.innerHTML = contributorsHTML;
    })
    .catch(() => {
      // Show placeholder if contributors can't be loaded
      contributorsElem.innerHTML = '<div class="person-icon" style="background: #ddd; display: flex; align-items: center; justify-content: center; color: #999; font-size: 0.8em;">👤</div>';
    });
};

// Initialize
getRepos();
</script>