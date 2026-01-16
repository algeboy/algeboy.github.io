---
layout: page
title: Chalkboard Posts
permalink: /posts/
---

<style>
/* Posts Page Styling */
.posts-container {
    max-width: 90%;
    margin: 0 auto;
    padding: 20px 0;
}

.posts-grid {
    display: grid;
    gap: 30px;
    margin-bottom: 40px;
}

.post-preview {
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid var(--chalk-yellow, #ffeb3b);
    border-radius: 12px;
    padding: 25px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.post-preview:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: var(--chalk-blue, #64b5f6);
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.post-title {
    color: var(--chalk-yellow, #ffeb3b);
    font-size: 1.8em;
    margin-bottom: 10px;
    text-decoration: none;
    display: block;
    font-weight: bold;
}

.post-date {
    color: var(--chalk-blue, #64b5f6);
    font-size: 1em;
    margin-bottom: 15px;
    opacity: 0.9;
}

.post-excerpt {
    color: var(--chalk-white, #f8f8f0);
    line-height: 1.6;
    font-size: 1.1em;
}

.posts-navigation {
    text-align: center;
    margin: 40px 0;
}

.nav-button {
    display: inline-block;
    padding: 12px 25px;
    margin: 0 10px;
    background: var(--chalk-blue, #64b5f6);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: bold;
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.nav-button:hover {
    background: var(--chalk-yellow, #ffeb3b);
    color: #333;
    border-color: var(--chalk-blue, #64b5f6);
    transform: translateY(-2px);
}

.nav-button:disabled,
.nav-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.posts-header {
    text-align: center;
    margin-bottom: 40px;
}

.posts-header h1 {
    color: var(--chalk-yellow, #ffeb3b);
    font-size: 2.5em;
    margin-bottom: 10px;
}

.posts-header p {
    color: var(--chalk-white, #f8f8f0);
    font-size: 1.3em;
    opacity: 0.9;
}

.no-posts {
    text-align: center;
    color: var(--chalk-white, #f8f8f0);
    font-size: 1.3em;
    padding: 60px 20px;
}
</style>

<div class="posts-container">
    <div class="posts-header">
        <h1>📝 Chalkboard Posts</h1>
        <p>Short articles and thoughts from the classroom</p>
    </div>

    <div class="posts-grid">
        {% if site.posts.size > 0 %}
            {% for post in site.posts %}
                <article class="post-preview" onclick="window.location.href='{{ post.url | relative_url }}'">
                    <h2 class="post-title">{{ post.title }}</h2>
                    <div class="post-date">{{ post.date | date: "%B %-d, %Y" }}</div>
                    <div class="post-excerpt">
                        {% if post.excerpt %}
                            {{ post.excerpt | strip_html | truncatewords: 30 }}
                        {% else %}
                            {{ post.content | strip_html | truncatewords: 30 }}
                        {% endif %}
                    </div>
                </article>
            {% endfor %}
        {% else %}
            <div class="no-posts">
                <p>No posts yet! Check back soon for new content.</p>
            </div>
        {% endif %}
    </div>

    {% if site.posts.size > 0 %}
        <div class="posts-navigation">
            <p style="color: var(--chalk-white, #f8f8f0); margin-bottom: 20px;">
                Showing all {{ site.posts.size }} posts
            </p>
        </div>
    {% endif %}
</div>