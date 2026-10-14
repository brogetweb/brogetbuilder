
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { initialArticles } from "./PropertyNews";

const STORAGE_KEY = "homeestate_property_news";

function PropertyNewsDetails() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const articles =
        saved === null ? initialArticles : JSON.parse(saved);

      const found = Array.isArray(articles)
        ? articles.find((item) => item.slug === slug)
        : null;

      setArticle(found || null);
    } catch (error) {
      console.error("Could not load article:", error);
      setArticle(null);
    }
  }, [slug]);

  if (!article) {
    return (
      <main className="content-page">
        <div className="content-empty">
          <span>📰</span>
          <h2>Article not found</h2>
          <p>We couldn't find that property news article.</p>

          <Link className="news-read-more" to="/property-news">
            ← Back to Property News
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="content-page">
      <article className="article-page">
        <Link className="article-back-link" to="/property-news">
          ← All Property News
        </Link>

        <span className="news-category">{article.category}</span>

        <h1>{article.title}</h1>

        <div className="article-byline">
          <span>{article.author}</span>
          <span>
            {new Date(
              `${article.publishedAt}T12:00:00`
            ).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        <img
          className="article-cover"
          src={article.image}
          alt={article.title}
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />

        <p className="article-excerpt">{article.excerpt}</p>

        <div className="article-content">
          {article.content.split("\n").map((paragraph, index) =>
            paragraph.trim() ? (
              <p key={index}>{paragraph}</p>
            ) : null
          )}
        </div>

        <Link
          className="content-primary-button article-back-button"
          to="/property-news"
        >
          Explore More Articles
        </Link>
      </article>
    </main>
  );
}

export default PropertyNewsDetails;

