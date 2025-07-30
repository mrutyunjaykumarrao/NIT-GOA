import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import './TechnicalStaff.css';

const TechnicalStaff = () => {
    const [selectedDepartment, setSelectedDepartment] = useState('CSE');
    const [searchParams] = useSearchParams();
    const { theme } = useTheme();
    const [allStaffData, setAllStaffData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Handle URL parameters for department selection
    useEffect(() => {
        const deptParam = searchParams.get('dept');
        if (deptParam) {
            const deptCode = deptParam.toUpperCase();
            const validDepts = ['CSE', 'ECE', 'EEE', 'MCE', 'CVE', 'APS', 'CCC'];
            if (validDepts.includes(deptCode)) {
                setSelectedDepartment(deptCode);
            }
        }
    }, [searchParams]);

    // Fetch technical staff data
    useEffect(() => {
        const fetchTechnicalStaff = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/staff/technical');
                const result = await response.json();
                
                if (result.success) {
                    setAllStaffData(result.data);
                } else {
                    setError('Failed to fetch technical staff data');
                }
            } catch (err) {
                console.error('Error fetching technical staff:', err);
                setError('Failed to load technical staff data');
            } finally {
                setLoading(false);
            }
        };

        fetchTechnicalStaff();
    }, []);

    // Function to get the image path based on department
    const getImagePath = (staff) => {
        if (!staff.profile_image) return '/images/fallback-profile.svg';
        return `/${staff.profile_image}`;
    };

    // Function to format the name with honorific
    const formatName = (staff) => {
        return staff.honorific ? `${staff.honorific} ${staff.name}` : staff.name;
    };

    // Function to get specialty or employment status for display
    const getSpecialtyOrStatus = (staff) => {
        if (staff.specialty) {
            return staff.specialty;
        }
        if (staff.employment_status && staff.employment_status !== 'Permanent') {
            return staff.employment_status;
        }
        return null;
    };

    const departments = [
        { code: 'CSE', name: 'Department of Computer Science and Engineering' },
        { code: 'ECE', name: 'Department of Electronics & Communication Engineering' },
        { code: 'EEE', name: 'Department of Electrical & Electronics Engineering' },
        { code: 'MCE', name: 'Department of Mechanical Engineering' },
        { code: 'CVE', name: 'Department of Civil Engineering' },
        { code: 'APS', name: 'Department of Applied Sciences & HSS' },
        { code: 'CCC', name: 'Campus Control Centre' }
    ];

    // Group staff data by department
    const groupedStaffData = allStaffData.reduce((acc, staff) => {
        // Use department_code from database if available, otherwise map department name
        let deptCode = staff.department_code;
        if (!deptCode && staff.department_name) {
            if (staff.department_name.includes('Computer Science')) deptCode = 'CSE';
            else if (staff.department_name.includes('Electronics') && staff.department_name.includes('Communication')) deptCode = 'ECE';
            else if (staff.department_name.includes('Electrical') && staff.department_name.includes('Electronics')) deptCode = 'EEE';
            else if (staff.department_name.includes('Mechanical')) deptCode = 'MCE';
            else if (staff.department_name.includes('Civil')) deptCode = 'CVE';
            else if (staff.department_name.includes('Applied Sciences') || staff.department_name.includes('HSS')) deptCode = 'APS';
            else if (staff.department_name.includes('Campus Control')) deptCode = 'CCC';
        }
        
        if (deptCode && !acc[deptCode]) {
            acc[deptCode] = [];
        }
        if (deptCode) {
            acc[deptCode].push(staff);
        }
        
        return acc;
    }, {});

    const handleDepartmentFilter = (dept) => {
        setSelectedDepartment(dept);
    };

    return (
        <div className={`technical-staff-page ${theme}`}>
            <div className="technical-staff-container">
                {/* Department Filter Buttons */}
                <div className="technical-staff-department-section">
                    <h2 className="technical-staff-current-department">
                        {departments.find(dept => dept.code === selectedDepartment)?.name || 'Department'} - Technical Staff
                    </h2>
                    <div className="technical-staff-department-filters">
                        {departments.map((dept) => (
                            <button
                                key={dept.code}
                                className={`technical-staff-filter-btn ${selectedDepartment === dept.code ? 'active' : ''}`}
                                onClick={() => handleDepartmentFilter(dept.code)}
                            >
                                {dept.code}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Staff Grid */}
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-grid technical-staff-grid">
                            {[...Array(4)].map((_, index) => (
                                <div key={index} className="technical-staff-card loading">
                                    <div className="technical-staff-image">
                                        <img 
                                            src="/images/fallback-profile.svg"
                                            alt="Loading..."
                                            style={{ 
                                                minHeight: '200px', 
                                                backgroundColor: '#f3f4f6',
                                                objectFit: 'cover',
                                                opacity: 0.6
                                            }}
                                        />
                                    </div>
                                    <div className="technical-staff-info">
                                        <div style={{ height: '20px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '8px' }}></div>
                                        <div style={{ height: '16px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '8px', width: '80%' }}></div>
                                        <div style={{ height: '14px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '8px', width: '60%' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading technical staff...</p>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <p>Error: {error}</p>
                    </div>
                ) : (
                    <div className="technical-staff-grid">
                        {groupedStaffData[selectedDepartment] && groupedStaffData[selectedDepartment].length > 0 ? (
                            groupedStaffData[selectedDepartment].map((staff, index) => (
                                <div key={staff.id || index} className="technical-staff-card">
                                    <div className="technical-staff-image">
                                        <img 
                                            src={getImagePath(staff)}
                                            alt={formatName(staff)}
                                            onError={(e) => {
                                                e.target.src = '/images/fallback-profile.svg';
                                            }}
                                            style={{ 
                                                minHeight: '200px', 
                                                backgroundColor: '#f3f4f6',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>
                                    <div className="technical-staff-info">
                                        <h3 className="technical-staff-name">{formatName(staff)}</h3>
                                        <p className="technical-staff-designation">{staff.designation}</p>
                                        {getSpecialtyOrStatus(staff) && (
                                            <p className="technical-staff-specialty">({getSpecialtyOrStatus(staff)})</p>
                                        )}
                                        <p className="technical-staff-department">{staff.department_name}</p>
                                        <div className="technical-staff-contact">
                                            <p>
                                                <strong>Email:</strong> 
                                                <a 
                                                    href={`mailto:${staff.email}`}
                                                    style={{ 
                                                        color: 'inherit', 
                                                        textDecoration: 'none',
                                                        marginLeft: '5px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {staff.email}
                                                </a>
                                            </p>
                                            <p>
                                                <strong>Extension No.:</strong> 
                                                <a 
                                                    href={`tel:${staff.phone}`}
                                                    style={{ 
                                                        color: 'inherit', 
                                                        textDecoration: 'none',
                                                        marginLeft: '5px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {staff.phone}
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-technical-staff">
                                <p>Technical staff information for {selectedDepartment} department will be updated soon.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TechnicalStaff;
