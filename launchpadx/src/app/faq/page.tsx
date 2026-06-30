import { Accordion } from '@/components/ui/Accordion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const faqItems = [
  {
    id: 'valuation',
    title: 'How are campaigns evaluated?',
    content:
      'The demo content highlights traction, target funding, and campaign story. A production version should add legal review, financial checks, and jurisdiction-specific compliance workflows.',
  },
  {
    id: 'invest',
    title: 'Can I invest directly from the site?',
    content:
      'Not yet. The current build simulates the flow with forms and success states. Real investing requires a payment, KYC/AML, and custody stack before money changes hands.',
  },
  {
    id: 'founder',
    title: 'Can founders submit a campaign?',
    content:
      'Yes, the launch modal captures startup details and funding targets. In production, that data should be stored server-side and move through an approval queue.',
  },
  {
    id: 'support',
    title: 'Where should users go for help?',
    content:
      'Use the contact page for support, press, or partnership questions. The legal page contains the current terms, privacy, risk, and compliance references.',
  },
];

export default function FAQPage() {
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
            <p className="text-xs font-bold uppercase tracking-widest text-primary">FAQ</p>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Answers for founders, investors, and operators
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              These answers reflect the current platform build and the production path the project is moving toward.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary px-6 text-base font-semibold text-white transition-all hover:opacity-95"
              >
                Contact support
              </Link>
              <Link
                href="/legal"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-transparent px-6 text-base font-semibold text-foreground transition-all hover:bg-muted"
              >
                Read disclosures
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Accordion items={faqItems} />
          </div>
        </div>
      </section>
    </main>
  );
}
