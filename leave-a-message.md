---
layout: page
title: Leave a message
permalink: /leave-a-message/
---

<style>
  .message-board { max-width: 760px; margin: 28px auto 70px; text-align: center; }
  .message-board h1 { color: var(--chalk-yellow); border: 0; margin-bottom: 8px; }
  .message-board p { color: var(--chalk-white); margin-bottom: 24px; }
  .message-pad { padding: 24px; border: 3px dashed var(--chalk-white); border-radius: 12px; background: rgba(16, 58, 43, 0.32); box-shadow: inset 0 0 22px rgba(0, 0, 0, 0.24); }
  .message-pad textarea { width: 100%; min-height: 230px; resize: vertical; border: 0; outline: 0; background: transparent; color: var(--chalk-white); font: 1.35rem/1.55 'Architects Daughter', cursive; }
  .message-pad textarea::placeholder { color: rgba(248, 248, 240, 0.58); }
  .message-pad button[type="submit"] { padding: 10px 20px; border: 2px solid var(--chalk-yellow); border-radius: 6px; background: transparent; color: var(--chalk-yellow); cursor: pointer; font: 700 1rem Helvetica, Arial, sans-serif; }
  .message-pad button[type="submit"]:hover { background: var(--chalk-yellow); color: var(--chalkboard-dark); }
  #message-status { min-height: 1.4em; color: var(--chalk-green); margin-top: 12px; }
</style>

<section class="message-board">
  <h1>The board is clear.</h1>
  <p>Choose a piece of chalk from the box on the shelf, then leave a note.</p>
  <form class="message-pad" id="chalk-message-form">
    <label for="chalk-message" class="visually-hidden">Your chalkboard message</label>
    <textarea id="chalk-message" maxlength="500" placeholder="Write a message…" required></textarea>
    <button type="submit">Leave this note</button>
    <p id="message-status" role="status"></p>
  </form>
</section>

<script>
  const messageArea = document.getElementById('chalk-message');
  window.addEventListener('chalkcolorchange', function(event) {
    const choice = event.detail;
    messageArea.style.color = choice.color;
    document.getElementById('message-status').textContent = choice.name.charAt(0).toUpperCase() + choice.name.slice(1) + ' chalk selected.';
  });
  document.getElementById('chalk-message-form').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('message-status').textContent = 'Your note is ready to send once the message service is connected.';
  });
</script>
