import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Terms.css';
import { usePageSEO } from '../../hooks/usePageSEO';

export default function Terms() {
  usePageSEO({
    title: 'Avance Terms of Service',
    description:
      'Read the Avance Terms of Service to understand account usage, subscription policies, acceptable use, and legal responsibilities.',
    canonicalPath: '/terms',
  });

  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/landing" className="back-link">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <h1>Terms of Service</h1>
        <p className="last-updated">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Avance ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these Terms, you may not access the Service.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            Avance is an online language learning platform that provides industry-specific Spanish language courses, vocabulary training, conversation practice, and progress tracking tools for business professionals.
          </p>
        </section>

        <section>
          <h2>3. User Accounts</h2>
          <h3>3.1 Account Creation</h3>
          <p>To use certain features of the Service, you must:</p>
          <ul>
            <li>Create an account with a valid email address</li>
            <li>Provide accurate and complete information</li>
            <li>Maintain and promptly update your account information</li>
            <li>Maintain the security of your password</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>

          <h3>3.2 Account Responsibility</h3>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>
        </section>

        <section>
          <h2>4. Subscription Plans and Payments</h2>
          <h3>4.1 Subscription Tiers</h3>
          <p>We offer the following subscription plans:</p>
          <ul>
            <li><strong>Free:</strong> Limited access to content and features</li>
            <li><strong>Professional:</strong> Full access to all content and features (monthly or yearly billing)</li>
            <li><strong>Team:</strong> Team management and analytics features (custom pricing)</li>
          </ul>

          <h3>4.2 Payment Terms</h3>
          <ul>
            <li>Subscription fees are billed in advance on a monthly or yearly basis</li>
            <li>All fees are non-refundable unless required by law or as stated in our refund policy</li>
            <li>We reserve the right to change our subscription fees with 30 days' notice</li>
            <li>Your subscription will automatically renew unless you cancel before the renewal date</li>
          </ul>

          <h3>4.3 Cancellation and Refunds</h3>
          <p>
            You may cancel your subscription at any time through your account settings. Cancellation takes effect at the end of your current billing period. We offer a 30-day money-back guarantee for new subscribers within 30 days of their initial subscription.
          </p>
        </section>

        <section>
          <h2>5. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any illegal purpose or in violation of any laws</li>
            <li>Violate or infringe upon the rights of others</li>
            <li>Transmit any harmful code, viruses, or malicious software</li>
            <li>Attempt to gain unauthorized access to the Service or other accounts</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Copy, modify, or create derivative works of the Service</li>
            <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
            <li>Use automated systems to access the Service without permission</li>
            <li>Share your account credentials with others</li>
            <li>Harass, abuse, or harm other users</li>
          </ul>
        </section>

        <section>
          <h2>6. Intellectual Property</h2>
          <p>
            All content, features, and functionality of the Service, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, and software, are the property of Avance or its licensors and are protected by international copyright, trademark, and other intellectual property laws.
          </p>
          <p>
            You are granted a limited, non-exclusive, non-transferable license to access and use the Service for personal, non-commercial purposes. This license does not include the right to:
          </p>
          <ul>
            <li>Resell or commercialize the Service</li>
            <li>Reproduce, distribute, or publicly display the content</li>
            <li>Modify or create derivative works</li>
            <li>Remove any copyright or proprietary notices</li>
          </ul>
        </section>

        <section>
          <h2>7. User Content</h2>
          <p>
            You retain ownership of any content you submit, post, or display through the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute your content solely for the purpose of providing and improving the Service.
          </p>
          <p>
            You represent and warrant that your content does not violate any third-party rights and is not unlawful, harmful, or offensive.
          </p>
        </section>

        <section>
          <h2>8. Privacy</h2>
          <p>
            Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy, which explains how we collect, use, and protect your information.
          </p>
        </section>

        <section>
          <h2>9. Disclaimers and Limitation of Liability</h2>
          <h3>9.1 Service Availability</h3>
          <p>
            We strive to maintain the Service's availability but do not guarantee uninterrupted access. The Service is provided "as is" and "as available" without warranties of any kind, either express or implied.
          </p>

          <h3>9.2 Learning Outcomes</h3>
          <p>
            While we provide educational content designed to improve your Spanish language skills, we do not guarantee specific learning outcomes. Results may vary based on individual effort, time commitment, and prior knowledge.
          </p>

          <h3>9.3 Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, Avance shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the Service.
          </p>
        </section>

        <section>
          <h2>10. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Avance and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way related to your use of the Service, violation of these Terms, or infringement of any rights of another.
          </p>
        </section>

        <section>
          <h2>11. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will cease immediately.
          </p>
          <p>
            You may terminate your account at any time by canceling your subscription and deleting your account through your account settings.
          </p>
        </section>

        <section>
          <h2>12. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify you of any material changes by posting the new Terms on this page and updating the "Last Updated" date. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2>13. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall be resolved in the courts of [Your Jurisdiction].
          </p>
        </section>

        <section>
          <h2>14. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> support@businessspanishpro.com<br />
            <strong>Website:</strong> <Link to="/landing">business-spanish.vercel.app</Link>
          </p>
        </section>

        <section>
          <h2>15. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
          </p>
        </section>
      </div>
    </div>
  );
}


