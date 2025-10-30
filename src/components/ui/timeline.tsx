"use client";

import React from "react";
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
  const sortedEvents = events.sort((a, b) => a.week - b.week);

  return (
    <div className="relative max-w-5/6 mx-auto px-4 py-8 overflow-x-auto scrollbar-hide">
      <div
        id="timeline-container"
        className="w-[600px] overflow-x-auto pb-4 scrollbar-hide"
      >
        <div className="flex items-center justify-between px-4">
          <div className="mx-16 w-[500px] absolute left-0 right-0 top-[66px] h-0.5 bg-muted-foreground z-0 " />
          {sortedEvents.map((event, index) => (
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
    </div>
  );
};

export default Timeline;
