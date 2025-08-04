import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import './AdministrativeStaff.css';

// Import staff images - using actual file names
import AmitKabiraj from '../../../assets/images/Administrative Staff/amit_kabiraj.jpg';
import AmitNaik from '../../../assets/images/Administrative Staff/amitnaik_JA.jpg';
import RashmiAsstLib from '../../../assets/images/Administrative Staff/Rashmi asst lib.jpg';
import SwetaNew from '../../../assets/images/Administrative Staff/swetaNEW.jpg';
import Tallulah from '../../../assets/images/Administrative Staff/tal.jpeg';
import EstateEngg from '../../../assets/images/Administrative Staff/estate engg.jpeg';
import ManmohanAsstReg from '../../../assets/images/Administrative Staff/manmohan_asst_reg_2022.jpg';
import DigambarManekar from '../../../assets/images/Administrative Staff/digambar.jpg';
import AnandGachchinamath from '../../../assets/images/Administrative Staff/anand.jpg';
import AOP from '../../../assets/images/Administrative Staff/aop.png';
import ReshmaNoronha from '../../../assets/images/Administrative Staff/reshma.jpeg';
import StenoPhoto from '../../../assets/images/Administrative Staff/steno_photograph.jpg';
import NamrataG from '../../../assets/images/Administrative Staff/Namrata_G.jpg';
import KarthiPhoto from '../../../assets/images/Administrative Staff/recent_karthi_photo.jpg';
import SandeepJai from '../../../assets/images/Administrative Staff/sandeep_jai.jpg';
import SupriyaTiwe from '../../../assets/images/Administrative Staff/supriya.jpg';
import PritamNageshkar from '../../../assets/images/Administrative Staff/pritam_Nageshkar.jpg';
import DiptiGaude from '../../../assets/images/Administrative Staff/Dipti.jpg';
import Tejubi from '../../../assets/images/Administrative Staff/tejubi.jpg';
import Asmita from '../../../assets/images/Administrative Staff/asmita.jpeg';
import KishorPariyekar from '../../../assets/images/Administrative Staff/kishor.jpg';
import Kumaraguru from '../../../assets/images/Administrative Staff/kumaraguru.jpg';
import ArchanaMisal from '../../../assets/images/Administrative Staff/archana.jpg';
import suneel_Mudhole from '../../../assets/images/Administrative Staff/Suneel_Mudhole.jpg';

const AdministrativeStaff = () => {
    const { theme } = useTheme();
    const staffData = [
        {
            name: "Mr. Amit Kabiraj",
            designation: "Deputy Registrar",
            department: "Administration",
            email: "dy.reg@nitgoa.ac.in",
            phone: "0832-2404209",
            image: AmitKabiraj
        },
        {
            name: "Mr. Manmohan Sakhuja",
            designation: "Assistant Registrar",
            department: "Accounts | Establishment | General Administration | Student Cell",
            email: "ar_af@nitgoa.ac.in",
            phone: "0832-2404210",
            image: ManmohanAsstReg
        },
        {
            name: "Mr. Digamber D. Mayekar",
            designation: "Accountant",
            // department: "Administration",
            email: "digamber.mayekar@nitgoa.ac.in",
            phone: "0832-2404221",
            image: DigambarManekar
        },
        {
            name: "Mr. Amit Ajit Naik",
            designation: "Superintendent",
            // department: "Administration",
            email: "amitnaik@nitgoa.ac.in",
            phone: "0832-2404311",
            image: AmitNaik
        },
        {
            name: "Mr. Anand Gachchinamath",
            designation: "Superintendent",
            // department: "Administration",
            email: "anandg@nitgoa.ac.in",
            phone: "0832-2404221",
            image: AnandGachchinamath
        },
        {
            name: "Dr. S. Kumaraguru",
            designation: "Student Activity and Sports Officer",
            department: "(On Contract)",
            email: "sports_officer@nitgoa.ac.in",
            phone: "0832-2404237",
            image: Kumaraguru
        },

        {
            name: "Ms. Shewale Rashmi Madhukar",
            designation: "Assistant Librarian",
            department: "(On Temporary Basis)",
            email: "smadhukar@nitgoa.ac.in",
            phone: "0832-2404208",
            image: RashmiAsstLib
        }, 
        {
            name: "Mrs. Reshma R. Castelino",
            designation: "Technical Assistant",
            department: "(Medical Unit)",
            email: "reshma.castelino@nitgoa.ac.in",
            phone: "0832-2404267",
            image: ReshmaNoronha
        },
        {
            name: "Mrs. Lotliker Swara Sarvesh",
            designation: "Stenographer",
            // department: "Administration",
            email: "stenographer@nitgoa.ac.in",
            phone: "0832-2404200",
            image: StenoPhoto
        },
        {
            name: "Mrs. Sweta Jadhav",
            designation: "Senior Assistant",
            // department: "Administration",
            email: "sweta.jadhav@nitgoa.ac.in",
            phone: "0832-2404318",
            image: SwetaNew
        },
        {
            name: "Mrs. Namrata Prajesh Sawant",
            designation: "Senior Assistant",
            // department: "Administration",
            email: "namrata@nitgoa.ac.in",
            phone: "0832-2404206",
            image: NamrataG
        },
        {
            name: "Mr. Karthikeyan M.",
            designation: "Junior Assistant",
            department: "(Relieved on Deputation)",
            email: "karthikeyan@nitgoa.ac.in",
            phone: "0832-2404221",
            image: KarthiPhoto
        },
        {
            name: "Mrs. Tallulah Rodrigues",
            designation: "Junior Assistant",
            // department: "Administration",
            email: "tallulah@nitgoa.ac.in",
            phone: "0832-2404322",
            image: Tallulah
        },
        {
            name: "Mr. Sandeep Jaishwar",
            designation: "Junior Assistant",
            // department: "Administration",
            email: "sandeep8025@nitgoa.ac.in",
            phone: "0832-2404200",
            image: SandeepJai
        },
        {
            name: "Mrs. Supriya S Shet Tilve",
            designation: "Junior Assistant",
            department: "Department of Electrical & Electronics Engineering",
            email: "supriya.tilve@nitgoa.ac.in",
            phone: "0832-2404605",
            image: SupriyaTiwe
        },
        {
            name: "Mrs.Teju Vasim Shaikh",
            designation: "Junior Assistant",
            // department: "Administration",
            email: "tejubi@nitgoa.ac.in",
            phone: "0832-2404221",
            image: Tejubi
        },
        {
            name: "Mr. Pritam Nageshkar",
            designation: "Multi-Tasking Staff",
            // department: "Administration",
            email: "pritamnageshkar@nitgoa.ac.in",
            phone: "0832-2404221",
            image: PritamNageshkar
        },
        {
            name: "Mrs. Dipti Devidas Gaude",
            designation: "Multi-Tasking Staff",
            // department: "Administration",
            email: "dipti@nitgoa.ac.in",
            phone: "0832-2404200",
            image: DiptiGaude
        },
        {
            name: "Mrs. Asmita Ashok Naik",
            designation: "Multi-Tasking Staff",
            // department: "Administration",
            email: "asmitnaik03@nitgoa.ac.in",
            phone: "0832-2404221",
            image: Asmita
        },
        {
            name: "Mr. Vinay Acharya",
            designation: "Estate Engineer",
            department: "(On Contract Basis)",
            email: "ee.civil@nitgoa.ac.in",
            phone: "- (Internal)",
            image: EstateEngg
        },
        {
            name: "Mr. Kishor Paryekar",
            designation: "Junior Assistant-Purchase",
            department: "(On Contract Basis)",
            email: "paryekarkishor@nitgoa.ac.in",
            phone: "0832-2404206",
            image: KishorPariyekar
        },
        {
            name: "Mr. Atul Milind",
            designation: "Administrative Officer (T&P Cell)",
            department: "(On Contract)",
            email: "aop@nitgoa.ac.in",
            phone: "- (Internal)",
            image: AOP
        },
        {
            name: "Mr. Suneel Mudhole",
            designation: "Field Technician ",
            department: "(On Contract Basis)",
            email: "suneelmudhole@nitgoa.ac.in",
            phone: "- (Internal)",
            image: suneel_Mudhole
        },
        {
            name: "Mrs. Archana Darshan Misal",
            designation: "Student Counselor",
            department: "(On Contract Basis)" ,
            email: "studentcounselor@nitgoa.ac.in",
            phone: "- (Internal)",
            image: ArchanaMisal
        }
    ];

    return (
        <div className={`administrative-staff-page ${theme}`}>
            <div className="administrative-staff-container">
                <div className="administrative-staff-current-department">
                    Administrative Staff
                </div>

                <div className="administrative-staff-grid">
                    {staffData.map((staff, index) => (
                        <div key={index} className="administrative-staff-card">
                            <div className="administrative-staff-image">
                                <img src={staff.image} alt={staff.name} />
                            </div>
                            <div className="administrative-staff-info">
                                <h3 className="administrative-staff-name">{staff.name}</h3>
                                <p className="administrative-staff-designation">{staff.designation}</p>
                                <p className="administrative-staff-department">{staff.department}</p>
                                <div className="administrative-staff-contact">
                                    <p><strong>Email:</strong> <a href={`mailto:${staff.email}`}>{staff.email}</a></p>
                                    <p><strong>Extenson No.:</strong> <a href={`tel:${staff.phone}`}>{staff.phone}</a></p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdministrativeStaff;
