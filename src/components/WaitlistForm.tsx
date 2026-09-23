import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AlertCircle, Check } from 'lucide-react';
import { BorderBeam } from '@/components/motion/border-beam';
import { SegmentedToggle } from '@/components/motion/segmented-toggle';
import { useToast } from '@/components/motion/use-toast';
import Loader from '@/components/kokonutui/loader';
import { Button } from '@/components/ui/button';
import { Field, FormError, inputClass } from '@/components/ui/field';
import { Eyebrow } from '@/components/ui/section';
import { Reveal, WordReveal } from '@/components/ui/reveal';
import { FORM_ENDPOINT } from '@/content';
import { useLanguage } from '@/lib/use-language';

// 'son or daughter': a grown-up child signing up to protect their parents.
type RoleOption = 'parent' | 'son or daughter' | 'bank or organisation' | 'other';

const ROLE_OPTIONS: { value: RoleOption; label: string }[] = [
  { value: 'parent', label: 'Parent' },
  { value: 'son or daughter', label: 'Son or daughter' },
  { value: 'bank or organisation', label: 'Bank or organisation' },
  { value: 'other', label: 'Other' },
];

const NEXT_STEPS = [
  'Join the list with your phone or email.',
  "We'll tell you when pilots open.",
  'Enrol your family, with consent.',
];

const EMPTY = { name: '', contact: '', city: '', role: 'parent' as RoleOption, story: '', consent: false, honeypot: '' };

function validContact(input: string) {
  const clean = input.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return true;
  return /^(?:\+91|91|0)?[6-9]\d{9}$/.test(clean.replace(/[\s\-()]/g, ''));
}

export const WaitlistForm: React.FC = () => {
  const toast = useToast();
  const { content } = useLanguage();
  const { waitlist } = content;
  const reduce = useReducedMotion();
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.honeypot) {
      setStatus('success');
      return;
    }
    if (!form.name.trim()) {
      setError('Please enter your name.');
      setStatus('error');
      return;
    }
    if (!validContact(form.contact)) {
      setError('Please enter a valid email address or a 10-digit Indian mobile number.');
      setStatus('error');
      return;
    }
    if (!form.consent) {
      setError('Please tick the consent box to continue.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setError('');

    try {
      const payload = {
        type: 'waitlist',
        timestamp: new Date().toISOString(),
        name: form.name.trim(),
        contact: form.contact.trim(),
        city: form.city.trim(),
        role: form.role,
        story: form.story.trim(),
      };
      if (FORM_ENDPOINT.trim()) {
        await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
          mode: 'no-cors',
        });
      }
      setStatus('success');
      toast({ title: waitlist.successMessage, description: "We'll let you know when early access opens.", tone: 'success' });
    } catch (err) {
      console.error('Waitlist submission error:', err);
      setError(waitlist.errorMessage);
      setStatus('error');
      toast({ title: 'Submission failed', description: 'Please check your connection and try again.', tone: 'error' });
    }
  };

  return (
    <section id="waitlist" className="relative w-full scroll-mt-24 overflow-hidden px-fluid py-24 lg:py-36" aria-labelledby="waitlist-heading">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/[0.12] blur-[160px]" />
        <div className="bg-grid mask-radial absolute inset-0 opacity-60" />
      </div>

      <div className="relative mx-auto grid max-w-[1300px] items-start gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32">
          <Reveal y={12}>
            <Eyebrow index="10" className="mb-6">
              Early access
            </Eyebrow>
          </Reveal>
          <WordReveal
            id="waitlist-heading"
            text="Protect the people who *pick up the phone*"
            className="type-headline max-w-[12ch] font-display font-semibold text-fg"
          />
          <Reveal delay={0.1}>
            <p className="type-lede mt-7 max-w-lg text-fg-muted">{waitlist.body}</p>
          </Reveal>
          <ol className="mt-10 space-y-4">
            {NEXT_STEPS.map((s, i) => (
              <Reveal as="li" key={s} delay={0.15 + i * 0.08} className="flex items-center gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line/20 bg-surface font-mono text-xs text-brand">
                  0{i + 1}
                </span>
                <span className="text-fg">{s}</span>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal>
          <BorderBeam radius={32} thickness={1.5} duration={7} innerClassName="bg-surface p-6 sm:p-10">
            <AnimatePresence mode="wait" initial={false}>
              {status === 'success' ? (
                <motion.div
                  key="done"
                  initial={reduce ? false : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-12 text-center"
                >
                  <div className="relative grid h-20 w-20 place-items-center">
                    <span className="absolute inset-0 rounded-full bg-ok/20 motion-safe:animate-pulse-ring" />
                    <motion.span
                      className="relative grid h-20 w-20 place-items-center rounded-full bg-ok text-canvas"
                      initial={reduce ? false : { scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                    >
                      <Check className="h-10 w-10" strokeWidth={3} aria-hidden="true" />
                    </motion.span>
                  </div>
                  <h3 className="mt-8 font-display text-3xl font-semibold tracking-tight text-fg">{waitlist.successMessage}</h3>
                  <p className="mt-3 max-w-sm text-fg-muted">We'll reach out as soon as early access opens.</p>
                  <Button
                    variant="secondary"
                    className="mt-8"
                    onClick={() => {
                      setForm(EMPTY);
                      setStatus('idle');
                    }}
                  >
                    Submit another response
                  </Button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-5" noValidate exit={{ opacity: 0 }}>
                  <input
                    type="text"
                    name="user_web_hp"
                    value={form.honeypot}
                    onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  {status === 'error' && (
                    <FormError>
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{error}</span>
                    </FormError>
                  )}

                  <Field id="waitlist-name" label="Name" required>
                    <input
                      id="waitlist-name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={inputClass}
                    />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="waitlist-contact" label="Phone or email" required>
                      <input
                        id="waitlist-contact"
                        type="text"
                        required
                        inputMode="email"
                        autoComplete="email"
                        placeholder="Email or 10-digit mobile"
                        value={form.contact}
                        onChange={(e) => setForm({ ...form, contact: e.target.value })}
                        className={inputClass}
                      />
                    </Field>
                    <Field id="waitlist-city" label="City" optional>
                      <input
                        id="waitlist-city"
                        type="text"
                        autoComplete="address-level2"
                        placeholder="e.g. Hyderabad"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <div>
                    <p id="waitlist-role-label" className="mb-2 text-[13px] font-medium text-fg">
                      I am a <span className="text-brand" aria-hidden="true">*</span>
                    </p>
                    <SegmentedToggle<RoleOption>
                      label="I am a"
                      options={ROLE_OPTIONS}
                      value={form.role}
                      onChange={(role) => setForm({ ...form, role })}
                      mobileColumns={2}
                      className="sm:w-full sm:justify-between"
                    />
                  </div>

                  <Field id="waitlist-story" label="Your story" optional>
                    <textarea
                      id="waitlist-story"
                      rows={3}
                      placeholder="Tell us about a suspicious call you or your family received."
                      value={form.story}
                      onChange={(e) => setForm({ ...form, story: e.target.value })}
                      className={`${inputClass} resize-none`}
                    />
                  </Field>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl p-1">
                    <input
                      type="checkbox"
                      required
                      checked={form.consent}
                      onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                      className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded accent-[rgb(var(--brand-solid))]"
                    />
                    <span className="text-sm leading-snug text-fg-muted">
                      I agree to be contacted about SatyaCheck and have read the{' '}
                      <Link to="/privacy" className="font-medium text-brand underline-offset-4 hover:underline">
                        privacy policy
                      </Link>
                      .
                    </span>
                  </label>

                  <Button type="submit" size="lg" className="w-full" disabled={status === 'loading'} arrow={status !== 'loading'}>
                    {status === 'loading' ? <Loader size="sm" title="Submitting..." /> : waitlist.buttonText}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </BorderBeam>
        </Reveal>
      </div>
    </section>
  );
};
