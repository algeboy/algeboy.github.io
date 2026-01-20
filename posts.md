---
layout: page
title: Chalkboard Posts
permalink: /posts/
---

<div class="posts-container">

    <div class="posts-grid">
        {% if site.posts.size > 0 %}
            {% for post in site.posts %}
                <article class="post-preview" onclick="window.location.href='{{ post.url | relative_url }}'">
                    {% if post.image %}
                        <div class="post-image">
                            <img src="{{ post.image | relative_url }}" alt="{{ post.title }}">
                        </div>
                    {% endif %}
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