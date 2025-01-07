import { gsap } from 'gsap';

interface BreathingAnimationElements {
  container: HTMLDivElement;
  icon: SVGSVGElement;
  elements: SVGElement[];
  isVisible: boolean;
}

export const createBreathingAnimation = ({
  container,
  icon,
  elements,
  isVisible
}: BreathingAnimationElements) => {
  const timeline = gsap.timeline({
    repeat: -1,
    repeatDelay: 0,
    defaults: {
      ease: "power2.inOut"
    }
  });

  // Set initial state
  gsap.set(elements, {
    transformOrigin: "center center",
    scale: 1,
    opacity: isVisible ? 1 : 0,
    immediateRender: true
  });

  // Create breathing animation
  timeline
    .to(elements, {
      scale: 1.05,
      duration: 2,
      ease: "power1.inOut"
    })
    .to(elements, {
      scale: 1,
      duration: 2,
      ease: "power1.inOut"
    });

  // Control animation based on visibility
  if (isVisible) {
    timeline.play();
  } else {
    timeline.pause();
  }

  return timeline;
}; 