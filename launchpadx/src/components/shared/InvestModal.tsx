'use client';

import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight } from 'lucide-react';
import { Startup } from '@/types';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { useAuth } from '../providers/AuthProvider';
import { AuthModal } from './AuthModal';

const investSchema = z.object({
  amount: z.coerce
    .number()
    .max(1000000, 'Maximum single allocation is $1,000,000'),
  fullName: z.string().min(2, 'Full legal name is required'),
  agreed: z.literal(true, {
    message: 'You must agree to the investor disclosure terms',
  }),
});

type InvestFormInput = z.input<typeof investSchema>;
type InvestFormData = z.output<typeof investSchema>;

interface InvestModalProps {
  startup: Startup | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InvestModal({ startup, isOpen, onClose }: InvestModalProps) {
  const { user, loading: authLoading } = useAuth();
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InvestFormInput, unknown, InvestFormData>({
    resolver: zodResolver(investSchema),
    defaultValues: {
      amount: startup?.minInvestment || 500,
      agreed: true,
    },
  });

  // Watch investment amount to calculate equity share in real time
  const watchAmount = Number(useWatch({ control, name: 'amount' }) || 0);

  React.useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => {
        setSubmitError(null);
        reset({
          amount: startup?.minInvestment || 500,
          agreed: true,
        });
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen, startup, reset]);

  if (!startup) return null;

  // Manual min check
  const minInvestment = startup.minInvestment;
  const isBelowMin = watchAmount < minInvestment;

  // Real-time equity share formula
  // Equity% = (Investment / Funding Goal) * Total Equity Pool
  const calculatedEquity = startup.fundingGoal > 0 
    ? (watchAmount / startup.fundingGoal) * (startup.expectedEquity * 100) 
    : 0;

  const onSubmit = async (data: InvestFormData) => {
    if (isBelowMin) return;
    setSubmitError(null);

    if (!user) {
      setSubmitError('Please log in or create an account before continuing to Stripe Checkout.');
      setIsAuthOpen(true);
      return;
    }

    const startupId = startup.id || startup._id || '';

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startupId,
        ...data,
      }),
    });

    const result = (await response.json()) as { url?: string; error?: string };

    if (!response.ok) {
      setSubmitError(result.error || 'Checkout could not be started.');
      return;
    }

    if (!result.url) {
      setSubmitError('Stripe checkout URL was not returned.');
      return;
    }

    window.location.assign(result.url);
  };

  return (
    <>
      <Dialog isOpen={isOpen} onClose={onClose} title={`Invest in ${startup.name}`} className="max-w-md">
        <motion.form
          key="invest-form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
            {/* Real-time Calculator Widget */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
              <div className="flex justify-between items-center text-xs text-muted-foreground font-bold uppercase tracking-wider">
                <span>Real-Time Estimation</span>
                <span className="text-primary">Min: ${startup.minInvestment}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">$</span>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    {...register('amount')}
                    className="w-full pl-7 pr-3 py-2 border border-border bg-card rounded-lg text-sm font-black text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="text-right shrink-0 px-3 py-2 bg-card rounded-lg border border-border/80 min-w-[120px]">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Est. Shares</p>
                  <p className="text-sm font-black text-primary">{calculatedEquity.toFixed(4)}%</p>
                </div>
              </div>
              {errors.amount && (
                <p className="text-[10px] font-black text-red-500">{errors.amount.message}</p>
              )}
              {isBelowMin && (
                <p className="text-[10px] font-black text-red-500">Minimum investment is ${minInvestment}</p>
              )}
            </div>

            {/* General Fields */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Legal Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register('fullName')}
                  className="w-full px-3 py-2.5 border border-border bg-card rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {errors.fullName && (
                  <p className="text-[10px] font-black text-red-500">{errors.fullName.message}</p>
                )}
              </div>

              <div className="rounded-xl border border-border/70 bg-muted/30 p-3 text-xs font-semibold leading-relaxed text-muted-foreground">
                Payment is completed on Stripe Checkout. LaunchPadX never sees or stores card details, and your allocation is recorded only after Stripe confirms payment.
              </div>

              {!user && !authLoading && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs font-bold leading-relaxed text-amber-700 dark:text-amber-300">
                  You need to log in before starting a payment.
                </div>
              )}

              {/* Checkbox agreement */}
              <div className="space-y-2 pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-muted-foreground font-semibold">
                  <input
                    type="checkbox"
                    {...register('agreed')}
                    className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                  />
                  <span>
                    I represent that I have read the Reg CF investor education guides and accept the risks associated with private placements.
                  </span>
                </label>
                {errors.agreed && (
                  <p className="text-[10px] font-black text-red-500">{errors.agreed.message}</p>
                )}
              </div>
            </div>

            {submitError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400">
                {submitError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-3 border-t border-border">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 text-sm font-bold">
                Cancel
              </Button>
              <Button type="submit" variant="gradient" isLoading={isSubmitting || authLoading} disabled={isBelowMin} className="flex-1 text-sm font-bold gap-1">
                {user ? 'Continue to Checkout' : 'Login to Continue'} <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
        </motion.form>
      </Dialog>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
