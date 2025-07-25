import { useEffect } from 'react';

/**
 * Custom hook to handle smooth scroll to top after navigation from quick links
 * Usage: Add this hook to any page component that can be navigated to from quick links
 */
export const useScrollToTop = () => {
    useEffect(() => {
        // Check if we should scroll to top after navigation from quick links
        const shouldScrollToTop = sessionStorage.getItem('scrollToTop');
        
        if (shouldScrollToTop === 'true') {
            // Clear the flag first to prevent repeated scrolling
            sessionStorage.removeItem('scrollToTop');
            
            // Smooth scroll to top after a brief delay to ensure page is fully rendered
            const scrollTimer = setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 150); // Small delay for better UX
            
            // Cleanup timer if component unmounts
            return () => clearTimeout(scrollTimer);
        }
    }, []); // Run only once on component mount
};

export default useScrollToTop;
