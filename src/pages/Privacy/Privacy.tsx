import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Privacy.css';
import { usePageSEO } from '../../hooks/usePageSEO';

export default function Privacy() {
  usePageSEO({
    title: 'Avance Privacy Policy',
    description:
      'Review the Avance privacy policy to understand how your data is collected, used, and protected while learning business Spanish.',
    canonicalPath: '/privacy',
  });

  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/landing" className="back-link">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to Avance ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website and in using our products and services. This Privacy Policy explains how we collect, use, share, and protect your personal information.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Information You Provide</h3>
          <p>We collect information that you provide directly to us, including:</p>
          <ul>
            <li><strong>Account Information:</strong> Email address, name, and password when you create an account</li>
            <li><strong>Profile Information:</strong> Your industry preference, language level, learning goals, and target date</li>
            <li><strong>Payment Information:</strong> Payment details are processed securely through Stripe (we do not store your full credit card information)</li>
            <li><strong>Communication:</strong> Messages you send to us through customer support or other channels</li>
          </ul>

          <h3>2.2 Information Automatically Collected</h3>
          <p>When you use our services, we automatically collect certain information, including:</p>
          <ul>
            <li><strong>Usage Data:</strong> Lessons completed, modules accessed, vocabulary reviewed, time spent learning, and progress tracking</li>
            <li><strong>Device Information:</strong> Browser type, device type, operating system, and IP address</li>
            <li><strong>Analytics Data:</strong> Page views, feature usage, and interaction patterns collected through Google Analytics</li>
            <li><strong>Cookies and Similar Technologies:</strong> We use cookies to remember your preferences and improve your experience</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Personalize your learning experience and recommend content</li>
            <li>Track your progress and provide learning analytics</li>
            <li>Process payments and manage subscriptions</li>
            <li>Send you service-related communications (e.g., account updates, progress reports)</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Detect, prevent, and address technical issues and security threats</li>
            <li>Comply with legal obligations and enforce our Terms of Service</li>
          </ul>
        </section>

        <section>
          <h2>4. How We Share Your Information</h2>
          <p>We do not sell your personal information. We may share your information only in the following circumstances:</p>
          <ul>
            <li><strong>Service Providers:</strong> We share data with trusted third-party service providers who assist us in operating our platform:
              <ul>
                <li><strong>Firebase (Google):</strong> Authentication, database, and hosting services</li>
                <li><strong>Stripe:</strong> Payment processing</li>
                <li><strong>Google Analytics:</strong> Website analytics and usage tracking</li>
              </ul>
            </li>
            <li><strong>Legal Requirements:</strong> If required by law, court order, or government regulation</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
          </ul>
        </section>

        <section>
          <h2>5. Data Storage and Security</h2>
          <p>
            Your data is stored securely using Firebase (Google Cloud Platform). We implement industry-standard security measures, including encryption in transit and at rest, to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
          <p>
            Payment information is processed directly by Stripe and is subject to Stripe's privacy policy and security standards. We do not store your full credit card details.
          </p>
        </section>

        <section>
          <h2>6. Your Rights and Choices</h2>
          <p>You have the following rights regarding your personal information:</p>
          <ul>
            <li><strong>Access:</strong> Request access to the personal data we hold about you</li>
            <li><strong>Correction:</strong> Update or correct your account information through your profile settings</li>
            <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
            <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
            <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails (service-related emails will still be sent)</li>
            <li><strong>Cookie Preferences:</strong> Manage cookie settings through your browser</li>
          </ul>
          <p>To exercise these rights, please contact us at the email address provided below.</p>
        </section>

        <section>
          <h2>7. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
          </p>
        </section>

        <section>
          <h2>8. Children's Privacy</h2>
          <p>
            Our service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
          </p>
        </section>

        <section>
          <h2>9. International Data Transfers</h2>
          <p>
            Your information may be transferred to and maintained on servers located outside of your country of residence. By using our services, you consent to the transfer of your information to the United States and other jurisdictions where our service providers operate.
          </p>
        </section>

        <section>
          <h2>10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>

        <section>
          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> privacy@businessspanishpro.com<br />
            <strong>Website:</strong> <Link to="/landing">business-spanish.vercel.app</Link>
          </p>
        </section>
      </div>
    </div>
  );
}


