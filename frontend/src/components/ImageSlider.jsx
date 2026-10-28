
import { useEffect, useState } from "react";
import "./ImageSlider.css";
import img1 from "../assets/img1.jpeg";
import img2 from "../assets/img2.jpeg";
import img3 from "../assets/img3.jpeg";
import img4 from "../assets/img4.jpeg";
import img5 from "../assets/img5.jpeg";
import img6 from "../assets/img6.webp";

const slides = [
  {
    id: 1,
    subtitle: "BUILDING THE BETTER FUTURE",
    title: "Committed Quality To Your Project",
    description:
      "We provide residential and commercial construction, renovation, project management, and custom building solutions.",
    image: img1,
    primaryText: "More About Us",
    secondaryText: "Our Services",
  },
  {
    id: 2,
    subtitle: "DESIGNED FOR EXCELLENCE",
    title: "Turning Your Vision Into Reality",
    description:
      "From the first blueprint to the final finishing, we build spaces designed for comfort, quality, and lasting value.",
    image: img2,
    primaryText: "Discover Our Work",
    secondaryText: "View Projects",
  },
  {
    id: 3,
    subtitle: "STRENGTH IN EVERY DETAIL",
    title: "Building Spaces That Last",
    description:
      "Our experienced team delivers dependable construction with careful planning, modern techniques, and attention to detail.",
    image: img3,
    primaryText: "About Our Team",
    secondaryText: "Our Expertise",
  },
  {
    id: 4,
    subtitle: "MODERN DESIGN. SOLID BUILD.",
    title: "Creating Tomorrow's Landmarks",
    description:
      "We bring innovative ideas and expert craftsmanship together to create outstanding residential and commercial buildings.",
    image: img4,
    primaryText: "Explore Projects",
    secondaryText: "Get In Touch",
  },
  {
    id: 5,
    subtitle: "RELIABLE FROM START TO FINISH",
    title: "Your Trusted Construction Partner",
    description:
      "Build with confidence through transparent planning, reliable execution, and a commitment to quality at every stage.",
    image: img5,
    primaryText: "Why Choose Us",
    secondaryText: "Our Services",
  },
  {
    id: 6,
    subtitle: "CRAFTED WITH PRECISION",
    title: "Excellence In Every Structure",
    description:
      "We combine skilled workmanship, dependable materials, and thoughtful design to bring your next project to life.",
    image: img6,
    primaryText: "Learn More",
    secondaryText: "Start A Project",
  },
];

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + slides.length) % slides.length
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Automatically change slides every 5 seconds.
  // Pause the slider when the user hovers over it.
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      className="builder-hero"
      aria-label="Construction company featured projects"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`builder-slide ${
            index === currentSlide ? "active" : ""
          }`}
          style={{
            backgroundImage: `url("${slide.image}")`,
          }}
          aria-hidden={index !== currentSlide}
        />
      ))}

      <div className="builder-overlay" />

      {/* Previous Slide Button */}
      <button
        type="button"
        className="builder-arrow builder-arrow-left"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Slide Content */}
      <div className="builder-content" key={slides[currentSlide].id}>
        <p className="builder-subtitle">
          {slides[currentSlide].subtitle}
        </p>

        <h1 className="builder-title">
          {slides[currentSlide].title}
        </h1>

        <p className="builder-description">
          {slides[currentSlide].description}
        </p>

      </div>
      <button
        type="button"
        className="builder-arrow builder-arrow-right"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="builder-indicators" aria-label="Choose a slide">
        {slides.map((slide, index) => (
          <button
            type="button"
            key={slide.id}
            className={`builder-dot ${
              index === currentSlide ? "active" : ""
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={
              index === currentSlide ? "true" : undefined
            }
          />
        ))}
      </div>

      {/* Back to Top Button */}
      <a
        className="builder-scroll-top"
        href="#top"
        aria-label="Back to top"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 15l6-6 6 6" />
        </svg>
      </a>
    </section>
  );
};

export default ImageSlider;