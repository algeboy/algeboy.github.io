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
            <h2> Theorem 1.  All the following are equivalent.
             Nilpotent $\Leftrightarrow$ Tensors $\Leftrightarrow$ Data science</h2>
            </P>
            <p class="uk-text-large" align="left">
             <Strong>Proof:</strong>  
                If $x^n=0$ then $x^n=x\times x\times\cdots$ means there's a product$(\times)$.
                Every zero $(0)$ needs a plus $(+)$. Times  with plus should distribute 
                $$a\times (b+c)=a\times b+a\times c.$$  
                Distributive multiplication is captured by a multiplication 
                table---what posh people call a tensor.
                What's the difference between a 
                Multiplication table and a Data table?
                Nothing really.
                $\Box$
            </p>
        </div>
    </div>
</div>
<p/>


<div class="custom-landing-section uk-container uk-container-small">
    <div class="uk-grid-small uk-flex-middle" uk-grid>
        <div class="uk-margin-top">
            <a href="#" id="algeboy-youtube-btn" class="uk-button uk-button-primary uk-margin-small-right">
            @Algeboy on YouTube
            <img src="uploads/images/Inductive-Type-cover.jpg" width="100">
            </a>

            <a href="/about/" class="uk-button uk-button-primary uk-margin-small-right">About Me</a>
            
            <a href="/contact/" class="uk-button uk-button-default uk-margin-small-right">
            Contact
            </a>

            <a href="/publications/" class="uk-button uk-button-default uk-margin-small-right">
            Articles
            </a>

            <a href="https://algeboy.github.io/LinearData/" class="uk-button uk-button-default">
            My <Strong>BOOK</strong> on Data Science Linear Algebra
            <img src="uploads/images/Full-Cover-Art-web.png"
            width="100"/>
            </a>
        </div>
    </div>
</div>            

<H2> References </H2>
<div class="custom-landing-section uk-container uk-container-small">
    <div class="uk-grid-small uk-flex-middle" uk-grid>
        <div class="uk-width-1-3@m" algin="center">
            <!-- Professional headshot placeholder -->
            <div class="uk-text-center">
                <img id="profile-slideshow" src="/uploads/images/people/profile1.jpeg" alt="James B. Wilson" class="rounded uk-box-shadow-large" width="100" height="100"/>
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
<!-- Projector Screen Overlay -->
<div id="projector-overlay" class="projector-overlay">
    <div class="projector-screen">
        <button id="close-projector" class="close-projector-btn">✕</button>
        <div class="video-container">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/D8Upe7RGL94?si=aJkRWnzEKZ-CkMNO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
        </iframe>
            </iframe>
        </div>
    </div>
</div>

<style>
.projector-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    z-index: 9999;
    display: none;
    opacity: 0;
    transition: opacity 0.5s ease;
}

.projector-overlay.active {
    display: block;
    opacity: 1;
}

.projector-screen {
    position: absolute;
    top: -100%;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 1200px;
    height: 0;
    background: linear-gradient(to bottom, #f5f5f5 0%, #ffffff 10%, #ffffff 90%, #f0f0f0 100%);
    border: 20px solid #2c2c2c;
    border-radius: 10px;
    box-shadow: 
        0 0 0 5px #666,
        0 20px 60px rgba(0, 0, 0, 0.8),
        inset 0 0 20px rgba(0, 0, 0, 0.1);
    transition: top 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55), height 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    overflow: hidden;
}

.projector-overlay.active .projector-screen {
    top: 5%;
    height: 85%;
}

.close-projector-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #C8C372;
    color: #1a4a3a;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
    z-index: 10001;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
    line-height: 50px;
    text-align: center;
}

.close-projector-btn:hover {
    background: #ffeb3b;
    transform: scale(1.15);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.6);
}

.video-container {
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
}

.video-container iframe {
    width: 100%;
    height: 100%;
    border-radius: 5px;
}

@media (max-width: 768px) {
    .projector-screen {
        width: 95%;
    }
    
    .projector-overlay.active .projector-screen {
        top: 5%;
        height: 70%;
    }
}
</style>

<script>
(function() {
    const youtubeBtn = document.getElementById('algeboy-youtube-btn');
    const overlay = document.getElementById('projector-overlay');
    const closeBtn = document.getElementById('close-projector');
    const youtubePlayer = document.getElementById('youtube-player');
    
    function openProjector(e) {
        e.preventDefault();
        // Scroll the chalkboard content to top smoothly
        const chalkboardContent = document.querySelector('.chalkboard-content');
        if (chalkboardContent) {
            chalkboardContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // Show overlay after a brief delay to allow scroll
        setTimeout(() => {
            overlay.classList.add('active');
            if (chalkboardContent) {
                chalkboardContent.style.overflow = 'hidden';
            }
            document.body.style.overflow = 'hidden';
        }, 1000);
    }
    
    function closeProjector() {
        overlay.classList.remove('active');
        const chalkboardContent = document.querySelector('.chalkboard-content');
        if (chalkboardContent) {
            chalkboardContent.style.overflow = 'auto';
        }
        document.body.style.overflow = 'auto';
        // Stop video by reloading iframe
        const src = youtubePlayer.src;
        youtubePlayer.src = '';
        setTimeout(() => { youtubePlayer.src = src; }, 100);
    }
    
    if (youtubeBtn) {
        youtubeBtn.addEventListener('click', openProjector);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeProjector);
    }
    
    // Close on overlay click (outside screen)
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeProjector();
        }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeProjector();
        }
    });
})();
</script>
