import { useRef } from "react";
import { BaseIconProps } from "@/types/icons";
import { BaseIcon } from "./BaseIcon";

export interface PianoIconProps extends BaseIconProps {
  onPianoOpen?: () => void;
  onPianoClose?: () => void;
  id: string;
}

export const PianoIcon: React.FC<PianoIconProps> = ({ id, ...props }) => {
  const iconRef = useRef<SVGSVGElement>(null);

  return (
    <BaseIcon id={id} {...props} onClick={props.onPianoOpen}>
      <svg
        ref={iconRef}
        width="56"
        height="56"
        viewBox="-2 -2 102 100"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
        style={{ pointerEvents: 'none' }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M30 20h40c5.523 0 10 4.477 10 10v40c0 5.523-4.477 10-10 10H30c-5.523 0-10-4.477-10-10V30c0-5.523 4.477-10 10-10zm0 5c-2.761 0-5 2.239-5 5v40c0 2.761 2.239 5 5 5h40c2.761 0 5-2.239 5-5V30c0-2.761-2.239-5-5-5H30zm-2 10h44v30H28V35zm8 0h4v18h-4V35zm12 0h4v18h-4V35zm12 0h4v18h-4V35z"
          fill="currentColor"
        />
      </svg>
    </BaseIcon>
  );
}; 