"use client";

import Image from "next/image";
import MagneticBubble from "./MagneticBubble";

type ProjectImageProps = {
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  isHovered: boolean;
};

const ProjectImage: React.FC<ProjectImageProps> = ({ imageUrl, imageWidth, imageHeight, isHovered }) => {
  return (
    <div className="relative">
      <div className={`absolute top-0 left-full ml-4 ${isHovered ? 'block' : 'hidden'}`}>
        <Image
          src={imageUrl}
          alt="Project Image"
          width={imageWidth}
          height={imageHeight}
          quality={95}
          className="w-full rounded-lg"
        />
      </div>
      <MagneticBubble isHovered={isHovered} />
    </div>
  );
};

export default ProjectImage;