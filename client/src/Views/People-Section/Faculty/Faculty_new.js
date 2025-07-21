import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import './Faculty.css';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const Faculty = () => {
    const [selectedDepartment, setSelectedDepartment] = useState('CSE');
    const [facultyData, setFacultyData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { theme } = useTheme();

    // Function to get the correct image path
    const getImagePath = (imageName, department) => {
        if (!imageName) return null;
        
        // If it's already a full path, return as is
        if (imageName.startsWith('http') || imageName.startsWith('/')) {
            return imageName;
        }
        
        // Construct the path based on department
        const deptFolders = {
            'CSE': 'CSE',
            'ECE': 'ECE', 
            'EEE': 'EEE',
            'MCE': 'MCE',
            'CVE': 'CVE',
            'APS': 'APS',
            'HSS': 'HSS'
        };
        
        const deptFolder = deptFolders[department] || department;
        try {
            return require(`../../../assets/images/Faculty/${deptFolder}/${imageName}`);
        } catch (error) {
            console.warn(`Could not load image: ${imageName}`);
            return 'https://via.placeholder.com/200x250/E5E7EB/6B7280?text=Faculty';
        }
    };

    // Function to get full department name
    const getDepartmentFullName = (code) => {
        const deptMap = {
            'CSE': 'Computer Science and Engineering',
            'ECE': 'Electronics & Communication Engineering',
            'EEE': 'Electrical & Electronics Engineering',
            'MCE': 'Mechanical Engineering',
            'CVE': 'Civil Engineering',
            'APS': 'Applied Sciences',
            'HSS': 'Humanities & Social Sciences'
        };
        return deptMap[code] || code;
    };

    // Fetch faculty data from API
    const fetchFacultyData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${API_BASE_URL}/faculty`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const faculty = await response.json();
            
            // Group faculty by department and format for existing structure
            const groupedFaculty = faculty.reduce((acc, member) => {
                const dept = member.department;
                if (!acc[dept]) {
                    acc[dept] = [];
                }
                
                try {
                    acc[dept].push({
                        id: member.id,
                        name: member.full_name,
                        designation: member.designation,
                        department: getDepartmentFullName(member.department),
                        email: member.email,
                        phone: member.phone || 'Extension No.: - (Internal)',
                        researchAreas: member.research_areas || 'Research areas will be updated soon',
                        image: getImagePath(member.profile_image, member.department),
                        isHOD: member.is_hod === 1
                    });
                } catch (imageError) {
                    // If image loading fails, use a placeholder
                    console.warn(`Could not load image for ${member.full_name}:`, imageError);
                    acc[dept].push({
                        id: member.id,
                        name: member.full_name,
                        designation: member.designation,
                        department: getDepartmentFullName(member.department),
                        email: member.email,
                        phone: member.phone || 'Extension No.: - (Internal)',
                        researchAreas: member.research_areas || 'Research areas will be updated soon',
                        image: 'https://via.placeholder.com/200x250/E5E7EB/6B7280?text=Faculty',
                        isHOD: member.is_hod === 1
                    });
                }
                return acc;
            }, {});
            
            setFacultyData(groupedFaculty);
        } catch (err) {
            console.error('Error fetching faculty data:', err);
            setError('Failed to load faculty data. Please try again later.');
            // Fallback to empty data structure
            setFacultyData({
                CSE: [], ECE: [], EEE: [], MCE: [], CVE: [], APS: [], HSS: []
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchFacultyData();
    }, []);

    useEffect(() => {
        const dept = searchParams.get('department');
        if (dept && ['CSE', 'ECE', 'EEE', 'MCE', 'CVE', 'APS', 'HSS'].includes(dept.toUpperCase())) {
            setSelectedDepartment(dept.toUpperCase());
        }
    }, [searchParams]);

    const handleDepartmentChange = (department) => {
        setSelectedDepartment(department);
        navigate(`/faculty?department=${department.toLowerCase()}`);
    };

    const departments = [
        { code: 'CSE', name: 'Computer Science and Engineering' },
        { code: 'ECE', name: 'Electronics & Communication Engineering' },
        { code: 'EEE', name: 'Electrical & Electronics Engineering' },
        { code: 'MCE', name: 'Mechanical Engineering' },
        { code: 'CVE', name: 'Civil Engineering' },
        { code: 'APS', name: 'Applied Sciences' },
        { code: 'HSS', name: 'Humanities & Social Sciences' }
    ];

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
        <div className={`faculty-page ${theme === 'dark' ? 'dark' : ''}`}>
            <div className="faculty-container">
                {/* Hero Section */}
                <div className="faculty-hero">
                    <div className="hero-image">
                        <img 
                            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                            alt="Faculty" 
                        />
                    </div>
                </div>

                {/* Department Filter Buttons */}
                <div className="department-section">
                    <h2 className="current-department">
                        {departments.find(dept => dept.code === selectedDepartment)?.name || 'Department'}
                    </h2>
                    <div className="department-filters">
                        {departments.map((dept) => (
                            <button
                                key={dept.code}
                                className={`filter-btn ${selectedDepartment === dept.code ? 'active' : ''}`}
                                onClick={() => handleDepartmentFilter(dept.code)}
                            >
                                {dept.code}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Faculty Grid */}
                <div className="faculty-grid">
                    {loading ? (
                        <div className="loading-state">
                            <p>Loading faculty data...</p>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <p>{error}</p>
                            <button className="retry-btn" onClick={fetchFacultyData}>
                                Retry
                            </button>
                        </div>
                    ) : facultyData[selectedDepartment] && facultyData[selectedDepartment].length > 0 ? (
                        getSortedFaculty(facultyData[selectedDepartment]).map((faculty, index) => (
                            <div key={faculty.id || index} className={`faculty-card ${faculty.isHOD ? 'hod-card' : ''}`}>
                                <div className="faculty-image">
                                    <img 
                                        src={faculty.image || 'https://via.placeholder.com/200x250/E5E7EB/6B7280?text=Faculty'} 
                                        alt={faculty.name}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/200x250/E5E7EB/6B7280?text=Faculty';
                                        }}
                                    />
                                </div>
                                <div className="faculty-info">
                                    <h3 className="faculty-name">{faculty.name}</h3>
                                    <p className="faculty-designation">{faculty.designation}</p>
                                    <p className="faculty-department">{faculty.department}</p>
                                    <div className="faculty-contact">
                                        <p><strong>Email:</strong> {faculty.email}</p>
                                        <p><strong>Phone:</strong> {faculty.phone}</p>
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
            </div>
        </div>
    );
};

export default Faculty;
