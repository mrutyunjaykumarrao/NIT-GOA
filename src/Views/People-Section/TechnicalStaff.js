import React from 'react';
import './TechnicalStaff.css';

// Import staff images
import Santosh from '../../assets/images/Technical Staff/Santosh.png';
import Sudharsan from '../../assets/images/Technical Staff/Sudharsan.png';
import SrinathLib from '../../assets/images/Technical Staff/srinath_lib.jpeg';

const TechnicalStaff = ({ user, onLogout }) => {
    const staffData = [
        {
            name: "Mr. Santosh",
            designation: "Technical Assistant",
            department: "Computer Science and Engineering",
            email: "santosh@nitgoa.ac.in",
            extension: "0832-2404422",
            image: Santosh
        },
        {
            name: "Mr. S Sudharsan",
            designation: "Senior Technical Assistant",
            department: "Computer Science and Engineering",
            email: "sudharsan@nitgoa.ac.in",
            extension: "0832-2404422",
            image: Sudharsan
        },
        {
            name: "Mr. Srinath",
            designation: "Library Technical Assistant",
            department: "Library",
            email: "srinath@nitgoa.ac.in",
            extension: "0832-2404422",
            image: SrinathLib
        }
    ];

    return (
        <div className="technical-staff-page">
            <div className="staff-container">
                <div className="current-department">
                    Technical Staff
                </div>

                <div className="staff-grid">
                    {staffData.map((staff, index) => (
                        <div key={index} className="staff-card">
                            <div className="staff-image">
                                <img src={staff.image} alt={staff.name} />
                            </div>
                            <div className="staff-info">
                                <h3 className="staff-name">{staff.name}</h3>
                                <p className="staff-designation">{staff.designation}</p>
                                {staff.department && (
                                    <p className="staff-department">{staff.department}</p>
                                )}
                                <div className="staff-contact">
                                    <p><strong>Email:</strong> {staff.email}</p>
                                    {staff.extension && (
                                        <p><strong>Extension:</strong> {staff.extension}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TechnicalStaff;
