import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { TrendingUp, Award, Users } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <section className="w-full flex justify-center py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Dominate Your Yahoo Fantasy Leagues
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Get the edge you need with advanced analytics and real-time
                insights.
              </p>
            </div>
            <div className="space-x-4">
              {/* <Link href="/pricing"> */}
              <Button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                See Pricing
              </Button>
              {/* </Link> */}
            </div>
          </div>
        </div>
      </section>
      <section
        id="features"
        className="w-full flex justify-center py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
      >
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
            Key Features
          </h2>
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Dive deep into player stats, team performance, and league
                  trends with our cutting-edge analytics tools.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Award className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>AI-Powered Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Get personalized player suggestions, trade insights, and
                  lineup optimizations powered by machine learning.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>League Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Understand your league&apos;s dynamics, track opponent
                  strategies, and identify market inefficiencies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section
        id="how-it-works"
        className="w-full flex justify-center py-12 md:py-24 lg:py-32"
      >
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
            How It Works
          </h2>
          <ol className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <li className="flex flex-col items-center text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <h3 className="mt-4 text-xl font-semibold">
                Connect Your Yahoo League
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Securely link your Yahoo Fantasy Sports account to FantasyTools.
              </p>
            </li>
            <li className="flex flex-col items-center text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <h3 className="mt-4 text-xl font-semibold">Analyze Your Team</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Get instant insights on your team&apos;s strengths, weaknesses,
                and potential improvements.
              </p>
            </li>
            <li className="flex flex-col items-center text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <h3 className="mt-4 text-xl font-semibold">
                Dominate Your League
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Make data-driven decisions and outperform your opponents
                consistently.
              </p>
            </li>
          </ol>
        </div>
      </section>
      <section className="w-full flex justify-center py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <Card>
              <CardHeader>
                <CardTitle>John D.</CardTitle>
                <CardDescription>3-time League Champion</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  &quot;FantasyTools has completely transformed my approach to
                  fantasy sports. The insights are invaluable!&quot;
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Sarah M.</CardTitle>
                <CardDescription>Fantasy Rookie</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  &quot;As a newcomer, FantasyTools helped me compete with
                  seasoned players. It&apos;s like having an expert by your
                  side.&quot;
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Mike R.</CardTitle>
                <CardDescription>10+ Years Experience</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  &quot;Even after years of playing, FantasyTools showed me new
                  strategies and insights I hadn&apos;t considered before.&quot;
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
