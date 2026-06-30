import Link from 'next/link';
import { AlertTriangle, ArrowLeft, FileText, LockKeyhole, ShieldCheck } from 'lucide-react';

const sections = [
  {
    id: 'terms',
    icon: FileText,
    title: 'Terms of Service',
    body: [
      'LaunchPadX is a pre-production equity crowdfunding marketplace experience. Campaign data, investor records, payment flows, and compliance statuses shown in this project are sample data unless connected to production services.',
      'Users are responsible for reviewing campaign materials, eligibility requirements, investment limits, and all offering documents before making any investment decision.',
    ],
  },
  {
    id: 'risk',
    icon: AlertTriangle,
    title: 'Investment Risk Disclosure',
    body: [
      'Startup investments are speculative, illiquid, and can result in a total loss of capital. Past performance, showcased success stories, and campaign progress do not guarantee future results.',
      'Private securities may be subject to holding periods, transfer restrictions, dilution, and limited reporting availability.',
    ],
  },
  {
    id: 'privacy',
    icon: LockKeyhole,
    title: 'Privacy Policy',
    body: [
      'A production version should collect only the information required for account security, KYC/AML checks, investment processing, support, analytics, and regulatory recordkeeping.',
      'Sensitive identity, payment, and investor suitability data should be encrypted in transit and at rest, with access limited by role-based controls.',
    ],
  },
  {
    id: 'compliance',
    icon: ShieldCheck,
    title: 'Compliance Notes',
    body: [
      'Before launch, connect the platform to licensed broker-dealer, funding portal, payment, identity verification, and document-signing providers appropriate for the operating jurisdiction.',
      'Final legal copy should be reviewed by qualified counsel before accepting real users, campaign submissions, or payments.',
    ],
  },
];

export default function LegalPage() {
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
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              LaunchPadX Legal Center
            </p>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Platform Terms, Privacy, and Risk Disclosures
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              This page provides the baseline legal and investor-risk language needed for a crowdfunding platform. Replace this content with counsel-approved documents before production use.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto grid gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <article
                id={section.id}
                key={section.id}
                className="scroll-mt-24 rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-extrabold">{section.title}</h2>
                </div>
                <div className="space-y-4 text-sm font-medium leading-relaxed text-muted-foreground">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
