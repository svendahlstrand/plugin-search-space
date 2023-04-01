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
  {{< search-space/text "default_greeting" >}}
</div>

<script src="./minisearch.js"></script>
<script src="./application.js" type="module"></script>
