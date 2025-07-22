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
        
        let deptFolder = '';
        if (staff.department.includes('Computer Science')) deptFolder = 'CSE';
        else if (staff.department.includes('Electronics') && staff.department.includes('Communication')) deptFolder = 'ECE';
        else if (staff.department.includes('Electrical')) deptFolder = 'EEE';
        else if (staff.department.includes('Mechanical')) deptFolder = 'MCE';
        else if (staff.department.includes('Civil')) deptFolder = 'CVE';
        else if (staff.department.includes('Applied Physics') || staff.department.includes('Applied Sciences') || staff.department.includes('Humanities')) deptFolder = 'APS & HSS';
        else if (staff.department.includes('Campus Control')) deptFolder = 'CCC';
        
        return `/images/Technical Staff/${deptFolder}/${staff.profile_image}`;
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
        // Map database department names to department codes
        let deptCode = '';
        if (staff.department.includes('Computer Science')) deptCode = 'CSE';
        else if (staff.department.includes('Electronics') && staff.department.includes('Communication')) deptCode = 'ECE';
        else if (staff.department.includes('Electrical') && staff.department.includes('Electronics')) deptCode = 'EEE';
        else if (staff.department.includes('Mechanical')) deptCode = 'MCE';
        else if (staff.department.includes('Civil')) deptCode = 'CVE';
        else if (staff.department.includes('Applied Sciences') || staff.department.includes('HSS')) deptCode = 'APS';
        else if (staff.department.includes('Campus Control')) deptCode = 'CCC';
        
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
                                <div key={index} className="technical-staff-card">
                                    <div className="technical-staff-image">
                                        <img 
                                            src={getImagePath(staff)}
                                            alt={staff.name}
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
                                        <h3 className="technical-staff-name">{staff.name}</h3>
                                        <p className="technical-staff-designation">{staff.designation}</p>
                                        {staff.speciality && <p className="technical-staff-designation">{staff.speciality}</p>}
                                        <p className="technical-staff-department">{staff.department}</p>
                                        <div className="technical-staff-contact">
                                            <p><strong>Email:</strong> {staff.email}</p>
                                            <p><strong>Extension No.:</strong> {staff.phone}</p>
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
