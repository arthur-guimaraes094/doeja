import React from "react";

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-background flex flex-col items-center overflow-hidden">
      
      {/* Simulated Header Skeleton */}
      <div className="w-full border-b border-surface-variant/30 bg-[#edf2e2]/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-7xl mx-auto">
          {/* Logo Skeleton */}
          <div className="h-10 w-28 bg-on-surface-variant/10 rounded-full animate-pulse"></div>
          
          {/* Links Skeleton */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="h-5 w-16 bg-on-surface-variant/10 rounded-full animate-pulse"></div>
            <div className="h-5 w-16 bg-on-surface-variant/10 rounded-full animate-pulse"></div>
            <div className="h-5 w-32 bg-on-surface-variant/10 rounded-full animate-pulse"></div>
          </div>
          
          {/* Login Button Skeleton */}
          <div className="h-10 w-24 bg-on-surface-variant/10 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="w-full max-w-7xl px-margin-mobile md:px-margin-desktop py-12 flex flex-col items-center gap-12">
        
        {/* Hero Section Skeleton */}
        <div className="w-full max-w-4xl flex flex-col items-center gap-6 text-center mt-8">
          {/* Title Line 1 */}
          <div className="h-12 w-[85%] md:w-[60%] bg-on-surface-variant/10 rounded-2xl animate-pulse"></div>
          {/* Subtitle */}
          <div className="h-6 w-[70%] md:w-[45%] bg-on-surface-variant/10 rounded-xl animate-pulse mt-2"></div>
          
          {/* Hero Image/Logo Skeleton */}
          <div className="h-44 md:h-56 w-44 md:w-56 bg-on-surface-variant/10 rounded-[32px] animate-pulse my-6"></div>

          {/* Action Buttons Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
            <div className="h-14 w-full sm:w-48 bg-on-surface-variant/10 rounded-full animate-pulse"></div>
            <div className="h-14 w-full sm:w-48 bg-on-surface-variant/10 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Bento Grid Section Skeleton */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {/* Card 1 - colspan 2 */}
          <div className="md:col-span-2 h-[260px] bg-[#edf2e2]/40 border border-primary/5 rounded-[32px] p-8 flex flex-col justify-between animate-pulse">
            <div className="space-y-4 w-full">
              <div className="h-8 w-48 bg-primary/10 rounded-xl"></div>
              <div className="h-4 w-full bg-primary/5 rounded-lg"></div>
              <div className="h-4 w-[90%] bg-primary/5 rounded-lg"></div>
            </div>
            <div className="h-20 w-20 bg-primary/10 rounded-2xl self-end"></div>
          </div>

          {/* Card 2 */}
          <div className="h-[260px] bg-surface-container-low/40 border border-secondary/5 rounded-[32px] p-8 flex flex-col justify-between animate-pulse">
            <div className="space-y-4">
              <div className="h-16 w-16 bg-secondary/10 rounded-2xl"></div>
              <div className="h-6 w-36 bg-secondary/10 rounded-xl"></div>
              <div className="h-4 w-full bg-secondary/5 rounded-lg"></div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="h-[260px] bg-[#edf2e2]/40 border border-primary/5 rounded-[32px] p-8 flex flex-col justify-between animate-pulse">
            <div className="space-y-4">
              <div className="h-16 w-16 bg-primary/10 rounded-2xl"></div>
              <div className="h-6 w-36 bg-primary/10 rounded-xl"></div>
              <div className="h-4 w-full bg-primary/5 rounded-lg"></div>
            </div>
          </div>

          {/* Card 4 - colspan 2 */}
          <div className="md:col-span-2 h-[260px] bg-surface-container-low/40 border border-secondary/5 rounded-[32px] p-8 flex flex-col justify-between animate-pulse">
            <div className="space-y-4 w-full">
              <div className="h-8 w-48 bg-secondary/10 rounded-xl"></div>
              <div className="h-4 w-full bg-secondary/5 rounded-lg"></div>
              <div className="h-4 w-[85%] bg-secondary/5 rounded-lg"></div>
            </div>
            <div className="h-12 w-32 bg-secondary/10 rounded-full self-start"></div>
          </div>
        </div>

      </div>
    </div>
  );
}
