---
layout: page
width: expand
title: Publications
permalink: /publications/
---

<div class="publications-content">
    <h1>Publications & Research</h1>
    
    <div class="publication-item">
        <h3>Linear Data Structures in Modern Computing</h3>
        <p><strong>James B. Wilson</strong> - 2024</p>
        <p>Exploring the mathematical foundations of data science through tensor algebra and nilpotent structures. This comprehensive work bridges the gap between pure mathematics and practical data science applications.</p>
        <div class="publication-links">
            <a href="#" class="pub-link">PDF</a> | 
            <a href="#" class="pub-link">BibTeX</a> | 
            <a href="#" class="pub-link">DOI</a>
        </div>
    </div>

    <div class="publication-item">
        <h3>Tensor Products in Machine Learning Algorithms</h3>
        <p><strong>James B. Wilson</strong>, <em>Co-Author Name</em> - 2023</p>
        <p>Applications of distributive algebra in modern computational frameworks. Demonstrates how mathematical tensor operations can optimize machine learning model performance.</p>
        <div class="publication-links">
            <a href="#" class="pub-link">PDF</a> | 
            <a href="#" class="pub-link">BibTeX</a> | 
            <a href="#" class="pub-link">DOI</a>
        </div>
    </div>

    <div class="publication-item">
        <h3>Algebraic Foundations of Data Science</h3>
        <p><strong>James B. Wilson</strong> - 2023</p>
        <p>Mathematical structures underlying contemporary data analysis techniques. Provides theoretical framework for understanding data relationships through algebraic lens.</p>
        <div class="publication-links">
            <a href="#" class="pub-link">PDF</a> | 
            <a href="#" class="pub-link">BibTeX</a> | 
            <a href="#" class="pub-link">DOI</a>
        </div>
    </div>

    <div class="publication-item">
        <h3>Nilpotent Structures in Computational Mathematics</h3>
        <p><strong>James B. Wilson</strong>, <em>Research Team</em> - 2022</p>
        <p>Investigation of nilpotent algebraic structures and their applications in solving complex computational problems in various mathematical domains.</p>
        <div class="publication-links">
            <a href="#" class="pub-link">PDF</a> | 
            <a href="#" class="pub-link">BibTeX</a> | 
            <a href="#" class="pub-link">DOI</a>
        </div>
    </div>

    <div class="publication-item">
        <h3>Multilinear Algebra Applications in Data Processing</h3>
        <p><strong>James B. Wilson</strong> - 2022</p>
        <p>Comprehensive analysis of how multilinear algebraic methods can be applied to improve data processing efficiency and accuracy in large-scale systems.</p>
        <div class="publication-links">
            <a href="#" class="pub-link">PDF</a> | 
            <a href="#" class="pub-link">BibTeX</a> | 
            <a href="#" class="pub-link">DOI</a>
        </div>
    </div>
</div>

<style>
.publications-content {
    padding: 20px 0;
}

.publication-item {
    margin-bottom: 40px;
    padding: 20px;
    border-left: 4px solid var(--chalk-blue);
    background: rgba(100, 181, 246, 0.1);
    border-radius: 0 12px 12px 0;
    transition: all 0.3s ease;
}

.publication-item:hover {
    background: rgba(100, 181, 246, 0.15);
    transform: translateX(5px);
}

.publication-item h3 {
    margin-bottom: 10px;
    color: var(--chalk-yellow);
    font-size: 1.4em;
}

.publication-item p {
    margin-bottom: 10px;
    color: var(--chalk-white);
    line-height: 1.6;
}

.publication-links {
    margin-top: 15px;
}

.pub-link {
    color: var(--chalk-green);
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s ease;
}

.pub-link:hover {
    color: var(--chalk-yellow);
    text-decoration: underline;
}
</style>
    font-size: 1.5em;
}

.chalkboard-paper h2:hover {
    color: #fff;
    text-decoration: underline;
}

.chalkboard-paper h3 {
    color: #C8C372;
    margin-bottom: 1em;
    font-size: 1.2em;
}

.chalkboard-paper .content {
    color: #b2ffb2;
    margin-top: 1em;
    line-height: 1.6;
}

.chalkboard-paper .authors {
    color: #87ceeb;
    font-style: italic;
    margin-bottom: 0.5em;
}

.chalkboard-paper .journal {
    color: #C8C372;
    margin-bottom: 1em;
    font-size: 0.9em;
}

.chalkboard-paper .research-area {
    color: #87ceeb;
    font-style: italic;
    margin-bottom: 1em;
}

.chalkboard-paper .description {
    color: #ddd;
    margin-top: 0.5em;
    font-size: 0.95em;
}

.chalkboard-paper .links {
    margin-top: 1.5em;
}

.chalkboard-paper .links a {
    color: #ffeb3b;
    text-decoration: none;
    margin-right: 1em;
    padding: 0.3em 0.8em;
    border: 1px solid #ffeb3b;
    border-radius: 4px;
    transition: all 0.3s ease;
    display: inline-block;
    margin-bottom: 0.5em;
}

.chalkboard-paper .links a:hover {
    <!-- background: #ffeb3b; -->
    color: #222;
}

/* Scroll indicator */
.scroll-indicator {
    position: fixed;
    right: 2em;
    top: 50%;
    transform: translateY(-50%);
    writing-mode: vertical-lr;
    color: #666;
    font-size: 0.8em;
    z-index: 100;
}

@media (max-width: 768px) {
    .chalkboard-paper {
        margin: 1em;
        padding: 1.5em;
    }
    .scroll-indicator {
        display: none;
    }
}
</style>

<div class="scroll-indicator">Scroll to explore</div>

<script>
(function() {
    const publications = [
        {
            type: 'article',
            title: 'The threshold for subgroup profiles to agree is log n-2',
            journal: 'Theory of Computing, Vol. 15, pp. 1--25, 2019',
            content: '<p><strong>Theorem</strong> There are families of groups, no two of which are the same, but having all the same proper subgroups, quotient groups, conjugacy classes, character tables and automorphism groups.  And all this with groups have the maximum number of subgroups possible.</p><p>In short, to say two groups are different is not about finding a difference in structure.</p>',
            links: [
                { text: 'Offprint (CC-BY)', url: 'https://theoryofcomputing.org/articles/v015a019/' }
            ]
        },
        {
            type: 'book',
            title: 'Linear Data',
            subtitle: 'A comprehensive treatment of linear algebraic data structures and their applications',
            content: 'An in-depth exploration of how linear algebra provides the foundation for understanding data structures, algorithms, and computational methods in modern mathematics and computer science.',
            links: [
                { text: 'Read Online', url: 'https://algeboy.github.io/LinearData/' }
            ]
        },
        {
            type: 'article',
            title: 'Tensor Isomorphism by conjugacy of Lie algebras',
            authors: 'with Peter A. Brooksbank, Joshua Maglione',
            journal: 'J. Algebra 604 (2022) 790-807',
            links: [
                { text: 'arXiv:2005.04046', url: 'https://arxiv.org/abs/2005.04046' }
            ]
        },
        {
            type: 'article',
            title: 'Subgroups of simple groups are as diverse as possible',
            authors: 'with Martin Kassabov, Brady Tyburski',
            journal: 'Bulletin LMS, 54 (1) 2022',
            links: [
                { text: 'Offprint', url: 'https://londmathsoc.onlinelibrary.wiley.com/doi/full/10.1112/blms.12573' },
                { text: 'arXiv:2007.10439', url: 'https://arxiv.org/abs/2007.10439' }
            ]
        },
        {
            type: 'article',
            title: 'Group isomorphism is nearly-linear time for most orders',
            authors: 'with Heiko Dietrich',
            journal: 'Proc. IEEE Symp. on Found. Comp. Sci (FOCS) 2022, 457-467',
            links: [
                { text: 'Offprint', url: 'https://ieeexplore.ieee.org/document/9719733' }
            ]
        },
        {
            type: 'article',
            title: 'New Lie products for groups and their automorphisms',
            journal: 'J. Group Theory, 24 (4) 2021',
            links: [
                { text: 'arXiv:1501.04670', url: 'https://arxiv.org/abs/1501.04670' }
            ]
        },
        {
            type: 'article',
            title: 'Exact sequences of inner automorphisms of tensors',
            authors: 'with Peter A. Brooksbank, Joshua Maglione',
            journal: 'J. Algebra 545 (2019) 43-65',
            links: [
                { text: 'arXiv:1812.00275', url: 'http://arxiv.org/abs/1812.00275' }
            ]
        },
        {
            type: 'article',
            title: 'Isomorphism testing of groups of cube-free order',
            authors: 'with Heiko Dietrich',
            journal: 'J. Algebra 545 (2019) 174-197',
            links: [
                { text: 'arXiv:1810.03467', url: 'http://arxiv.org/abs/1810.03467' }
            ]
        },
        {
            type: 'preprint',
            title: 'Isomorphism Invariant Metrics',
            authors: 'with P. Brooksbank, J. Maglione, E.A. O\'Brien',
            links: [
                { text: 'arXiv:2304.00465', url: 'https://arxiv.org/abs/2304.00465' }
            ]
        },
        {
            type: 'preprint',
            title: 'A spectral theory for transverse tensor operators',
            authors: 'with U. First, J.Maglione',
            links: [
                { text: 'arXiv:1911.02518', url: 'https://arxiv.org/abs/1911.02518' }
            ]
        },
        {
            type: 'preprint',
            title: 'Polynomial-time isomorphism testing of groups of most finite orders',
            authors: 'with H. Dietrich',
            links: [
                { text: 'arXiv:1806.08872', url: 'https://arxiv.org/abs/1806.08872' }
            ]
        },
        {
            type: 'software',
            title: 'TameGenus',
            content: 'Software for high-speed isomorphism for tame representations',
            authors: 'Co-written with Peter A. Brooksbank and Joshua Maglione',
            links: [
                { text: 'GitHub Repository', url: 'https://github.com/algeboy/TameGenus' }
            ]
        },
        {
            type: 'software',
            title: 'Multilinear Algebra Group',
            content: 'General purpose software developed for high-dimensional tensors',
            authors: 'Co-written with Josh Maglione, with contributions from P.A. Brooksbank',
            links: [
                { text: 'GitHub Repository', url: 'https://github.com/algeboy/eMAGma' },
                { text: 'MAGMA System', url: 'http://magma.maths.usyd.edu.au/magma/handbook/multilinear_algebra' }
            ]
        },
        {
            type: 'software',
            title: 'StarAlgebras',
            content: 'Software for algebras with involutions, isometry groups, and intersections of isometry groups',
            authors: 'Co-written with Peter A. Brooksbank',
            links: [
                { text: 'GitHub Repository', url: 'https://github.com/algeboy/StarAlge' },
                { text: 'MAGMA System', url: 'http://magma.maths.usyd.edu.au/magma/handbook/algebras_with_involution' }
            ]
        }
    ];

    function createChalkboardPaper(pub, index) {
        const paper = document.createElement('div');
        paper.className = 'chalkboard-paper';
        paper.style.transitionDelay = `${index * 0.1}s`;

        let linksHTML = '';
        if (pub.links) {
            linksHTML = '<div class="links">' + 
                pub.links.map(link => `<a href="${link.url}" target="_blank">${link.text}</a>`).join('') +
                '</div>';
        }

        let titleElement = '';
        if (pub.type === 'book') {
            titleElement = `<h2 onclick="window.open('${pub.links[0].url}', '_blank')">${pub.title}</h2>`;
        } else {
            titleElement = `<h2>${pub.title}</h2>`;
        }

        paper.innerHTML = `
            ${titleElement}
            ${pub.subtitle ? `<h3>${pub.subtitle}</h3>` : ''}
            ${pub.authors ? `<div class="authors">${pub.authors}</div>` : ''}
            ${pub.journal ? `<div class="journal">${pub.journal}</div>` : ''}
            ${pub.content ? `<div class="content">${pub.content}</div>` : ''}
            ${pub.description ? `<div class="description">${pub.description}</div>` : ''}
            ${linksHTML}
        `;

        return paper;
    }

    function loadPublications() {
        const container = document.getElementById('chalkboard-publications');
        publications.forEach((pub, index) => {
            const paper = createChalkboardPaper(pub, index);
            container.appendChild(paper);
        });
        revealOnScroll(); // Check initial state
    }

    function revealOnScroll() {
        document.querySelectorAll('.chalkboard-paper').forEach(paper => {
            const rect = paper.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                paper.classList.add('visible');
            }
        });
    }

    // Initialize
    loadPublications();
    
    // Scroll event
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(revealOnScroll, 10);
    });

    // Reveal first paper immediately
    setTimeout(() => {
        const firstPaper = document.querySelector('.chalkboard-paper');
        if (firstPaper) firstPaper.classList.add('visible');
    }, 500);
})();
</script>