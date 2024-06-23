import React from 'react';

type SectionHeadingProps = {
  children: React.ReactNode;
};

const SectionHeading: React.FC<SectionHeadingProps> = ({children}:SectionHeadingProps) => {
  return (
    <h2 className="text-3xl font-medium lowercase mb-8 text-center">{children}</h2>
  );
};

export default SectionHeading;