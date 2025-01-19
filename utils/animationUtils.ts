import gsap from "gsap";

interface BreathingAnimationProps {
  container: HTMLDivElement;
  icon: SVGSVGElement;
  elements: (SVGCircleElement | SVGPathElement)[];
  isVisible: boolean;
}

export function createBreathingAnimation({
  container,
  icon,
  elements,
  isVisible
}: BreathingAnimationProps): gsap.Context {
  // Create a GSAP context for proper cleanup
  const ctx = gsap.context(() => {
    // Reset any existing animations
    gsap.killTweensOf([container, icon, ...elements]);

    // Create the breathing animation
    gsap.to(elements, {
      opacity: 0.7,
      scale: 0.97,
      duration: 1.5,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
      transformOrigin: "center center",
    });

    // Create hover effect
    container.addEventListener("mouseenter", () => {
      gsap.to(elements, {
        scale: 1.1,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    container.addEventListener("mouseleave", () => {
      gsap.to(elements, {
        scale: 1,
        opacity: 0.85,
        duration: 0.3,
        ease: "power2.in",
      });
    });
  }, container);

  return ctx;
} 