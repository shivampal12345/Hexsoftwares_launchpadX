import Link from 'next/link';
import { Rocket, Globe } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-zinc-200 border-t border-zinc-900 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-2 text-white font-extrabold text-xl tracking-wider">
              <Rocket className="h-6 w-6 text-secondary stroke-[2.5]" />
              <span>LAUNCHPAD<span className="text-accent">X</span></span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              Connect visionary founders with global investor networks. Empowering the next generation of disruptive startups via secure, transparent equity crowdfunding.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="mailto:support@launchpadx.com" className="p-2 rounded-xl bg-zinc-900 hover:bg-teal-700/20 hover:text-secondary transition-all" aria-label="Email support">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M1.5 4.5h21v15h-21v-15zm2.25 2.25v.5l8.25 5.5 8.25-5.5v-.5h-16.5zm16.5 10.5v-7.5l-8.25 5.5-8.25-5.5v7.5h16.5z" />
                </svg>
              </a>
              <a href="/about" className="p-2 rounded-xl bg-zinc-900 hover:bg-teal-700/20 hover:text-secondary transition-all" aria-label="About LaunchPadX">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M4 4h16v16H4zM8 9h3v7H8zM9.5 5.75A1.75 1.75 0 1 0 9.5 9.25 1.75 1.75 0 0 0 9.5 5.75zM13.5 9h3v1.05h.04c.42-.79 1.45-1.62 2.98-1.62 3.19 0 3.78 2.1 3.78 4.83V16h-3v-2.61c0-.62-.01-1.42-.87-1.42-.87 0-1.01.68-1.01 1.38V16h-3V9z" />
                </svg>
              </a>
              <a href="/faq" className="p-2 rounded-xl bg-zinc-900 hover:bg-teal-700/20 hover:text-secondary transition-all" aria-label="FAQ">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2zm2.15-6.2-.9.92A2.5 2.5 0 0 0 13 13.5V14h-2v-.8a3.9 3.9 0 0 1 1.15-2.8l1.24-1.23a1.5 1.5 0 1 0-2.56-1.06H8a4 4 0 1 1 7.15 2.9z" />
                </svg>
              </a>
              <a href="/contact" className="p-2 rounded-xl bg-zinc-900 hover:bg-teal-700/20 hover:text-secondary transition-all" aria-label="Contact">
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3 text-zinc-400 text-sm">
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">Press Room</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Partnerships</a></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-3 text-zinc-400 text-sm">
              <li><Link href="/startups" className="hover:text-white transition-colors">Browse Startups</Link></li>
              <li><a href="/legal#terms" className="hover:text-white transition-colors">Campaign Rules</a></li>
              <li><a href="/legal#compliance" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="/legal#risk" className="hover:text-white transition-colors">Investor Risk</a></li>
            </ul>
          </div>

          {/* Links Column 3 */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-3 text-zinc-400 text-sm">
              <li><a href="/faq#valuation" className="hover:text-white transition-colors">Valuation Guide</a></li>
              <li><a href="/legal#compliance" className="hover:text-white transition-colors">Tax Incentives</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ Support</a></li>
              <li><a href="/legal#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-900 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500 gap-4">
          <p>&copy; {currentYear} LaunchPadX Technologies Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="/legal#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/legal#terms" className="hover:text-white transition-colors">Terms of Use</a>
            <a href="/legal#privacy" className="hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
