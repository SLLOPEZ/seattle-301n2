(function(module) {
  var articlesController = {};

  Article.createTable();  // Ensure the database table is properly initialized

  articlesController.index = function(ctx, next) {
    articleView.index(ctx.articles);
  };

  // This method loads articles with the specific ID the user selected.

  // Execution Path : User clicks read-on, this method fires and get the info. from database and
  // associate it to the context object and teh next makes a callback to articleVIew.index method
  articlesController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };

    Article.findWhere('id', ctx.params.id, articleData);
  };

  // This method loads articles with the specific author name the user selected.

  // Execution Path : User selects specific Author, this method fires and get the info. from database
  // and associate it to the context object and the next makes a callback to articleVIew.index method
  articlesController.loadByAuthor = function(ctx, next) {
    var authorData = function(articlesByAuthor) {
      ctx.articles = articlesByAuthor;
      next();
    };

    Article.findWhere('author', ctx.params.authorName.replace('+', ' '), authorData);
  };

  // This method loads articles with the specific category the user selected.

  // Execution Path : User selects specific Author, this method fires and get the info. from database
  // and associate it to the context object and the next makes a callback to articleVIew.index method
  articlesController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };


  // It loads the data which renders all the articles

  // Execution Path : When the page loads, this method fires and get the info. from database
  // and associate it to the context object and the next makes a callback to articleVIew.index method

  articlesController.loadAll = function(ctx, next) {
    var articleData = function(allArticles) {
      ctx.articles = Article.all;
      next();
    };

    if (Article.all.length) {
      ctx.articles = Article.all;
      next();
    } else {
      Article.fetchAll(articleData);
    }
  };


  module.articlesController = articlesController;
})(window);
