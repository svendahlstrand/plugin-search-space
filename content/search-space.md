---
title: "Search Space"
url: "/search-space/"
---

<form id="search-space-form" role="search">
  <p>
    <label for="q">Search posts and replies:</label>
    <input type="search" name="q" id="q" placeholder="micro monday" disabled list="search-space-suggestions" data-documents-url="{{< search-space/documents-url >}}" />
    <button disabled>Search</button>
  </p>

  <datalist id="search-space-suggestions"></datalist>
</form>

<p id="search-space-info">&nbsp;</p>

<noscript>
  <p>I'm sorry, but JavaScript is required for searching. You might want to look at <a href="{{< search-space/documents-url >}}">all unindexed posts and replies</a>. Beware, though, as that file might be heavy.</p>
</noscript>

<hr />

<div id="search-space-results">
  <p>Welcome to 🔭&nbsp;Search Space! Here are some nifty features to play with:</p>

  <ul>
    <li>💡 Suggestions are a thing. Start typing, and you will see what I mean.</li>
    <li>❤️ Emojis are valid search terms. How often do you <a href="?q=😂">😂</a>, <a href="?q=😭">😭</a>, or read <a href="?q=📚">📚</a>?</li>
    <li>🔗 You can link to search results like <a href="?q=this"><em>this</em></a>.</li>
    <li>🪆 Searching for <a href="?q=mac"><em>mac</em></a> will return results like <em>Mac</em>Book and <em>mac</em>hine.</li>
    <li>💬 Replies are indexed as well. Try searching people's usernames to find conversations you had with them.</li>
  </ul>
  <p>P.S. Search Space is a passion project! Built by <a href="https://micro.blog/sod">@sod</a> and released to the world for free. 💸&nbsp;<a href="https://dahlstrand.net/donate/">Donate $10</a> if you find it useful.</p>
</div>

<script src="./minisearch.js"></script>
<script src="./application.js" type="module"></script>
