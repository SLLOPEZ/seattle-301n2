(function(module) {

  var articleView = {};

  var render = function(article) {
    var template = Handlebars.compile($('#article-template').text());

    article.daysAgo = parseInt((new Date() - new Date(article.publishedOn))/60/60/24/1000);
    article.publishStatus = article.publishedOn ? 'published ' + article.daysAgo + ' days ago' : '(draft)';
    article.body = marked(article.body);

    return template(article);
  };

  //This method is populating the filter options through the handlebar template.

  // Execution Path: This method filters the author data using map method and
  // return an array  of the author selected
  articleView.populateFilters = function() {
    var options,
      template = Handlebars.compile($('#option-template').text());

    // Example of using model method with FP, synchronous approach:
    // NB: This method is dependant on info being in the DOM. Only authors of shown articles are loaded.
    options = Article.allAuthors().map(function(author) { return template({val: author}); });
    if ($('#author-filter option').length < 2) { // Prevent duplication
      $('#author-filter').append(options);
    };

    // Example of using model method with async, SQL-based approach:
    // This approach is DOM-independent, since it reads from the DB directly.
    Article.allCategories(function(rows) {
      if ($('#category-filter option').length < 2) {
        $('#category-filter').append(
          rows.map(function(row) {
            return template({val: row.category});
          })
        );
      };
    });
  };

  // This method is handling filters, when the user selects a filter it changes it as per the selection.

  // Execution Path: This method filters all the data for either author or category.
  // and fires an event and get the info. from database and renders the specific ID data.
  articleView.handleFilters = function() {
    $('#filters').one('change', 'select', function() {
      resource = this.id.replace('-filter', '');
      page('/' + resource + '/' + $(this).val().replace(/\W+/g, '+')); // Replace any/all whitespace with a +
    });
  };

  articleView.initNewArticlePage = function() {
    $('#articles').show().siblings().hide();

    $('#export-field').hide();
    $('#article-json').on('focus', function(){
      this.select();
    });

    $('#new-form').on('change', 'input, textarea', articleView.create);
  };

  articleView.create = function() {
    var article;
    $('#articles').empty();

    // Instantiate an article based on what's in the form fields:
    article = new Article({
      title: $('#article-title').val(),
      author: $('#article-author').val(),
      authorUrl: $('#article-author-url').val(),
      category: $('#article-category').val(),
      body: $('#article-body').val(),
      publishedOn: $('#article-published:checked').length ? util.today() : null
    });

    $('#articles').append(render(article));

    $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });

    // Export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
    $('#export-field').show();
    $('#article-json').val(JSON.stringify(article) + ',');
  };

//Execution Path:When the user clicks the articles ,it hides its about sibling. Also removes all the articles and
//appends the specific article being selected.

  // This method is showing all the articles and hiding the sibilings.
  articleView.index = function(articles) {
    $('#articles').show().siblings().hide();

    $('#articles article').remove();
    articles.forEach(function(a) {
      $('#articles').append(render(a));
    });

    articleView.populateFilters();
// Execution Path: Calling the populate filters.

    // Its  calling the the populate filers method of the article view object.
    articleView.handleFilters();

    // DONE: Replace setTeasers with just the truncation logic, if needed:
    if ($('#articles article').length > 1) {
      $('.article-body *:nth-of-type(n+2)').hide();
    }
  };

  articleView.initAdminPage = function() {
    var template = Handlebars.compile($('#author-template').text());

    Article.numWordsByAuthor().forEach(function(stat) {
      $('.author-stats').append(template(stat));
    });

    $('#blog-stats .articles').text(Article.all.length);
    $('#blog-stats .words').text(Article.numWordsAll());
  };

  module.articleView = articleView;
})(window);
