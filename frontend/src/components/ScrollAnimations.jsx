
// import { useEffect } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Lenis from "lenis";

// import "lenis/dist/lenis.css";

// gsap.registerPlugin(ScrollTrigger);

// function ScrollAnimations() {
// useEffect(() => {
// const reduceMotion = window.matchMedia(
// "(prefers-reduced-motion: reduce)"
// ).matches;

// if (reduceMotion) return;

// const lenis = new Lenis({
// lerp: 0.075,
// smoothWheel: true,
// wheelMultiplier: 0.85,
// });

// lenis.on("scroll", ScrollTrigger.update);

// const ticker = (time) => {
// lenis.raf(time * 1000);
// };

// gsap.ticker.add(ticker);
// gsap.ticker.lagSmoothing(0);

// const ctx = gsap.context(() => {
// gsap.utils.toArray([
// ".explore-properties",
// ".properties-section",
// ".projects-container",
// ".cities-section",
// ".owners-section",
// ".popular-localities-section.localities-embedded",
// ".possession-section",
// ".bhk-choice-section",
// ".home-about-preview",
// ".builder-demo",
// ".bb-why-section",
// ".home-why-preview",
// ".contact-main",
// ".loan-section",
// ".content-page.testimonials-page",
// ]).forEach((section) => {
// gsap.fromTo(
// section,
// {
// y: 100,
// opacity: 0,
// filter: "blur(5px)",
// },
// {
// y: 0,
// opacity: 1,
// filter: "blur(0px)",
// ease: "none",
// scrollTrigger: {
// trigger: section,
// start: "top 90%",
// end: "top 35%",
// scrub: 1.5,
// },
// }
// );
// });

//       // ==========================================


// // const localityObserver = new MutationObserver(() => {
// //   const sections = document.querySelectorAll(
// //     ".popular-localities-section.localities-embedded"
// //   );

// //   sections.forEach((section) => {
// //     const cards = section.querySelectorAll(
// //       ".popular-localities-grid .locality-card:not(.locality-animated)"
// //     );

// //     if (!cards.length) return;

// //     cards.forEach((card) => {
// //       card.classList.add("locality-animated");

// //       gsap.fromTo(
// //         card,
// //         {
// //           y: 90,
// //           opacity: 0,
// //           scale: 0.94,
// //         },
// //         {
// //           y: 0,
// //           opacity: 1,
// //           scale: 1,
// //           duration: 0.9,
// //           ease: "power3.out",
// //           scrollTrigger: {
// //             trigger: card,
// //             start: "top 88%",
// //             toggleActions: "play none none reverse",
// //           },
// //         }
// //       );
// //     });

// //     ScrollTrigger.refresh();
// //   });
// // });

// // localityObserver.observe(document.body, {
// //   childList: true,
// //   subtree: true,
// // });

// // =====================================
// // LOCALITY, BHK & POSSESSION ANIMATIONS
// // =====================================

// const animationGroups = [
//   {
//     section: ".popular-localities-section.localities-embedded",
//     cards: ".popular-localities-grid .locality-card",
//     animatedClass: "locality-animated",
//   },
//   {
//     section: ".possession-section",
//     cards: ".possession-grid > *",
//     animatedClass: "possession-animated",
//   },
// ];

// const animateDynamicCards = () => {
//   let hasNewCards = false;

//   animationGroups.forEach((group) => {
//     document.querySelectorAll(group.section).forEach((section) => {
//       const cards = section.querySelectorAll(
//         `${group.cards}:not(.${group.animatedClass})`
//       );

//       cards.forEach((card) => {
//         card.classList.add(group.animatedClass);
//         hasNewCards = true;

//         gsap.fromTo(
//           card,
//           {
//             y: 70,
//             opacity: 0,
//             scale: 0.96,
//           },
//           {
//             y: 0,
//             opacity: 1,
//             scale: 1,
//             duration: 0.85,
//             ease: "power3.out",
//             scrollTrigger: {
//               trigger: card,
//               start: "top 88%",
//               toggleActions: "play none none reverse",
//             },
//           }
//         );
//       });
//     });
//   });

//   if (hasNewCards) {
//     ScrollTrigger.refresh();
//   }
// };

// const localityObserver = new MutationObserver(() => {
//   animateDynamicCards();
// });

// animateDynamicCards();

// localityObserver.observe(document.body, {
//   childList: true,
//   subtree: true,
// });


// // ==========================================
// // BHK CARDS — PREMIUM SCROLL REVEAL
// // ==========================================

// // =====================================
// // BHK CARD SCROLL ANIMATION
// // =====================================

// const bhkCards = gsap.utils.toArray(
//   ".bhk-choice-section .bhk-choice-grid .bhk-choice-card"
// );

// bhkCards.forEach((card, index) => {
//   gsap.fromTo(
//     card,
//     {
//       y: 100,
//       opacity: 0,
//       scale: 0.9,
//     },
//     {
//       y: 0,
//       opacity: 1,
//       scale: 1,
//       duration: 1,
//       delay: index * 0.15,
//       ease: "power3.out",
//       scrollTrigger: {
//         trigger: card,
//         start: "top 90%",
//         toggleActions: "play none none reverse",
//       },
//     }
//   );
// });



// gsap.utils.toArray([
// ".section-header h2",
// ".category-header h2",
// ".explore-heading h2",
// ".cities-section > h2",
// ".selected-city-banner h3",
// ".possession-heading h2",
// ".bhk-choice-heading h2",
// ".localities-heading-copy h2",
// ]).forEach((heading) => {
// gsap.fromTo(
// heading,
// {
// x: -100,
// opacity: 0,
// filter: "blur(8px)",
// },
// {
// x: 0,
// opacity: 1,
// filter: "blur(0px)",
// ease: "none",
// scrollTrigger: {
// trigger: heading,
// start: "top 90%",
// end: "top 55%",
// scrub: 1.5,
// },
// }
// );
// });


// // temp removing property card animations due to performance issues on mobile devices
// // const animatePropertyCards = () => {
// // const grids = document.querySelectorAll(".property-grid");

// // grids.forEach((grid) => {
// // const cards = grid.querySelectorAll(
// // ".pc-card:not([data-animated='true'])"
// // );

// // if (!cards.length) return;

// // cards.forEach((card) => {
// // card.dataset.animated = "true";
// // });

// // gsap.fromTo(
// // cards,
// // {
// // y: 100,
// // opacity: 0,
// // scale: 0.94,
// // },
// // {
// // y: 0,
// // opacity: 1,
// // scale: 1,
// // duration: 0.8,
// // stagger: 0.2,
// // ease: "power3.out",
// // clearProps: "transform",
// // scrollTrigger: {
// // trigger: cards[0],
// // start: "top 85%",
// // once: true,
// // },
// // }
// // );
// // });
// // };

// // animatePropertyCards();

// // const cardObserver = new MutationObserver(() => {
// // animatePropertyCards();
// // ScrollTrigger.refresh();
// // });

// // cardObserver.observe(document.querySelector(".property-grid") || document.body, {
// // childList: true,
// // subtree: true,
// // });

// gsap.utils.toArray([
// // ".property-grid > *",
// ".projects-grid > *",
// ".city-grid > *",
// ".quick-grid > *",
// ".why-grid > *",
// ]).forEach((card) => {
// gsap.fromTo(
// card,
// {
// y: 90,
// opacity: 0,
// scale: 0.96,
// },
// {
// y: 0,
// opacity: 1,
// scale: 1,
// ease: "none",
// scrollTrigger: {
// trigger: card,
// start: "top 92%",
// end: "top 55%",
// scrub: 1.3,
// },
// }
// );
// });


// // Images
// gsap.utils.toArray(
// ".property-grid img, .projects-grid img"
// ).forEach((img) => {
// gsap.fromTo(
// img,
// { scale: 1.12 },
// {
// scale: 1,
// ease: "none",
// scrollTrigger: {
// trigger: img,
// start: "top 95%",
// end: "top 40%",
// scrub: 1.5,
// },
// }
// );
// });
// });

// ScrollTrigger.refresh();

// return () => {
      
// ctx.revert();
// gsap.ticker.remove(ticker);
// lenis.destroy();
// };
// }, []);

// return null;

  
// }

// export default ScrollAnimations;


import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

function ScrollAnimations() {
  useEffect(() => {
    // ==========================================
    // REDUCED MOTION CHECK
    // ==========================================

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    // ==========================================
    // LENIS - DESKTOP ONLY
    // ANDROID USES NATIVE TOUCH SCROLLING
    // ==========================================

    const isTouchDevice = window.matchMedia(
      "(pointer: coarse)"
    ).matches;

    let lenis = null;
    let ticker = null;

    if (!isTouchDevice) {
      lenis = new Lenis({
        lerp: 0.075,
        smoothWheel: true,
        wheelMultiplier: 0.85,
      });

      lenis.on("scroll", ScrollTrigger.update);

      ticker = (time) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
    }

    // ==========================================
    // REFRESH SCHEDULER
    // ==========================================

    let refreshFrame1;
    let refreshFrame2;

    const refreshScrollAnimations = () => {
      cancelAnimationFrame(refreshFrame1);
      cancelAnimationFrame(refreshFrame2);

      refreshFrame1 = requestAnimationFrame(() => {
        refreshFrame2 = requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      });
    };

    // ==========================================
    // ANIMATION GROUPS
    // ==========================================

    const animationGroups = [
      // SECTION ANIMATIONS
      {
        selector: [
          ".explore-properties",
          ".properties-section",
          ".projects-container",
          ".cities-section",
          ".owners-section",
          ".popular-localities-section.localities-embedded",
          ".possession-section",
          ".bhk-choice-section",
          ".home-about-preview",
          ".builder-demo",
          ".bb-why-section",
          ".home-why-preview",
          ".contact-main",
          ".loan-section",
          ".content-page.testimonials-page",
        ].join(","),

        from: {
          y: 100,
          opacity: 0,
          filter: "blur(5px)",
        },

        to: {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
        },

        trigger: {
          start: "top 90%",
          end: "top 35%",
          scrub: 1.5,
        },
      },

      // HEADING ANIMATIONS
      {
        selector: [
          ".section-header h2",
          ".category-header h2",
          ".explore-heading h2",
          ".cities-section > h2",
          ".selected-city-banner h3",
          ".possession-heading h2",
          ".bhk-choice-heading h2",
          ".localities-heading-copy h2",
        ].join(","),

        from: {
          x: -100,
          opacity: 0,
          filter: "blur(8px)",
        },

        to: {
          x: 0,
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
        },

        trigger: {
          start: "top 90%",
          end: "top 55%",
          scrub: 1.5,
        },
      },

      // BHK CARDS
      {
        selector:
          ".bhk-choice-section .bhk-choice-grid .bhk-choice-card",

        from: {
          y: 100,
          opacity: 0,
          scale: 0.9,
        },

        to: {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        },

        trigger: {
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      },

      // PROJECT / CITY / QUICK / WHY CARDS
      {
        selector: [
          ".projects-grid > *",
          ".city-grid > *",
          ".quick-grid > *",
          ".why-grid > *",
        ].join(","),

        from: {
          y: 90,
          opacity: 0,
          scale: 0.96,
        },

        to: {
          y: 0,
          opacity: 1,
          scale: 1,
          ease: "none",
        },

        trigger: {
          start: "top 92%",
          end: "top 55%",
          scrub: 1.3,
        },
      },

      // LOCALITY CARDS
      {
        selector:
          ".popular-localities-grid .locality-card",

        from: {
          y: 70,
          opacity: 0,
          scale: 0.96,
        },

        to: {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.85,
          ease: "power3.out",
        },

        trigger: {
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      },

      // POSSESSION CARDS
      {
        selector: ".possession-grid > *",

        from: {
          y: 70,
          opacity: 0,
          scale: 0.96,
        },

        to: {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.85,
          ease: "power3.out",
        },

        trigger: {
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      },

      // PROPERTY AND PROJECT IMAGES
      {
        selector: ".property-grid img, .projects-grid img",

        from: {
          scale: 1.12,
        },

        to: {
          scale: 1,
          ease: "none",
        },

        trigger: {
          start: "top 95%",
          end: "top 40%",
          scrub: 1.5,
        },
      },
    ];

    // ==========================================
    // TRACK ANIMATIONS
    // ==========================================

    const seenElements = animationGroups.map(
      () => new WeakSet()
    );

    const activeAnimations = [];

    // ==========================================
    // REMOVE ANIMATIONS OF REMOVED ELEMENTS
    // ==========================================

    const cleanupDetachedAnimations = () => {
      for (let i = activeAnimations.length - 1; i >= 0; i--) {
        const item = activeAnimations[i];

        if (!item.element.isConnected) {
          item.tween.scrollTrigger?.kill();
          item.tween.kill();

          activeAnimations.splice(i, 1);
        }
      }
    };

    // ==========================================
    // INITIALIZE ALL ANIMATIONS
    // ALSO HANDLES DYNAMICALLY LOADED ELEMENTS
    // ==========================================

    const animateDynamicElements = () => {
      cleanupDetachedAnimations();

      animationGroups.forEach((group, groupIndex) => {
        const elements = document.querySelectorAll(
          group.selector
        );

        elements.forEach((element) => {
          if (seenElements[groupIndex].has(element)) {
            return;
          }

          seenElements[groupIndex].add(element);

          const tween = gsap.fromTo(
            element,
            group.from,
            {
              ...group.to,

              scrollTrigger: {
                trigger: element,
                ...group.trigger,
              },
            }
          );

          activeAnimations.push({
            element,
            tween,
          });
        });
      });

      refreshScrollAnimations();
    };

    // ==========================================
    // INITIAL ANIMATION CHECK
    // ==========================================

    animateDynamicElements();

    // ==========================================
    // MUTATION OBSERVER
    // DETECTS NEW REACT ELEMENTS
    // ==========================================

    let mutationTimeout;

    const localityObserver = new MutationObserver(() => {
      clearTimeout(mutationTimeout);

      mutationTimeout = setTimeout(() => {
        animateDynamicElements();
      }, 150);
    });

    localityObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // ==========================================
    // RESIZE OBSERVER
    // ==========================================

    const pageContainer =
      document.querySelector(".home-page") ||
      document.querySelector("main") ||
      document.body;

    const resizeObserver = new ResizeObserver(() => {
      refreshScrollAnimations();
    });

    resizeObserver.observe(pageContainer);

    // ==========================================
    // WINDOW EVENTS
    // ==========================================

    const handleResize = () => {
      refreshScrollAnimations();
    };

    const handleWindowLoad = () => {
      animateDynamicElements();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    window.addEventListener("load", handleWindowLoad);

    // Refresh after fonts are ready
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        refreshScrollAnimations();
      });
    }

    refreshScrollAnimations();

    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {
      clearTimeout(mutationTimeout);

      cancelAnimationFrame(refreshFrame1);
      cancelAnimationFrame(refreshFrame2);

      localityObserver.disconnect();
      resizeObserver.disconnect();

      window.removeEventListener("resize", handleResize);
      window.removeEventListener(
        "orientationchange",
        handleResize
      );
      window.removeEventListener("load", handleWindowLoad);

      activeAnimations.forEach(({ tween }) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });

      activeAnimations.length = 0;

      if (lenis) {
        gsap.ticker.remove(ticker);
        lenis.destroy();
      }
    };
  }, []);

  return null;
}

export default ScrollAnimations;
