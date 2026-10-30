import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import gsap from "gsap";

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

  const heroRef = useRef(null);
  const slideRefs = useRef([]);

  const subtitleRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const previousSlideRef = useRef(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + slides.length) % slides.length
    );
  };

  const goToSlide = (index) => {
    if (index === currentSlide) return;
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const activeSlide = slideRefs.current[currentSlide];

      if (!activeSlide) return;

      const previousIndex = previousSlideRef.current;
      const previousSlide =
        previousIndex !== null
          ? slideRefs.current[previousIndex]
          : null;

      slideRefs.current.forEach((slide, index) => {
        if (!slide) return;

        if (
          index !== currentSlide &&
          index !== previousIndex
        ) {
          gsap.set(slide, {
            opacity: 0,
            scale: 1.12,
          });
        }
      });

      const timeline = gsap.timeline();

      if (previousSlide && previousSlide !== activeSlide) {
        timeline.to(
          previousSlide,
          {
            opacity: 0,
            scale: 1.08,
            duration: 1.3,
            ease: "power2.inOut",
          },
          0
        );
      }

      timeline.fromTo(
        activeSlide,
        {
          opacity: 0,
          scale: 1.14,
        },
        {
          opacity: 1,
          scale: 1.035,
          duration: 1.6,
          ease: "power2.out",
        },
        0
      );

      timeline.to(
        activeSlide,
        {
          scale: 1.09,
          duration: 4.8,
          ease: "none",
        },
        1.2
      );

      previousSlideRef.current = currentSlide;
    }, heroRef);

    return () => ctx.revert();
  }, [currentSlide]);


  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const subtitle = subtitleRef.current;
      const title = titleRef.current;
      const description = descriptionRef.current;

      if (!subtitle || !title || !description) return;

      const words = title.querySelectorAll(".builder-word");

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline.fromTo(
        subtitle,
        {
          x: -45,
          opacity: 0,
          filter: "blur(8px)",
        },
        {
          x: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
        }
      );

      timeline.fromTo(
        words,
        {
          yPercent: 115,
          opacity: 0,
          filter: "blur(10px)",
        },
        {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.12,
        },
        "-=0.45"
      );

      timeline.fromTo(
        description,
        {
          y: 35,
          opacity: 0,
          filter: "blur(6px)",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
        },
        "-=0.45"
      );
    }, heroRef);

    return () => ctx.revert();
  }, [currentSlide]);

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsPaused(false);
    }
  };

  return (
    <section
      ref={heroRef}
      className="builder-hero"
      aria-label="Construction company featured projects"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={handleBlur}
    >

      <div className="builder-backgrounds">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            ref={(element) => {
              slideRefs.current[index] = element;
            }}
            className="builder-slide"
            style={{
              backgroundImage: `url("${slide.image}")`,
            }}
            aria-hidden={index !== currentSlide}
          />
        ))}
      </div>

      <div className="builder-overlay" />

      <div className="builder-vignette" />

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

      <div
        className="builder-content"
        key={slides[currentSlide].id}
      >
        <div className="builder-content-inner">
          <p
            className="builder-subtitle"
            ref={subtitleRef}
          >
            <span className="builder-subtitle-line" />
            {slides[currentSlide].subtitle}
          </p>

          

<h1 className="builder-title" ref={titleRef}>
  {slides[currentSlide].title.split(" ").map((word, index) => (
    <span key={`${slides[currentSlide].id}-${index}`}>
      <span className="builder-word-mask">
        <span className="builder-word">{word}</span>
      </span>
      {" "}
    </span>
  ))}
</h1>
          <p
            className="builder-description"
            ref={descriptionRef}
          >
            {slides[currentSlide].description}
          </p>
        </div>
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

      <div
        className="builder-indicators"
        aria-label="Choose a slide"
      >
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
          >
            <span className="builder-dot-inner" />
          </button>
        ))}
      </div>
    </section>
  );
};

export default ImageSlider;
