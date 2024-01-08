import React from "react";
import ContentLoader from "react-content-loader";

interface SkeletonProps {}

const Skeleton: React.FC<SkeletonProps> = ({}) => {
  return (
    <ContentLoader
      speed={2}
      width={372}
      height={70}
      viewBox="0 0 372 70"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="27" rx="8" ry="8" width="254" height="15" />
      <rect x="266" y="17" rx="17" ry="17" width="106" height="38" />
    </ContentLoader>
  );
};

export default Skeleton;
