// ─── Email Service using EmailJS ──────────────────────────────────────────────
// This service lazy-loads the @emailjs/browser package when sendEmail is called.

const PUBLIC_KEY = (import.meta as any).env?.VITE_EMAILJS_PUBLIC_KEY ?? '';
const SERVICE_ID = (import.meta as any).env?.VITE_EMAILJS_SERVICE_ID ?? '';
const TEMPLATE_ID = (import.meta as any).env?.VITE_EMAILJS_TEMPLATE_ID ?? '';

export interface EmailParams {
  from_name: string;      // Combines First Name + Last Name
  from_email: string;     // Email Address
  subject: string;        // Subject
  message: string;        // Message content
}

/**
 * Sends an email using EmailJS by dynamically loading the browser SDK.
 */
export async function sendEmail(params: EmailParams): Promise<void> {
  if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
    throw new Error('EmailJS environment variables (VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID) are not configured.');
  }

  // Dynamically import @emailjs/browser to avoid loading it on initial page load
  const emailjs = await import('@emailjs/browser');

  const templateParams = {
    from_name: params.from_name,
    from_email: params.from_email,
    subject: params.subject,
    message: params.message,
    to_name: 'Sharon Sam',
  };

  const response = await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    templateParams,
    PUBLIC_KEY
  );

  if (response.status !== 200) {
    throw new Error(`EmailJS responded with status code ${response.status}: ${response.text}`);
  }
}
