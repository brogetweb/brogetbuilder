
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./PropertyNews.css";
const STORAGE_KEY = "homeestate_property_news";

export const initialArticles = [
  {
    id: "news-1",
    slug: "first-time-home-buying-guide",
    title: "A Beginner's Guide to Buying Your First Home",
    category: "Buying Guide",
    excerpt:
      "Understand your budget, shortlist properties, compare locations and prepare the questions to ask before making a decision.",
    content: `Buying a home is an important decision. Start by identifying your needs, preferred location and realistic budget.

Compare multiple properties and understand the total cost, including applicable taxes, registration charges, maintenance and other fees.

Before committing, review the ownership documents and property approvals with a qualified professional. Ask questions whenever something is unclear.

Take your time, compare your options and make a decision that fits your circumstances.`,
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    author: "BuilderBroget Editorial Team",
    publishedAt: "2026-09-20",
  },
  {
    id: "news-2",
    slug: "understanding-rental-agreements",
    title: "Rental Agreements: What Every Tenant Should Know",
    category: "Renting Guide",
    excerpt:
      "Learn which rental terms to review, from rent and deposits to maintenance responsibilities and notice periods.",
    content: `Before renting a property, read the rental agreement carefully.

Check the rent amount, security deposit, payment due date, agreement duration, notice period and maintenance responsibilities.

Make sure the agreement accurately describes the property and the people involved. Keep a signed copy for your records.

Rules and registration requirements can vary by location, so consult a qualified local professional when needed.`,
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    author: "BuilderBroget Editorial Team",
    publishedAt: "2026-09-23",
  },
  {
    id: "news-3",
    slug: "home-loan-planning-basics",
    title: "Home Loan Planning: Start with the Basics",
    category: "Home Loans",
    excerpt:
      "Explore interest rates, loan tenure, down payments and additional costs before comparing home loan offers.",
    content: `A home loan can help finance a property, but it is important to understand the full repayment commitment.

Compare the interest rate, processing fees, loan tenure, repayment schedule and applicable charges offered by different lenders.

Estimate a monthly repayment that fits your income and existing expenses. Remember to account for property maintenance, insurance and unexpected costs.

Loan eligibility and terms depend on the lender and your financial circumstances. Review the current terms directly with the lender before deciding.`,
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    author: "BuilderBroget Editorial Team",
    publishedAt: "2026-09-26",
  },
  {
    id: "news-4",
    slug: "small-space-interior-design-ideas",
    title: "Simple Interior Design Ideas for Smaller Homes",
    category: "Interior Design",
    excerpt:
      "Explore practical ways to make compact rooms feel more organised using lighting, storage and flexible furniture.",
    content: `A smaller home can still feel comfortable and functional with thoughtful planning.

Use multi-purpose furniture, keep frequently used items accessible and choose storage solutions that make use of vertical space.

Natural light, mirrors and a consistent colour palette can help a room feel more open. Avoid overcrowding the space with furniture that blocks walkways.

The best design is one that suits your everyday routines and makes the space comfortable for you.`,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    author: "BuilderBroget Editorial Team",
    publishedAt: "2026-09-29",
  },
  {
    id: "news-5",
    slug: "how-to-compare-property-locations",
    title: "How to Compare Property Locations",
    category: "Market Trends",
    excerpt:
      "Consider commute times, transport, local amenities, future plans and everyday convenience when comparing neighbourhoods.",
    content: `A property is more than its rooms and floor plan. Its location affects everyday life.

Consider your commute, access to public transport, schools, healthcare, shopping and other facilities relevant to your household.

Visit the neighbourhood at different times of day if possible. Check noise levels, access roads, drainage and the availability of essential services.

Research local development plans through reliable sources, and remember that planned developments are not guarantees of future property appreciation.`,
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    author: "BuilderBroget Editorial Team",
    publishedAt: "2026-10-02",
  },
  {
    id: "news-6",
    slug: "questions-to-ask-about-new-projects",
    title: "Questions to Ask Before Choosing a New Project",
    category: "New Projects",
    excerpt:
      "Review project approvals, timelines, amenities, payment terms and the details of the unit before making a commitment.",
    content: `When considering a new residential project, gather the relevant information before committing.

Ask about project registration and approvals, construction progress, the expected possession timeline and the exact specifications of the unit.

Review the payment schedule, cancellation conditions, maintenance charges and any promised amenities in the written documents.

Where applicable, check the project details on the official RERA website for the relevant state. Consider obtaining independent legal advice before signing.`,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    author: "BuilderBroget Editorial Team",
    publishedAt: "2026-10-05",
  },
];

function getArticles() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : initialArticles;
    }
  } catch (error) {
    console.error("Could not read property news:", error);
  }

  return initialArticles;
}

function PropertyNews() {
  const [articles, setArticles] = useState(getArticles);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    } catch (error) {
      console.error("Could not save property news:", error);
    }
  }, [articles]);

  const categories = [
    "All Categories",
    ...new Set(articles.map((article) => article.category)),
  ];

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      category === "All Categories" ||
      article.category === category;

    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      !searchText ||
      article.title.toLowerCase().includes(searchText) ||
      article.excerpt.toLowerCase().includes(searchText) ||
      article.category.toLowerCase().includes(searchText);

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="content-page property-news-page">
      <section className="content-hero news-hero">
        <span className="content-eyebrow">THE BUILDERBROGET JOURNAL</span>

        <h1>Property News & Insights</h1>

        <p>
          Discover property guides, home-buying tips, rental advice
          and inspiration for your next move.
        </p>
      </section>

      <section className="content-section news-section">
        <div className="news-toolbar">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search property news..."
            aria-label="Search property news"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter by category"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="news-results-heading">
          <h2>Latest Articles</h2>
          <span>{filteredArticles.length} articles</span>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="content-empty">
            <span>📰</span>
            <h3>No articles found</h3>
            <p>Try another search term or select a different category.</p>
          </div>
        ) : (
          <div className="news-grid">
            {filteredArticles.map((article) => (
              <article className="news-card" key={article.id}>
                <Link
                  to={`/property-news/${article.slug}`}
                  className="news-image-link"
                >
                  <img
                    className="news-image"
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                </Link>

                <div className="news-card-body">
                  <div className="news-meta">
                    <span className="news-category">
                      {article.category}
                    </span>

                    <span>
                      {new Date(
                        `${article.publishedAt}T12:00:00`
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h2>{article.title}</h2>
                  <p>{article.excerpt}</p>

                  <Link
                    className="news-read-more"
                    to={`/property-news/${article.slug}`}
                  >
                    Read Article <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default PropertyNews;

