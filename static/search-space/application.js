const truncate = (text, max) => {
  if (text.length <= max) { return text; }

  const truncated = text.slice(0, max-1);

  return truncated.slice(0, truncated.lastIndexOf(" ")) + "&nbsp;&hellip;";
};

const query = (() => {
  const queryElement = document.querySelector('#q');
  const parameter = (new URL(document.location)).searchParams.get('q');
  const disabledElements = document.querySelectorAll('#search-space-form :disabled');

  queryElement.value = parameter;
  disabledElements.forEach(e => { e.disabled = false; });
  queryElement.focus();

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
        const deletedLink = document.createElement('del');
        deletedLink.innerText = linkElement.innerText;
        linkElement.parentNode.replaceChild(deletedLink, linkElement);
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
const documentsURL = query.element.getAttribute('data-documents-url');

inform('Fetching data…');

const cache = await caches.open('search-space');
let response = await cache.match(documentsURL);

if (response === undefined) {
  cache.keys().then(keys => {
    keys.forEach(request => {
      cache.delete(request);
    });
  });

  await cache.add(documentsURL);
  response = await cache.match(documentsURL);
}

inform('Indexing…');

response.json().then(documents => {
  const miniSearch = new MiniSearch({
    fields: ['title', 'text'],
    storeFields: ['title', 'text', 'permalink', 'timelinelink', 'date'],
    searchOptions: {
      combineWith: 'AND',
      prefix: term => term.length > 2
    }
  });

  miniSearch.addAll(documents);

  inform(`${miniSearch._documentCount} posts and replies indexed.`);

  if (query.parameterIsPresent) {
    const results = miniSearch.search(query.parameter);

    document.querySelector('#search-space-results').innerHTML = results.map(hit => {
      const title = hit.title.length > 0 ? `<strong>${hit.title}</strong> ` : '';
      return `<article><p>${title}${truncate(hit.text, 300)}</p><p><a href="${hit.permalink}">${hit.date}</a> · <a href="${hit.timelinelink}">Conversation</a></p></article>`;
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
