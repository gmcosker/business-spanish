import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initGA, trackPageView } from '../../services/analytics';

export default function GoogleAnalytics() {
  const location = useLocation();

  // Initialize GA on mount
  useEffect(() => {
    initGA();
  }, []);

  // Track page views on route change
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
}

