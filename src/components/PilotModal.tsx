import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Overlay } from '@/components/motion/overlay';
import { useToast } from '@/components/motion/use-toast';
import Loader from '@/components/kokonutui/loader';
import { Button } from '@/components/ui/button';
import { Field, FormError, inputClass } from '@/components/ui/field';
import { FORM_ENDPOINT } from '@/content';

interface PilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'pilot' | 'partner';
}

const EMPTY = { name: '', organisation: '', role: '', email: '', honeypot: '' };

export const PilotModal: React.FC<PilotModalProps> = ({ isOpen, onClose, type = 'pilot' }) => {
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');

  const partner = type === 'partner';
  const title = partner ? 'Partner with SatyaCheck' : 'Talk to us about a pilot';
  const description = partner
    ? 'Tell us about the community you protect, or the voice-scam scripts you are seeing.'
    : "Tell us a little about your organisation and we'll set up a call about adding SatyaCheck to your app.";

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.honeypot) {
      onClose();
      return;
    }
    if (!form.name.trim() || !form.organisation.trim() || !form.role.trim() || !form.email.trim()) {
      setError('Please fill in all required fields.');
      setStatus('error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid work email address.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setError('');

    try {
      const payload = {
        type,
        timestamp: new Date().toISOString(),
        name: form.name.trim(),
        organisation: form.organisation.trim(),
        role: form.role.trim(),
        email: form.email.trim(),
      };
      if (FORM_ENDPOINT.trim()) {
        await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
          mode: 'no-cors',
        });
      }
      toast({
        title: partner ? 'Partnership request sent' : 'Pilot request sent',
        description: 'Thank you. We will be in touch soon.',
        tone: 'success',
      });
      setForm(EMPTY);
      setStatus('idle');
      onClose();
    } catch (err) {
      console.error('Inquiry submission error:', err);
      setError('We could not send your request. Please check your connection and try again.');
      setStatus('error');
      toast({ title: 'Submission failed', description: 'Please check your connection and try again.', tone: 'error' });
    }
  };

  return (
    <Overlay open={isOpen} onClose={onClose} title={title}>
      <p className="-mt-3 mb-6 text-[15px] leading-relaxed text-fg-muted">{description}</p>

      {status === 'error' && (
        <FormError className="mb-5">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </FormError>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <input
          type="text"
          name="website_url_hp"
          value={form.honeypot}
          onChange={set('honeypot')}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <Field id="modal-name" label="Full name" required>
          <input id="modal-name" type="text" required autoComplete="name" value={form.name} onChange={set('name')} className={inputClass} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="modal-org" label="Organisation" required>
            <input id="modal-org" type="text" required autoComplete="organization" value={form.organisation} onChange={set('organisation')} className={inputClass} />
          </Field>
          <Field id="modal-role" label="Your role" required>
            <input id="modal-role" type="text" required autoComplete="organization-title" value={form.role} onChange={set('role')} className={inputClass} />
          </Field>
        </div>
        <Field id="modal-email" label="Work email" required>
          <input id="modal-email" type="email" required autoComplete="email" placeholder="name@organisation.com" value={form.email} onChange={set('email')} className={inputClass} />
        </Field>
        <div className="pt-2">
          <Button type="submit" size="lg" className="w-full" disabled={status === 'loading'} arrow={status !== 'loading'}>
            {status === 'loading' ? <Loader size="sm" title="Sending..." className="[&_span]:text-on-brand" /> : partner ? 'Send partnership request' : 'Send pilot request'}
          </Button>
        </div>
      </form>
    </Overlay>
  );
};
