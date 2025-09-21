import React, { useState, useEffect, useCallback } from 'react';

const CoursesTaughtSection = ({ formData, setFormData, loading, employeeCode }) => {
    const [facultyCourses, setFacultyCourses] = useState([]);
    const [tempCourseOrder, setTempCourseOrder] = useState([]);
    const [hasOrderChanges, setHasOrderChanges] = useState(false);
    const [renderKey, setRenderKey] = useState(0); // Force re-render counter
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showQuickAddForm, setShowQuickAddForm] = useState(false);
    const [quickAddData, setQuickAddData] = useState({
        custom_course_name: '',
        custom_course_code: '',
        custom_credits: '',
        custom_course_level: 'Undergraduate',
        custom_semester: ''
    });
    const [filters, setFilters] = useState({
        level: '',
        semester: '',
        department: ''
    });
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (employeeCode) {
            fetchFacultyCourses();
        }
    }, [employeeCode]);

    useEffect(() => {
        if (searchTerm.length >= 2) {
            searchCourses();
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, filters]);

    const fetchFacultyCourses = async () => {
        if (!employeeCode) {
            return;
        }
        
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`/api/faculty-data/faculty-courses/${employeeCode}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const data = await response.json();
            if (data.success) {
                console.log('=== DEBUGGING COURSE FETCH ===');
                console.log('Fetched courses from API:', data.courses.length);
                
                // Log each course with detailed info
                data.courses.forEach((course, index) => {
                    console.log(`Course ${index + 1}:`, {
                        id: course.id,
                        course_id: course.course_id,
                        course_code: course.course_code,
                        course_name: course.course_name,
                        course_level: course.course_level,
                        display_order: course.display_order,
                        is_custom: course.is_custom
                    });
                });
                
                // Check for duplicates
                const courseNames = data.courses.map(c => c.course_name);
                const duplicateNames = courseNames.filter((name, index) => courseNames.indexOf(name) !== index);
                if (duplicateNames.length > 0) {
                    console.log('⚠️ DUPLICATE COURSE NAMES FOUND:', duplicateNames);
                }
                
                // Ensure all courses have display_order values
                const coursesWithOrder = data.courses.map((course, index) => ({
                    ...course,
                    display_order: course.display_order || (index + 1)
                }));
                
                console.log('Setting faculty courses:', coursesWithOrder.length);
                console.log('Undergraduate courses:', coursesWithOrder.filter(c => c.course_level === 'Undergraduate').length);
                console.log('Postgraduate courses:', coursesWithOrder.filter(c => c.course_level === 'Postgraduate').length);
                
                setFacultyCourses(coursesWithOrder);
                setTempCourseOrder(coursesWithOrder);
                setHasOrderChanges(false);
            } else {
                console.error('API returned error:', data);
            }
        } catch (error) {
            console.error('Error fetching faculty courses:', error);
        }
    };

    const searchCourses = async () => {
        setIsSearching(true);
        try {
            const token = localStorage.getItem('authToken');
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (filters.level) params.append('level', filters.level);

            const response = await fetch(`/api/faculty-data/courses?${params}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const data = await response.json();
            if (data.success && data.courses) {
                // Filter by semester and department on frontend if needed
                let filteredCourses = data.courses;
                
                if (filters.semester) {
                    filteredCourses = filteredCourses.filter(course => 
                        course.semester && course.semester.toString() === filters.semester
                    );
                }
                
                if (filters.department) {
                    filteredCourses = filteredCourses.filter(course => 
                        course.department_name && course.department_name.toLowerCase().includes(filters.department.toLowerCase())
                    );
                }
                
                setSearchResults(filteredCourses); // Show all results, no limit
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error searching courses:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectCourse = (course) => {
        setSelectedCourse(course);
        // Don't modify search term to avoid triggering a new search
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
                setTempCourseOrder(prev => [...prev, data.course]);
                // Reset form
                setSelectedCourse(null);
                setSearchTerm('');
                setSearchResults([]);
                setShowAddForm(false);
                setFilters({ level: '', semester: '', department: '' });
            } else {
                alert(data.error || 'Failed to add course');
            }
        } catch (error) {
            console.error('Error adding course:', error);
            alert('Failed to add course');
        }
    };

    const handleRemoveCourse = async (courseId, isCustom = false) => {
        if (window.confirm('Are you sure you want to remove this course?')) {
            try {
                const token = localStorage.getItem('authToken');
                const deleteId = isCustom ? `custom_${courseId}` : courseId;
                
                const response = await fetch(`/api/faculty-data/faculty-courses/${employeeCode}/${deleteId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const data = await response.json();
                if (data.success) {
                    setFacultyCourses(prev => prev.filter(course => {
                        if (isCustom) {
                            return course.course_code !== courseId;
                        } else {
                            return course.course_id !== courseId;
                        }
                    }));
                    setTempCourseOrder(prev => prev.filter(course => {
                        if (isCustom) {
                            return course.course_code !== courseId;
                        } else {
                            return course.course_id !== courseId;
                        }
                    }));
                } else {
                    alert(data.error || 'Failed to remove course');
                }
            } catch (error) {
                console.error('Error removing course:', error);
                alert('Failed to remove course');
            }
        }
    };

    const handleQuickAddCourse = async () => {
        if (!quickAddData.custom_course_name || !quickAddData.custom_course_level) {
            alert('Please fill in at least the course name and level');
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            
            // Prepare data and ensure credits is a number
            const courseData = {
                ...quickAddData,
                custom_credits: quickAddData.custom_credits ? parseInt(quickAddData.custom_credits) : null
            };
            
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
                setTempCourseOrder(prev => [...prev, data.course]);
                // Reset form
                setQuickAddData({
                    custom_course_name: '',
                    custom_course_code: '',
                    custom_credits: '',
                    custom_course_level: 'Undergraduate',
                    custom_semester: ''
                });
                setShowQuickAddForm(false);
            } else {
                alert(data.error || 'Failed to add custom course');
            }
        } catch (error) {
            console.error('Error adding custom course:', error);
            alert('Failed to add custom course');
        }
    };

    const handleReorderCourse = (courseIndex, direction, courseLevel) => {
        console.log('=== SIMPLE REORDER START ===');
        console.log('Input:', { courseIndex, direction, courseLevel });
        
        // Create a working copy of the current array
        const workingArray = [...tempCourseOrder];
        
        // Find all courses of the target level
        const levelCourses = [];
        const otherCourses = [];
        
        workingArray.forEach(course => {
            if (course.course_level === courseLevel) {
                levelCourses.push(course);
            } else {
                otherCourses.push(course);
            }
        });
        
        // Sort level courses by display_order to match what's shown in the table
        levelCourses.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        
        console.log('Level courses before swap:', levelCourses.map(c => c.course_name));
        
        // Check boundaries
        if (direction === 'up' && courseIndex === 0) {
            console.log('Cannot move up - at top');
            return;
        }
        if (direction === 'down' && courseIndex >= levelCourses.length - 1) {
            console.log('Cannot move down - at bottom');
            return;
        }
        
        // Get the two courses to swap
        const course1 = levelCourses[courseIndex];
        const course2Index = direction === 'up' ? courseIndex - 1 : courseIndex + 1;
        const course2 = levelCourses[course2Index];
        
        console.log(`Swapping "${course1.course_name}" with "${course2.course_name}"`);
        
        // Simple array swap - just swap their positions in the levelCourses array
        levelCourses[courseIndex] = course2;
        levelCourses[course2Index] = course1;
        
        // Assign new sequential display_order values
        levelCourses.forEach((course, index) => {
            course.display_order = index + 1;
        });
        
        console.log('Level courses after swap:', levelCourses.map(c => c.course_name));
        
        // Rebuild the complete array
        const newTempOrder = [...otherCourses, ...levelCourses];
        
        console.log('Setting new state...');
        setTempCourseOrder(newTempOrder);
        setHasOrderChanges(true);
        setRenderKey(prev => prev + 1);
        console.log('=== SIMPLE REORDER END ===');
    };

    const handleSaveOrder = async () => {
        try {
            const token = localStorage.getItem('authToken');
            
            console.log('=== SAVE ORDER DEBUG ===');
            console.log('Saving order for', tempCourseOrder.length, 'courses');
            console.log('Current tempCourseOrder:', tempCourseOrder.map(c => ({ 
                id: c.id, 
                name: c.course_name, 
                display_order: c.display_order, 
                is_custom: c.is_custom,
                course_level: c.course_level
            })));
            
            // Send the new order to backend - send ALL courses with their new display orders
            const undergraduateCourses = tempCourseOrder
                .filter(course => course.course_level === 'Undergraduate')
                .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                .map((course, index) => ({
                    id: course.id,
                    isCustom: course.is_custom,
                    displayOrder: index + 1 // Sequential order starting from 1
                }));
                
            const postgraduateCourses = tempCourseOrder
                .filter(course => course.course_level === 'Postgraduate')
                .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                .map((course, index) => ({
                    id: course.id,
                    isCustom: course.is_custom,
                    displayOrder: index + 1 // Sequential order starting from 1
                }));
            
            const orderData = [...undergraduateCourses, ...postgraduateCourses];
            
            console.log('Undergraduate courses for save:', undergraduateCourses);
            console.log('Postgraduate courses for save:', postgraduateCourses);
            console.log('Final order data being sent:', orderData);
            
            if (orderData.length === 0) {
                console.log('No courses to save!');
                return;
            }
            
            const saveUrl = `/api/faculty-data/faculty-courses/${employeeCode}/save-order`;
            console.log('Saving to URL:', saveUrl);
            
            const response = await fetch(saveUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ courseOrder: orderData })
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Save response:', data);
            
            if (data.success) {
                console.log('Save successful, refreshing data...');
                setFacultyCourses(tempCourseOrder);
                setHasOrderChanges(false);
                alert('Course order saved successfully!');
                // Refresh the data to confirm it was saved
                await fetchFacultyCourses();
                console.log('Data refreshed after save');
            } else {
                console.error('Save failed:', data);
                alert(data.error || 'Failed to save course order');
            }
        } catch (error) {
            console.error('Error saving course order:', error);
            alert('Failed to save course order');
        }
    };

    return (
        <div className="faculty-edit-components-form-section">
            <h3 className="faculty-edit-section-title">Courses Taught</h3>

            {/* Empty State or Add Course Button */}
            {!showAddForm && !showQuickAddForm && (
                <div className="section-header">
                    <button
                        type="button"
                        onClick={() => setShowAddForm(true)}
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        + Add Course
                    </button>
                </div>
            )}

            {/* Add Course Form */}
            {showAddForm && (
                <div className="add-course-form">
                    <h4>Add New Course</h4>
                    
                    {/* Single Row Layout: Search, Filters, and Buttons */}
                    <div className="course-search-row">
                        <div className="search-input-container">
                            <input
                                type="text"
                                placeholder="Enter course code or name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="faculty-edit-form-input"
                            />
                        </div>
                        
                        <div className="level-filter-container">
                            <select
                                value={filters.level}
                                onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
                                className="faculty-edit-form-input"
                            >
                                <option value="">All Levels</option>
                                <option value="Undergraduate">Undergraduate</option>
                                <option value="Postgraduate">Postgraduate</option>
                            </select>
                        </div>
                        
                        <div className="semester-filter-container">
                            <select
                                value={filters.semester}
                                onChange={(e) => setFilters(prev => ({ ...prev, semester: e.target.value }))}
                                className="faculty-edit-form-input"
                            >
                                <option value="">All Semesters</option>
                                <option value="I">I</option>
                                <option value="II">II</option>
                                <option value="III">III</option>
                                <option value="IV">IV</option>
                                <option value="V">V</option>
                                <option value="VI">VI</option>
                                <option value="VII">VII</option>
                                <option value="VIII">VIII</option>
                            </select>
                        </div>
                        
                        <div className="action-buttons-container">
                            <button 
                                type="button" 
                                onClick={handleAddCourse} 
                                className="btn btn-primary"
                                disabled={!selectedCourse || loading}
                            >
                                Add Course
                            </button>
                            <button 
                                type="button" 
                                onClick={() => {
                                    setShowAddForm(false);
                                    setSearchTerm('');
                                    setSelectedCourse(null);
                                    setSearchResults([]);
                                    setFilters({ level: '', semester: '', department: '' });
                                }} 
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>

                    {/* Search Results */}
                    {isSearching && (
                        <div className="search-loading">
                            <p>Searching courses...</p>
                        </div>
                    )}
                    
                    {searchResults.length > 0 && !isSearching && (
                        <div className="search-results">
                            <h5>Found {searchResults.length} course(s):</h5>
                            <div className="courses-list">
                                {searchResults.map(course => (
                                    <div 
                                        key={course.course_id}
                                        className={`course-item ${selectedCourse?.course_id === course.course_id ? 'selected' : ''}`}
                                        onClick={() => handleSelectCourse(course)}
                                    >
                                        <div className="course-header">
                                            <div className="course-code">{course.course_code}</div>
                                            <div className="course-level-badge">{course.course_level}</div>
                                        </div>
                                        <div className="course-name">{course.course_name}</div>
                                        <div className="course-meta">
                                            <span className="course-credits">{course.credits} Credits</span>
                                            {course.semester && <span className="course-semester">Sem {course.semester}</span>}
                                            {course.department_name && (
                                                <span className="course-dept">{course.department_name}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {searchTerm.length >= 2 && searchResults.length === 0 && !isSearching && !selectedCourse && (
                        <div className="no-results">
                            <p>No courses found for "{searchTerm}"</p>
                            <button 
                                type="button" 
                                className="btn btn-success btn-sm"
                                onClick={() => {
                                    setShowQuickAddForm(true);
                                    setQuickAddData(prev => ({
                                        ...prev,
                                        custom_course_name: searchTerm.length > 10 ? searchTerm : '',
                                        custom_course_code: searchTerm.length <= 10 ? searchTerm : ''
                                    }));
                                }}
                            >
                                + Add Custom Course "{searchTerm}"
                            </button>
                        </div>
                    )}

                    {/* Selected Course Preview */}
                    {selectedCourse && (
                        <div className="selected-course">
                            <h5>Selected Course:</h5>
                            <div className="course-details">
                                <strong>{selectedCourse.course_code}</strong> - {selectedCourse.course_name}
                                <br />
                                <small>{selectedCourse.course_level} • {selectedCourse.credits} Credits • Semester {selectedCourse.semester}</small>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Quick Add Custom Course Form */}
            {showQuickAddForm && (
                <div className="add-course-form">
                    <h4>Quick Add Custom Course</h4>
                    <div className="custom-course-form-grid">
                        {/* Row 1: Course Name (2), Course Code (1), Credits (1) */}
                        <div className="custom-course-row-1">
                            <div className="form-group">
                                <label>Course Name <span className="required">*</span></label>
                                <input
                                    type="text"
                                    value={quickAddData.custom_course_name}
                                    onChange={(e) => setQuickAddData(prev => ({...prev, custom_course_name: e.target.value}))}
                                    className="faculty-edit-form-input"
                                    placeholder="e.g., Advanced Machine Learning"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Course Code</label>
                                <input
                                    type="text"
                                    value={quickAddData.custom_course_code}
                                    onChange={(e) => setQuickAddData(prev => ({...prev, custom_course_code: e.target.value}))}
                                    className="faculty-edit-form-input"
                                    placeholder="e.g., CS999"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Credits</label>
                                <input
                                    type="number"
                                    value={quickAddData.custom_credits}
                                    onChange={(e) => setQuickAddData(prev => ({...prev, custom_credits: e.target.value}))}
                                    className="faculty-edit-form-input"
                                    min="1" max="10"
                                    placeholder="3"
                                />
                            </div>
                        </div>
                        
                        {/* Row 2: Course Level (1), Semester (1), Add Button (1), Cancel Button (1) */}
                        <div className="custom-course-row-2">
                            <div className="form-group">
                                <label>Course Level <span className="required">*</span></label>
                                <select
                                    value={quickAddData.custom_course_level}
                                    onChange={(e) => setQuickAddData(prev => ({...prev, custom_course_level: e.target.value}))}
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
                                    value={quickAddData.custom_semester}
                                    onChange={(e) => setQuickAddData(prev => ({...prev, custom_semester: e.target.value}))}
                                    className="faculty-edit-form-input"
                                    placeholder="e.g., I, III, V"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>&nbsp;</label>
                                <button 
                                    type="button" 
                                    onClick={handleQuickAddCourse}
                                    className="btn btn-success"
                                    disabled={loading}
                                >
                                    Add Custom Course
                                </button>
                            </div>
                            
                            <div className="form-group">
                                <label>&nbsp;</label>
                                <button 
                                    type="button" 
                                    onClick={() => setShowQuickAddForm(false)}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Save Changes Button */}
            {hasOrderChanges && (
                <div className="save-order-section">
                    <button
                        type="button"
                        onClick={handleSaveOrder}
                        className="btn btn-success"
                        disabled={loading}
                    >
                        Save Changes
                    </button>
                    <span className="order-notice">You have unsaved course order changes</span>
                </div>
            )}

            {/* Faculty Courses Display */}
            {tempCourseOrder.length === 0 && !showAddForm && !showQuickAddForm ? (
                <div className="empty-state">
                    <div className="empty-state-content">
                        <div className="empty-state-icon">📚</div>
                        <h4>No courses added yet</h4>
                        <p>Start by adding courses that you teach to showcase your academic responsibilities.</p>
                    </div>
                </div>
            ) : tempCourseOrder.length > 0 ? (
                <div className="faculty-courses">
                    <div className="courses-sections">
                        {/* Undergraduate Courses */}
                        {tempCourseOrder.filter(course => course.course_level === 'Undergraduate').length > 0 && (
                            <div className="course-section">
                                <h4>Undergraduate Courses ({tempCourseOrder.filter(course => course.course_level === 'Undergraduate').length})</h4>
                                <div className="courses-table" key={`ug-table-${renderKey}`}>
                                    <table>
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
                                            {tempCourseOrder
                                                .filter(course => {
                                                    console.log('UG Filter check:', course.course_name, 'Level:', course.course_level);
                                                    return course.course_level === 'Undergraduate';
                                                })
                                                .sort((a, b) => (a.display_order || 999) - (b.display_order || 999))
                                                .map((course, index, filteredCourses) => {
                                                    console.log('UG Rendering course:', course.course_name, 'at index', index, 'display_order:', course.display_order);
                                                    return (
                                                <tr key={course.id || `ug_${course.course_id}_${course.course_code}_${index}`}>
                                                    <td className="course-code-cell">
                                                        {course.course_code || 'N/A'}
                                                    </td>
                                                    <td className="course-name-cell">{course.course_name}</td>
                                                    <td className="course-credits-cell">{course.credits || 'N/A'}</td>
                                                    <td className="course-semester-cell">{course.semester || 'N/A'}</td>
                                                    <td className="course-actions-cell">
                                                        <div className="action-buttons">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveCourse(
                                                                    course.is_custom ? course.course_code : course.course_id,
                                                                    course.is_custom
                                                                )}
                                                                className="btn btn-danger btn-sm"
                                                                disabled={loading}
                                                            >
                                                                Remove
                                                            </button>
                                                            <div className="order-controls">
                                                                <button
                                                                    type="button"
                                                                    className="order-btn"
                                                                    onClick={() => handleReorderCourse(index, 'up', 'Undergraduate')}
                                                                    disabled={index === 0}
                                                                    title="Move up"
                                                                >
                                                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                                                                        <path d="M6 0L12 8H0L6 0Z" fill="currentColor"/>
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="order-btn"
                                                                    onClick={() => handleReorderCourse(index, 'down', 'Undergraduate')}
                                                                    disabled={index === filteredCourses.length - 1}
                                                                    title="Move down"
                                                                >
                                                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                                                                        <path d="M6 8L0 0H12L6 8Z" fill="currentColor"/>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Postgraduate Courses */}
                        {tempCourseOrder.filter(course => course.course_level === 'Postgraduate').length > 0 && (
                            <div className="course-section">
                                <h4>Postgraduate Courses ({tempCourseOrder.filter(course => course.course_level === 'Postgraduate').length})</h4>
                                <div className="courses-table" key={`pg-table-${renderKey}`}>
                                    <table>
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
                                            {tempCourseOrder
                                                .filter(course => course.course_level === 'Postgraduate')
                                                .sort((a, b) => (a.display_order || 999) - (b.display_order || 999))
                                                .map((course, index, filteredCourses) => (
                                                <tr key={course.id || `pg_${course.course_id}_${course.course_code}_${index}`}>
                                                    <td className="course-code-cell">
                                                        {course.course_code || 'N/A'}
                                                    </td>
                                                    <td className="course-name-cell">{course.course_name}</td>
                                                    <td className="course-credits-cell">{course.credits || 'N/A'}</td>
                                                    <td className="course-semester-cell">{course.semester || 'N/A'}</td>
                                                    <td className="course-actions-cell">
                                                        <div className="action-buttons">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveCourse(
                                                                    course.is_custom ? course.course_code : course.course_id,
                                                                    course.is_custom
                                                                )}
                                                                className="btn btn-danger btn-sm"
                                                                disabled={loading}
                                                            >
                                                                Remove
                                                            </button>
                                                            <div className="order-controls">
                                                                <button
                                                                    type="button"
                                                                    className="order-btn"
                                                                    onClick={() => handleReorderCourse(index, 'up', 'Postgraduate')}
                                                                    disabled={index === 0}
                                                                    title="Move up"
                                                                >
                                                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                                                                        <path d="M6 0L12 8H0L6 0Z" fill="currentColor"/>
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="order-btn"
                                                                    onClick={() => handleReorderCourse(index, 'down', 'Postgraduate')}
                                                                    disabled={index === filteredCourses.length - 1}
                                                                    title="Move down"
                                                                >
                                                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                                                                        <path d="M6 8L0 0H12L6 8Z" fill="currentColor"/>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default CoursesTaughtSection;