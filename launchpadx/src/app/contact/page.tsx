import { ArrowLeft, Mail, Phone, MapPin, MessageSquare, Clock3 } from 'lucide-react';
import Link from 'next/link';

const contactItems = [
  {
    icon: Mail,
    label: 'Email',
    value: 'support@launchpadx.com',
    href: 'mailto:support@launchpadx.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (555) 014-2026',
    href: 'tel:+15550142026',
  },
  {
    icon: MapPin,
    label: 'Office',
    value: 'Remote-first, global support',
    href: '/about',
  },
];

export default function ContactPage() {
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
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Contact</p>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Support, partnerships, and investor questions
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Use the channels below for product support, campaign onboarding, partnership discussions, and general questions about the platform.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto grid gap-6 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5 space-y-4">
            {contactItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</p>
                    <p className="text-base font-bold">{item.value}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold">What we handle</h2>
                <p className="text-sm text-muted-foreground">A production support route for the platform.</p>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>Campaign onboarding and launch questions</p>
              <p>Investor experience and account support</p>
              <p>Compliance and disclosure clarification</p>
              <p>Partnership and press inquiries</p>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">
              <Clock3 className="h-4 w-4 text-primary" />
              Typical response window: 1 business day
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
