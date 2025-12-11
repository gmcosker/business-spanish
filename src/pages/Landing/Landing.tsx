import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Check, Star, ArrowRight, Shield, Clock, TrendingUp, 
  Users, Target, Zap, Play, Menu, X, ChevronDown,
  Brain, MessageCircle, Timer, Repeat, Briefcase, BarChart3, Award, HeartPulse, BookOpen
} from 'lucide-react';
import './Landing.css';
import { usePageSEO } from '../../hooks/usePageSEO';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  usePageSEO({
    title: 'Avance | Learn Business Spanish in 10 Minutes a Day',
    description:
      'Avance helps professionals master business Spanish with industry-specific lessons, AI conversation practice, and daily microlearning sessions.',
    canonicalPath: '/landing',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setShowSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => {
        setShowSuccess(false);
        setEmail('');
      }, 3000);
    }, 1000);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // FAQ data for structured data
  const faqData = [
    {
      question: "How long does it take to see results?",
      answer: "Most professionals see measurable improvement in business conversations within 2-3 weeks. You'll notice confidence in meetings and presentations after 30 days of consistent daily practice."
    },
    {
      question: "What makes Avance different from other apps?",
      answer: "We're the only Spanish app built specifically for business contexts. Our vocabulary is industry-specific, our conversations simulate real business scenarios (sales calls, negotiations, meetings), and our AI gives you professional-level feedback on pronunciation and fluency."
    },
    {
      question: "How much time do I need to invest daily?",
      answer: "Just 10 minutes per day. Our microlearning approach is designed for busy professionals. You can practice during your commute, lunch break, or before bed—whenever fits your schedule."
    },
    {
      question: "What if I already speak conversational Spanish?",
      answer: "Perfect! Avance is designed to bridge the gap between conversational Spanish and professional Spanish. You'll learn business-specific vocabulary, formal phrases for presentations, and industry terminology that conversational Spanish doesn't cover."
    },
    {
      question: "Can multiple people in my team use one account?",
      answer: "Each plan is designed for individual use to ensure personalized learning. For team needs, we offer Enterprise plans with team management, analytics, and volume discounts. Contact sales for details."
    },
    {
      question: "What happens after my free trial?",
      answer: "You can continue learning on the Basic plan for free with limited features, or upgrade to Professional for full access. No credit card required for the free trial, and you can cancel anytime."
    },
    {
      question: "Do you offer corporate training programs?",
      answer: "Yes! Our Enterprise plan includes custom content for your industry, team management tools, progress tracking, and dedicated account management. Contact our sales team for a custom quote."
    },
    {
      question: "What's your refund policy?",
      answer: "We offer a 30-day money-back guarantee. If you're not satisfied for any reason, email us and we'll issue a full refund—no questions asked."
    }
  ];

  return (
    <div className="landing-page">
      {/* FAQ Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
      
      {/* Sticky Header */}
      <header className="landing-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <TrendingUp className="logo-icon" />
              <span>Avance</span>
            </div>
            
            <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
              <button onClick={() => scrollToSection('features')}>Features</button>
              <button onClick={() => scrollToSection('testimonials')}>Reviews</button>
              <button onClick={() => scrollToSection('pricing')}>Pricing</button>
              <button onClick={() => scrollToSection('faq')}>FAQ</button>
              <button className="cta-button-nav" onClick={() => navigate('/login')}>
                Sign In
              </button>
            </nav>

            <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">
                <Zap className="badge-icon" />
                <span>Join 50,000+ professionals already learning</span>
              </div>
              
              <h1 className="hero-headline">
                Master <span className="gradient-text">Business Spanish</span> in
                <br />30 Days or Less
              </h1>
              
              <p className="hero-subheadline">
                Join executives, sales teams, and entrepreneurs who confidently communicate 
                in Spanish. AI-powered, industry-specific training tailored to your career.
              </p>

              {/* Trust Elements */}
              <div className="hero-trust">
                <div className="trust-item">
                  <Star className="trust-icon" />
                  <span>4.9/5 from 12,000+ reviews</span>
                </div>
                <div className="trust-item">
                  <Users className="trust-icon" />
                  <span>50,000+ professionals trained</span>
                </div>
                <div className="trust-item">
                  <Shield className="trust-icon" />
                  <span>Used by Fortune 500 companies</span>
                </div>
              </div>

              {/* Primary CTA */}
              <div className="hero-cta">
                <button 
                  className="cta-primary"
                  onClick={() => navigate('/signup')}
                >
                  Start Your Free Trial
                  <ArrowRight className="cta-icon" />
                </button>
                <button 
                  className="cta-secondary"
                  onClick={() => scrollToSection('features')}
                >
                  <Play className="cta-play-icon" />
                  See How It Works
                </button>
              </div>

              {/* Testimonial Quote */}
              <div className="hero-testimonial">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="filled-star" />
                  ))}
                </div>
                <p className="testimonial-quote">
                  "Closed a $2M deal after just 3 weeks of using Avance. 
                  This isn't just a language app—it's a career accelerator."
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">SR</div>
                  <div className="author-info">
                    <div className="author-name">Sarah Rodriguez</div>
                    <div className="author-title">VP of Sales, TechCorp Global</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-image">
              <div className="image-container">
                <div className="floating-card card-1">
                  <div className="card-icon">
                    <Users className="card-icon-svg" />
                  </div>
                  <div className="card-text">
                    <div className="card-label">Active Users</div>
                    <div className="card-value">2,847 today</div>
                  </div>
                </div>
                <div className="floating-card card-2">
                  <div className="card-icon">
                    <Star className="card-icon-svg" />
                  </div>
                  <div className="card-text">
                    <div className="card-label">Average Rating</div>
                    <div className="card-value">4.9/5</div>
                  </div>
                </div>
                <div className="floating-card card-3">
                  <div className="card-icon">
                    <Award className="card-icon-svg" />
                  </div>
                  <div className="card-text">
                    <div className="card-label">Success Rate</div>
                    <div className="card-value">94%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="problem-section" id="problem">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">The Challenge</span>
            <h2 className="section-title">Why Traditional Language Learning Fails for Busy Professionals</h2>
          </div>

          <div className="problem-grid">
            <div className="problem-card">
              <Clock className="problem-icon" />
              <h3>No Time</h3>
              <p>Traditional courses take 3-6 months. You need results now for upcoming meetings, presentations, and client calls.</p>
            </div>
            <div className="problem-card">
              <Target className="problem-icon" />
              <h3>Wrong Vocabulary</h3>
              <p>Generic Spanish apps teach restaurant Spanish. You need boardroom Spanish, sales Spanish, negotiation Spanish.</p>
            </div>
            <div className="problem-card">
              <Shield className="problem-icon" />
              <h3>Fear of Mistakes</h3>
              <p>One wrong word in a high-stakes conversation can damage professional relationships and lose deals.</p>
            </div>
          </div>

          <div className="solution-section">
            <div className="solution-content">
              <h2 className="solution-title">The Avance Solution</h2>
              <p className="solution-text">
                We've completely reimagined language learning for professionals. Our AI-powered platform 
                delivers industry-specific vocabulary, real-world business scenarios, and career-focused 
                practice—all in 10-minute daily sessions that fit your schedule.
              </p>
              <button 
                className="cta-primary solution-cta"
                onClick={() => navigate('/signup')}
              >
                Start Your Free Trial
                <ArrowRight className="cta-icon" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">How It Works</span>
            <h2 className="section-title">Everything You Need to Succeed</h2>
            <p className="section-subtitle">Built specifically for busy professionals who need results fast</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Target className="icon-svg" />
              </div>
              <h3>Industry-Specific Curriculum</h3>
              <p>Learn vocabulary and phrases tailored to your industry: Tech, Finance, Logistics, Customer Service, and more.</p>
              <ul className="feature-benefits">
                <li><Check /> 500+ business scenarios</li>
                <li><Check /> Context-specific vocabulary</li>
                <li><Check /> Industry-focused dialogues</li>
              </ul>
            </div>

            <div className="feature-card featured">
              <div className="feature-badge">Most Popular</div>
              <div className="feature-icon">
                <Brain className="icon-svg" />
              </div>
              <h3>AI Conversation Practice</h3>
              <p>Practice real business conversations with our AI. Get instant feedback on grammar, pronunciation, and fluency.</p>
              <ul className="feature-benefits">
                <li><Check /> Unlimited conversation scenarios</li>
                <li><Check /> Real-time pronunciation tips</li>
                <li><Check /> Grammar and vocabulary hints</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Timer className="icon-svg" />
              </div>
              <h3>10-Minute Daily Lessons</h3>
              <p>Microlearning sessions designed for busy schedules. Progress in just 10 minutes per day during your commute or breaks.</p>
              <ul className="feature-benefits">
                <li><Check /> Fits your schedule</li>
                <li><Check /> Offline access</li>
                <li><Check /> Mobile-first design</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Repeat className="icon-svg" />
              </div>
              <h3>Spaced Repetition System</h3>
              <p>Our proven algorithm ensures you retain what you learn. Review vocabulary at optimal intervals for maximum retention.</p>
              <ul className="feature-benefits">
                <li><Check /> Science-backed method</li>
                <li><Check /> Personalized review schedule</li>
                <li><Check /> Spanish-first vocabulary priority</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Briefcase className="icon-svg" />
              </div>
              <h3>Career-Focused Practice</h3>
              <p>Simulate real business scenarios: sales calls, team meetings, client presentations, and vendor negotiations.</p>
              <ul className="feature-benefits">
                <li><Check /> Real-world business scenarios</li>
                <li><Check /> Professional role-playing</li>
                <li><Check /> Industry-specific contexts</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <BarChart3 className="icon-svg" />
              </div>
              <h3>Progress Analytics</h3>
              <p>Track your learning journey with detailed analytics. See your progress, streaks, and career milestones.</p>
              <ul className="feature-benefits">
                <li><Check /> Daily activity tracking</li>
                <li><Check /> Weekly progress reports</li>
                <li><Check /> Milestone achievements</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="social-proof-section" id="testimonials">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Trusted by Professionals</span>
            <h2 className="section-title">Join 50,000+ Successful Learners</h2>
          </div>

          {/* Stats Bar */}
          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-number">50,000+</div>
              <div className="stat-label">Active Professionals</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">94%</div>
              <div className="stat-label">Success Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.9/5</div>
              <div className="stat-label">User Rating</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">30 Days</div>
              <div className="stat-label">Average to Fluency</div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="filled-star" />
                ))}
              </div>
              <p className="testimonial-text">
                "I was struggling with client calls in Mexico. After 2 weeks with Avance, 
                I closed a deal completely in Spanish. The industry-specific vocabulary is a game-changer."
              </p>
              <div className="testimonial-author-full">
                <div className="testimonial-avatar">MR</div>
                <div className="testimonial-info">
                  <div className="testimonial-name">Michael Ramirez</div>
                  <div className="testimonial-title">Regional Sales Director, Fortinet</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="filled-star" />
                ))}
              </div>
              <p className="testimonial-text">
                "Finally, a Spanish app built for execs. The conversations are realistic, the vocabulary 
                is practical, and I can fit it into my insane schedule. Best investment in my career."
              </p>
              <div className="testimonial-author-full">
                <div className="testimonial-avatar">EP</div>
                <div className="testimonial-info">
                  <div className="testimonial-name">Emma Patel</div>
                  <div className="testimonial-title">COO, CloudSync Inc.</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="filled-star" />
                ))}
              </div>
              <p className="testimonial-text">
                "Our team of 20 sales reps uses Avance. We've seen 3x more successful 
                outreach to Latin American markets. The ROI is undeniable."
              </p>
              <div className="testimonial-author-full">
                <div className="testimonial-avatar">JL</div>
                <div className="testimonial-info">
                  <div className="testimonial-name">Javier López</div>
                  <div className="testimonial-title">VP of Growth, StartupXYZ</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="filled-star" />
                ))}
              </div>
              <p className="testimonial-text">
                "I was terrified of presenting in Spanish at a board meeting. Avance's 
                conversation practice gave me the confidence I needed. Nailed it!"
              </p>
              <div className="testimonial-author-full">
                <div className="testimonial-avatar">CW</div>
                <div className="testimonial-info">
                  <div className="testimonial-name">Chen Wei</div>
                  <div className="testimonial-title">Product Manager, Meta</div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Logos */}
          <div className="companies-section">
            <p className="companies-title">Trusted by teams at</p>
            <div className="companies-grid">
              <div className="company-logo">Microsoft</div>
              <div className="company-logo">Amazon</div>
              <div className="company-logo">Salesforce</div>
              <div className="company-logo">IBM</div>
              <div className="company-logo">Accenture</div>
              <div className="company-logo">Deloitte</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section" id="pricing">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Simple Pricing</span>
            <h2 className="section-title">Choose Your Plan</h2>
            <p className="section-subtitle">Start free, upgrade anytime. 30-day money-back guarantee.</p>
          </div>

          <div className="pricing-grid">
            {/* Free Plan */}
            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-name">Basic</h3>
                <p className="pricing-description">Perfect for trying out Avance</p>
              </div>
              <div className="pricing-price">
                <span className="price-amount">Free</span>
                <span className="price-period">Forever</span>
              </div>
              <ul className="pricing-features">
                <li><Check /> 1 Industry vertical</li>
                <li><Check /> 5 lessons per week</li>
                <li><Check /> Basic vocabulary review</li>
                <li><Check /> Limited conversation practice</li>
                <li><Check /> Mobile & web access</li>
              </ul>
              <button className="cta-outline">Current Plan</button>
            </div>

            {/* Professional Plan - Featured */}
            <div className="pricing-card featured">
              <div className="popular-badge">Most Popular</div>
              <div className="pricing-header">
                <h3 className="pricing-name">Professional</h3>
                <p className="pricing-description">For serious professionals who need results</p>
              </div>
              <div className="pricing-price">
                <span className="price-amount">$29</span>
                <span className="price-period">per month</span>
                <div className="price-savings">Save $99/year with annual billing</div>
              </div>
              <ul className="pricing-features">
                <li><Check /> All industry verticals</li>
                <li><Check /> Unlimited lessons</li>
                <li><Check /> AI conversation practice</li>
                <li><Check /> Spaced repetition system</li>
                <li><Check /> Advanced analytics</li>
                <li><Check /> Priority support</li>
                <li><Check /> Offline mode</li>
              </ul>
              <button 
                className="cta-primary pricing-cta"
                onClick={() => navigate('/pricing')}
              >
                Start Free Trial
                <ArrowRight className="cta-icon" />
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-name">Enterprise</h3>
                <p className="pricing-description">Custom solutions for teams</p>
              </div>
              <div className="pricing-price">
                <span className="price-amount">Custom</span>
                <span className="price-period">Contact us</span>
              </div>
              <ul className="pricing-features">
                <li><Check /> Everything in Professional</li>
                <li><Check /> Team management dashboard</li>
                <li><Check /> Custom industry content</li>
                <li><Check /> Admin analytics & reporting</li>
                <li><Check /> Dedicated account manager</li>
                <li><Check /> SSO integration</li>
                <li><Check /> SLA guarantee</li>
              </ul>
              <button className="cta-outline">Contact Sales</button>
            </div>
          </div>

          {/* Money-Back Guarantee */}
          <div className="guarantee-section">
            <Shield className="guarantee-icon" />
            <h3>30-Day Money-Back Guarantee</h3>
            <p>If you're not completely satisfied, we'll refund every penny. No questions asked.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section" id="faq">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Common Questions</span>
            <h2 className="section-title">Everything You Need to Know</h2>
          </div>

          <div className="faq-list">
            <FAQItem 
              question="How long does it take to see results?"
              answer="Most professionals see measurable improvement in business conversations within 2-3 weeks. You'll notice confidence in meetings and presentations after 30 days of consistent daily practice."
            />
            <FAQItem 
              question="What makes Avance different from other apps?"
              answer="We're the only Spanish app built specifically for business contexts. Our vocabulary is industry-specific, our conversations simulate real business scenarios (sales calls, negotiations, meetings), and our AI gives you professional-level feedback on pronunciation and fluency."
            />
            <FAQItem 
              question="How much time do I need to invest daily?"
              answer="Just 10 minutes per day. Our microlearning approach is designed for busy professionals. You can practice during your commute, lunch break, or before bed—whenever fits your schedule."
            />
            <FAQItem 
              question="What if I already speak conversational Spanish?"
              answer="Perfect! Avance is designed to bridge the gap between conversational Spanish and professional Spanish. You'll learn business-specific vocabulary, formal phrases for presentations, and industry terminology that conversational Spanish doesn't cover."
            />
            <FAQItem 
              question="Can multiple people in my team use one account?"
              answer="Each plan is designed for individual use to ensure personalized learning. For team needs, we offer Enterprise plans with team management, analytics, and volume discounts. Contact sales for details."
            />
            <FAQItem 
              question="What happens after my free trial?"
              answer="You can continue learning on the Basic plan for free with limited features, or upgrade to Professional for full access. No credit card required for the free trial, and you can cancel anytime."
            />
            <FAQItem 
              question="Do you offer corporate training programs?"
              answer="Yes! Our Enterprise plan includes custom content for your industry, team management tools, progress tracking, and dedicated account management. Contact our sales team for a custom quote."
            />
            <FAQItem 
              question="What's your refund policy?"
              answer="We offer a 30-day money-back guarantee. If you're not satisfied for any reason, email us and we'll issue a full refund—no questions asked."
            />
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="resources-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Resources</span>
            <h2 className="section-title">Learn More About Business Spanish</h2>
          </div>
          <div className="resources-grid">
            <Link to="/blog/business-spanish-guide-2026" className="resource-card">
              <div className="resource-icon">
                <BookOpen className="icon-svg" />
              </div>
              <h3>The Complete Guide to Learning Spanish for Business in 2026</h3>
              <p>Everything you need to know about mastering professional Spanish: market trends, proven methods, industry-specific strategies, and actionable steps.</p>
              <div className="resource-link">
                Read Guide <ArrowRight className="link-arrow" />
              </div>
            </Link>

            <Link to="/blog/spanish-in-healthcare" className="resource-card">
              <div className="resource-icon">
                <HeartPulse className="icon-svg" />
              </div>
              <h3>Why Spanish Proficiency Matters in Healthcare</h3>
              <p>Evidence-based analysis of how language access shapes patient safety, trust, and equity—plus strategies for clinicians and health systems.</p>
              <div className="resource-link">
                Explore Insights <ArrowRight className="link-arrow" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="container">
          <div className="cta-content">
            <div className="cta-badge">
              <Clock className="cta-badge-icon" />
              <span>Limited Time: Start your free trial in the next</span>
              <div className="countdown-timer">
                {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
              </div>
            </div>
            
            <h2 className="cta-headline">Ready to Advance Your Career?</h2>
            <p className="cta-subtext">
              Join 50,000+ professionals who are already confident communicating in Spanish. 
              Start your free trial today—no credit card required.
            </p>

            <div className="cta-buttons">
              <button 
                className="cta-primary-large"
                onClick={() => navigate('/signup')}
              >
                Start Free Trial
                <ArrowRight className="cta-icon" />
              </button>
              <button 
                className="cta-secondary-large"
                onClick={() => navigate('/login')}
              >
                Already a member? Sign in
              </button>
            </div>

            <div className="cta-trust-badges">
              <div className="trust-badge-item">
                <Shield /> 30-day money-back guarantee
              </div>
              <div className="trust-badge-item">
                <Users /> 50,000+ happy professionals
              </div>
              <div className="trust-badge-item">
                <Check /> No credit card required
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <TrendingUp className="logo-icon" />
              <span>Avance</span>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#testimonials">Testimonials</a>
                <a href="#faq">FAQ</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#">About</a>
                <a href="#">Careers</a>
                <a href="#">Press</a>
                <a href="#">Contact</a>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <a href="#">Blog</a>
                <a href="#">Help Center</a>
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms of Service</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Avance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// FAQ Item Component
const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        <ChevronDown className={`faq-chevron ${isOpen ? 'open' : ''}`} />
      </button>
      {isOpen && (
        <div className="faq-answer">{answer}</div>
      )}
    </div>
  );
};

export default Landing;

