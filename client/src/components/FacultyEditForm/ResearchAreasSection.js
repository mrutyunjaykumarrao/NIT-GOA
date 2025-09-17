import React, { useState, useEffect } from 'react';
import researchAreasData from './research_area.json';

const ResearchAreasSection = ({ formData, setFormData, loading }) => {
    const [availableAreas, setAvailableAreas] = useState(researchAreasData);
    const [selectedAreas, setSelectedAreas] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newAreaName, setNewAreaName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Initialize selected areas from formData
        if (formData.research_interests) {
            try {
                const interests = typeof formData.research_interests === 'string' 
                    ? formData.research_interests.split(',').map(s => s.trim())
                    : formData.research_interests;
                setSelectedAreas(interests.filter(area => area));
            } catch (error) {
                console.error('Error parsing research interests:', error);
            }
        }
    }, [formData.research_interests]);

    const handleAddNewArea = () => {
        if (!newAreaName.trim()) {
            alert('Please enter an area name');
            return;
        }

        const trimmedAreaName = newAreaName.trim();
        
        // Check if area already exists
        if (availableAreas.includes(trimmedAreaName)) {
            alert('This research area already exists');
            return;
        }

        // Add to available areas
        setAvailableAreas(prev => [...prev, trimmedAreaName].sort());
        
        // Automatically select the new area
        handleAreaToggle(trimmedAreaName);
        
        // Reset form
        setNewAreaName('');
        setShowAddForm(false);
    };

    const handleAreaToggle = (areaName) => {
        setSelectedAreas(prev => {
            const isSelected = prev.includes(areaName);
            const newSelected = isSelected 
                ? prev.filter(area => area !== areaName)
                : [...prev, areaName];
            
            // Update form data
            setFormData(prevData => ({
                ...prevData,
                research_interests: newSelected.join(', ')
            }));
            
            return newSelected;
        });
    };

    const handleCustomAreaAdd = (customArea) => {
        if (customArea.trim() && !selectedAreas.includes(customArea.trim())) {
            handleAreaToggle(customArea.trim());
        }
    };

    const filteredAreas = availableAreas.filter(area =>
        area.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="form-section">
            <h3 className="section-title">Research Areas</h3>

            {/* Search and Add New Button */}
            <div className="research-areas-header">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search research areas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input search-input"
                        disabled={loading}
                    />
                </div>
                <button
                    type="button"
                    onClick={() => setShowAddForm(true)}
                    className="btn btn-secondary"
                    disabled={loading}
                >
                    + Add New Area
                </button>
            </div>

            {/* Add New Area Form */}
            {showAddForm && (
                <div className="add-area-form">
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Enter new research area name"
                            value={newAreaName}
                            onChange={(e) => setNewAreaName(e.target.value)}
                            className="form-input"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddNewArea()}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={handleAddNewArea} className="btn btn-primary">
                            Add Area
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setShowAddForm(false)} 
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Selected Areas Display */}
            {selectedAreas.length > 0 && (
                <div className="selected-areas">
                    <h4>Selected Research Areas:</h4>
                    <div className="tag-container">
                        {selectedAreas.map((area, index) => (
                            <span key={index} className="research-tag selected">
                                {area}
                                <button
                                    type="button"
                                    onClick={() => handleAreaToggle(area)}
                                    className="tag-remove"
                                    disabled={loading}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Available Areas Grid */}
            <div className="available-areas">
                <h4>Available Research Areas:</h4>
                <div className="areas-grid">
                    {filteredAreas.slice(0, 12).map(area => (
                        <div 
                            key={area}
                            className={`area-item ${selectedAreas.includes(area) ? 'selected' : ''}`}
                            onClick={() => !loading && handleAreaToggle(area)}
                        >
                            <div className="area-name">{area}</div>
                            <div className="area-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedAreas.includes(area)}
                                    onChange={() => handleAreaToggle(area)}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                
                {filteredAreas.length === 0 && (
                    <div className="no-results">
                        No research areas found matching your search.
                    </div>
                )}

                {filteredAreas.length > 12 && (
                    <div className="search-hint">
                        Showing 12 of {filteredAreas.length} areas. Use search to find more specific areas.
                    </div>
                )}
            </div>

            {/* Custom Area Input */}
            <div className="custom-area-section">
                <h4>Add Custom Research Area:</h4>
                <div className="custom-area-input">
                    <input
                        type="text"
                        placeholder="Type a custom research area and press Enter"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleCustomAreaAdd(e.target.value);
                                e.target.value = '';
                            }
                        }}
                        disabled={loading}
                        className="form-input"
                    />
                    <small className="form-hint">
                        Press Enter to add a custom research area
                    </small>
                </div>
            </div>

            {/* Research Interests Text Area (backup) */}
            <div className="form-group">
                <label htmlFor="research_interests_text">Research Interests (Text Format)</label>
                <textarea
                    id="research_interests_text"
                    value={formData.research_interests || ''}
                    onChange={(e) => {
                        setFormData(prev => ({ ...prev, research_interests: e.target.value }));
                        setSelectedAreas(e.target.value.split(',').map(s => s.trim()).filter(s => s));
                    }}
                    disabled={loading}
                    className="form-input form-textarea"
                    rows="3"
                    placeholder="Enter research interests separated by commas"
                />
                <small className="form-hint">
                    You can also directly type your research interests here, separated by commas
                </small>
            </div>
        </div>
    );
};

export default ResearchAreasSection;