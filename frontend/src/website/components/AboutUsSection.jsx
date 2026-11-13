import {Link} from 'react-router-dom';
import "./AboutUsSection.css";

const stats = [
  {
    number: "500+",
    label: "COMPLETED PROJECTS",
    theme: "dark",
  },
  {
    number: "25+",
    label: "YEARS OF EXPERIENCE",
    theme: "orange",
  },
];

function AboutUsSection() {
  return (
    <section className="builder-demo">
      <div className="builder-demo-container">

        <div className="builder-demo-content">
          <span className="builder-demo-label">
            BUILDING YOUR FUTURE
          </span>

          <h1>
            Building Dreams,
            <br />
            <span>Creating Landmarks.</span>
          </h1>

          <h2>
            Quality Construction. Lasting Relationships.
          </h2>

          <p className="builder-demo-description">
            At Builder Broget, we turn your vision into
            reality with innovative construction solutions,
            skilled professionals, and an unwavering
            commitment to quality. From planning to
            completion, we build spaces designed to last.
          </p>

          <div className="builder-demo-features">
            <div className="builder-demo-feature">
              <span>✓</span>
              Quality Workmanship
            </div>

            <div className="builder-demo-feature">
              <span>✓</span>
              On-Time Delivery
            </div>

            <div className="builder-demo-feature">
              <span>✓</span>
              Experienced Team
            </div>
          </div>

         <Link
  to="/about"
  className="builder-demo-button"
>
  Let's Build Together <span>↗</span>
</Link>

          <div className="builder-demo-trust">
            <span></span>
            Built on trust. Driven by excellence.
          </div>
        </div>

        <div className="builder-demo-visual">
          <div className="builder-demo-image">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900"
              alt="Construction team working on a building project"
            />

            <div className="builder-demo-image-overlay"></div>

            <div className="builder-demo-image-caption">
              <span></span>
              BUILDING A BETTER TOMORROW
            </div>
          </div>

          <div className="builder-demo-badge">
            <div className="builder-demo-badge-icon">
              B
            </div>

            <div>
              <strong>BUILDER BROGET</strong>
              <small>Built to Last</small>
            </div>
          </div>

          <div className="builder-demo-stats">
            {stats.map((stat) => (
              <div
                className={`builder-demo-stat ${stat.theme}`}
                key={stat.label}
              >
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default AboutUsSection;