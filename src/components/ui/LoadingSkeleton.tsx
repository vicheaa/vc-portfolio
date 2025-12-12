import React from "react";

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = "",
  count = 1,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
        />
      ))}
    </>
  );
};

export const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <LoadingSkeleton className="h-48 w-full mb-4" />
      <LoadingSkeleton className="h-6 w-3/4 mb-2" />
      <LoadingSkeleton className="h-4 w-full mb-4" />
      <div className="flex gap-2">
        <LoadingSkeleton className="h-6 w-16" />
        <LoadingSkeleton className="h-6 w-16" />
        <LoadingSkeleton className="h-6 w-16" />
      </div>
    </div>
  );
};

export const BlogCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <LoadingSkeleton className="h-48 w-full" />
      <div className="p-6">
        <LoadingSkeleton className="h-6 w-3/4 mb-2" />
        <LoadingSkeleton className="h-4 w-1/4 mb-4" />
        <LoadingSkeleton className="h-4 w-full mb-2" count={3} />
      </div>
    </div>
  );
};
