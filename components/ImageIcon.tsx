import { useRef } from "react";
import { BaseIconProps } from "@/types/icons";
import { BaseIcon } from "./BaseIcon";

export interface ImageIconProps extends BaseIconProps {
  onClick?: () => void;
  id: string;
}

const ImageIcon: React.FC<ImageIconProps> = ({ id, ...props }) => {
  const iconRef = useRef<SVGSVGElement>(null);

  return (
    <BaseIcon id={id} {...props}>
      <svg
        ref={iconRef}
        width="30"
        height="30"
        viewBox="-2 -2 102 100"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
        style={{ pointerEvents: 'none' }}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M30 20h40c5.523 0 10 4.477 10 10v40c0 5.523-4.477 10-10 10H30c-5.523 0-10-4.477-10-10V30c0-5.523 4.477-10 10-10zm0 5c-2.761 0-5 2.239-5 5v40c0 2.761 2.239 5 5 5h40c2.761 0 5-2.239 5-5V30c0-2.761-2.239-5-5-5H30zm-2 40l10-10 5 5 15-15 10 10v10c0 1.105-.895 2-2 2H30c-1.105 0-2-.895-2-2v-0zM40 35c0 2.761-2.239 5-5 5s-5-2.239-5-5 2.239-5 5-5 5 2.239 5 5z"
          fill="currentColor"
        />
      </svg>
    </BaseIcon>
  );
};

export default ImageIcon; 