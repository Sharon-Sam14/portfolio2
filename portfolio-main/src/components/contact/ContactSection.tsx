// ─── Contact Section Component ───────────────────────────────────────────────
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLinkedin, FiGithub, FiArrowRight, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import FadeIn from '../FadeIn';
import { sendEmail } from '../../services/email';

interface Theme {
  sectionBg: string;
  cardBg: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  pillBg: string;
  pillBorder: string;
  heroGradient: string;
  borderFaint: string;
}

interface ContactSectionProps {
  theme: Theme;
  isDark: boolean;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactSection({ theme, isDark }: ContactSectionProps) {
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Client-side validation helper
  const validate = (): boolean => {
    const tempErrors: FormErrors = {};
    if (!form.firstName.trim()) tempErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) tempErrors.lastName = 'Last name is required';
    
    if (!form.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      tempErrors.email = 'Please enter a valid email address';
    }
    
    if (!form.subject.trim()) tempErrors.subject = 'Subject is required';
    if (!form.message.trim()) tempErrors.message = 'Message is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      await sendEmail({
        from_name: `${form.firstName} ${form.lastName}`,
        from_email: form.email,
        subject: form.subject,
        message: form.message,
      });
      setStatus('success');
      setForm({ firstName: '', lastName: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err?.message || 'Something went wrong. Please try again.');
    }
  };

  const contactCards = [
    {
      id: 'email-card',
      icon: <FiMail className="text-xl sm:text-2xl" style={{ color: isDark ? '#BBCCD7' : '#2D4A8A' }} />,
      title: 'Email',
      value: 'sharonsam1401@gmail.com',
      href: 'mailto:sharonsam1401@gmail.com',
      ariaLabel: 'Send an email to Sharon Sam',
    },
    {
      id: 'linkedin-card',
      icon: <FiLinkedin className="text-xl sm:text-2xl" style={{ color: isDark ? '#BBCCD7' : '#2D4A8A' }} />,
      title: 'LinkedIn',
      value: 'linkedin.com/in/sharon-sam-6b1836290',
      href: 'https://www.linkedin.com/in/sharon-sam-6b1836290',
      ariaLabel: 'Visit Sharon Sam\'s LinkedIn Profile',
    },
    {
      id: 'github-card',
      icon: <FiGithub className="text-xl sm:text-2xl" style={{ color: isDark ? '#BBCCD7' : '#2D4A8A' }} />,
      title: 'GitHub',
      value: 'github.com/Sharon-Sam14',
      href: 'https://github.com/Sharon-Sam14',
      ariaLabel: 'Visit Sharon Sam\'s GitHub Profile',
    },
  ];

  const focusRingStyle = isDark 
    ? 'focus:ring-2 focus:ring-white/20 focus:border-white/40' 
    : 'focus:ring-2 focus:ring-black/10 focus:border-black/30';

  const glowShadowStyle = isDark
    ? 'hover:shadow-[0_0_30px_rgba(182,0,168,0.15)] hover:border-purple-500/30'
    : 'hover:shadow-[0_0_30px_rgba(118,33,176,0.1)] hover:border-purple-600/20';

  const headingGradientStyle = {
    background: theme.heroGradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  return (
    <section
      id="contact"
      className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-20 pt-24 pb-32 px-5 sm:px-8 md:px-10 transition-colors duration-500"
      style={{ background: theme.sectionBg }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* ── Left Column ── */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <FadeIn delay={0} y={30}>
              <h2
                className="font-black uppercase tracking-tight text-4xl sm:text-5xl md:text-6xl mb-4"
                style={headingGradientStyle}
              >
                Let&apos;s Connect
              </h2>
              <p
                className="font-light leading-relaxed text-sm sm:text-base"
                style={{ color: theme.textMuted }}
              >
                I&apos;m always open to discussing internships, software engineering opportunities, collaborations, open-source projects, or innovative ideas. Feel free to reach out.
              </p>
            </FadeIn>

            {/* Glass Cards List */}
            <div className="flex flex-col gap-4">
              {contactCards.map((card, i) => (
                <FadeIn key={card.title} delay={0.1 + i * 0.08} y={20}>
                  <a
                    id={card.id}
                    href={card.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={card.ariaLabel}
                    className={`flex items-center justify-between p-5 rounded-[24px] border backdrop-blur-md transition-all duration-300 ${glowShadowStyle} active:scale-[0.98] group`}
                    style={{
                      background: theme.cardBg,
                      borderColor: theme.cardBorder,
                    }}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: theme.pillBg,
                          borderColor: theme.pillBorder,
                        }}
                      >
                        {card.icon}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs uppercase tracking-widest font-semibold" style={{ color: theme.textMuted }}>
                          {card.title}
                        </h3>
                        <p className="text-sm sm:text-base font-bold truncate mt-0.5 group-hover:opacity-90" style={{ color: theme.text }}>
                          {card.value}
                        </p>
                      </div>
                    </div>
                    <FiArrowRight
                      className="text-lg transition-transform duration-300 group-hover:translate-x-2 group-hover:opacity-100 opacity-60 flex-shrink-0"
                      style={{ color: theme.text }}
                    />
                  </a>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* ── Right Column ── */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 0, y: 40 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: '50px' }}
              transition={{
                delay: 0.2,
                duration: 0.7,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="w-full"
            >
              <div
                className="rounded-[32px] border p-6 sm:p-8 md:p-10 backdrop-blur-md"
                style={{
                  background: theme.cardBg,
                  borderColor: theme.cardBorder,
                }}
              >
                <AnimatePresence mode="wait">
                  {status === 'success' ? (
                    <motion.div
                      key="success-state"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center text-center py-12 px-4 gap-4"
                    >
                      <FiCheckCircle className="text-5xl sm:text-6xl text-green-500 animate-bounce" />
                      <h3 className="text-2xl font-black uppercase tracking-tight mt-2" style={{ color: theme.text }}>
                        Message Sent!
                      </h3>
                      <p className="font-light text-sm sm:text-base leading-relaxed max-w-md" style={{ color: theme.textMuted }}>
                        Thank you! Your message has been sent successfully. I&apos;ll get back to you as soon as possible.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setStatus('idle')}
                        className="mt-6 rounded-full border-2 font-medium uppercase tracking-widest text-xs sm:text-sm px-6 py-2.5 transition-all duration-300"
                        style={{
                          borderColor: theme.text,
                          color: theme.text,
                        }}
                      >
                        Send Another Message
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form-state"
                      onSubmit={handleSubmit}
                      noValidate
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col gap-5 sm:gap-6"
                    >
                      {/* Name Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                        {/* First Name */}
                        <div className="flex flex-col gap-2">
                          <label htmlFor="firstName" className="text-xs uppercase tracking-widest font-semibold" style={{ color: theme.textMuted }}>
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            required
                            aria-required="true"
                            aria-invalid={!!errors.firstName}
                            aria-describedby={errors.firstName ? "firstName-error" : undefined}
                            value={form.firstName}
                            onChange={handleChange}
                            placeholder="John"
                            className={`w-full rounded-2xl px-4 py-3 bg-transparent border text-sm sm:text-base outline-none transition-all duration-300 ${focusRingStyle}`}
                            style={{
                              borderColor: errors.firstName ? '#ef4444' : theme.cardBorder,
                              color: theme.text,
                            }}
                          />
                          {errors.firstName && (
                            <span id="firstName-error" className="text-xs text-red-500 font-light flex items-center gap-1">
                              <FiAlertCircle /> {errors.firstName}
                            </span>
                          )}
                        </div>

                        {/* Last Name */}
                        <div className="flex flex-col gap-2">
                          <label htmlFor="lastName" className="text-xs uppercase tracking-widest font-semibold" style={{ color: theme.textMuted }}>
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            required
                            aria-required="true"
                            aria-invalid={!!errors.lastName}
                            aria-describedby={errors.lastName ? "lastName-error" : undefined}
                            value={form.lastName}
                            onChange={handleChange}
                            placeholder="Doe"
                            className={`w-full rounded-2xl px-4 py-3 bg-transparent border text-sm sm:text-base outline-none transition-all duration-300 ${focusRingStyle}`}
                            style={{
                              borderColor: errors.lastName ? '#ef4444' : theme.cardBorder,
                              color: theme.text,
                            }}
                          />
                          {errors.lastName && (
                            <span id="lastName-error" className="text-xs text-red-500 font-light flex items-center gap-1">
                              <FiAlertCircle /> {errors.lastName}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Email Address */}
                      <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-xs uppercase tracking-widest font-semibold" style={{ color: theme.textMuted }}>
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          aria-required="true"
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "email-error" : undefined}
                          value={form.email}
                          onChange={handleChange}
                          placeholder="john.doe@example.com"
                          className={`w-full rounded-2xl px-4 py-3 bg-transparent border text-sm sm:text-base outline-none transition-all duration-300 ${focusRingStyle}`}
                          style={{
                            borderColor: errors.email ? '#ef4444' : theme.cardBorder,
                            color: theme.text,
                          }}
                        />
                        {errors.email && (
                          <span id="email-error" className="text-xs text-red-500 font-light flex items-center gap-1">
                            <FiAlertCircle /> {errors.email}
                          </span>
                        )}
                      </div>

                      {/* Subject */}
                      <div className="flex flex-col gap-2">
                        <label htmlFor="subject" className="text-xs uppercase tracking-widest font-semibold" style={{ color: theme.textMuted }}>
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          required
                          aria-required="true"
                          aria-invalid={!!errors.subject}
                          aria-describedby={errors.subject ? "subject-error" : undefined}
                          value={form.subject}
                          onChange={handleChange}
                          placeholder="Inquiry / Opportunity"
                          className={`w-full rounded-2xl px-4 py-3 bg-transparent border text-sm sm:text-base outline-none transition-all duration-300 ${focusRingStyle}`}
                          style={{
                            borderColor: errors.subject ? '#ef4444' : theme.cardBorder,
                            color: theme.text,
                          }}
                        />
                        {errors.subject && (
                          <span id="subject-error" className="text-xs text-red-500 font-light flex items-center gap-1">
                            <FiAlertCircle /> {errors.subject}
                          </span>
                        )}
                      </div>

                      {/* Message */}
                      <div className="flex flex-col gap-2">
                        <label htmlFor="message" className="text-xs uppercase tracking-widest font-semibold" style={{ color: theme.textMuted }}>
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          aria-required="true"
                          aria-invalid={!!errors.message}
                          aria-describedby={errors.message ? "message-error" : undefined}
                          value={form.message}
                          onChange={handleChange}
                          placeholder="Type your message here..."
                          rows={5}
                          className={`w-full rounded-2xl px-4 py-3 bg-transparent border text-sm sm:text-base outline-none transition-all duration-300 resize-none ${focusRingStyle}`}
                          style={{
                            borderColor: errors.message ? '#ef4444' : theme.cardBorder,
                            color: theme.text,
                          }}
                        />
                        {errors.message && (
                          <span id="message-error" className="text-xs text-red-500 font-light flex items-center gap-1">
                            <FiAlertCircle /> {errors.message}
                          </span>
                        )}
                      </div>

                      {/* Error Display */}
                      {status === 'error' && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs sm:text-sm text-red-500"
                        >
                          <FiAlertCircle className="flex-shrink-0" />
                          <span>{errorMessage}</span>
                        </motion.div>
                      )}

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={status === 'loading'}
                        whileHover={status === 'loading' ? {} : { 
                          scale: 1.02,
                          boxShadow: isDark
                            ? '0px 8px 24px rgba(181, 1, 167, 0.4), inset 4px 4px 12px #7721B1'
                            : '0px 8px 24px rgba(118, 33, 176, 0.3), inset 4px 4px 12px #7721B1'
                        }}
                        whileTap={status === 'loading' ? {} : { scale: 0.98 }}
                        style={{
                          background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                          boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1',
                          outline: '2px solid white',
                          outlineOffset: '-3px',
                        }}
                        className={`relative rounded-full uppercase tracking-widest text-white font-medium text-xs sm:text-sm md:text-base px-8 py-3.5 sm:px-10 sm:py-4 transition-all duration-300 w-full flex items-center justify-center gap-2 overflow-hidden ${
                          status === 'loading' ? 'opacity-80 cursor-not-allowed' : 'hover:opacity-95'
                        }`}
                      >
                        {status === 'loading' ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <span>Send Message</span>
                            <FiArrowRight />
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
