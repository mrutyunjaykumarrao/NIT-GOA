import React, { useState, useEffect } from 'react';

const CoursesTaughtSection = ({ formData, setFormData, loading, employeeCode }) => {
    const [facultyCourses, setFacultyCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState('');

    useEffect(() => {
        if (employeeCode) {
            fetchFacultyCourses();
        }
    }, [employeeCode]);

    useEffect(() => {
        if (searchTerm.length >= 1) {
            searchCourses();
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, selectedLevel]);

    const fetchFacultyCourses = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`/api/faculty-data/faculty-courses/${employeeCode}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setFacultyCourses(data.courses);
            }
        } catch (error) {
            console.error('Error fetching faculty courses:', error);
        }
    };

    const searchCourses = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (selectedLevel) params.append('level', selectedLevel);

            const response = await fetch(`/api/faculty-data/courses?${params}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setSearchResults(data.courses);
            }
        } catch (error) {
            console.error('Error searching courses:', error);
        }
    };

    const handleSelectCourse = (course) => {
        setSelectedCourse(course);
        setSearchTerm(`${course.course_code} - ${course.course_name}`);
        setSearchResults([]);
    };

    const handleAddCourse = async () => {
        if (!selectedCourse) {
            alert('Please select a course');
            return;
        }

        // Check if course is already added
        const isAlreadyAdded = facultyCourses.some(fc => 
            fc.course_id === selectedCourse.course_id
        );

        if (isAlreadyAdded) {
            alert('This course is already in your list');
            return;
        }

        const courseData = {
            course_id: selectedCourse.course_id
        };

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`/api/faculty-data/faculty-courses/${employeeCode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(courseData)
            });

            const data = await response.json();
            if (data.success) {
                setFacultyCourses(prev => [...prev, data.course]);
                // Reset form
                setSelectedCourse(null);
                setSearchTerm('');
                setSearchResults([]);
                setSelectedLevel('');
                setShowAddForm(false);
            } else {
                alert(data.error || 'Failed to add course');
            }
        } catch (error) {
            console.error('Error adding course:', error);
            alert('Failed to add course');
        }
    };

    const handleRemoveCourse = async (courseId) => {
        if (window.confirm('Are you sure you want to remove this course?')) {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`/api/faculty-data/faculty-courses/${employeeCode}/${courseId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const data = await response.json();
                if (data.success) {
                    setFacultyCourses(prev => prev.filter(course => course.course_taught_id !== courseId));
                } else {
                    alert(data.error || 'Failed to remove course');
                }
            } catch (error) {
                console.error('Error removing course:', error);
                alert('Failed to remove course');
            }
        }
    };

    return (
        <div className="faculty-edit-components-form-section">
            <h3 className="faculty-edit-section-title">Courses Taught</h3>

            {/* Add Course Buttons */}
            <div className="section-header">
                <button
                    type="button"
                    onClick={() => {setShowAddForm(true); setSelectedLevel('UG');}}
                    className="btn btn-primary"
                    disabled={loading}
                >
                    + Add UG Course
                </button>
                <button
                    type="button"
                    onClick={() => {setShowAddForm(true); setSelectedLevel('PG');}}
                    className="btn btn-secondary"
                    disabled={loading}
                >
                    + Add PG Course
                </button>
            </div>

            {/* Add Course Form */}
            {showAddForm && (
                <div className="add-course-form">
                    <h4>Add New {selectedLevel} Course</h4>
                    
                    {/* Course Search */}
                    <div className="faculty-edit-form-group">
                        <label>Search Courses</label>
                        <input
                            type="text"
                            placeholder="Enter course code or name to search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="faculty-edit-form-input"
                        />
                    </div>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <div className="search-results">
                            <h5>Search Results:</h5>
                            <div className="courses-list">
                                {searchResults.slice(0, 10).map(course => (
                                    <div 
                                        key={course.course_id}
                                        className={`course-item ${selectedCourse?.course_id === course.course_id ? 'selected' : ''}`}
                                        onClick={() => handleSelectCourse(course)}
                                    >
                                        <div className="course-code">{course.course_code}</div>
                                        <div className="course-name">{course.course_name}</div>
                                        <div className="course-meta">
                                            <span className="course-level">{course.academic_level}</span>
                                            <span className="course-credits">{course.credit_hours} Credits</span>
                                            {course.department_name && (
                                                <span className="course-dept">{course.department_name}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Selected Course */}
                    {selectedCourse && (
                        <div className="selected-course">
                            <h5>Selected Course:</h5>
                            <div className="course-details">
                                <strong>{selectedCourse.course_code}</strong> - {selectedCourse.course_name}
                                <br />
                                <small>{selectedCourse.academic_level} • {selectedCourse.credit_hours} Credits</small>
                            </div>
                        </div>
                    )}

                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={handleAddCourse} 
                            className="btn btn-primary"
                            disabled={!selectedCourse}
                        >
                            Add Course
                        </button>
                        <button 
                            type="button" 
                            onClick={() => {
                                setShowAddForm(false);
                                setSelectedLevel('');
                                setSearchTerm('');
                                setSelectedCourse(null);
                                setSearchResults([]);
                            }} 
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* UG Courses */}
            <div className="current-courses">
                <h4>Undergraduate Courses ({facultyCourses.filter(c => c.academic_level === 'UG').length})</h4>
                
                {facultyCourses.filter(c => c.academic_level === 'UG').length > 0 ? (
                    <div className="courses-table">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Course Code</th>
                                    <th>Course Name</th>
                                    <th>Credits</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {facultyCourses.filter(c => c.academic_level === 'UG').map(course => (
                                    <tr key={course.course_taught_id}>
                                        <td>{course.course_code}</td>
                                        <td>{course.course_name}</td>
                                        <td>{course.credit_hours}</td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveCourse(course.course_taught_id)}
                                                className="btn btn-sm btn-danger"
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
                ) : (
                    <div className="empty-state">
                        <p>No UG courses added yet. Click "Add UG Course" to get started.</p>
                    </div>
                )}
            </div>

            {/* PG Courses */}
            <div className="current-courses">
                <h4>Postgraduate Courses ({facultyCourses.filter(c => c.academic_level === 'PG').length})</h4>
                
                {facultyCourses.filter(c => c.academic_level === 'PG').length > 0 ? (
                    <div className="courses-table">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Course Code</th>
                                    <th>Course Name</th>
                                    <th>Credits</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {facultyCourses.filter(c => c.academic_level === 'PG').map(course => (
                                    <tr key={course.course_taught_id}>
                                        <td>{course.course_code}</td>
                                        <td>{course.course_name}</td>
                                        <td>{course.credit_hours}</td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveCourse(course.course_taught_id)}
                                                className="btn btn-sm btn-danger"
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
                ) : (
                    <div className="empty-state">
                        <p>No PG courses added yet. Click "Add PG Course" to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoursesTaughtSection;