import React, { useEffect, useRef, useState } from "react";

import {
  ArrowRight,
  Check,
  Mail,
  Phone,
  MapPin,
  Clock,
  ExternalLink,
  Menu,
  X,
  Award,
  Zap,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import {
  TRUST_LOGOS,
  STATS_DATA,
  INDUSTRIES_DATA,
  PROGRAMS_DATA,
  PROCESS_STEPS,
  WHY_US_DATA,
  TEAM_DATA
} from "./data";
const heroVideoSrc = "/assets/generate_hero_section_video_fo.mp4";

export default function App() {
  const navbarRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSubmittedSuccess(true);

    // Scale pulse animation using GSAP on the submit button
    const gsap = (window as any).gsap;
    if (gsap) {
      gsap.fromTo('#form-submit-btn',
        { scale: 1 },
        { scale: 1.12, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' }
      );
    }

    // Clear form fields
    setFormData({ name: "", company: "", email: "", phone: "", message: "" });

    // Revert button after 2.5s and trigger the success screen transition
    setTimeout(() => {
      setIsSubmittedSuccess(false);
      setIsSubmitting(false);
      setFormSubmitted(true);
    }, 2500);
  };

  // Efficient hero video handling: pause when the hero scrolls out of view
  // (saves CPU/GPU/battery) and resume when it's back in view. Also respects
  // the user's reduced-motion preference by freezing on the first frame.
  useEffect(() => {
    const videoEl = heroVideoRef.current;
    if (!videoEl) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      videoEl.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoEl.play().catch(() => { });
        } else {
          videoEl.pause();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(videoEl);

    return () => observer.disconnect();
  }, []);

  // GSAP and Lenis Scroll Trigger Initialization
  useEffect(() => {
    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;
    const Lenis = (window as any).Lenis;

    if (!gsap || !ScrollTrigger || !Lenis) {
      console.warn("GSAP, ScrollTrigger, or Lenis CDN scripts are missing from index.html.");
      return;
    }

    // 1. Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 2. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);

    // Sync Lenis with GSAP Ticker
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Smooth scroll for all anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) {
          lenis.scrollTo(el, { offset: -70 });
        }
      }
    };

    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', handleAnchorClick as any);
    });

    // 3. Navbar scroll effect
    if (navbarRef.current) {
      ScrollTrigger.create({
        start: 'top -60',
        onToggle: (self: any) => {
          if (self.isActive) {
            navbarRef.current?.classList.add('scrolled');
          } else {
            navbarRef.current?.classList.remove('scrolled');
          }
        }
      });
    }

    // 4. Hero Entrance Sequence
    gsap.set('.hero-anim', { opacity: 0, y: 30, filter: 'blur(5px)' });
    gsap.to('.hero-anim', {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1,
      stagger: 0.1,
      ease: 'power4.out',
      delay: 0.25
    });

    // Word Reveal Animation for Hero Title
    gsap.set('.title-word', { yPercent: 100, rotate: 2 });
    gsap.to('.title-word', {
      yPercent: 0,
      rotate: 0,
      duration: 1.2,
      stagger: 0.08,
      ease: 'power4.out',
      delay: 0.1
    });

    // 5. Scroll Progress Indicator Bar Animation (Top)
    ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self: any) => {
        gsap.to('.scroll-progress-bar', { width: `${self.progress * 100}%`, duration: 0.1, overwrite: 'auto' });
      }
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 6. Magnetic Buttons Effect
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    const handleMagneticMove = (e: any) => {
      if (prefersReducedMotion) return;
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      let offsetX = x * 0.25;
      let offsetY = y * 0.25;
      if (offsetX > 8) offsetX = 8;
      if (offsetX < -8) offsetX = -8;
      if (offsetY > 8) offsetY = 8;
      if (offsetY < -8) offsetY = -8;

      gsap.to(btn, {
        x: offsetX,
        y: offsetY,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };
    const handleMagneticLeave = (e: any) => {
      const btn = e.currentTarget;
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto'
      });
    };
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', handleMagneticMove);
      btn.addEventListener('mouseleave', handleMagneticLeave);
    });

    // 7. Card Spotlight Custom Coordinate Tracker
    const spotlightCards = document.querySelectorAll('.spotlight-card');
    const handleSpotlightMove = (e: any) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };
    spotlightCards.forEach(card => {
      card.addEventListener('mousemove', handleSpotlightMove);
    });

    // 3D Card Tilt Configuration
    const setupCardTilt = (selector: string, maxDeg: number) => {
      const cards = document.querySelectorAll(selector);
      cards.forEach((card: any) => {
        card.style.transformStyle = "preserve-3d";
        const onMove = (e: any) => {
          if (prefersReducedMotion) return;
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;

          const mx = e.clientX - rect.left;
          const my = e.clientY - rect.top;
          card.style.setProperty('--mx', `${mx}px`);
          card.style.setProperty('--my', `${my}px`);

          gsap.to(card, {
            rotateY: x * maxDeg,
            rotateX: -y * maxDeg,
            transformPerspective: 700,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        };
        const onLeave = () => {
          gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            transformPerspective: 700,
            duration: 0.6,
            ease: 'power3.out',
            overwrite: 'auto'
          });
        };
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
      });
    };
    setupCardTilt('.tilt-large', 6);
    setupCardTilt('.tilt-small', 3);

    // 8. Background Parallax (Blobs, Floaters, Shapes) - target wrappers to avoid CSS animation conflict
    gsap.to('.blob1-wrap', {
      y: 150,
      rotate: 45,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2
      }
    });
    gsap.to('.blob2-wrap', {
      y: -120,
      rotate: -45,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2
      }
    });

    // Extra shape floaters parallax
    gsap.to('.shape-float', {
      yPercent: -40,
      rotation: 180,
      ease: 'none',
      scrollTrigger: {
        trigger: '#about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });

    // 8b. Mouse-reactive horizontal parallax on the hero blobs, layered on top of the scroll parallax above.
    // Uses quickTo + only animates 'x' so it never fights the ScrollTrigger-driven 'y'/'rotate' on the same elements.
    let handleHeroMouseMove: ((e: MouseEvent) => void) | null = null;
    const heroSectionEl = document.getElementById('hero');
    if (heroSectionEl && !prefersReducedMotion) {
      const moveBlob1X = gsap.quickTo('.blob1-wrap', 'x', { duration: 1.4, ease: 'power3.out' });
      const moveBlob2X = gsap.quickTo('.blob2-wrap', 'x', { duration: 1.6, ease: 'power3.out' });
      handleHeroMouseMove = (e: MouseEvent) => {
        const rect = heroSectionEl.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 (left) to 0.5 (right)
        moveBlob1X(relX * 40);
        moveBlob2X(relX * -30);
      };
      heroSectionEl.addEventListener('mousemove', handleHeroMouseMove);
    }

    // 9. Floating Hero Cards Ambient Sinusoidal Motion
    gsap.to('.card-main', { y: -16, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to('.card-points', { y: 16, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.35 });
    gsap.to('.card-badge', { y: -12, duration: 3.1, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.7 });

    // 10. Specialized Rhythmic Entrance Reveals
    if (prefersReducedMotion) {
      const allReveals = document.querySelectorAll('.reveal, .reveal-stat, .reveal-industry, .reveal-program, .reveal-whyus, .reveal-team, .reveal-step, .reveal-goc-band, .reveal-coming-soon');
      gsap.set(allReveals, { opacity: 0 });
      ScrollTrigger.batch(allReveals, {
        start: 'top 90%',
        onEnter: (batch: any) => gsap.to(batch, { opacity: 1, duration: 0.5, overwrite: 'auto' }),
        once: true
      });
    } else {
      // Stat cards: y:40 -> 0, scale:0.92 -> 1, opacity:0 -> 1, 0.7s back.out(1.4)
      const statCards = document.querySelectorAll('.reveal-stat');
      if (statCards.length > 0) {
        gsap.set(statCards, { opacity: 0, y: 40, scale: 0.92 });
        ScrollTrigger.batch(statCards, {
          start: 'top 88%',
          onEnter: (batch: any) => gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: 'back.out(1.4)',
            stagger: 0.08,
            overwrite: 'auto'
          }),
          once: true
        });
      }

      // Industry & Why-Us cards: alternate fly direction x:-40 / x:40 with rotateZ and stagger
      const industryCards = document.querySelectorAll('.reveal-industry');
      if (industryCards.length > 0) {
        gsap.set(industryCards, { opacity: 0 });
        ScrollTrigger.batch(industryCards, {
          start: 'top 88%',
          onEnter: (batch: any) => {
            batch.forEach((el: any, i: number) => {
              const isEven = i % 2 === 0;
              gsap.fromTo(el, {
                opacity: 0,
                x: isEven ? -40 : 40,
                rotateZ: isEven ? -3 : 3
              }, {
                opacity: 1,
                x: 0,
                rotateZ: 0,
                duration: 0.75,
                ease: 'power3.out',
                delay: i * 0.06,
                overwrite: 'auto'
              });
            });
          },
          once: true
        });
      }

      const whyUsCards = document.querySelectorAll('.reveal-whyus');
      if (whyUsCards.length > 0) {
        gsap.set(whyUsCards, { opacity: 0 });
        ScrollTrigger.batch(whyUsCards, {
          start: 'top 88%',
          onEnter: (batch: any) => {
            batch.forEach((el: any, i: number) => {
              // Scatter source coordinates: cards fly in from different angles / corners "here and there"
              const angles = [
                -135, // top-left
                -45,  // top-right
                180,  // far left
                0,    // far right
                135,  // bottom-right
                45    // bottom-left
              ];
              const angleDeg = angles[i % angles.length];
              const angleRad = angleDeg * (Math.PI / 180);
              const distance = 180 + (i * 25); // varied distance for stagger offset
              const startX = Math.cos(angleRad) * distance;
              const startY = Math.sin(angleRad) * distance;
              const startRotate = (i % 2 === 0 ? -1 : 1) * (15 + (i * 8)); // dynamic rotation on entry

              gsap.fromTo(el, {
                opacity: 0,
                x: startX,
                y: startY,
                rotateZ: startRotate,
                scale: 0.5,
              }, {
                opacity: 1,
                x: 0,
                y: 0,
                rotateZ: 0,
                scale: 1,
                duration: 1.25,
                ease: 'back.out(1.4)',
                delay: i * 0.08,
                overwrite: 'auto'
              });
            });
          },
          once: true
        });
      }

      // Program cards: 3D flip-reveal with moving / sliding animation and continuous floating
      const programCards = document.querySelectorAll('.reveal-program');
      if (programCards.length > 0) {
        gsap.set(programCards, { opacity: 0 });
        ScrollTrigger.batch(programCards, {
          start: 'top 88%',
          onEnter: (batch: any) => {
            batch.forEach((el: any, i: number) => {
              // Alternating slide-in from left/right to look like they fly in with movement
              const isEven = i % 2 === 0;
              gsap.fromTo(el, {
                opacity: 0,
                x: isEven ? -80 : 80,
                y: 40,
                rotateX: -15,
                transformPerspective: 800
              }, {
                opacity: 1,
                x: 0,
                y: 0,
                rotateX: 0,
                duration: 1.1,
                ease: 'back.out(1.2)',
                delay: i * 0.08,
                overwrite: 'auto',
                onComplete: () => {
                  // Once entry completes, start a continuous drifting/floating animation
                  gsap.to(el, {
                    y: "-=8",
                    rotateZ: (i % 2 === 0 ? -1 : 1) * 1.5,
                    duration: 2.2 + (i * 0.3),
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                  });
                }
              });
            });
          },
          once: true
        });
      }

      // Team cards: scale pulse on arrival
      // Team cards: continuous stacking "deck" carousel

      // Steps (How It Works / Execution Method): sequential sliding-in animation & continuous floating/breathing
      const stepCardsReveal = document.querySelectorAll('.reveal-step');
      stepCardsReveal.forEach((card, i) => {
        const marker = card.querySelector('.step-number-marker');
        const text = card.querySelector('.step-text-content');
        if (marker && text) {
          const isEven = i % 2 === 0;
          // Set initial state for sequential spring sliding entry
          gsap.set(card, { opacity: 0, x: isEven ? -100 : 100, y: 20 });
          gsap.set(marker, { scale: 0 });
          gsap.set(text, { opacity: 0, y: 15 });

          ScrollTrigger.create({
            trigger: card,
            start: 'top 88%',
            onEnter: () => {
              const tl = gsap.timeline({
                onComplete: () => {
                  // Continuous gentle bobbing moving animation on the card
                  gsap.to(card, {
                    y: "-=6",
                    duration: 2.4 + (i * 0.4),
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                  });
                  // Gentle pulsing/breathing of the number marker
                  gsap.to(marker, {
                    scale: 1.08,
                    duration: 1.6,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                  });
                }
              });

              tl.to(card, {
                opacity: 1,
                x: 0,
                y: 0,
                duration: 1.0,
                ease: 'back.out(1.2)'
              })
                .to(marker, {
                  scale: 1,
                  duration: 0.6,
                  ease: 'back.out(2)'
                }, "-=0.55")
                .to(text, {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  ease: 'power2.out'
                }, "-=0.3");
            },
            once: true
          });
        }
      });

      // GiftsOnClick dark band: soft scale reveal
      const scaleReveals = document.querySelectorAll('.reveal-goc-band');
      scaleReveals.forEach((el) => {
        gsap.set(el, { opacity: 0, scale: 0.96 });
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          onEnter: () => {
            gsap.to(el, {
              opacity: 1,
              scale: 1,
              duration: 0.9,
              ease: 'power3.out',
              overwrite: 'auto'
            });
          },
          once: true
        });
      });

      // Partner with Us section left/right container entrance
      const partnerLeft = document.querySelector('.reveal-partner-left');
      const partnerRight = document.querySelector('.reveal-partner-right');

      if (partnerLeft) {
        gsap.set(partnerLeft, { opacity: 0, x: -150 });
        ScrollTrigger.create({
          trigger: partnerLeft,
          start: 'top 85%',
          onEnter: () => {
            gsap.to(partnerLeft, {
              opacity: 1,
              x: 0,
              duration: 1.25,
              ease: 'power4.out',
              overwrite: 'auto'
            });
          },
          once: true
        });
      }

      if (partnerRight) {
        gsap.set(partnerRight, { opacity: 0, x: 150 });
        ScrollTrigger.create({
          trigger: partnerRight,
          start: 'top 85%',
          onEnter: () => {
            gsap.to(partnerRight, {
              opacity: 1,
              x: 0,
              duration: 1.25,
              ease: 'power4.out',
              overwrite: 'auto'
            });
          },
          once: true
        });
      }

      // Standard remaining reveals
      const standardReveals = document.querySelectorAll('.reveal');
      if (standardReveals.length > 0) {
        gsap.set(standardReveals, { opacity: 0, y: 25 });
        ScrollTrigger.batch(standardReveals, {
          start: 'top 88%',
          onEnter: (batch: any) => gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.08,
            overwrite: 'auto'
          }),
          once: true
        });
      }
    }

    // 11. Count-Up Stat Numbers with Digit Flicker (supports decimals)
    const countEls = document.querySelectorAll('[data-count]');
    countEls.forEach(el => {
      const target = parseFloat(el.getAttribute('data-count') || '0');
      const suffix = el.getAttribute('data-suffix') || '';
      ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        once: true,
        onEnter: () => {
          let obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 1.85,
            ease: 'power3.out',
            onUpdate: () => {
              const hasDecimal = target % 1 !== 0;
              const formatted = hasDecimal ? obj.val.toFixed(1) : Math.floor(obj.val).toLocaleString();
              el.textContent = formatted + suffix;
            },
            onComplete: () => {
              if (prefersReducedMotion) {
                el.textContent = target.toLocaleString() + suffix;
                return;
              }
              let flickerCount = 0;
              const flickerInterval = setInterval(() => {
                flickerCount++;
                if (flickerCount < 3) {
                  const offset = (Math.random() - 0.5) * Math.max(10, target * 0.02);
                  const randomVal = Math.max(0, target + offset);
                  const hasDecimal = target % 1 !== 0;
                  const formatted = hasDecimal ? randomVal.toFixed(1) : Math.floor(randomVal).toLocaleString();
                  el.textContent = formatted + suffix;
                } else {
                  clearInterval(flickerInterval);
                  el.textContent = target.toLocaleString() + suffix;
                }
              }, 50);
            }
          });
        }
      });
    });

    // 12. How It Works Progress Line (horizontal scroll scrub)
    const stepsFill = document.querySelector('#stepsFill');
    if (stepsFill) {
      gsap.to(stepsFill, {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.steps-wrap',
          start: 'top 70%',
          end: 'bottom 60%',
          scrub: 1
        }
      });
    }

    // 13. Active Step Spotlight Highlighter
    const stepCards = document.querySelectorAll('.step-card-item');
    stepCards.forEach((card, idx) => {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 75%',
        end: 'bottom 55%',
        onEnter: () => gsap.to(card, {
          scale: 1.05,
          borderColor: '#C41E3A',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 20px 40px rgba(196, 30, 58, 0.08)',
          duration: 0.4,
          ease: 'power2.out'
        }),
        onLeave: () => gsap.to(card, {
          scale: 1,
          borderColor: 'transparent',
          backgroundColor: 'transparent',
          boxShadow: 'none',
          duration: 0.4,
          ease: 'power2.out'
        }),
        onEnterBack: () => gsap.to(card, {
          scale: 1.05,
          borderColor: '#C41E3A',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 20px 40px rgba(196, 30, 58, 0.08)',
          duration: 0.4,
          ease: 'power2.out'
        }),
        onLeaveBack: () => gsap.to(card, {
          scale: 1,
          borderColor: 'transparent',
          backgroundColor: 'transparent',
          boxShadow: 'none',
          duration: 0.4,
          ease: 'power2.out'
        }),
      });
    });

    // Clean up on unmount
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
      anchorLinks.forEach(link => {
        link.removeEventListener('click', handleAnchorClick as any);
      });
      magneticBtns.forEach(btn => {
        btn.removeEventListener('mousemove', handleMagneticMove);
        btn.removeEventListener('mouseleave', handleMagneticLeave);
      });
      spotlightCards.forEach(card => {
        card.removeEventListener('mousemove', handleSpotlightMove);
      });
      if (heroSectionEl && handleHeroMouseMove) {
        heroSectionEl.removeEventListener('mousemove', handleHeroMouseMove);
      }
      // Kill all scroll triggers
      ScrollTrigger.getAll().forEach((t: any) => t.kill());
    };
  }, []);

  // Custom Cursor: dot snaps to mouse position, ring trails behind via CSS transition.
  // Skipped entirely on touch devices (checked via matchMedia) so mobile taps are unaffected.
  useEffect(() => {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    document.body.classList.add('custom-cursor-active');

    const handleMove = (e: MouseEvent) => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    };

    const handleLeaveWindow = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    // Delegated hover detection: grows the ring and hides the dot over any clickable element
    const interactiveSelector = 'a, button, input, textarea, .cursor-hover, [role="button"]';
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(interactiveSelector)) {
        ring.classList.add('cursor-is-hovering');
        dot.classList.add('cursor-is-hovering');
      }
    };
    const handleOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(interactiveSelector)) {
        ring.classList.remove('cursor-is-hovering');
        dot.classList.remove('cursor-is-hovering');
      }
    };

    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseleave', handleLeaveWindow);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseleave', handleLeaveWindow);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
    };
  }, []);

  // Card Mouse Tilt Interaction Handler (calculates relative coordinate center & rotates)
  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

    const gsap = (window as any).gsap;
    if (gsap) {
      gsap.to(card, {
        rotateY: x * 8,
        rotateX: -y * 8,
        transformPerspective: 600,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  };

  const handleTiltLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const gsap = (window as any).gsap;
    if (gsap) {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1A1414] font-sans selection:bg-[#FCEAEC] selection:text-[#C41E3A]">

      {/* Scroll Progress Bar at very top of screen */}
      <div className="scroll-progress-bar"></div>

      {/* Custom Cursor: precise dot + lagging ring (desktop/mouse only, see useEffect below) */}
      <div ref={cursorDotRef} className="custom-cursor-dot"></div>
      <div ref={cursorRingRef} className="custom-cursor-ring"></div>

      {/* 1. Navbar */}
      <nav
        id="navbar"
        ref={navbarRef}
        className="navbar-el fixed top-0 left-0 right-0 z-50 py-[22px] px-6 md:px-12 flex justify-between items-center bg-transparent transition-all duration-300"
      >
        <div className="flex items-center">
          <a href="#hero" className="flex items-center">
            <img
              src="/goclogo.png"
              alt="GiftsOnClick"
              className="h-16 md:h-20 w-auto object-contain scale-[1.5] md:scale-[1.8] origin-left"
            />
          </a>
        </div>

        {/* Desktop Navigation links */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          <a href="#about" className="nav-link text-sm font-semibold text-[#5A5252] hover:text-[#C41E3A]">About</a>
          <a href="#industries" className="nav-link text-sm font-semibold text-[#5A5252] hover:text-[#C41E3A]">Industries</a>
          <a href="#programs" className="nav-link text-sm font-semibold text-[#5A5252] hover:text-[#C41E3A]">Programs</a>
          <a href="#why-us" className="nav-link text-sm font-semibold text-[#5A5252] hover:text-[#C41E3A]">Why Us</a>
          <a href="#team" className="nav-link text-sm font-semibold text-[#5A5252] hover:text-[#C41E3A]">Team</a>
          <a href="#contact" className="nav-link text-sm font-semibold text-[#5A5252] hover:text-[#C41E3A]">Contact</a>
        </div>

        {/* Demo Button */}
        <div className="hidden md:block">

        </div>

        {/* Mobile Hamburger toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-[#1A1414] hover:text-[#C41E3A] transition-colors"
          aria-label="Toggle Menu"
          id="mobile-menu-toggle"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Drawer Overlay Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#FFFFFF] transition-all duration-500 flex flex-col justify-between p-8 pt-28 md:hidden ${isMobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
          }`}
        id="mobile-drawer"
      >
        <div className="flex flex-col gap-6 text-left">
          <a
            href="#about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-2xl font-semibold text-[#1A1414] border-b border-[#F0E2E0] pb-2 font-heading"
          >
            About Us
          </a>
          <a
            href="#industries"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-2xl font-semibold text-[#1A1414] border-b border-[#F0E2E0] pb-2 font-heading"
          >
            Industries We Serve
          </a>
          <a
            href="#programs"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-2xl font-semibold text-[#1A1414] border-b border-[#F0E2E0] pb-2 font-heading"
          >
            Reward Programs
          </a>
          <a
            href="#why-us"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-2xl font-semibold text-[#1A1414] border-b border-[#F0E2E0] pb-2 font-heading"
          >
            Why Choose Us
          </a>
          <a
            href="#team"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-2xl font-semibold text-[#1A1414] border-b border-[#F0E2E0] pb-2 font-heading"
          >
            Our Team
          </a>
          <a
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-2xl font-semibold text-[#1A1414] border-b border-[#F0E2E0] pb-2 font-heading"
          >
            Contact
          </a>
        </div>
        <div className="flex flex-col gap-4">
          <a
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="btn-pill w-full text-center bg-[#C41E3A] hover:bg-[#8C1327] text-white py-4 font-bold tracking-wide"
          >
            Get a Demo
          </a>

        </div>
      </div>


      {/* 2. Hero Section */}
      <section
        id="hero"
        className="relative min-h-0 py-16 pt-28 pb-10 md:min-h-screen md:py-24 lg:py-32 md:pt-36 md:pb-24 px-6 md:px-12 lg:px-24 flex items-center overflow-hidden bg-[#1A1414]"
      >
        {/* Background video: muted/autoplay/loop/playsInline for silent autoplay support and
            battery-friendly playback; paused off-screen via IntersectionObserver above. */}
        <video
          ref={heroVideoRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={heroVideoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
        />

        {/* Subtle high-contrast white gradient overlay to guarantee perfect text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/60 to-white/30 md:to-transparent z-0"></div>

        {/* Parallax Blobs behind content */}
        <div className="blob1-wrap absolute top-[10%] right-[10%] w-[500px] h-[500px] pointer-events-none z-0">
          <div className="blob1 w-full h-full rounded-full bg-gradient-to-br from-[#C41E3A]/5 to-[#FCEAEC]/10 filter blur-[80px]"></div>
        </div>
        <div className="blob2-wrap absolute bottom-[10%] left-[5%] w-[450px] h-[450px] pointer-events-none z-0">
          <div className="blob2 w-full h-full rounded-full bg-gradient-to-tr from-[#C9A24B]/5 to-[#FBF6F5]/15 filter blur-[80px]"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full max-w-7xl mx-auto z-10">

          {/* Hero Left Content Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">

            {/* Main Headline */}
            <h1 className="hero-anim text-[36px] sm:text-[54px] lg:text-[68px] leading-[1.1] md:leading-[1.05] font-heading text-[#1A1414] mb-4 md:mb-6 max-w-xl">
              <span className="inline-block overflow-hidden"><span className="title-word inline-block mr-2 md:mr-2.5">Turn</span></span>
              <span className="inline-block overflow-hidden"><span className="title-word inline-block mr-2 md:mr-2.5">every</span></span>
              <span className="inline-block overflow-hidden"><span className="title-word inline-block mr-2 md:mr-2.5">achievement</span></span>
              <span className="inline-block overflow-hidden"><span className="title-word inline-block mr-2 md:mr-2.5">into</span></span>
              <span className="inline-block overflow-hidden"><span className="title-word inline-block text-[#C41E3A] italic">a reward.</span></span>
            </h1>

            {/* Subcopy text */}
            <p className="hero-anim text-base md:text-xl text-[#5A5252] leading-relaxed mb-6 md:mb-8 max-w-lg font-body">
              Reward your employees, dealers, and channel partners with India's premium B2B incentive platform. Simple integration, vetted brands, and real-time distribution.
            </p>

          </div>

          {/* Hero Right Floating Cards Column - height optimized on mobile */}
          <div className="lg:col-span-5 relative h-[240px] sm:h-[280px] lg:h-[500px] flex items-center justify-center w-full mt-4 lg:mt-0">

            {/* Card 1: Main mockup wallet card (centered & responsive on mobile) */}
            <div
              onMouseMove={handleTiltMove}
              onMouseLeave={handleTiltLeave}
              className="card-main absolute w-[92%] max-w-[310px] sm:w-[330px] p-5 sm:p-6 rounded-2xl bg-white border border-[#F0E2E0] shadow-xl z-20 top-2 left-1/2 -translate-x-1/2 lg:left-10 lg:translate-x-0 cursor-pointer hover:border-[#C41E3A]/20 transition-all duration-300"
              style={{ transformStyle: "preserve-3d" }}
              id="hero-card-main"
            >
              <div className="flex justify-between items-center mb-5 sm:mb-6">
                <span className="text-[10px] sm:text-xs font-bold text-[#C41E3A] bg-[#FCEAEC] px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Corporate Portal
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-[#5A5252]">gocrewards</span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#5A5252] mb-0.5 sm:mb-1 font-body">Welcome back,</p>
              <h4 className="text-lg sm:text-xl font-bold text-[#1A1414] mb-3 sm:mb-4 font-heading">Samir Kalra</h4>

              <div className="bg-[#FBF6F5] rounded-xl p-3 sm:p-4 border border-[#F0E2E0] mb-3 sm:mb-4">
                <p className="text-[9px] sm:text-[10px] text-[#5A5252] uppercase tracking-wider font-semibold mb-1">Available Point Balance</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-[#C41E3A] tracking-tight">25,000</span>
                  <span className="text-[11px] sm:text-xs font-semibold text-[#C9A24B]">Pts</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[10px] sm:text-xs text-[#5A5252]">Active Campaign: Q2 Rewards</span>
                <span className="text-[10px] sm:text-xs font-bold text-[#C41E3A] flex items-center gap-0.5 hover:underline">
                  Redeem Now <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Card 2: Points redeemed today stats (hidden on mobile to reduce screen height) */}
            <div
              onMouseMove={handleTiltMove}
              onMouseLeave={handleTiltLeave}
              className="card-points absolute hidden md:block w-[190px] sm:w-[220px] p-5 rounded-2xl bg-[#1A1414] text-white shadow-2xl z-30 bottom-12 right-2 sm:right-6 cursor-pointer"
              style={{ transformStyle: "preserve-3d" }}
              id="hero-card-points"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-[#C41E3A] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] uppercase font-bold text-[#C9A24B] tracking-wider">Real-time</span>
              </div>
              <p className="text-xs text-gray-400 font-body mb-0.5">Points Redeemed Today</p>
              <h5
                className="text-2xl font-bold tracking-tight text-white mb-2 font-heading"
                data-count="184300"
                data-suffix=""
              >
                184,300
              </h5>
              <div className="flex items-center gap-1.5 text-[11px] text-green-400">
                <Sparkles className="w-3 h-3" />
                <span>+12.4% vs yesterday</span>
              </div>
            </div>

            {/* Card 3: Elite Badge achievements (hidden on mobile to reduce screen height) */}
            <div
              onMouseMove={handleTiltMove}
              onMouseLeave={handleTiltLeave}
              className="card-badge absolute hidden md:block w-[160px] sm:w-[180px] p-4 rounded-xl bg-[#FBF6F5] border-2 border-[#C9A24B] shadow-lg z-10 top-36 right-0 sm:right-10 cursor-pointer"
              style={{ transformStyle: "preserve-3d" }}
              id="hero-card-badge"
            >
              <div className="text-center">
                <span className="text-3xl inline-block mb-2">🏆</span>
                <h6 className="text-xs font-bold text-[#1A1414] uppercase tracking-wider mb-1 font-heading">Top Performer 2026</h6>
                <p className="text-[10px] text-[#5A5252] font-body">Milestone unlocked via platform</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* link to other websites */}
      {/* Platform Selection */}
      <section className="py-20 md:py-24 bg-[#FBF6F5] px-6 md:px-12 lg:px-24 border-y border-[#F0E2E0]">
        <div className="max-w-7xl mx-auto">

          {/* Heading */}
          <div className="text-center mb-16">
            <span className="text-[#C41E3A] text-sm font-bold uppercase tracking-[0.2em]">
              Explore Our Platforms
            </span>

            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-[#1A1414]">
              Choose the Platform That Fits Your Business
            </h2>

            <p className="mt-5 max-w-3xl mx-auto text-lg text-[#5A5252] leading-relaxed">
              Whether you're looking for premium corporate gifting or a complete
              loyalty and rewards ecosystem, choose the solution that best matches
              your business objectives.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* GiftsOnClick */}
            <div className="bg-white rounded-3xl border border-[#F0E2E0] p-10 shadow-sm">

              <div className="h-33 mb-">
                <img src="/logo.jpg(1).jpeg" alt="GiftsOnClick Logo" className="h-full w-auto object-contain" />
              </div>

              <h3 className="text-3xl font-bold text-[#1A1414] mb-4">

              </h3>

              <p className="text-[#5A5252] leading-8 mb-8">
                Discover a premium corporate gifting platform offering gift vouchers,
                branded merchandise, festive hampers, employee rewards, onboarding
                kits, luxury gifts, and customized gifting experiences for every
                business occasion.
              </p>

              <div className="grid grid-cols-2 gap-y-3 mb-10 text-sm text-[#1A1414]">

                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C41E3A]" />
                  Gift Vouchers
                </div>

                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C41E3A]" />
                  Employee Gifts
                </div>

                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C41E3A]" />
                  Festive Hampers
                </div>

                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C41E3A]" />
                  Merchandise
                </div>

                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C41E3A]" />
                  Onboarding Kits
                </div>

                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C41E3A]" />
                  Corporate Gifts
                </div>

              </div>

              <a
                href="https://www.giftsonclick.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-[#C41E3A] text-white px-7 py-4 rounded-full font-semibold hover:bg-[#8C1327]"
              >
                Visit GiftsOnClick
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>

            </div>

            {/* RewardsOnClick */}
            <div className="bg-white rounded-3xl border border-[#F0E2E0] p-10 shadow-sm">

              <div className="h-24 mb-8">
                <img src="/assets/rocbg.png" alt="RewardsOnClick Logo" className="h-full w-auto object-contain" />
              </div>

              <h3 className="text-3xl font-bold text-[#1A1414] mb-4">
                Rewards-On-Click
              </h3>

              <p className="text-[#5A5252] leading-8 mb-8">
                A complete loyalty and rewards management platform for businesses to
                run dealer loyalty programs, customer rewards, employee recognition,
                channel incentives, digital gift cards, and reward point redemption
                from one centralized dashboard.
              </p>

              <div className="grid grid-cols-2 gap-y-3 mb-10 text-sm text-[#1A1414]">

                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C41E3A]" />
                  Loyalty Programs
                </div>

                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C41E3A]" />
                  Dealer Rewards
                </div>

                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C41E3A]" />
                  Employee Recognition
                </div>

                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C41E3A]" />
                  Digital Gift Cards
                </div>

                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C41E3A]" />
                  Reward Points
                </div>

                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C41E3A]" />
                  Sales Incentives
                </div>

              </div>

              <a
                href="https://rewardsonclick.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-[#1A1414] text-white px-7 py-4 rounded-full font-semibold hover:bg-black"
              >
                Visit RewardsOnClick
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>

            </div>

          </div>

        </div>
      </section>


      {/* 3. About Us Section */}
      <section
        id="about"
        className="reveal-container py-24 md:py-32 bg-[#FBF6F5] px-6 md:px-12 lg:px-24 border-y border-[#F0E2E0] relative overflow-hidden"
      >
        {/* Decorative Floating Shapes */}
        <div className="shape-float absolute right-[5%] top-[15%] w-24 h-24 border border-[#C41E3A]/20 rounded-full flex items-center justify-center opacity-60 pointer-events-none hidden lg:flex">
          <div className="w-16 h-16 border-2 border-dashed border-[#C9A24B]/30 rounded-full animate-spin [animation-duration:15s]"></div>
        </div>
        <div className="shape-float absolute left-[3%] bottom-[10%] w-32 h-32 border border-[#C9A24B]/15 rounded-full flex items-center justify-center opacity-60 pointer-events-none hidden lg:flex">
          <div className="w-20 h-20 border border-dashed border-[#C41E3A]/20 rounded-full animate-spin [animation-duration:20s]"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">

          {/* Narrative Content Left */}
          <div className="reveal lg:col-span-7 text-left">
            <span className="text-[#C41E3A] text-sm uppercase font-extrabold tracking-widest block mb-4">
              Our Origin & DNA
            </span>
            <h2 className="text-4xl md:text-5xl font-heading text-[#1A1414] mb-6 max-w-xl">
              Born from GiftsOnClick. Powered for corporate scale.
            </h2>
            <div className="space-y-6 text-[#5A5252] text-base md:text-lg leading-relaxed font-body">
              <p>
                <strong>GiftsOnClick</strong> is India's corporate gifting platform, built to solve a
                simple problem for HR, sales, and procurement teams:{" "}
                <span className="text-[#1A1414] font-semibold">
                  finding the right gift, at scale, without the back-and-forth.
                </span>
              </p>
              <p>
                A great gift is more than something to check off a list — it's a reflection of your
                brand and how much thought you put into the people you work with. That's why we've
                built a catalog spanning apparel, drinkware, electronics, bags, personalized items,
                trophies, and premium gifts from brands like Adidas, Puma, Samsung, Philips, and Jack &
                Jones — all sourced, curated, and fulfilled through one platform.
              </p>
              <p className="italic text-[#C41E3A]">
                Trusted by teams at HUL, Vodafone Idea, SBI, Mahindra, Asian Paints, and Glenmark for
                employee recognition, channel incentives, and festive gifting.
              </p>
            </div>

            <div className="mt-8">
              <a
                href="#programs"
                className="btn-pill magnetic-btn inline-flex items-center text-white bg-[#C41E3A] hover:bg-[#8C1327] px-6 py-3.5 font-bold text-sm tracking-wide transition-all"
                id="about-cta"
              >
                Learn More About Our Programs <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>

          {/* 2x2 Count-Up Stat Grid Right */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-6">
            {STATS_DATA.map((stat, i) => (
              <div
                key={stat.id}
                className="reveal-stat tilt-large bg-white p-6 md:p-8 rounded-2xl border border-[#F0E2E0] hover:border-[#C41E3A]/20 transition-all text-center flex flex-col justify-center shadow-sm cursor-pointer"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#C41E3A] mb-2 tracking-tight">
                  <span
                    data-count={stat.count}
                    data-suffix={stat.suffix}
                  >
                    0{stat.suffix}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-[#5A5252] leading-tight font-body">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* 4. Industries We Serve */}
      <section
        id="industries"
        className="reveal-container py-24 md:py-32 bg-white px-6 md:px-12 lg:px-24"
      >
        <div className="max-w-7xl mx-auto text-center">

          <span className="reveal text-[#C41E3A] text-sm uppercase font-extrabold tracking-widest block mb-4">
            Sectors & Expertise
          </span>
          <h2 className="reveal text-4xl md:text-5xl font-heading text-[#1A1414] mb-6 max-w-2xl mx-auto">
            Custom incentive architectures tailored to your industry
          </h2>
          <p className="reveal text-[#5A5252] text-lg max-w-xl mx-auto mb-16 font-body">
            Every business sector operates on distinct organizational incentives. We structure portals that align perfectly with your vertical goals.
          </p>

          {/* 10-card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {INDUSTRIES_DATA.map((ind) => (
              <div
                key={ind.id}
                className="reveal-industry tilt-small spotlight-card p-6 flex flex-col items-center text-center cursor-pointer select-none"
                id={ind.id}
              >
                <span className="text-4xl mb-4 inline-block transform hover:scale-125 transition-transform duration-300">
                  {ind.emoji}
                </span>
                <h3 className="text-base font-bold text-[#1A1414] mb-2 font-heading tracking-tight leading-snug">
                  {ind.name}
                </h3>
                <p className="text-xs text-[#5A5252] font-body leading-relaxed">
                  {ind.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* 5. Reward Programs We Power */}
      <section
        id="programs"
        className="reveal-container py-24 md:py-32 bg-[#FBF6F5] px-6 md:px-12 lg:px-24 border-y border-[#F0E2E0] relative"
      >
        {/* Very faint drifting radial glow / mesh behind the card grid */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.08]">
          <div className="programs-glow1 absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#C41E3A] to-[#C9A24B] filter blur-[120px]"></div>
          <div className="programs-glow2 absolute -bottom-[10%] -right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#C9A24B] to-[#C41E3A] filter blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">

          {/* Sticky on md+: stays pinned near the top of the viewport while the card grid below scrolls past it */}
          <div className="md:sticky md:top-24 z-10 pb-10 md:bg-gradient-to-b md:from-[#FBF6F5] md:from-60% md:to-transparent">
            <span className="reveal text-[#C41E3A] text-sm uppercase font-extrabold tracking-widest block mb-4">
              Campaign Structures
            </span>
            <h2 className="reveal text-4xl md:text-5xl font-heading text-[#1A1414] mb-6 max-w-2xl mx-auto">
              Reward programs built to drive commercial impact
            </h2>
            <p className="reveal text-[#5A5252] text-lg max-w-xl mx-auto mb-16 font-body">
              From field-agent spot awards to massive dealer-distributor loyalty programs, our tech engine processes payouts instantly.
            </p>
          </div>

          {/* 2 Cards with 3px top gradient bar reveal on hover */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {PROGRAMS_DATA.map((prog) => (
              <div
                key={prog.id}
                className="reveal-program tilt-large spotlight-card program-card p-8 text-left bg-white relative cursor-pointer flex flex-col justify-between h-full min-h-[260px]"
                id={prog.id}
              >
                <div>
                  <div className="text-3xl mb-4">{prog.emoji}</div>
                  <h3 className="text-xl font-bold text-[#1A1414] mb-3 font-heading tracking-tight">
                    {prog.title}
                  </h3>
                  <p className="text-sm text-[#5A5252] font-body leading-relaxed">
                    {prog.description}
                  </p>
                </div>

                {/* Dynamic increment counter */}
                <div className="mt-8 pt-5 border-t border-[#F0E2E0] flex items-baseline gap-2">
                  <span
                    className="text-3xl font-bold text-[#C41E3A] font-heading tracking-tight"
                    data-count={prog.count}
                    data-suffix={prog.suffix}
                  >
                    0{prog.suffix}
                  </span>
                  <span className="text-xs font-bold text-[#5A5252] uppercase tracking-wider font-body">
                    {prog.countLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* 6. How It Works (4 steps progress animation) */}
      <section
        id="how-it-works"
        className="reveal-container py-24 md:py-32 bg-white px-6 md:px-12 lg:px-24"
      >
        <div className="max-w-7xl mx-auto text-center">

          <span className="reveal text-[#C41E3A] text-sm uppercase font-extrabold tracking-widest block mb-4">
            Execution Method
          </span>
          <h2 className="reveal text-4xl md:text-5xl font-heading text-[#1A1414] mb-6 max-w-xl mx-auto">
            From strategic blueprint to seamless launch
          </h2>
          <p className="reveal text-[#5A5252] text-lg max-w-lg mx-auto mb-20 font-body">
            Four clear steps to modernizing your corporate incentive structure with dedicated implementation.
          </p>

          {/* 4 Steps wrapper with scroll-scrubbed progress line */}
          <div className="steps-wrap relative max-w-5xl mx-auto py-8">

            {/* Horizontal progress background bar line */}
            <div className="absolute top-[35px] left-8 right-8 h-1 bg-[#F0E2E0] hidden md:block z-0">
              {/* Scrubbed overlay fill indicator */}
              <div
                id="stepsFill"
                className="h-full bg-gradient-to-r from-[#C41E3A] to-[#C9A24B]"
                style={{ width: "0%" }}
              ></div>
            </div>

            {/* Vertical progress bar line for mobile layout */}
            <div className="absolute left-[26px] top-8 bottom-8 w-1 bg-[#F0E2E0] md:hidden z-0"></div>

            {/* Steps Flex Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative z-10 text-left">
              {PROCESS_STEPS.map((step, i) => (
                <div
                  key={i}
                  className="reveal-step step-card-item flex flex-row md:flex-col gap-6 md:gap-4 items-start p-6 rounded-2xl border border-transparent transition-all"
                >

                  {/* Number Badge Marker */}
                  <div className="step-number-marker w-14 h-14 rounded-full bg-[#C41E3A] text-white flex items-center justify-center font-heading text-lg font-bold shadow-lg shrink-0 mb-2 border-4 border-white">
                    {step.number}
                  </div>

                  <div className="step-text-content">
                    <h3 className="text-lg font-bold text-[#1A1414] mb-2 font-heading tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#5A5252] font-body leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>
      </section>


      {/* 7. Why RewardsOnClick (6 USPs) */}
      <section
        id="why-us"
        className="reveal-container py-24 md:py-32 bg-[#FBF6F5] px-6 md:px-12 lg:px-24 border-y border-[#F0E2E0]"
      >
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <span className="reveal text-[#C41E3A] text-sm uppercase font-extrabold tracking-widest block mb-4">
              Our Advantages
            </span>
            <h2 className="reveal text-4xl md:text-5xl font-heading text-[#1A1414] mb-6 max-w-xl mx-auto">
              Why leading enterprises partner with us
            </h2>
            <p className="reveal text-[#5A5252] text-lg max-w-lg mx-auto font-body">
              Enterprise security, regulatory compliance, and unmatched curation built directly into our ecosystem.
            </p>
          </div>

          {/* 6-card USP grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WHY_US_DATA.map((usp) => (
              <div
                key={usp.id}
                className="reveal-whyus tilt-small spotlight-card p-8 text-left bg-white cursor-pointer"
                id={usp.id}
              >
                <div className="w-12 h-12 rounded-xl bg-[#FCEAEC] text-[#C41E3A] flex items-center justify-center text-xl font-bold mb-6">
                  {usp.emoji}
                </div>
                <h3 className="text-lg font-bold text-[#1A1414] mb-3 font-heading tracking-tight">
                  {usp.title}
                </h3>
                <p className="text-sm text-[#5A5252] font-body leading-relaxed">
                  {usp.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* 8. Infinite Client Logo Marquee */}
      <section className="py-16 bg-white overflow-hidden border-b border-[#F0E2E0]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8 text-center">
          <p className="text-xs uppercase font-extrabold tracking-widest text-[#5A5252]/60">
            Backed by Unmatched Experience & Industry Trust
          </p>
        </div>

        {/* Marquee Track Duplicated (exactly 2x) */}
        <div className="marquee-container w-full py-4 bg-[#FBF6F5]">
          <div className="marquee-track flex gap-12 sm:gap-16 items-center">
            {TRUST_LOGOS.concat(TRUST_LOGOS).map((logo, i) => (
              <div
                key={i}
                className="marquee-logo mx-4 text-lg sm:text-xl font-bold text-[#5A5252]/70 hover:text-[#C41E3A] transition-all cursor-pointer select-none"
              >
                ✨ {logo.logoText}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 9. Meet the Team - Stacking Card Deck Reveal */}
      <section
        id="team"
        className="reveal-container py-24 md:py-32 bg-white relative overflow-hidden"
      >
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-gradient-to-br from-[#FCEAEC] to-transparent rounded-full filter blur-[80px] pointer-events-none opacity-60"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-br from-[#C9A24B]/5 to-transparent rounded-full filter blur-[80px] pointer-events-none opacity-60"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mb-16 text-center relative z-10">
          <span className="reveal text-[#C41E3A] text-sm uppercase font-extrabold tracking-widest block mb-4">
            Organizational DNA
          </span>
          <h2 className="reveal text-4xl md:text-5xl font-heading text-[#1A1414] mb-6 max-w-xl mx-auto">
            Meet the minds behind RewardsOnClick
          </h2>
          <p className="reveal text-[#5A5252] text-lg max-w-lg mx-auto font-body">
            A dedicated team of technology, operation, and corporate servicing experts committed to your scale.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-6xl mx-auto px-6 md:px-12 lg:px-24 z-10 relative">
          {TEAM_DATA.flatMap((group) =>
            group.members.map((m) => ({ ...m, department: group.department }))
          ).map((member) => {
            const isLeadership = member.department === "Leadership";
            return (
              <div
                key={member.name}
                className="rounded-2xl border border-[#F0E2E0] bg-white text-center flex flex-col items-center justify-between select-none cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-3 overflow-hidden"
              >
                <div className="flex flex-col items-center w-full">
                  <div className="w-full aspect-square overflow-hidden border-b border-[#F0E2E0] bg-gradient-to-br from-[#FCEAEC] to-[#FBF6F5]">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="px-6 pt-5">
                    <h4 className="text-lg sm:text-xl font-bold text-[#1A1414] font-heading mb-1 tracking-tight">
                      {member.name}
                    </h4>
                    {member.name === "Agrim Kalra" ? (
                      <p className="text-base sm:text-lg text-[#8C1327] font-semibold font-body tracking-wide leading-tight">
                        Marketing<br />Head
                      </p>
                    ) : (
                      <p className="text-base sm:text-lg text-[#8C1327] font-semibold font-body line-clamp-1 tracking-wide">
                        {member.role}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-3 mb-8 w-full flex flex-col items-center gap-2">
                  <span className={`text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm ${isLeadership
                    ? "text-white bg-gradient-to-r from-[#C9A24B] to-[#B8873A] border border-[#C9A24B]/30"
                    : "text-white bg-gradient-to-r from-[#C41E3A] to-[#8C1327] border border-[#C41E3A]/30"
                    }`}>
                    {member.department}
                  </span>
                  {isLeadership && (
                    <div className="flex items-center gap-1.5 text-xs text-[#C9A24B] font-bold tracking-wide">
                      <Award className="w-4 h-4" />
                      <span>Executive Director</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Full Team Photo */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mt-20">

        <div className="text-center mb-8">
          <span className="text-[#C41E3A] text-sm font-bold uppercase tracking-[0.2em]">
            Together We Build Success
          </span>

          <h3 className="mt-3 text-3xl md:text-4xl font-bold text-[#1A1414]">
            One Team. One Vision.
          </h3>

          <p className="mt-4 max-w-3xl mx-auto text-[#5A5252] leading-relaxed">
            Behind every successful rewards program is a passionate team of
            strategists, developers, designers, operations specialists, and
            customer success professionals working together to deliver exceptional
            experiences.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#F0E2E0] shadow-lg bg-white">

          <img
            src="/assets/team-photo.jpg"
            alt="RewardsOnClick Team"
            className="w-full h-auto object-cover"
          />

        </div>

      </div>

      <br>
      </br>

      {/* 10. About GiftsOnClick Parent Brand Connection */}
      <section className="reveal-container py-24 bg-gradient-to-br from-[#1A1414] via-[#3d0f17] to-[#1A1414] text-white px-6 md:px-12 lg:px-24 relative overflow-hidden">
        {/* Abstract background graphics */}
        <div className="goc-blob1-wrap absolute top-0 right-0 w-[300px] h-[300px] pointer-events-none">
          <div className="goc-blob1 w-full h-full bg-gradient-to-bl from-[#C41E3A]/20 to-transparent filter blur-[60px]"></div>
        </div>
        <div className="goc-blob2-wrap absolute bottom-0 left-0 w-[250px] h-[250px] pointer-events-none">
          <div className="goc-blob2 w-full h-full bg-gradient-to-tr from-[#C9A24B]/15 to-transparent filter blur-[50px]"></div>
        </div>

        <div className="reveal-goc-band max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block bg-[#C41E3A] text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Our Foundation
          </span>
          <h2 className="text-3xl md:text-5xl font-heading text-white mb-6 leading-tight max-w-2xl mx-auto">
            15+ Years of Corporate Gifting Excellence via GiftsOnClick
          </h2>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto font-body">
            RewardsOnClick inherits its extensive supplier network, robust verification standards, and customer-first commitment directly from its parent brand, <strong>GiftsOnClick.in</strong>. Over the last decade and a half, we have delivered corporate delight to over half a million employees and client networks nationwide.
          </p>
          <div>
            <a
              href="https://www.giftsonclick.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill magnetic-btn inline-flex items-center bg-[#C41E3A] hover:bg-[#8C1327] text-white px-8 py-4 font-bold text-sm tracking-wide transition-all"
              id="parent-site-link"
            >
              Visit GiftsOnClick.in <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </section>


      {/* 12. Contact Section */}
      <section
        id="contact"
        className="reveal-container py-24 md:py-32 bg-white px-6 md:px-12 lg:px-24"
      >
        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Info panel Left column */}
            <div className="reveal-partner-left lg:col-span-5 text-left">
              <span className="text-[#C41E3A] text-sm uppercase font-extrabold tracking-widest block mb-4">
                Partner With Us
              </span>
              <h2 className="text-4xl md:text-5xl font-heading text-[#1A1414] mb-6">
                Consult with our dedicated incentive architects
              </h2>
              <p className="text-base text-[#5A5252] font-body leading-relaxed mb-10">
                Ready to deploy custom white-labeled portals, secure national catalogs, or GEM-compliant incentives? Get in touch with our leadership and Techno-Sales team today.
              </p>

              {/* Info Rows */}
              <div className="space-y-6">

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FCEAEC] text-[#C41E3A] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1414] uppercase tracking-wider mb-1 font-sans">Email Inquiries</h4>
                    <a href="mailto:info@giftsonclick.in" className="text-base font-semibold text-[#C41E3A] hover:underline font-body">
                      info@giftsonclick.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FCEAEC] text-[#C41E3A] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1414] uppercase tracking-wider mb-1 font-sans">Call or WhatsApp</h4>
                    <p className="text-base font-semibold text-[#1A1414] font-body">
                      (+91) 8194824242
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FCEAEC] text-[#C41E3A] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1414] uppercase tracking-wider mb-1 font-sans">HQ Address</h4>
                    <p className="text-sm text-[#5A5252] leading-relaxed font-body">
                      #1511, First Floor, <br />
                      JLPL Industrial Park, Sector 82,<br />
                      Mohali (Punjab) INDIA 160055
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FCEAEC] text-[#C41E3A] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1414] uppercase tracking-wider mb-1 font-sans">Working Hours</h4>
                    <p className="text-sm text-[#5A5252] font-body">
                      Monday to Saturday • 9:30 AM to 6:30 PM
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Google Map */}
            <div className="reveal-partner-right lg:col-span-7 w-full">

              <div className="overflow-hidden rounded-3xl border border-[#F0E2E0] shadow-lg">

                <iframe
                  title="A Square Technologies"
                  src="https://www.google.com/maps?q=A+SQUARE+TECHNOLOGIES,+1511,+First+Floor,+JLPL+Industrial+Park,+Sector+82,+Mohali,+Punjab+160055&output=embed"
                  width="100%"
                  height="550"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />

              </div>

              <div className="mt-6 flex justify-end">
                <a
                  href="https://maps.google.com/?q=A+SQUARE+TECHNOLOGIES,+1511,+First+Floor,+JLPL+Industrial+Park,+Sector+82,+Mohali,+Punjab+160055"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-[#C41E3A] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#8C1327]"
                >
                  Open in Google Maps
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* 13. Footer */}
      <footer className="bg-[#1A1414] text-[#FBF6F5] pt-20 pb-12 px-6 md:px-12 lg:px-24 border-t border-[#F0E2E0]/15 relative">
        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start mb-16">

            {/* Logo and Tagline Column */}
            <div className="md:col-span-5 text-left">
              <a href="#hero" className="text-2xl font-bold tracking-tight text-white inline-block mb-4 font-sans">
                Rewards<span className="text-[#C41E3A]">OnClick</span><span className="text-xs text-[#C9A24B] align-super font-medium ml-0.5">.in</span>
              </a>
              <p className="text-sm text-gray-400 max-w-sm font-body leading-relaxed">
                Premium corporate rewards and recognition engine powered by 15+ years of trusted B2B gifting experience via GiftsOnClick.in.
              </p>

              <div className="mt-6 text-xs text-[#C9A24B] font-bold uppercase tracking-wider">
                A GiftsOnClick Group Company
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="md:col-span-3 text-left">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6 font-sans">Company</h4>
              <ul className="space-y-3 text-sm text-gray-400 font-body">
                <li><a href="#about" className="hover:text-[#C41E3A] transition-colors">About Our Origin</a></li>
                <li><a href="#industries" className="hover:text-[#C41E3A] transition-colors">Sectors Supported</a></li>
                <li><a href="#team" className="hover:text-[#C41E3A] transition-colors">Meet Our Team</a></li>
                <li><a href="https://www.giftsonclick.in" target="_blank" rel="noreferrer" className="hover:text-[#C41E3A] transition-colors inline-flex items-center gap-1">Parent Brand <ExternalLink className="w-3 h-3" /></a></li>
              </ul>
            </div>

            {/* Programs Column */}
            <div className="md:col-span-4 text-left">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6 font-sans">Programs</h4>
              <ul className="space-y-3 text-sm text-gray-400 font-body">
                <li><a href="#programs" className="hover:text-[#C41E3A] transition-colors">Sales Incentives</a></li>
                <li><a href="#programs" className="hover:text-[#C41E3A] transition-colors">Dealer & Channel Incentives</a></li>
                <li><a href="#programs" className="hover:text-[#C41E3A] transition-colors">Employee Spot Recognition</a></li>
                <li><a href="#programs" className="hover:text-[#C41E3A] transition-colors">Government & GEM Campaigns</a></li>
              </ul>
            </div>

          </div>

          {/* Copyright & Disclaimer Line */}
          <div className="border-t border-[#F0E2E0]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-body">
            <p>© 2026 RewardsOnClick.in. All Rights Reserved.</p>
            <p>Designed for premium B2B enterprises. Designed by <a href="https://www.sevenwealth.org/" target="_blank" rel="noreferrer" className="text-white hover:text-[#C41E3A] underline">sevenwealth.org</a></p>
          </div>

        </div>
      </footer>

    </div>
  );
}
