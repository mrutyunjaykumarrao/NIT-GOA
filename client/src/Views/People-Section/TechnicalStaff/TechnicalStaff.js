import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './TechnicalStaff.css';

// Import staff images - CSE Department
import SantoshCSE from '../../../assets/images/Technical Staff/CSE/Santosh.png';
import SudharsanCSE from '../../../assets/images/Technical Staff/CSE/Sudharsan.png';
import SrinathLib from '../../../assets/images/Technical Staff/CSE/srinath_lib.jpeg';

// Import staff images - ECE Department
import NikhilECE from '../../../assets/images/Technical Staff/ECE/Nikhil.png';
import RamECE from '../../../assets/images/Technical Staff/ECE/Ram.png';
import PradhanECE from '../../../assets/images/Technical Staff/ECE/pradhan.jpg';

// Import staff images - EEE Department
import DigambarEEE from '../../../assets/images/Technical Staff/EEE/Digambar1.png';
import PinakiEEE from '../../../assets/images/Technical Staff/EEE/Pinaki.png';
import RohitEEE from '../../../assets/images/Technical Staff/EEE/Rohit.png';
import ArjunEEE from '../../../assets/images/Technical Staff/EEE/arjun_singh1.jpg';
import KoushikEEE from '../../../assets/images/Technical Staff/EEE/koushik_eee.jpeg';

// Import staff images - MCE Department
import VijeeshMCE from '../../../assets/images/Technical Staff/MCE/vijeesh_mce.jpg';

// Import staff images - CVE Department
import RajkumarCVE from '../../../assets/images/Technical Staff/CVE/rajkumar_aps.jpeg';

// Import staff images - APS & HSS Department
import PriyankaAPS from '../../../assets/images/Technical Staff/APS & HSS/Priyanka.png';

// Import staff images - CCC Department
import NijinCCC from '../../../assets/images/Technical Staff/CCC/Nijin.png';
import RameezCCC from '../../../assets/images/Technical Staff/CCC/Rameez.png';
import VenkatCCC from '../../../assets/images/Technical Staff/CCC/Venkat.png';

const TechnicalStaff = () => {
    const [selectedDepartment, setSelectedDepartment] = useState('CSE');
    const [searchParams] = useSearchParams();

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

    const departments = [
        { code: 'CSE', name: 'Computer Science & Engineering' },
        { code: 'ECE', name: 'Electronics & Communication Engineering' },
        { code: 'EEE', name: 'Electrical & Electronics Engineering' },
        { code: 'MCE', name: 'Mechanical Engineering' },
        { code: 'CVE', name: 'Civil Engineering' },
        { code: 'APS', name: 'Applied Sciences & HSS' },
        { code: 'CCC', name: 'Computer Center' }
    ];

    const staffData = {
        CSE: [
            {
                name: "Mr. Santosh",
                designation: "Technical Assistant",
                department: "Computer Science and Engineering",
                email: "santosh@nitgoa.ac.in",
                phone: "Extension No.: - (Internal)",
                image: SantoshCSE
            },
            {
                name: "Mr. S Sudharsan",
                designation: "Senior Technical Assistant",
                department: "Computer Science and Engineering",
                email: "sudharsan@nitgoa.ac.in",
                phone: "Extension No.: - (Internal)",
                image: SudharsanCSE
            },
            {
                name: "Mr. Srinath",
                designation: "Library Technical Assistant",
                department: "Library",
                email: "srinath@nitgoa.ac.in",
                phone: "Extension No.: - (Internal)",
                image: SrinathLib
            }
        ],
        ECE: [
            {
                name: "Mr. Nikhil",
                designation: "Technical Assistant",
                department: "Electronics & Communication Engineering",
                email: "nikhil@nitgoa.ac.in",
                phone: "Extension No.: - (Internal)",
                image: NikhilECE
            },
            {
                name: "Mr. Ram",
                designation: "Technical Assistant",
                department: "Electronics & Communication Engineering",
                email: "ram@nitgoa.ac.in",
                phone: "Extension No.: - (Internal)",
                image: RamECE
            },
            {
                name: "Mr. Pradhan",
                designation: "Technical Assistant",
                department: "Electronics & Communication Engineering",
                email: "pradhan@nitgoa.ac.in",
                phone: "Extension No.: - (Internal)",
                image: PradhanECE
            }
        ],
        EEE: [
            {
                name: "Mr. Digambar",
                designation: "Technical Assistant",
                department: "Electrical & Electronics Engineering",
                email: "digambar@nitgoa.ac.in",
                phone: "Extension No.: - (Internal)",
                image: DigambarEEE
            },
            {
                name: "Mr. Pinaki",
                designation: "Technical Assistant",
                department: "Electrical & Electronics Engineering",
                email: "pinaki@nitgoa.ac.in",
                phone: "Extension No.: - (Internal)",
                image: PinakiEEE
            },
            {
                name: "Mr. Rohit",
                designation: "Technical Assistant",
                department: "Electrical & Electronics Engineering",
                email: "rohit@nitgoa.ac.in",
                phone: "Extension No.: - (Internal)",
                image: RohitEEE
            },
            {
                name: "Mr. Arjun Singh",
                designation: "Technical Assistant",
                department: "Electrical & Electronics Engineering",
                email: "arjun@nitgoa.ac.in",
                phone: "Extension No.: - (Internal)",
                image: ArjunEEE
            },
            {
                name: "Mr. Koushik",
                designation: "Technical Assistant",
                department: "Electrical & Electronics Engineering",
                email: "koushik@nitgoa.ac.in",
                phone: "Extension No.: - (Internal)",
                image: KoushikEEE
            }
        ],
        MCE: [
            {
                name: "Mr. Vijeesh",
                designation: "Technical Assistant",
                department: "Mechanical Engineering",
                email: "vijeesh@nitgoa.ac.in",
                phone: "Extension No.: - (Internal)",
                image: VijeeshMCE
            }
        ],
        CVE: [
            {
                name: "Mr. Rajkumar",
                designation: "Technical Assistant",
                department: "Civil Engineering",
                email: "rajkumar@nitgoa.ac.in",
                phone: "Extension No.: - (Internal)",
                image: RajkumarCVE
            }
        ],
        APS: [
            {
                name: "Ms. Priyanka",
                designation: "Technical Assistant",
                department: "Applied Sciences & HSS",
                email: "priyanka@nitgoa.ac.in",
                phone: "Extension No.: - (Internal)",
                image: PriyankaAPS
            }
        ],
        CCC: [
            {
                name: "Mr. Nijin",
                designation: "Technical Assistant",
                department: "Computer Center",
                email: "nijin@nitgoa.ac.in",
                phone: "Extension No.: - (Internal)",
                image: NijinCCC
            },
            {
                name: "Mr. Rameez",
                designation: "Technical Assistant",
                department: "Computer Center",
                email: "rameez@nitgoa.ac.in",
                phone: "Extension No.: - (Internal)",
                image: RameezCCC
            },
            {
                name: "Mr. Venkat",
                designation: "Technical Assistant",
                department: "Computer Center",
                email: "venkat@nitgoa.ac.in",
                phone: "Extension No.: - (Internal)",
                image: VenkatCCC
            }
        ]
    };

    const handleDepartmentFilter = (dept) => {
        setSelectedDepartment(dept);
    };

    return (
        <div className="technical-staff-page">
            <div className="staff-container">
                {/* Department Filter Buttons */}
                <div className="department-section">
                    <h2 className="current-department">
                        {departments.find(dept => dept.code === selectedDepartment)?.name || 'Department'} - Technical Staff
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

                {/* Staff Grid */}
                <div className="staff-grid">
                    {staffData[selectedDepartment] && staffData[selectedDepartment].length > 0 ? (
                        staffData[selectedDepartment].map((staff, index) => (
                            <div key={index} className="staff-card">
                                <div className="staff-image">
                                    <img src={staff.image} alt={staff.name} />
                                </div>
                                <div className="staff-info">
                                    <h3 className="staff-name">{staff.name}</h3>
                                    <p className="staff-designation">{staff.designation}</p>
                                    <p className="staff-department">{staff.department}</p>
                                    <div className="staff-contact">
                                        <p><strong>Email:</strong> {staff.email}</p>
                                        <p><strong>Phone:</strong> {staff.phone}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-staff">
                            <p>Technical staff information for {selectedDepartment} department will be updated soon.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TechnicalStaff;
