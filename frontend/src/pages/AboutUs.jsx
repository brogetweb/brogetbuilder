function AboutUs() {
  return (
    <div className="about-page">

      <section className="about-hero">

        <div className="about-hero-content">

          <span className="section-label">
            ABOUT BUILDERBROGET
          </span>

          <h1>
            Find a Place You'll
            <span>
              {" "}Love to Call Home
            </span>
          </h1>

          <p>
            A simple and convenient way to
            discover your next property.
          </p>

        </div>

      </section>


      {/* ABOUT CONTENT */}

      <section className="about-main">

        <div className="about-container">

          <div className="about-content">

            <span className="section-label">
              WHO WE ARE
            </span>

            <h2>
              Making Property Search
              <span>
                {" "}Simple & Convenient
              </span>
            </h2>

            <p>
              BuilderBroget is a modern real-estate
              platform built to help people discover
              properties that match their needs,
              preferences and budget.
            </p>

            <p>
              Whether you are looking to buy,
              rent or find a PG, BuilderBroget makes
              it easier to explore different types
              of properties.
            </p>

            <p>
              From apartments and villas to plots
              and independent houses, you can search
              properties based on location, price,
              property type, bedrooms and area.
            </p>

          </div>


          <div className="about-image">

            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900"
              alt="Modern Home"
            />

          </div>

        </div>

      </section>

      <section className="about-values">

        <div className="about-values-container">

          <div className="value-card">

            <div className="value-icon">
              🏠
            </div>

            <h3>
              Our Mission
            </h3>

            <p>
              To make property discovery easier
              and more convenient for everyone.
            </p>

          </div>


          <div className="value-card">

            <div className="value-icon">
              🎯
            </div>

            <h3>
              Our Goal
            </h3>

            <p>
              Help users find properties that
              match their requirements and budget.
            </p>

          </div>


          <div className="value-card">

            <div className="value-icon">
              🤝
            </div>

            <h3>
              Our Approach
            </h3>

            <p>
              Provide a simple and transparent
              platform for property discovery.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default AboutUs;