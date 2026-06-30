import { ArrowLeft, Building2, Globe2, ShieldCheck, Users } from 'lucide-react';
import Link from 'next/link';

const pillars = [
  {
    title: 'Trust-first investing',
    description: 'Campaigns, disclosures, and portfolio data are structured to support transparent decision-making.',
    icon: ShieldCheck,
  },
  {
    title: 'Founder-friendly fundraising',
    description: 'The experience is designed so founders can present their story, traction, and campaign targets clearly.',
    icon: Building2,
  },
  {
    title: 'Community capital',
    description: 'The product emphasizes broad access to startup ownership, not just institutional allocations.',
    icon: Users,
  },
  {
    title: 'Global-ready platform',
    description: 'The layout and content can be adapted for jurisdiction-specific compliance and localized investment flows.',
    icon: Globe2,
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/50 bg-muted/20 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <Link
              href="/"
              className="inline-flex h-9 w-fit items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition-all hover:bg-muted"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">About LaunchPadX</p>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              A crowdfunding experience built for serious startup financing
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              LaunchPadX is a production-minded front end for equity crowdfunding. The current build focuses on campaign discovery, investor trust, and clear presentation of startup progress while the backend stack is still being added.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary px-6 text-base font-semibold text-white transition-all hover:opacity-95"
              >
                Open dashboard
              </Link>
              <Link
                href="/startups"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-transparent px-6 text-base font-semibold text-foreground transition-all hover:bg-muted"
              >
                Browse campaigns
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <article key={pillar.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-5 text-lg font-extrabold">{pillar.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pillar.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
