import gsap from "gsap";

interface BreathingAnimationConfig {
  container: HTMLElement;
  icon: SVGSVGElement;
  elements: (SVGElement | null)[];
  isVisible: boolean;
}

interface ModalAnimationConfig {
  element: HTMLElement;
  onStart?: () => void;
  onComplete?: () => void;
}

export const createBreathingAnimation = ({
  container,
  icon,
  elements,
  isVisible
}: BreathingAnimationConfig) => {
  return gsap.context(() => {
    // Set initial state to prevent edge visibility
    gsap.set(container, {
      overflow: 'hidden'
    });
    
    gsap.set(elements, {
      transformOrigin: 'center',
      scale: 1
    });

    const timeline = gsap.timeline({ 
      repeat: -1,
      onUpdate: () => {
        console.log('Breathing animation update');
      }
    });
    
    timeline.to(elements, {
      scale: 1.1,
      duration: 2,
      ease: "sine.inOut",
      stagger: {
        each: 0.1,
        repeat: -1,
        yoyo: true
      }
    });

    return timeline;
  }, container);
};

export const showModal = ({
  element,
  onStart,
  onComplete
}: ModalAnimationConfig) => {
  return gsap.fromTo(element,
    { 
      opacity: 0, 
      scale: 0.95, 
      y: 20 
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.3,
      ease: "power2.out",
      onStart,
      onComplete
    }
  );
};

export const hideModal = ({
  element,
  onStart,
  onComplete
}: ModalAnimationConfig) => {
  return gsap.to(element, {
    opacity: 0,
    scale: 0.95,
    y: 20,
    duration: 0.2,
    ease: "power2.in",
    onStart,
    onComplete
  });
};

export const clickAnimation = (element: HTMLElement | SVGElement) => {
  const timeline = gsap.timeline();
  timeline.to(element, {
    scale: 0.92,
    duration: 0.15,
    ease: "power2.out"
  })
  .to(element, {
    scale: 1,
    duration: 0.15,
    ease: "power2.in"
  });
  return timeline;
}; 