import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function TypewriterText({ text, className = '', delay = 0, speed = 0.05, onComplete }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !text) return;
    const el = containerRef.current;
    el.textContent = '';
    const chars = text.split('');
    let timeline = gsap.timeline({ delay });

    chars.forEach((char, i) => {
      timeline.to(el, {
        duration: speed,
        onStart: () => {
          el.textContent = text.slice(0, i + 1);
        },
      });
    });

    if (onComplete) {
      timeline.call(onComplete);
    }

    return () => timeline.kill();
  }, [text, delay, speed, onComplete]);

  return <span ref={containerRef} className={className} />;
}

export function FadeInText({ text, className = '', delay = 0, staggerDelay = 0.04 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !text) return;
    const el = containerRef.current;
    el.innerHTML = '';

    // Split into words, then characters
    const words = text.split(' ');
    words.forEach((word, wi) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.marginRight = '0.3em';

      word.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        charSpan.style.display = 'inline-block';
        charSpan.style.opacity = '0';
        charSpan.style.transform = 'translateY(20px)';
        wordSpan.appendChild(charSpan);
      });

      el.appendChild(wordSpan);
    });

    const allChars = el.querySelectorAll('span > span');
    gsap.to(allChars, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: staggerDelay,
      delay,
      ease: 'power3.out',
    });
  }, [text, delay, staggerDelay]);

  return <span ref={containerRef} className={className} />;
}
