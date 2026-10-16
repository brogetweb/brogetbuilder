function WhyChooseUs() {
  return (
    <div className="why-page">

      {/* HERO */}

      <section className="why-hero">

        <div className="why-hero-content">

          <span className="section-label">
            WHY CHOOSE US
          </span>

          <h1>
            Why Choose
            <span>
              {" "}BuilderBroget?
            </span>
          </h1>

          <p>
            We make your property search
            easier, faster and more convenient.
          </p>

        </div>

      </section>


      {/* FEATURES */}

      <section className="why-main">

        <div className="why-container">

          <div className="why-heading">

            <span className="section-label">
              OUR ADVANTAGES
            </span>

            <h2>
              Everything You Need to Find
              Your Next Property
            </h2>

            <p>
              BuilderBroget brings useful property
              search features together in one
              simple platform.
            </p>

          </div>


          <div className="why-grid">

            <div className="why-card">

              <div className="why-icon">
                ✓
              </div>

              <h3>
                Verified Properties
              </h3>

              <p>
                Discover verified property
                listings and search with
                greater confidence.
              </p>

            </div>


            <div className="why-card">

              <div className="why-icon">
                🔍
              </div>

              <h3>
                Smart Search
              </h3>

              <p>
                Search properties using
                location, price, property type,
                bedrooms and area.
              </p>

            </div>


            <div className="why-card">

              <div className="why-icon">
                🏠
              </div>

              <h3>
                Wide Range
              </h3>

              <p>
                Explore apartments, villas,
                plots, independent houses
                and more.
              </p>

            </div>


            <div className="why-card">

              <div className="why-icon">
                🤝
              </div>

              <h3>
                Easy to Connect
              </h3>

              <p>
                Discover properties and
                connect with property owners
                for your requirements.
              </p>

            </div>


            <div className="why-card">

              <div className="why-icon">
                📍
              </div>

              <h3>
                Location Based Search
              </h3>

              <p>
                Find properties in your
                preferred city and location.
              </p>

            </div>


            <div className="why-card">

              <div className="why-icon">
                💰
              </div>

              <h3>
                Budget Friendly
              </h3>

              <p>
                Use price filters to discover
                properties that fit your budget.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* CTA */}

      <section className="why-cta">

        <h2>
          Ready to Find Your Next Home?
        </h2>

        <p>
          Start exploring properties on BuilderBroget.
        </p>

        <a
          href="/"
          className="why-cta-btn"
        >
          Explore Properties
        </a>

      </section>

    </div>
  );
}

export default WhyChooseUs;