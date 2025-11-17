import React, { useState } from 'react';

const TrainingSection = ({ formData, setFormData, loading }) => {
    const [activeTrainingTab, setActiveTrainingTab] = useState('attended');
    const [showAddForm, setShowAddForm] = useState(false);
    const [addFormType, setAddFormType] = useState('attended');
    const [newTraining, setNewTraining] = useState({
        month: '',
        year: new Date().getFullYear(),
        training_information: ''
    });

    const handleTrainingChange = (type, index, field, value) => {
        const fieldName = type === 'attended' ? 'training_attended' : 'training_conducted';
        const updated = [...(formData[fieldName] || [])];
        updated[index] = { ...updated[index], [field]: value };
        setFormData(prev => ({ ...prev, [fieldName]: updated }));
    };

    const openAddForm = (type) => {
        setNewTraining({
            month: '',
            year: new Date().getFullYear(),
            training_information: ''
        });
        setAddFormType(type);
        setShowAddForm(true);
    };

    const cancelAdd = () => {
        setShowAddForm(false);
        setNewTraining({
            month: '',
            year: new Date().getFullYear(),
            training_information: ''
        });
    };

    const addToList = () => {
        if (!newTraining.training_information.trim()) {
            alert('Please enter training information');
            return;
        }
        
        const fieldName = addFormType === 'attended' ? 'training_attended' : 'training_conducted';
        const currentTrainings = Array.isArray(formData[fieldName]) ? formData[fieldName] : [];
        setFormData(prev => ({
            ...prev,
            [fieldName]: [
                { ...newTraining, display_order: 1 },
                ...currentTrainings
            ]
        }));
        setShowAddForm(false);
        setNewTraining({
            month: '',
            year: new Date().getFullYear(),
            training_information: ''
        });
    };

    const removeTraining = (type, index) => {
        const fieldName = type === 'attended' ? 'training_attended' : 'training_conducted';
        const updated = (formData[fieldName] || []).filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, [fieldName]: updated }));
    };

    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    const renderTrainingList = (type) => {
        const fieldName = type === 'attended' ? 'training_attended' : 'training_conducted';
        const trainings = formData[fieldName] || [];
        const title = type === 'attended' ? 'Training Attended' : 'Training Conducted';
        const isCurrentType = addFormType === type;

        return (
            <>
                <button 
                    type="button" 
                    onClick={() => openAddForm(type)} 
                    className="add-item-button"
                    disabled={loading}
                >
                    <i className="fas fa-plus"></i> Add {title}
                </button>

                {/* Add New Training Form */}
                {showAddForm && isCurrentType && (
                    <div className="array-item-card" style={{ border: '2px solid var(--primary-color)', backgroundColor: '#f0f8ff' }}>
                        <div className="array-item-header">
                            <h4>Add New {title}</h4>
                            <button 
                                type="button"
                                onClick={cancelAdd}
                                className="remove-item-button"
                                disabled={loading}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="faculty-edit-form-row">
                            <div className="faculty-edit-form-group">
                                <label>Month</label>
                                <select
                                    value={newTraining.month}
                                    onChange={(e) => setNewTraining({...newTraining, month: e.target.value})}
                                    disabled={loading}
                                    className="faculty-edit-form-input"
                                >
                                    <option value="">Select Month</option>
                                    {months.map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="faculty-edit-form-group">
                                <label>Year</label>
                                <input
                                    type="number"
                                    value={newTraining.year}
                                    onChange={(e) => setNewTraining({...newTraining, year: parseInt(e.target.value)})}
                                    disabled={loading}
                                    className="faculty-edit-form-input"
                                    min="1900"
                                    max={new Date().getFullYear() + 1}
                                />
                            </div>
                        </div>

                        <div className="faculty-edit-form-group">
                            <label>Training Information *</label>
                            <textarea
                                value={newTraining.training_information}
                                onChange={(e) => setNewTraining({...newTraining, training_information: e.target.value})}
                                disabled={loading}
                                className="faculty-edit-form-input"
                                placeholder="Enter training details"
                                rows="3"
                                required
                            />
                        </div>

                        <button 
                            type="button"
                            onClick={addToList}
                            className="add-item-button"
                            disabled={loading}
                            style={{ marginTop: '10px' }}
                        >
                            <i className="fas fa-check"></i> Add to List
                        </button>
                    </div>
                )}

                {trainings.length > 0 ? (
                    <div className="array-items-container">
                        {trainings.map((training, index) => (
                            <div key={index} className="array-item-card">
                                <div className="array-item-header">
                                    <h4>{title} {index + 1}</h4>
                                    <button 
                                        type="button"
                                        onClick={() => removeTraining(type, index)}
                                        className="remove-item-button"
                                        disabled={loading}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>

                                <div className="faculty-edit-form-row">
                                    <div className="faculty-edit-form-group">
                                        <label>Month</label>
                                        <select
                                            value={training.month || ''}
                                            onChange={(e) => handleTrainingChange(type, index, 'month', e.target.value)}
                                            disabled={loading}
                                            className="faculty-edit-form-input"
                                        >
                                            <option value="">Select Month</option>
                                            {months.map(m => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="faculty-edit-form-group">
                                        <label>Year</label>
                                        <input
                                            type="number"
                                            value={training.year || ''}
                                            onChange={(e) => handleTrainingChange(type, index, 'year', e.target.value)}
                                            disabled={loading}
                                            className="faculty-edit-form-input"
                                            placeholder="YYYY"
                                            min="1900"
                                            max={new Date().getFullYear() + 1}
                                        />
                                    </div>
                                </div>

                                <div className="faculty-edit-form-group">
                                    <label>Training Information *</label>
                                    <textarea
                                        value={training.training_information || ''}
                                        onChange={(e) => handleTrainingChange(type, index, 'training_information', e.target.value)}
                                        disabled={loading}
                                        className="faculty-edit-form-input"
                                        placeholder="Enter training/workshop details"
                                        rows="3"
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <i className="fas fa-chalkboard"></i>
                        <p>No {title.toLowerCase()} added yet</p>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="faculty-edit-components-form-section">
            <h3 className="faculty-edit-section-title">Training & Workshops</h3>
            
            <div className="training-tabs">
                <button
                    type="button"
                    className={`training-tab ${activeTrainingTab === 'attended' ? 'active' : ''}`}
                    onClick={() => setActiveTrainingTab('attended')}
                >
                    Training Attended
                </button>
                <button
                    type="button"
                    className={`training-tab ${activeTrainingTab === 'conducted' ? 'active' : ''}`}
                    onClick={() => setActiveTrainingTab('conducted')}
                >
                    Training Conducted
                </button>
            </div>

            <div className="training-content">
                {activeTrainingTab === 'attended' && renderTrainingList('attended')}
                {activeTrainingTab === 'conducted' && renderTrainingList('conducted')}
            </div>
        </div>
    );
};

export default TrainingSection;
