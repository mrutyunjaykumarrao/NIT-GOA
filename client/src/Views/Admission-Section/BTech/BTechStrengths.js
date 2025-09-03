import React from 'react';
import './BTechStrengths.css';
import strengthsData from './BTechStrengths.json';

const BTechStrengths = () => {
    return (
        <div className="btech-strengths">
            <div className="btech-strengths-container">
                {/* Hero Section */}
                <div className="btech-strengths-hero">
                    <div className="btech-strengths-hero-content">
                        <h1>{strengthsData.title}</h1>
                        <p className="btech-strengths-hero-subtitle">{strengthsData.subtitle}</p>
                    </div>
                </div>

                <div className="btech-strengths-content-section">
                    <div className="btech-strengths-main-content">
                        {strengthsData.content.map((item, index) => (
                            item.type === 'list' ? (
                                <ul key={index}>
                                    {item.items.map((listItem, listIndex) => (
                                        <li key={listIndex}>{listItem}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p key={index}>
                                    {item.paragraph}
                                </p>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BTechStrengths;