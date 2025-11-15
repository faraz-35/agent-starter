import Link from "next/link";
import { Button } from "@/common/components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            Production-Ready
            <span className="text-primary"> Next.js</span> Starter
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A modern, feature-complete starter template built with Next.js 16,
            Supabase, React Hook Form, Zod, Zustand, and more. Follows AI
            agent-first architecture for scalable development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/register">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Features & Technologies
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Modern Stack</CardTitle>
                <CardDescription>
                  Built with the latest and greatest technologies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Next.js 16 with App Router</li>
                  <li>• Supabase for backend</li>
                  <li>• React Hook Form + Zod</li>
                  <li>• Zustand for state management</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Developer Experience</CardTitle>
                <CardDescription>
                  Optimized for productivity and maintainability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• TypeScript throughout</li>
                  <li>• Tailwind CSS styling</li>
                  <li>• Component library</li>
                  <li>• Server Actions</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Architecture</CardTitle>
                <CardDescription>
                  AI agent-first, feature-centric structure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Modular features</li>
                  <li>• Separation of concerns</li>
                  <li>• Scalable patterns</li>
                  <li>• Best practices</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>
                  Complete auth system with Supabase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Email/password auth</li>
                  <li>• Protected routes</li>
                  <li>• User management</li>
                  <li>• Session handling</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>UI Components</CardTitle>
                <CardDescription>
                  Beautiful, accessible components out of the box
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Radix UI primitives</li>
                  <li>• Tailwind styling</li>
                  <li>• Dark mode support</li>
                  <li>• Form components</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Production Ready</CardTitle>
                <CardDescription>
                  Built for scale and reliability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Error handling</li>
                  <li>• Type safety</li>
                  <li>• Performance optimized</li>
                  <li>• SEO friendly</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
