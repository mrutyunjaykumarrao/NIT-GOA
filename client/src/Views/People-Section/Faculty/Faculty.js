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
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Fetch faculty data from API
    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/faculty-profiles');
                const result = await response.json();
                
                if (response.ok && result.success) {
                    setAllFacultyData(result.data);
                } else {
                    console.error('Failed to fetch faculty:', result.error);
                }
            } catch (err) {
                console.error('Error fetching faculty:', err);
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
        if (!fullDepartmentName) return 'CSE';
        if (fullDepartmentName.includes('Computer Science')) return 'CSE';
        if (fullDepartmentName.includes('Electronics & Communication')) return 'ECE';
        if (fullDepartmentName.includes('Electrical & Electronics')) return 'EEE';
        if (fullDepartmentName.includes('Mechanical')) return 'MCE';
        if (fullDepartmentName.includes('Civil')) return 'CVE';
        if (fullDepartmentName.includes('Applied Sciences')) return 'APS';
        if (fullDepartmentName.includes('Humanities')) return 'HSS';
        return 'CSE';
    }

    // Function to generate slug from faculty name
    const generateSlug = (name) => {
        if (!name) return 'unknown-faculty';
        return name.toLowerCase()
            .replace(/^dr\.?\s*/i, '') // Remove "Dr." prefix
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/[^\w-]/g, '') // Remove special characters except hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .trim();
    };

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
        // Use department_code directly from the API response, fallback to extracting from name
        const deptCode = faculty.department_code || getDepartmentCode(faculty.department_name);
        if (!acc[deptCode]) {
            acc[deptCode] = [];
        }
        
        // Format name with honorific
        const formatName = (faculty) => {
            return faculty.honorific ? `${faculty.honorific} ${faculty.full_name}` : faculty.full_name;
        };
        
        acc[deptCode].push({
            id: faculty.id.toString(),
            employee_code: faculty.employee_code,
            name: faculty.full_name,
            formattedName: formatName(faculty),
            designation: faculty.designation,
            department: faculty.department_name || 'Department of Computer Science & Engineering',
            email: faculty.email,
            phone: faculty.phone || '0832-2404420',
            researchAreas: faculty.research_interests ? 
                (faculty.research_interests.includes('[') && faculty.research_interests.includes(']') ? 
                 JSON.parse(faculty.research_interests).join(', ') : 
                 faculty.research_interests) : '',
            image: getImagePath(faculty.profile_image, deptCode),
            isHOD: faculty.is_hod === 1 || faculty.is_hod === true,
            displayOrder: faculty.display_order || 999
        });
        return acc;
    }, {});

    // Helper function to get correct image path with department
    function getImagePath(imagePath, departmentCode) {
        if (!imagePath) return '/images/fallback-profile.svg';
        
        // If it's already a full path starting with 'client/src/assets', convert it
        if (imagePath.startsWith('client/src/assets/images/Faculty/')) {
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
        if (dept !== selectedDepartment) {
            setIsTransitioning(true);
            // Shorter, smoother transition timing
            setTimeout(() => {
                setSelectedDepartment(dept);
                // Reset transition state after content is updated
                setTimeout(() => {
                    setIsTransitioning(false);
                }, 100); // Reduced delay for quicker recovery
            }, 100); // Reduced delay for faster transition
        }
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
                        <div className={`faculty-grid ${isTransitioning ? 'updating' : ''}`}>
                            {groupedFacultyData[selectedDepartment] && groupedFacultyData[selectedDepartment].length > 0 ? (
                                groupedFacultyData[selectedDepartment].map((faculty, index) => (
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
                                            <h3 className="faculty-name">{faculty.formattedName}</h3>
                                            <p className="faculty-designation">{faculty.designation}</p>
                                            <p className="faculty-department">{faculty.department}</p>
                                            <div className="faculty-contact">
                                                <p><strong>Email:</strong> <a href={`mailto:${faculty.email}`}>{faculty.email}</a></p>
                                                <p><strong>Extension No.:</strong> <a href={`tel:${faculty.phone}`} style={{ textDecoration: 'none', color: 'inherit' }}>{faculty.phone}</a></p>
                                            </div>
                                            <div className="faculty-actions">
                                                <button className="view-profile-btn" onClick={() => {
                                                    navigate(`/people/faculty/${faculty.employee_code}`);
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
