import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import './AdministrativeStaff.css';

const AdministrativeStaff = () => {
    const { theme } = useTheme();
    const [staffData, setStaffData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdministrativeStaff = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/staff/administrative');
                const result = await response.json();
                
                if (result.success) {
                    setStaffData(result.data);
                } else {
                    setError('Failed to fetch administrative staff data');
                }
            } catch (err) {
                console.error('Error fetching administrative staff:', err);
                setError('Failed to load administrative staff data');
            } finally {
                setLoading(false);
            }
        };

        fetchAdministrativeStaff();
    }, []);

    // Function to get the image path for administrative staff
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
        // First check if there's a specialty from staff_profiles
        if (staff.specialty && staff.specialty.trim()) {
            return `(${staff.specialty})`;
        }
        
        // Then check employment status (but don't show if it's "Permanent")
        if (staff.employment_status && 
            staff.employment_status.trim() && 
            staff.employment_status.toLowerCase() !== 'permanent') {
            return `(${staff.employment_status})`;
        }
        
        return null;
    };

    return (
        <div className={`administrative-staff-page ${theme}`}>
            <div className="administrative-staff-container">
                <div className="administrative-staff-current-department">
                    Administrative Staff
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-grid">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="administrative-staff-card loading">
                                    <div className="administrative-staff-image">
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
                                    <div className="administrative-staff-info">
                                        <div style={{ height: '20px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '8px' }}></div>
                                        <div style={{ height: '16px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '8px', width: '80%' }}></div>
                                        <div style={{ height: '14px', backgroundColor: '#e5e7eb', borderRadius: '4px', marginBottom: '8px', width: '60%' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading administrative staff...</p>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <p>Error: {error}</p>
                    </div>
                ) : (
                    <div className="administrative-staff-grid">
                        {staffData.map((staff, index) => (
                            <div key={staff.id || index} className="administrative-staff-card">
                                <div className="administrative-staff-image">
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
                                <div className="administrative-staff-info">
                                    <h3 className="administrative-staff-name">{formatName(staff)}</h3>
                                    <p className="administrative-staff-designation">{staff.designation}</p>
                                    {getSpecialtyOrStatus(staff) && (
                                        <p className="administrative-staff-specialty">{getSpecialtyOrStatus(staff)}</p>
                                    )}
                                    {staff.department_name && 
                                     staff.department_name !== 'General Administration' && (
                                        <p className="administrative-staff-department">{staff.department_name}</p>
                                    )}
                                    <div className="administrative-staff-contact">
                                        <p><strong>Email:</strong> {staff.email}</p>
                                        <p><strong>Extension No.:</strong> {staff.phone}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdministrativeStaff;
