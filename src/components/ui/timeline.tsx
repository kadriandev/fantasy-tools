"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export interface TimelineEvent {
  week: number;
  title: string;
  current?: boolean;
}

interface TimelineProps {
  events: TimelineEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const isMobile = useIsMobile();
  const sortedEvents = events.sort((a, b) => a.week - b.week);
  
  // State for mobile sliding window
  const [mobileStartIndex, setMobileStartIndex] = React.useState(() => {
    if (!isMobile) return 0;
    const currentIndex = sortedEvents.findIndex(event => event.current);
    return currentIndex === -1 ? 0 : Math.max(0, currentIndex - 1);
  });

  // Update start index when mobile state changes or events change
  React.useEffect(() => {
    if (isMobile) {
      const currentIndex = sortedEvents.findIndex(event => event.current);
      if (currentIndex !== -1) {
        setMobileStartIndex(Math.max(0, currentIndex - 1));
      }
    }
  }, [isMobile, sortedEvents]);
  
  const handleScroll = (direction: "left" | "right") => {
    if (isMobile) {
      // Handle mobile navigation with sliding window
      const maxStartIndex = Math.max(0, sortedEvents.length - 3);
      if (direction === "left") {
        setMobileStartIndex(prev => Math.max(0, prev - 1));
      } else {
        setMobileStartIndex(prev => Math.min(maxStartIndex, prev + 1));
      }
    } else {
      // Handle desktop scrolling
      const container = document.getElementById("timeline-container");
      if (container) {
        const scrollAmount = direction === "left" ? -200 : 200;
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  // Get events to display
  const displayEvents = isMobile 
    ? sortedEvents.slice(mobileStartIndex, mobileStartIndex + 3)
    : sortedEvents;

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-8">
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
        <button
          onClick={() => handleScroll("left")}
          className="p-2 bg-background border border-input rounded-full shadow-sm hover:bg-accent hover:text-accent-foreground"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-3 w-3" />
        </button>
      </div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
        <button
          onClick={() => handleScroll("right")}
          className="p-2 bg-background border border-input rounded-full shadow-sm hover:bg-accent hover:text-accent-foreground"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
      <div
        id="timeline-container"
        className="overflow-x-auto pb-4 scrollbar-hide"
      >
        <div className="flex items-center justify-between px-4">
          <div className="mx-16 absolute left-0 right-0 top-[66px] h-0.5 bg-muted-foreground z-0 " />
          {displayEvents.map((event, index) => (
              <div
                key={index}
                className="z-10 flex flex-col items-center"
                tabIndex={0}
              >
                <div className="text-sm font-semibold text-muted-foreground">
                  Week {event.week}
                </div>
                <div
                  className={cn(
                    "w-4 h-4 rounded-full my-2 bg-muted-foreground",
                    event.current && "bg-primary",
                  )}
                ></div>
                <div className="text-sm font-semibold">{event.title}</div>
              </div>
            ))}
        </div>
      </div>
      <div className="absolute left-0 right-0 top-[34px] h-1 bg-muted -z-10"></div>
    </div>
  );
};

export default Timeline;
