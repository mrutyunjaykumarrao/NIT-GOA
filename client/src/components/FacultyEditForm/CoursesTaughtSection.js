import React, { useState, useEffect } from 'react';

const CoursesTaughtSection = ({ formData, setFormData, loading, employeeCode }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCourse, setNewCourse] = useState({
        custom_course_name: '',
        custom_course_code: '',
        custom_credits: '',
        custom_course_level: 'Undergraduate',
        custom_semester: ''
    });

    const openAddForm = () => {
        setNewCourse({
            custom_course_name: '',
            custom_course_code: '',
            custom_credits: '',
            custom_course_level: 'Undergraduate',
            custom_semester: ''
        });
        setShowAddForm(true);
    };

    const cancelAdd = () => {
        setShowAddForm(false);
        setNewCourse({
            custom_course_name: '',
            custom_course_code: '',
            custom_credits: '',
            custom_course_level: 'Undergraduate',
            custom_semester: ''
        });
    };

    const addToList = () => {
        // Validate required fields
        if (!newCourse.custom_course_name || !newCourse.custom_course_level) {
            alert('Please fill in at least the course name and level');
            return;
        }

        const current = Array.isArray(formData.courses_taught) ? formData.courses_taught : [];
        
        // Create new course object
        const courseToAdd = {
            course_name: newCourse.custom_course_name,
            course_code: newCourse.custom_course_code || null,
            credits: newCourse.custom_credits ? parseInt(newCourse.custom_credits) : null,
            course_level: newCourse.custom_course_level,
            semester: newCourse.custom_semester || null,
            display_order: 1
        };

        setFormData(prev => ({
            ...prev,
            courses_taught: [courseToAdd, ...current]
        }));

        setShowAddForm(false);
        setNewCourse({
            custom_course_name: '',
            custom_course_code: '',
            custom_credits: '',
            custom_course_level: 'Undergraduate',
            custom_semester: ''
        });
    };

    const handleRemoveCourse = (index) => {
        if (window.confirm('Are you sure you want to remove this course?')) {
            const current = Array.isArray(formData.courses_taught) ? formData.courses_taught : [];
            setFormData(prev => ({
                ...prev,
                courses_taught: current.filter((_, i) => i !== index)
            }));
        }
    };

    return (
        <div className="faculty-edit-components-form-section">
            <h3 className="faculty-edit-section-title">Courses Taught</h3>

            {/* Add Course Button */}
            {!showAddForm && (
                <div className="section-header">
                    <button
                        type="button"
                        onClick={openAddForm}
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        + Add Course
                    </button>
                </div>
            )}

            {/* Add Course Form */}
            {showAddForm && (
                <div className="add-form-container">
                    <div className="add-form-header">
                        <h4>Add New Course</h4>
                        <button type="button" onClick={cancelAdd} className="close-form-btn">✕</button>
                    </div>
                    <div className="add-form-body">
                        <div className="form-row">
                            <div className="form-group" style={{ flex: 2 }}>
                                <label>Course Name <span className="required">*</span></label>
                                <input
                                    type="text"
                                    value={newCourse.custom_course_name}
                                    onChange={(e) => setNewCourse(prev => ({...prev, custom_course_name: e.target.value}))}
                                    className="faculty-edit-form-input"
                                    placeholder="e.g., Advanced Machine Learning"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Course Code</label>
                                <input
                                    type="text"
                                    value={newCourse.custom_course_code}
                                    onChange={(e) => setNewCourse(prev => ({...prev, custom_course_code: e.target.value}))}
                                    className="faculty-edit-form-input"
                                    placeholder="e.g., CS999"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Credits</label>
                                <input
                                    type="number"
                                    value={newCourse.custom_credits}
                                    onChange={(e) => setNewCourse(prev => ({...prev, custom_credits: e.target.value}))}
                                    className="faculty-edit-form-input"
                                    min="1" max="10"
                                    placeholder="3"
                                />
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Course Level <span className="required">*</span></label>
                                <select
                                    value={newCourse.custom_course_level}
                                    onChange={(e) => setNewCourse(prev => ({...prev, custom_course_level: e.target.value}))}
                                    className="faculty-edit-form-input"
                                >
                                    <option value="Undergraduate">Undergraduate</option>
                                    <option value="Postgraduate">Postgraduate</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Semester</label>
                                <input
                                    type="text"
                                    value={newCourse.custom_semester}
                                    onChange={(e) => setNewCourse(prev => ({...prev, custom_semester: e.target.value}))}
                                    className="faculty-edit-form-input"
                                    placeholder="e.g., I, III, V"
                                />
                            </div>
                        </div>
                        
                        <div className="form-actions">
                            <button 
                                type="button" 
                                onClick={addToList}
                                className="btn btn-success"
                                disabled={loading}
                            >
                                Add to List
                            </button>
                            <button 
                                type="button" 
                                onClick={cancelAdd}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Display Courses */}
            {formData.courses_taught && formData.courses_taught.length === 0 && !showAddForm ? (
                <div className="empty-state">
                    <div className="empty-state-content">
                        <div className="empty-state-icon">📚</div>
                        <h4>No courses added yet</h4>
                        <p>Start by adding courses that you teach to showcase your academic responsibilities.</p>
                    </div>
                </div>
            ) : formData.courses_taught && formData.courses_taught.length > 0 ? (
                <div className="data-list">
                    {/* Undergraduate Courses */}
                    {formData.courses_taught.filter(course => course.course_level === 'Undergraduate').length > 0 && (
                        <div className="course-section">
                            <h4>Undergraduate Courses ({formData.courses_taught.filter(course => course.course_level === 'Undergraduate').length})</h4>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Course Code</th>
                                        <th>Course Name</th>
                                        <th>Credits</th>
                                        <th>Semester</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.courses_taught
                                        .map((course, originalIndex) => ({ course, originalIndex }))
                                        .filter(({ course }) => course.course_level === 'Undergraduate')
                                        .map(({ course, originalIndex }) => (
                                        <tr key={originalIndex}>
                                            <td>{course.course_code || 'N/A'}</td>
                                            <td>{course.course_name}</td>
                                            <td>{course.credits || 'N/A'}</td>
                                            <td>{course.semester || 'N/A'}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveCourse(originalIndex)}
                                                    className="btn btn-danger btn-sm"
                                                    disabled={loading}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Postgraduate Courses */}
                    {formData.courses_taught.filter(course => course.course_level === 'Postgraduate').length > 0 && (
                        <div className="course-section">
                            <h4>Postgraduate Courses ({formData.courses_taught.filter(course => course.course_level === 'Postgraduate').length})</h4>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Course Code</th>
                                        <th>Course Name</th>
                                        <th>Credits</th>
                                        <th>Semester</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.courses_taught
                                        .map((course, originalIndex) => ({ course, originalIndex }))
                                        .filter(({ course }) => course.course_level === 'Postgraduate')
                                        .map(({ course, originalIndex }) => (
                                        <tr key={originalIndex}>
                                            <td>{course.course_code || 'N/A'}</td>
                                            <td>{course.course_name}</td>
                                            <td>{course.credits || 'N/A'}</td>
                                            <td>{course.semester || 'N/A'}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveCourse(originalIndex)}
                                                    className="btn btn-danger btn-sm"
                                                    disabled={loading}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
};

export default CoursesTaughtSection;