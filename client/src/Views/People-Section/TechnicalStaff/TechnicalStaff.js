import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
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
    const [selectedDepartment, setSelectedDepartment] = useState(() => {
        // Get saved department from localStorage or default to 'CSE'
        return localStorage.getItem('technical-staff-selected-department') || 'CSE';
    });
    const [searchParams] = useSearchParams();
    const { theme } = useTheme();

    // Handle URL parameters for department selection
    useEffect(() => {
        const deptParam = searchParams.get('dept');
        if (deptParam) {
            const deptCode = deptParam.toUpperCase();
            const validDepts = ['CSE', 'ECE', 'EEE', 'MCE', 'CVE', 'APS', 'CCC'];
            if (validDepts.includes(deptCode)) {
                setSelectedDepartment(deptCode);
                // Save to localStorage when set from URL
                localStorage.setItem('technical-staff-selected-department', deptCode);
            }
        }
    }, [searchParams]);

    // Handle department change with localStorage persistence
    const handleDepartmentChange = (dept) => {
        setSelectedDepartment(dept);
        localStorage.setItem('technical-staff-selected-department', dept);
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

    const staffData = {
        CSE: [
            {
                name: "Mr. S SUDHARSAN",
                designation: "Senior Technical Assistant",
                department: "Department of Computer Science and Engineering",
                email: "sudharsan@nitgoa.ac.in",
                phone: "0832-2404422",
                image: SudharsanCSE
            },
            {
                name: "Mr. Srinath",
                designation: "Senior Techniciant",
                department: "Department of Computer Science and Engineering",
                email: "revoorisrinath@nitgoa.ac.in",
                phone: "0832-2404208",
                image: SrinathLib
            },
            {
                name: "Mr. Kokate Santosh Parvatrao",
                designation: "Technician",
                department: "Department of Computer Science and Engineering",
                email: "ksantosh@nitgoa.ac.in",
                phone: "0832-2404430",
                image: SantoshCSE
            }
        ],
        ECE: [
            {
                name: "Mr. Patitapaban Pradhan",
                designation: "Senior Technical Assistan",
                department: "Department of Electronics and Communication Engineering",
                email: "pradhanp@nitgoa.ac.in",
                phone: "0832-2404503",
                image: PradhanECE
            },
            {
                name: "Mr. Shri Ram Kumawat",
                designation: "Technical Assistant",
                department: "Department of Electronics and Communication Engineering",
                email: "shriram@nitgoa.ac.in",
                phone: "0832-2404545",
                image: RamECE
            },
            {
                name: "Mr. Nikhil Uday Naik",
                designation: "Technician",
                department: "Department of Electronics and Communication Engineering",
                email: "nikhilnaik@nitgoa.ac.in",
                phone: "0832-2404537",
                image: NikhilECE
            }
        ],
        EEE: [
            {
                name: "Mr. Pinaki Chatterjee",
                designation: "Technical Assistant",
                department: "Department of Electrical and Electronics Engineering",
                email: "pinaki@nitgoa.ac.in",
                phone: "0832-2404616",
                image: PinakiEEE
            },
            {
                name: "Mr. Digambar R. D.",
                designation: "Senior Technician",
                department: "Department of Electrical and Electronics Engineering",
                email: "digambar@nitgoa.ac.in",
                phone: "0832-2404219",
                image: DigambarEEE
            },
            {
                name: "Mr. Rohit Madhu Gawas",
                designation: "Senior Technician",
                department: "Department of Electrical and Electronics Engineering",
                email: "rohit@nitgoa.ac.in",
                phone: "0832-2404636",
                image: RohitEEE
            },
            {
                name: "Mr. Arjun Singh",
                designation: "Technician",
                department: "Department of Electrical and Electronics Engineering",
                email: "arjunsingh@nitgoa.ac.in",
                phone: "0832-2404629",
                image: ArjunEEE
            },
            {
                name: "Mr. Koushik",
                designation: "Technician",
                department: "Department of Electrical and Electronics Engineering",
                email: "koushik@nitgoa.ac.in",
                phone: "0832-2404610",
                image: KoushikEEE
            }
        ],
        MCE: [
            {
                name: "Mr. Vijeesh V.P",
                designation: "Senior Technical Assistant",
                department: "Department of Mechanical Engineering",
                email: "vijeesh@nitgoa.ac.in",
                phone: "0832-2404812",
                image: VijeeshMCE
            }
        ],
        CVE: [
            {
                name: "Mr. K Rajkumar",
                designation: "Multi-Tasking Staff",
                department: "Department of Civil",
                email: "rajkumar@nitgoa.ac.in",
                phone: "0832-2404805",
                image: RajkumarCVE
            }
        ],
        APS: [
            {
                name: "Ms. Priyanka Parab",
                designation: "Technician",
                department: "Department of Applied Sciences",
                email: "priyankaparab@nitgoa.ac.in",
                phone: "0832-2404722",
                image: PriyankaAPS
            }
        ],
        CCC: [
            {
                name: "Mr. Venkat R Grandhi",
                designation: "Senior Technical Assistant",
                speciality: "(System Administrator)",
                department: "Campus Control Centre",
                email: "sysadmin@nitgoa.ac.in",
                phone: "0832-2404851",
                image: VenkatCCC
            },
            {
                name: "Mr. Rameez Rahman",
                designation: "Senior Technical Assistant",
                speciality: "(Network Administrator)",
                department: "Campus Control Centre",
                email: "netadmin@nitgoa.ac.in",
                phone: "0832-2404852",
                image: RameezCCC
            },
            {
                name: "Mr. Nijin Mambrol",
                designation: "Technical Assistant",
                speciality:  "(MIS Administrator)",
                department: "Campus Control Centre",
                email: "misadmin@nitgoa.ac.in",
                phone: "0832-2404853",
                image: NijinCCC
            }
            
        ]
    };

    const handleDepartmentFilter = (dept) => {
        handleDepartmentChange(dept);
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
                <div className="technical-staff-grid">
                    {staffData[selectedDepartment] && staffData[selectedDepartment].length > 0 ? (
                        staffData[selectedDepartment].map((staff, index) => (
                            <div key={index} className="technical-staff-card">
                                <div className="technical-staff-image">
                                    <img src={staff.image} alt={staff.name} />
                                </div>
                                <div className="technical-staff-info">
                                    <h3 className="technical-staff-name">{staff.name}</h3>
                                    <p className="technical-staff-designation">{staff.designation}</p>
                                    <p className="technical-staff-designation">{staff.speciality}</p>
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
            </div>
        </div>
    );
};

export default TechnicalStaff;
