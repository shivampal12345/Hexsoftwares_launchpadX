'use strict';
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronRight, ChevronLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import { queryKeys } from '@/lib/query-keys';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';

interface LaunchCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const campaignSchema = z.object({
  name: z.string().min(2, 'Startup Name must be at least 2 characters'),
  tagline: z.string().min(10, 'Tagline must be at least 10 characters').max(120, 'Keep tagline under 120 characters'),
  industry: z.string().min(1, 'Please select an industry'),
  location: z.string().min(2, 'Location is required'),
  fundingGoal: z.coerce.number().min(10000, 'Minimum funding goal is $10,000').max(10000000, 'Maximum funding goal is $10M'),
  minInvestment: z.coerce.number().min(50, 'Minimum investment is $50'),
  expectedEquity: z.coerce.number().min(1, 'Equity Pool must be at least 1%').max(49, 'Equity Pool must be under 49%'),
  story: z.string().min(30, 'Please write at least 30 characters about your pitch story'),
});

type CampaignFormInput = z.input<typeof campaignSchema>;
type CampaignFormData = z.output<typeof campaignSchema>;

export function LaunchCampaignModal({ isOpen, onClose }: LaunchCampaignModalProps) {
  const queryClient = useQueryClient();
  const [step, setStep] = React.useState(1);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submissionReference, setSubmissionReference] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CampaignFormInput, unknown, CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      industry: 'Technology',
      fundingGoal: 100000,
      minInvestment: 250,
      expectedEquity: 10,
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => {
        setStep(1);
        setIsSuccess(false);
        setSubmitError(null);
        setSubmissionReference(null);
        reset();
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen, reset]);

  const handleNext = async () => {
    // Validate current step fields before proceeding
    let fieldsToValidate: ('name' | 'tagline' | 'industry' | 'location' | 'fundingGoal' | 'minInvestment' | 'expectedEquity' | 'story')[] = [];
    if (step === 1) {
      fieldsToValidate = ['name', 'tagline', 'industry', 'location'];
    } else if (step === 2) {
      fieldsToValidate = ['fundingGoal', 'minInvestment', 'expectedEquity'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: CampaignFormData) => {
    setSubmitError(null);

    const response = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      setSubmitError(result.error || 'Campaign proposal could not be submitted.');
      return;
    }

    setSubmissionReference(result.data.reference);
    await queryClient.invalidateQueries({ queryKey: queryKeys.startups });
    await queryClient.invalidateQueries({ queryKey: queryKeys.stats });
    await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    setIsSuccess(true);
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Launch Your Campaign" className="max-w-lg">
      {/* Step Indicators */}
      {!isSuccess && (
        <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center space-x-2">
              <div
                className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                  step === num
                    ? 'bg-primary text-white ring-2 ring-primary/20 shadow-md'
                    : step > num
                    ? 'bg-primary/25 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {num}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {num === 1 ? 'Startup Details' : num === 2 ? 'Funding' : 'Pitch Story'}
              </span>
              {num < 3 && <div className="hidden sm:block h-[1px] w-6 bg-border" />}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: General Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Startup Name</label>
                  <input
                    type="text"
                    placeholder="e.g. AeroLux Grid"
                    {...register('name')}
                    className="w-full px-3 py-2.5 border border-border bg-card rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.name && <p className="text-[10px] font-black text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">One-Line Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. Intelligent smart-grid mesh routing surplus clean energy."
                    {...register('tagline')}
                    className="w-full px-3 py-2.5 border border-border bg-card rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.tagline && <p className="text-[10px] font-black text-red-500">{errors.tagline.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Industry</label>
                    <select
                      {...register('industry')}
                      className="w-full px-3 py-2.5 border border-border bg-card rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="Technology">Technology</option>
                      <option value="AI">AI</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="FinTech">FinTech</option>
                      <option value="EdTech">EdTech</option>
                      <option value="Green Energy">Green Energy</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Consumer Products">Consumer Products</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">HQ Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Austin, USA"
                      {...register('location')}
                      className="w-full px-3 py-2.5 border border-border bg-card rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {errors.location && <p className="text-[10px] font-black text-red-500">{errors.location.message}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Financial Details */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Funding Target Goal ($)</label>
                  <input
                    type="number"
                    placeholder="Goal (Min $10,000)"
                    {...register('fundingGoal')}
                    className="w-full px-3 py-2.5 border border-border bg-card rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.fundingGoal && <p className="text-[10px] font-black text-red-500">{errors.fundingGoal.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Min Investment ($)</label>
                    <input
                      type="number"
                      placeholder="e.g. 250"
                      {...register('minInvestment')}
                      className="w-full px-3 py-2.5 border border-border bg-card rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {errors.minInvestment && <p className="text-[10px] font-black text-red-500">{errors.minInvestment.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Equity Allocation (%)</label>
                    <input
                      type="number"
                      placeholder="e.g. 10"
                      {...register('expectedEquity')}
                      className="w-full px-3 py-2.5 border border-border bg-card rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {errors.expectedEquity && <p className="text-[10px] font-black text-red-500">{errors.expectedEquity.message}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: story */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pitch Description & Core Story</label>
                  <textarea
                    placeholder="Tell investors about your company, core market problem, and why you are seeking crowdfunding capital..."
                    rows={6}
                    {...register('story')}
                    className="w-full px-3 py-2.5 border border-border bg-card rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                  {errors.story && <p className="text-[10px] font-black text-red-500">{errors.story.message}</p>}
                </div>
              </motion.div>
            )}

            {/* Navigation buttons */}
            {submitError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400">
                {submitError}
              </div>
            )}

            <div className="flex justify-between items-center gap-4 pt-4 border-t border-border">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={handleBack} className="text-sm font-bold flex items-center gap-1.5 cursor-pointer">
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <Button type="button" variant="primary" onClick={handleNext} className="text-sm font-bold flex items-center gap-1.5 cursor-pointer">
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" variant="gradient" isLoading={isSubmitting} className="text-sm font-bold flex items-center gap-1.5 cursor-pointer">
                  Submit Campaign
                </Button>
              )}
            </div>
          </form>
        ) : (
          <motion.div
            key="success-launch"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-6 space-y-5"
          >
            <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2 animate-bounce">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-foreground">Campaign Proposal Submitted!</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto font-semibold">
                Your campaign structure has been registered and placed in the review queue.
              </p>
              {submissionReference && (
                <p className="text-xs font-black text-primary">
                  Reference: {submissionReference}
                </p>
              )}
            </div>

            {/* Verification Checklist */}
            <div className="p-4 rounded-xl border border-border bg-muted/40 text-left text-xs space-y-3 font-semibold text-muted-foreground">
              <p className="font-bold text-foreground uppercase text-[10px] tracking-wider mb-1">Audit Phases & Next Steps:</p>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Regulatory CF compliance audit (Pending)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Anti-money laundering KYC check (Queue)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Pitch material review & cover design generation</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-bold py-1">
              <ShieldAlert className="h-4 w-4 text-accent" /> Audits are normally resolved in 2-3 business days.
            </div>

            <div className="pt-2">
              <Button variant="primary" onClick={onClose} className="w-full text-sm font-bold">
                Done
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
