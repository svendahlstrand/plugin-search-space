---
title: "Search Space"
url: "/search-space/"
---

<link href="./posts-and-replies/" rel="prefetch" />

<form id="search-space-form" role="search">
  <p>
    <label for="q">Search posts and replies:</label>
    <input type="search" name="q" id="q" placeholder="micro monday" disabled list="search-space-suggestions" />
    <button disabled>Search</button>
  </p>

  <datalist id="search-space-suggestions">&nbsp;</datalist>
</form>

<p id="search-space-info"></p>

<noscript>
  <p>I'm sorry, but JavaScript is required for searching. You might want to look at <a href="./posts-and-replies/">all unindexed posts and replies</a>. Beware, though, as that page might be heavy.</p>
</noscript>

<hr />

<div id="search-space-results">
  <p>Hey! It's me, Sven. Thanks for beta testing 🔭 Search Space. Here are some nifty features to play with:</p>

  <ul>
    <li>💡 Suggestions are a thing. Start typing, and you will see what I mean.</li>
    <li>❤️ Emojis are valid search terms. How often do you <a href="?q=😂">😂</a>, <a href="?q=😭">😭</a>, or read <a href="?q=📚">📚</a>?</li>
    <li>🔗 You can link to search results like <a href="?q=this"><em>this</em></a>.</li>
    <li>🪆 Searching for <a href="?q=mac"><em>mac</em></a> will return results like <em>Mac</em>Book and <em>mac</em>hine.</li>
    <li>💬 Replies are indexed as well. Try searching people's usernames to find conversations you had with them.</li>
  </ul>

  <p>Follow <a href="https://micro.blog/sod">@sod</a> for updates and <a href="https://micro.blog/sod/13396481">puppies</a>. Hit me up if you find any bugs or want to chat.</p>
  <p>P.S. Search Space and my other plug-ins are passion projects released to the world for free. That said, donations are always welcome if you get value out of my work.</p>
  <p><a href="https://dahlstrand.net/donate/" id="throw-money-at-sven">💸 Throw money at Sven</a></p>
</div>

<script src="./mini-search.js"></script>
<script>
  const query = (() => {
    const queryElement = document.querySelector('#q');
    const parameter = (new URL(document.location)).searchParams.get('q');
    const disabledElements = document.querySelectorAll('#search-space-form :disabled');

    queryElement.value = parameter;
    disabledElements.forEach(e => { e.disabled = false; });

    return {
      element: queryElement,
      parameter: parameter,
      parameterIsPresent: parameter?.length > 0
    };
  })();

  document.querySelector('#search-space-results').addEventListener('click', event => {
    const linkElement = event.target;
    const url = linkElement.getAttribute('href');

    if (url?.includes('conversation.js')) {
      event.preventDefault();

      fetch(url)
        .then(response => response.json())
        .then(conversation => {
          linkElement.setAttribute('href', conversation.home_page_url);
          window.location.href = conversation.home_page_url;
        })
        .catch((error) => {
          linkElement.innerHTML = `<del>${linkElement.innerText}</del>`;
        });
    }
  });

  const startSuggesting = (index) => {
    query.element.addEventListener('input', _ => {
      let options = '';

      if (query.element.value.length > 0) {
        options = index.autoSuggest(query.element.value).map(item => `<option>${item.suggestion}</option>`);
      }

      document.querySelector('#search-space-suggestions').innerHTML = options;
    });
  };

  const inform = message => document.querySelector('#search-space-info').innerText = message;

  const start = performance.now();

  inform('Indexing…');

  fetch('./posts-and-replies/')
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const articles = [...doc.querySelectorAll('article')].map((article, id) => {
        return {
          id: id,
          title:article.querySelector('h2').textContent,
          text: article.querySelector('p').textContent,
          permalink: article.querySelector('time > a').href,
          timelinelink: article.querySelector('article > a').href,
          date: article.querySelector('time').textContent
        };
      });

      const miniSearch = new MiniSearch({
        fields: ['title', 'text'],
        storeFields: ['title', 'text', 'permalink', 'timelinelink', 'date']
      });

      miniSearch.addAll(articles);

      inform(`${miniSearch._documentCount} posts and replies indexed.`);

      if (query.parameterIsPresent) {
        const results = miniSearch.search(query.parameter, { prefix: true, combineWith: 'AND' });

        document.querySelector('#search-space-results').innerHTML = results.map(hit => {
          const title = hit.title.length > 0 ? `<strong>${hit.title}</strong> ` : '';
          return `<article><p>${title}${hit.text}</p><p><a href="${hit.permalink}">${hit.date}</a> · <a href="${hit.timelinelink}">Conversation</a></p></article>`;
        }).join('<hr />');

        const duration = (performance.now() - start) / 1000;
        inform(`${results.length} results (${ duration.toFixed(2) } seconds)`);
      }

      startSuggesting(miniSearch);
    })
    .catch(err => {
      inform("⚠️ I'm sorry, something bad happened. Please, check the logs.");
      console.warn('Something went wrong.', err);
    });
</script>

<style>
  #search-space-form input,
  #search-space-form button {
    font-size: 1em;
  }

  #throw-money-at-sven {
    display:inline-block;border: solid 0.2em yellow;border-radius:2px;background:black; color:white;padding:0.2em;font-size:1.23em;
  }
</style>
