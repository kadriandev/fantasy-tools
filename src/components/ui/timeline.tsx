"use client";

import type React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineEvent {
  week: number;
  title: string;
  current?: boolean;
}

interface TimelineProps {
  events: TimelineEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById("timeline-container");
    if (container) {
      const scrollAmount = direction === "left" ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

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
          {events
            .sort((a, b) => a.week - b.week)
            .map((event, index) => (
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
