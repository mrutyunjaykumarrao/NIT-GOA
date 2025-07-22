import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import './Faculty.css';

const Faculty = () => {
    const [selectedDepartment, setSelectedDepartment] = useState('CSE');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [allFacultyData, setAllFacultyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch faculty data from API
    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/faculty');
                const facultyData = await response.json();
                
                if (Array.isArray(facultyData)) {
                    setAllFacultyData(facultyData);
                } else {
                    setError('Failed to fetch faculty data');
                }
            } catch (err) {
                console.error('Error fetching faculty:', err);
                setError('Failed to load faculty data');
            } finally {
                setLoading(false);
            }
        };

        fetchFaculty();
    }, []);

    // Handle URL parameters for department selection
    useEffect(() => {
        const deptParam = searchParams.get('dept');
        if (deptParam) {
            const deptCode = deptParam.toUpperCase();
            const validDepts = ['CSE', 'ECE', 'EEE', 'MCE', 'CVE', 'APS', 'HSS'];
            if (validDepts.includes(deptCode)) {
                setSelectedDepartment(deptCode);
            }
        }
    }, [searchParams]);

    const departments = [
        { code: 'CSE', name: 'Department of Computer Science & Engineering' },
        { code: 'ECE', name: 'Department of Electronics & Communication Engineering' },
        { code: 'EEE', name: 'Department of Electrical & Electronics Engineering' },
        { code: 'MCE', name: 'Department of Department of Mechanical Engineering' },
        { code: 'CVE', name: 'Department of Department of Civil Engineering'},
        { code: 'APS', name: 'Department of Department of Applied Sciences' },
        { code: 'HSS', name: 'Department of Humanities and Social Sciences' }
    ];

    // Helper function to get department code from full name
    function getDepartmentCode(fullDepartmentName) {
        if (fullDepartmentName.includes('Computer Science')) return 'CSE';
        if (fullDepartmentName.includes('Electronics & Communication')) return 'ECE';
        if (fullDepartmentName.includes('Electrical & Electronics')) return 'EEE';
        if (fullDepartmentName.includes('Mechanical')) return 'MCE';
        if (fullDepartmentName.includes('Civil')) return 'CVE';
        if (fullDepartmentName.includes('Applied Sciences')) return 'APS';
        if (fullDepartmentName.includes('Humanities')) return 'HSS';
        return 'OTHER'; // fallback
    }

    // Helper function to get full department name from code (for display purposes)
    function getDepartmentName(deptCode) {
        const deptMap = {
            'CSE': 'Computer Science & Engineering',
            'ECE': 'Electronics & Communication Engineering',
            'EEE': 'Electrical & Electronics Engineering',
            'MCE': 'Mechanical Engineering',
            'CVE': 'Civil Engineering',
            'APS': 'Applied Sciences',
            'HSS': 'Humanities and Social Sciences'
        };
        return deptMap[deptCode] || deptCode;
    }

    // Group faculty data by department
    const groupedFacultyData = allFacultyData.reduce((acc, faculty) => {
        // Extract department code from full department name
        const deptCode = getDepartmentCode(faculty.department);
        if (!acc[deptCode]) {
            acc[deptCode] = [];
        }
        acc[deptCode].push({
            id: faculty.faculty_id || faculty.id.toString(),
            name: faculty.full_name,
            designation: faculty.designation,
            department: faculty.department, // Use full department name from database
            email: faculty.email,
            phone: faculty.phone || '0832-2404420', // Default phone if not available
            researchAreas: '', // Not available in short profile
            image: getImagePath(faculty.profile_image, deptCode),
            isHOD: faculty.is_hod === 1
        });
        return acc;
    }, {});

    // Helper function to get correct image path with department
    function getImagePath(imagePath, departmentCode) {
        if (!imagePath) return '/images/fallback-profile.svg';
        
        // If it's already a full path starting with 'client/src/assets', convert it
        if (imagePath.startsWith('client/src/assets/images/Faculty/')) {
            // Extract the relative path from the full client path
            const relativePath = imagePath.replace('client/src/assets/images/Faculty/', '');
            return `/images/Faculty/${relativePath}`;
        }
        
        // If it's just a filename, use it with the department subdirectory
        if (!imagePath.includes('/')) {
            return `/images/Faculty/${departmentCode}/${imagePath}`;
        }
        
        return imagePath;
    }

    const handleDepartmentFilter = (dept) => {
        setSelectedDepartment(dept);
    };

    // Sort faculty to show HODs first
    const getSortedFaculty = (facultyList) => {
        return [...facultyList].sort((a, b) => {
            if (a.isHOD && !b.isHOD) return -1;
            if (!a.isHOD && b.isHOD) return 1;
            return 0;
        });
    };

    return (
        <div className={`faculty-page ${theme}`}>
            <div className="faculty-container">
                

                {/* Department Filter Buttons */}
                <div className="faculty-department-section">
                    <h2 className="faculty-current-department">
                        {departments.find(dept => dept.code === selectedDepartment)?.name || 'Department'}
                    </h2>
                    <div className="faculty-department-filters">
                        {departments.map((dept) => (
                            <button
                                key={dept.code}
                                className={`faculty-filter-btn ${selectedDepartment === dept.code ? 'active' : ''}`}
                                onClick={() => handleDepartmentFilter(dept.code)}
                            >
                                {dept.code}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="faculty-loading">
                        <div className="faculty-grid">
                            {/* Skeleton loading cards */}
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="faculty-card faculty-skeleton">
                                    <div className="faculty-image">
                                        <div style={{ width: '100%', height: '200px', backgroundColor: '#e5e7eb', borderRadius: '8px' }}></div>
                                    </div>
                                    <div className="faculty-info">
                                        <div style={{ height: '20px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '8px', width: '80%' }}></div>
                                        <div style={{ height: '16px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '8px', width: '60%' }}></div>
                                        <div style={{ height: '14px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '8px', width: '90%' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading faculty...</p>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <p>Error: {error}</p>
                    </div>
                ) : (
                    <>
                        {/* Faculty Grid */}
                        <div className="faculty-grid">
                            {groupedFacultyData[selectedDepartment] && groupedFacultyData[selectedDepartment].length > 0 ? (
                                getSortedFaculty(groupedFacultyData[selectedDepartment]).map((faculty, index) => (
                                    <div key={index} className={`faculty-card ${faculty.isHOD ? 'hod-card' : ''}`}>
                                        <div className="faculty-image">
                                            <img 
                                                src={faculty.image} 
                                                alt={faculty.name}
                                                onLoad={(e) => {
                                                    e.target.style.opacity = '1';
                                                }}
                                                onError={(e) => {
                                                    e.target.src = '/images/fallback-profile.svg';
                                                }}
                                                style={{ opacity: '0', transition: 'opacity 0.3s ease' }}
                                            />
                                        </div>
                                        <div className="faculty-info">
                                            <h3 className="faculty-name">{faculty.name}</h3>
                                            <p className="faculty-designation">{faculty.designation}</p>
                                            <p className="faculty-department">{faculty.department}</p>
                                            <div className="faculty-contact">
                                                <p><strong>Email:</strong> {faculty.email}</p>
                                                <p><strong>Extension No.:</strong> {faculty.phone}</p>
                                            </div>
                                            <div className="faculty-actions">
                                                <button className="view-profile-btn" onClick={() => {
                                                    navigate(`/faculty/${faculty.id}`);
                                                }}>
                                                    View Profile
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-faculty">
                                    <p>Faculty information for {selectedDepartment} department will be updated soon.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Faculty;
