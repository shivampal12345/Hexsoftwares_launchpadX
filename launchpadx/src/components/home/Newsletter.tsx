'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle2, Shield } from 'lucide-react';
import { Button } from '../ui/Button';

const newsletterSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export function Newsletter() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setSubmitError(null);

    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      setSubmitError(result.error || 'Subscription failed. Please try again.');
      return;
    }

    setIsSubmitted(true);
    reset();
  };

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-r from-primary to-teal-800 text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-white blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md mb-2">
            <Mail className="h-6 w-6 text-accent" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Get Exclusive Dealflow Alerts
            </h2>
            <p className="text-teal-100/80 text-sm sm:text-base font-semibold max-w-lg mx-auto leading-relaxed">
              Subscribe to receive weekly updates on newly approved campaigns, secondary equity listings, and VC insights.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="newsletter-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 max-w-md mx-auto"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      placeholder="Enter your professional email"
                      {...register('email')}
                      className={`w-full h-11 px-4 py-2.5 rounded-xl border bg-white text-zinc-950 text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent transition-all ${
                        errors.email ? 'border-amber-400 ring-2 ring-amber-400' : 'border-transparent'
                      }`}
                    />
                    {errors.email && (
                      <span className="absolute left-1 -bottom-5 text-[10px] font-black text-amber-300">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                  <Button
                    type="submit"
                    variant="accent"
                    isLoading={isSubmitting}
                    className="h-11 font-bold text-sm shrink-0 w-full sm:w-auto"
                  >
                    Subscribe Now
                  </Button>
                </div>

                <div className="flex justify-center items-center gap-1.5 text-xs text-teal-100/60 pt-2 select-none">
                  <Shield className="h-3.5 w-3.5" />
                  <span>No spam. Unsubscribe anytime. GDPR compliant.</span>
                </div>
                {submitError && (
                  <p className="text-center text-xs font-bold text-amber-200">{submitError}</p>
                )}
              </motion.form>
            ) : (
              <motion.div
                key="newsletter-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md max-w-md mx-auto space-y-3"
              >
                <CheckCircle2 className="h-10 w-10 text-accent mx-auto" />
                <h3 className="font-extrabold text-lg">Subscription Successful!</h3>
                <p className="text-xs sm:text-sm text-teal-100/70 font-semibold leading-relaxed">
                  We have added you to our weekly distribution list. Keep an eye on your inbox for upcoming launches.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs font-bold text-accent hover:underline mt-2 cursor-pointer"
                >
                  Subscribe another email
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
