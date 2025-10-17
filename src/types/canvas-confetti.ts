declare module "canvas-confetti" {
  interface Options {
    particleCount?: number;
    angle?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    shapes?: ("square" | "circle")[];
    scalar?: number;
    drift?: number;
    ticks?: number;
    gravity?: number;
    decay?: number;
    startVelocity?: number;
    disableForReducedMotion?: boolean;
  }

  export default function confetti(options?: Options): void;
}
