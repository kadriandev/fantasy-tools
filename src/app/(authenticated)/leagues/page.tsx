import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fantasy League Information",
  description: "Comprehensive overview of your fantasy sports league",
};

export default function LeagueInfoPage() {
  return (
    <div className=" ">
      <div className="absolute top-1/2 left-1/2">
        <p className="text-5xl text-muted-foreground">Select a League</p>
      </div>
    </div>
  );
}
