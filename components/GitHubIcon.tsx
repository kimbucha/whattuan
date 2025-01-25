import { useRef } from "react";
import { BaseIconProps } from "@/types/icons";
import { BaseIcon } from "./BaseIcon";

export interface GitHubIconProps extends BaseIconProps {
  username?: string;
  onChartOpen?: () => void;
  onChartClose?: () => void;
  id: string;
}

const GitHubIcon: React.FC<GitHubIconProps> = ({ id, ...props }) => {
  const iconRef = useRef<SVGSVGElement>(null);

  return (
    <BaseIcon id={id} {...props} onClick={props.onChartOpen}>
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
          d="M48 19.9c-14.4 0-26 11.6-26 26 0 11.5 7.5 21.2 17.8 24.7 1.3.2 1.8-.6 1.8-1.3v-4.4c-7.3 1.6-8.8-3.5-8.8-3.5-1.2-3-2.9-3.8-2.9-3.8-2.4-1.6.2-1.6.2-1.6 2.6.2 4 2.7 4 2.7 2.3 4 6.1 2.8 7.6 2.1.2-1.7.9-2.8 1.6-3.4-5.8-.7-11.9-2.9-11.9-12.9 0-2.8 1-5.2 2.7-7-.3-.7-1.2-3.3.3-6.8 0 0 2.2-.7 7.2 2.7 2.1-.6 4.3-.9 6.5-.9 2.2 0 4.4.3 6.5.9 5-3.4 7.2-2.7 7.2-2.7 1.4 3.5.5 6.1.3 6.8 1.7 1.8 2.7 4.2 2.7 7 0 10-6.1 12.2-11.9 12.9.9.8 1.7 2.4 1.7 4.8v7.1c0 .7.5 1.5 1.8 1.3 10.3-3.4 17.8-13.2 17.8-24.7 0-14.4-11.6-26-26-26z"
          fill="currentColor"
        />
      </svg>
    </BaseIcon>
  );
};

export default GitHubIcon; 