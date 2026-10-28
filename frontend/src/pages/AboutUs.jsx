

const reasons = [
  {
    number: "01",
    title: "Built with Purpose",
    description:
      "Every project starts with a clear plan, practical thinking, and a focus on getting the details right.",
    icon: "⌂",
  },
  {
    number: "02",
    title: "Quality That Lasts",
    description:
      "We believe good construction is measured not just at handover, but by how well a space serves you over time.",
    icon: "✦",
  },
  {
    number: "03",
    title: "Clear Communi-cation",
    description:
      "We keep the process straightforward, with honest conversations and a shared understanding of the work ahead.",
    icon: "◇",
  },
  {
    number: "04",
    title: "Your Vision, Our Focus",
    description:
      "Your ideas shape the project. Our role is to help turn them into a space that feels right for you.",
    icon: "♡",
  },
];


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


      {/* Our Story */}
      <section className="about-story-section" id="our-story">
        <div className="about-container about-story-grid">
          <div className="about-story-visual">
            <div className="about-story-image-main">
              <img
                src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=85"
                alt="Contemporary building architecture"
                loading="lazy"
              />
            </div>

            <div className="about-story-image-note">
              <span>THE BUILDER BROGET WAY</span>
              <span>Good work speaks for itself.</span>
            </div>

            <div className="about-story-small-image">
              <img
                src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=700&q=85"
                alt="Contemporary home interior"
                loading="lazy"
              />
            </div>
          </div>

          <div className="about-story-content">
            <span className="about-eyebrow">
              OUR STORY
            </span>

            <h2>
              Every Great Space
              <br />
              <span>Starts with an Idea.</span>
            </h2>

            <p>
              Every project begins with a thought — a place to call
              home, a space to grow a business, or an idea waiting
              to take shape. At Builder Broget, we understand that
              what you build matters.
            </p>

            <p>
              That is why we look beyond the structure itself.
              We pay attention to the planning, the practical
              details, and the choices that make a space work
              in everyday life.
            </p>

            <p>
              Our approach is simple: understand what matters to
              you, work through the details carefully, and keep
              the goal in sight from beginning to end.
            </p>

            <div className="about-signature">
              <div className="about-signature-mark">B</div>
              <div>
                <strong>Builder Broget</strong>
                <span>Built around your vision.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="about-purpose-section">
        <div className="about-container">
          <div className="about-section-heading about-purpose-heading">
            <span className="about-eyebrow">WHAT DRIVES US</span>

            <h2>
              A Clear Purpose.
              <br />
              <span>A Lasting Impact.</span>
            </h2>

            <p>
              The way we work matters just as much as what we build.
            </p>
          </div>

          <div className="about-purpose-grid">
            <article className="about-purpose-card about-purpose-dark">
              <div className="about-purpose-top">
                <span className="about-purpose-label">
                  01 / OUR MISSION
                </span>
                <span className="about-purpose-icon">↗</span>
              </div>

              <div className="about-purpose-number">01</div>

              <h3>Make Every Project Count.</h3>

              <p className="about-purpose-description">
                To turn ideas into well-planned, carefully executed
                spaces through dependable work, thoughtful decisions,
                and a genuine understanding of our clients' needs.
              </p>

              <div className="about-purpose-bottom">
                <span>CARE</span>
                <span>CRAFT</span>
                <span>COMMITMENT</span>
              </div>
            </article>

            <article className="about-purpose-card about-purpose-orange">
              <div className="about-purpose-top">
                <span className="about-purpose-label">
                  02 / OUR VISION
                </span>
                <span className="about-purpose-icon">✦</span>
              </div>

              <div className="about-purpose-number">02</div>

              <h3>Build Beyond Today.</h3>

              <p className="about-purpose-description">
                To create spaces that remain valuable, useful, and
                meaningful for years to come — earning trust through
                the quality of our work and the way we work.
              </p>

              <div className="about-purpose-bottom">
                <span>PROGRESS</span>
                <span>TRUST</span>
                <span>VALUE</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="about-why-section">
        <div className="about-container">
          <div className="about-why-heading">
            <div className="about-section-heading">
              <span className="about-eyebrow">
                WHY BUILDER BROGET
              </span>

              <h2>
                It's Not Just What
                <br />
                <span>We Build.</span>
              </h2>
            </div>

            <p>
              It is how we approach the work, how we handle the
              details, and how seriously we take the trust you
              place in us.
            </p>
          </div>

          <div className="about-reasons-grid">
            {reasons.map((reason) => (
              <article className="about-reason-card" key={reason.number}>
                <div className="about-reason-top">
                  <span className="about-reason-number">
                    {reason.number}
                  </span>
                  <span className="about-reason-icon">
                    {reason.icon}
                  </span>
                </div>

                <h3>{reason.title}</h3>
                <p>{reason.description}</p>

                <span className="about-reason-line" />
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;