import React from 'react';
import { SocialIcons, getIconNameFromUrl } from './SocialIcons';
import './SocialLinks.css';

const SocialLinks = ({ socialLinks, showLabels = false, size = 24, className = "" }) => {
  if (!socialLinks || Object.keys(socialLinks).length === 0) {
    return null;
  }

  const renderSocialLink = (key, url) => {
    if (!url) return null;
    
    const iconName = getIconNameFromUrl(url);
    const icon = SocialIcons[iconName];
    
    if (!icon) return null;

    // Format the display name
    const formatLabel = (key) => {
      const labelMap = {
        linkedin: 'LinkedIn',
        twitter: 'Twitter',
        youtube: 'YouTube',
        facebook: 'Facebook',
        instagram: 'Instagram',
        github: 'GitHub',
        googleScholar: 'Google Scholar',
        orcid: 'ORCID',
        researchGate: 'ResearchGate',
        scopus: 'Scopus',
        ieee: 'IEEE',
        website: 'Personal Website',
        academia: 'Academia.edu',
        mendeley: 'Mendeley',
        publons: 'Publons/Web of Science'
      };
      return labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
    };

    return (
      <a
        key={key}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`social-link ${className}`}
        title={formatLabel(iconName)}
        aria-label={`Visit ${formatLabel(iconName)}`}
      >
        <div className="social-icon-wrapper">
          {React.cloneElement(icon, {
            width: size,
            height: size,
            className: `social-icon ${iconName}-icon`
          })}
          {showLabels && (
            <span className="social-label">{formatLabel(iconName)}</span>
          )}
        </div>
      </a>
    );
  };

  return (
    <div className={`social-links-container ${className}`}>
      {Object.entries(socialLinks).map(([key, url]) => renderSocialLink(key, url))}
    </div>
  );
};

export default SocialLinks;
