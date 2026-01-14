---
layout: page
width: expand
---

<div class="custom-landing-section uk-container uk-container-small">
    <div class="uk-grid-small uk-flex-middle" uk-grid>
        <div class="uk-width-2-3@m">
            <h1 class="uk-heading-medium">Call me James</h1>
            <!-- <h2 class="uk-heading-small uk-text-muted">Professor of Mathematics</h2> -->
            <!-- <p class="uk-text-lead">Colorado State University</p> -->
            <p class="uk-text-large" align="center">
            <h2> Theorem.  All the following are equivalent.
             Nilpotent $\Leftrightarrow$ Tensors $\Leftrightarrow$ Data science</h2>
            </P>
            <p class="uk-text-large" align="left">
             <Strong>Proof:</strong>  
                If $x^n=0$ then power means there's a product$(\times)$.
                A zere $(0)$ needs a plus $(+)$. Times has to distribute $a\times (b+c)=a\times b+a\times c$.  
                Distributive multiplication goes through a tensor, which is 
                fancy speak for multiplication table.
                What's the difference between a 
                Multiplication table and a Data table?
                Nothing really.
                $\Box$
            </p>
        </div>
    </div>
</div>
<p/>
<H2> References </H2>
<div class="custom-landing-section uk-container uk-container-small">
    <div class="uk-grid-small uk-flex-middle" uk-grid>
        <div class="uk-width-1-3@m" algin="center">
            <!-- Professional headshot placeholder -->
            <div class="uk-text-center">
                <img id="profile-slideshow" src="/uploads/images/people/profile1.jpeg" alt="James B. Wilson" class="rounded uk-box-shadow-large" width="100" height="100"/>
            </div>
        </div>
            <div class="uk-margin-top">
                <a href="/about/" class="uk-button uk-button-primary uk-margin-small-right">About Me</a>
                <a href="/contact/" class="uk-button uk-button-default uk-margin-small-right">Contact</a>
                <a href="https://algeboy.github.io/LinearData/" class="uk-button uk-button-default">Linear Data Book</a>
            </div>
        </div>
    </div>
</div>

<script>
(function() {
    const profileImages = [
        '/uploads/images/people/profile1.jpeg',
        '/uploads/images/people/profile2.jpeg',
        '/uploads/images/people/profile3.jpeg',
        '/uploads/images/people/profile4.jpeg',
        '/uploads/images/people/friends1.jpeg',
        '/uploads/images/people/friends2.jpeg',
        '/uploads/images/people/friends3.jpeg',
        '/uploads/images/people/friends4.jpeg',
        '/uploads/images/people/friends5.jpeg',
        '/uploads/images/people/friends6.jpeg',
        '/uploads/images/people/friends7.jpeg',
        '/uploads/images/people/friends8.jpeg',
        '/uploads/images/people/friends9.jpeg',
        '/uploads/images/people/friends10.jpeg',
        '/uploads/images/people/friends11.jpeg',
        '/uploads/images/people/friends12.jpeg',
        '/uploads/images/people/friends13.jpeg',
        '/uploads/images/people/friends14.jpeg',
        '/uploads/images/people/friends15.jpeg',
        '/uploads/images/people/friends16.jpeg',
        '/uploads/images/people/friends17.jpeg',
        '/uploads/images/people/friends18.jpeg',
        '/uploads/images/people/friends19.jpeg',
        '/uploads/images/people/friends20.jpeg',
        '/uploads/images/people/friends21.jpeg',
        '/uploads/images/people/friends22.jpeg',
        '/uploads/images/people/friends23.jpeg',
        '/uploads/images/people/friends24.jpeg',
        '/uploads/images/people/friends25.jpeg',
        '/uploads/images/people/friends26.jpeg',
        '/uploads/images/people/firends27.jpeg',
        '/uploads/images/people/friends28.jpeg',
        '/uploads/images/people/friends29.jpeg',
        '/uploads/images/people/friends30.jpeg',
        '/uploads/images/people/friends31.jpeg',
        '/uploads/images/people/friends32.jpeg',
        '/uploads/images/people/friends33.jpeg'
    ];
    
    let currentIndex = 0;
    const imgElement = document.getElementById('profile-slideshow');
    
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // Start with profile1, then shuffle the rest
    const remainingImages = profileImages.slice(1);
    const shuffledImages = [profileImages[0], ...shuffleArray(remainingImages)];
    
    function changeImage() {
        currentIndex = (currentIndex + 1) % shuffledImages.length;
        imgElement.src = shuffledImages[currentIndex];
    }
    
    // Change image every 3 seconds
    setInterval(changeImage, 3000);
})();
</script>

<div class="uk-section uk-section-muted">
    <div class="uk-container uk-container-small">
        <h2 class="uk-heading-small uk-text-center">Research Interests</h2>
        <div class="uk-grid-match uk-child-width-1-3@m uk-child-width-1-1@s uk-margin-large-top" uk-grid>
            <div class="uk-text-center">
                <span uk-icon="icon: database; ratio: 3" class="uk-text-primary"></span>
                <h3 class="uk-margin-top">Linear Data Structures</h3>
                <p>Developing mathematical frameworks for understanding and processing data with underlying linear structure.</p>
            </div>
            <div class="uk-text-center">
                <span uk-icon="icon: settings; ratio: 3" class="uk-text-primary"></span>
                <h3 class="uk-margin-top">Tensor Analysis</h3>
                <p>Exploring tensor spaces, decompositions, and applications to computational problems and machine learning.</p>
            </div>
            <div class="uk-text-center">
                <span uk-icon="icon: code; ratio: 3" class="uk-text-primary"></span>
                <h3 class="uk-margin-top">Computational Algebra</h3>
                <p>Building algorithms and software tools for solving isomorphism problems and algebraic computations.</p>
            </div>
        </div>
    </div>
</div>

<div class="uk-section">
    <div class="uk-container uk-container-small">
        <div class="uk-text-center">
            <h2 class="uk-heading-small">Current Focus</h2>
            <p class="uk-text-large uk-width-3-4@m uk-margin-auto">
                How can we recognize that data recorded in different ways represents the same information? This fundamental question of <em>isomorphism</em> has been challenging researchers for over a century. My work focuses on cases where data is parameterized by vector spaces, studying any data structure with obvious or hidden distributive properties.
            </p>
        </div>
    </div>
</div>

<div class="uk-section uk-section-default">
    <div class="uk-container uk-container-small">
        <h2 class="uk-heading-small uk-text-center">Recent Publications & Preprints</h2>
        <div class="uk-margin-large-top">
            <div class="uk-card uk-card-default uk-card-body uk-margin">
                <h3 class="uk-card-title">Featured Research</h3>
                <p>Recent work on isomorphism problems, tensor decompositions, and computational algebra methods for analyzing linear data structures.</p>
                <a href="https://algeboy.github.io/LinearData/" class="uk-button uk-button-text">View Linear Data Book →</a>
            </div>
            <div class="uk-grid-match uk-child-width-1-2@m" uk-grid>
                <div>
                    <div class="uk-card uk-card-default uk-card-body">
                        <h4>Tensor Categories & Applications</h4>
                        <p class="uk-text-small uk-text-muted">Work on tensor categories and their applications to computational problems.</p>
                    </div>
                </div>
                <div>
                    <div class="uk-card uk-card-default uk-card-body">
                        <h4>Group Theory & Algorithms</h4>
                        <p class="uk-text-small uk-text-muted">Algorithmic approaches to group decomposition and isomorphism testing.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

{% include boxes.html columns="3" title="Browse Topics" subtitle="" %}

{% include custom-hero-search.html %}

<div class="uk-section uk-section-muted">
    <div class="uk-container uk-container-small">
        <h2 class="uk-heading-small uk-text-center">Recent Events & Workshops</h2>
        <p class="uk-text-center uk-text-lead">Conferences, workshops, and collaborative research activities</p>
        <div class="uk-grid-match uk-child-width-1-2@m uk-margin-large-top" uk-grid>
            <div>
                <div class="uk-card uk-card-default uk-card-body">
                    <h4>Groups, Nilpotence, and Tensors 2023</h4>
                    <p class="uk-text-small uk-text-muted">Regional workshop on groups, nilpotent structures, and multilinear algebra</p>
                    <a href="/events/" class="uk-button uk-button-text">View All Events →</a>
                </div>
            </div>
            <div>
                <div class="uk-card uk-card-default uk-card-body">
                    <h4>Tensor Analysis Research Group</h4>
                    <p class="uk-text-small uk-text-muted">Regular seminars and collaborative research in tensor analysis</p>
                    <a href="/docs/tensorSpaces/" class="uk-button uk-button-text">Learn More →</a>
                </div>
            </div>
        </div>
    </div>
</div>

{% include videos.html columns="2" title="Video Content" subtitle="Watch video tutorials and content via The Tensor Space" %}

<div class="uk-section uk-section-default">
    <div class="uk-container uk-container-small">
        <h2 class="uk-heading-small uk-text-center">Software & Tools</h2>
        <p class="uk-text-center uk-text-lead">Open-source computational tools for algebraic research</p>
        <div class="uk-grid-match uk-child-width-1-3@m uk-margin-large-top" uk-grid>
            <div class="uk-text-center">
                <span uk-icon="icon: code; ratio: 2" class="uk-text-primary"></span>
                <h4 class="uk-margin-top">Magma Packages</h4>
                <p class="uk-text-small">Computational algebra tools and algorithms</p>
                <a href="/docs/magma/" class="uk-button uk-button-text">View Docs</a>
            </div>
            <div class="uk-text-center">
                <span uk-icon="icon: settings; ratio: 2" class="uk-text-primary"></span>
                <h4 class="uk-margin-top">Tensor Analysis</h4>
                <p class="uk-text-small">Tools for tensor space computations</p>
                <a href="/docs/tensorSpaces/" class="uk-button uk-button-text">Learn More</a>
            </div>
            <div class="uk-text-center">
                <span uk-icon="icon: github; ratio: 2" class="uk-text-primary"></span>
                <h4 class="uk-margin-top">Open Source</h4>
                <p class="uk-text-small">Contribute to our research tools</p>
                <a href="https://github.com/algeboy" class="uk-button uk-button-text">GitHub</a>
            </div>
        </div>
    </div>
</div>

{% include cta.html title="Didn't find an answer?" button_text="Contact Us" button_url="/contact/" subtitle="Get in touch with us for details on setup and additional questions." %}

