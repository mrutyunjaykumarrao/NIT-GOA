import React from 'react';
import './AdministrativeStaff.css';

// Import staff images - using actual file names
import AmitKabiraj from '../../assets/images/Administrative Staff/amit_kabiraj.jpg';
import AmitNaik from '../../assets/images/Administrative Staff/amitnaik_JA.jpg';
import RashmiAsstLib from '../../assets/images/Administrative Staff/Rashmi asst lib.jpg';
import SwetaNew from '../../assets/images/Administrative Staff/swetaNEW.jpg';
import Tallulah from '../../assets/images/Administrative Staff/tal.jpeg';
import EstateEngg from '../../assets/images/Administrative Staff/estate engg.jpeg';
import ManmohanAsstReg from '../../assets/images/Administrative Staff/manmohan_asst_reg_2022.jpg';
import DigambarManekar from '../../assets/images/Administrative Staff/digambar.jpg';
import AnandGachchinamath from '../../assets/images/Administrative Staff/anand.jpg';
import AOP from '../../assets/images/Administrative Staff/aop.png';
import ReshmaNoronha from '../../assets/images/Administrative Staff/reshma.jpeg';
import StenoPhoto from '../../assets/images/Administrative Staff/steno_photograph.jpg';
import NamrataG from '../../assets/images/Administrative Staff/Namrata_G.jpg';
import KarthiPhoto from '../../assets/images/Administrative Staff/recent_karthi_photo.jpg';
import SandeepJai from '../../assets/images/Administrative Staff/sandeep_jai.jpg';
import SupriyaTiwe from '../../assets/images/Administrative Staff/supriya.jpg';
import PritamNageshkar from '../../assets/images/Administrative Staff/pritam_Nageshkar.jpg';
import DiptiGaude from '../../assets/images/Administrative Staff/Dipti.jpg';
import Tejubi from '../../assets/images/Administrative Staff/tejubi.jpg';
import Asmita from '../../assets/images/Administrative Staff/asmita.jpeg';
import KishorPariyekar from '../../assets/images/Administrative Staff/kishor.jpg';
import Kumaraguru from '../../assets/images/Administrative Staff/kumaraguru.jpg';
import ArchanaMisal from '../../assets/images/Administrative Staff/archana.jpg';

const AdministrativeStaff = () => {
    const staffData = [
        {
            name: "Mr. Amit Kabiraj",
            designation: "Assistant Registrar",
            department: "Administration",
            email: "akabiraj@nitgoa.ac.in",
            phone: "Extension No.: 0832-2404422 (Internal)",
            image: AmitKabiraj
        },
        {
            name: "Mr. Amit Naik",
            designation: "Junior Assistant",
            department: "Administration",
            email: "amit.naik@nitgoa.ac.in",
            phone: "Extension No.: 0832-2404218 (Internal)",
            image: AmitNaik
        },
        {
            name: "Ms. Rashmi",
            designation: "Assistant Librarian",
            department: "Library",
            email: "rashmi@nitgoa.ac.in",
            phone: "Extension No.: 0832-2404399 (Internal)",
            image: RashmiAsstLib
        },
        {
            name: "Ms. Sweta",
            designation: "Technical Assistant",
            department: "Administration",
            email: "sweta@nitgoa.ac.in",
            phone: "Extension No.: 0832-2404533 (Internal)",
            image: SwetaNew
        },
        {
            name: "Ms. Tallulah Rodrigues",
            designation: "Assistant Registrar",
            department: "Administration",
            email: "tallulah@nitgoa.ac.in",
            phone: "Extension No.: 0832-2404826 (Internal)",
            image: Tallulah
        },
        {
            name: "Estate Engineer",
            designation: "Estate Engineer",
            department: "Estate Management",
            email: "estate@nitgoa.ac.in",
            phone: "Extension No.: 0832-2404237 (Internal)",
            image: EstateEngg
        },
        {
            name: "Mr. Manmohan Sakhuja",
            designation: "Assistant Registrar",
            department: "Accounts | Establishment | General Administration | Student Cell",
            email: "msakhuja@nitgoa.ac.in",
            phone: "Extension No.: 0832-2404218 (Internal)",
            image: ManmohanAsstReg
        },
        {
            name: "Mr. Digamber D. Manekar",
            designation: "Accountant",
            department: "Administration",
            email: "digamber.manekar@nitgoa.ac.in",
            phone: "Extension No.: 0832-2404422 (Internal)",
            image: DigambarManekar
        },
        {
            name: "Mr. Anand Gachchinamath",
            designation: "Superintendent",
            department: "Administration",
            email: "a.anand@nitgoa.ac.in",
            phone: "Extension No.: 0832-2404721 (Internal)",
            image: AnandGachchinamath
        },
        {
            name: "AOP",
            designation: "Administrative Officer",
            department: "Administration",
            email: "aop@nitgoa.ac.in",
            phone: "Extension No.: - (Internal)",
            image: AOP
        },
        {
            name: "Ms. Reshma Noronha",
            designation: "Assistant Section Officer",
            department: "Administration",
            email: "reshma.noronha@nitgoa.ac.in",
            phone: "Extension No.: 0832-2404422 (Internal)",
            image: ReshmaNoronha
        },
        {
            name: "Stenographer",
            designation: "Stenographer",
            department: "Administration",
            email: "steno@nitgoa.ac.in",
            phone: "Extension No.: - (Internal)",
            image: StenoPhoto
        },
        {
            name: "Ms. Namrata G",
            designation: "Junior Assistant",
            department: "Administration",
            email: "namrata@nitgoa.ac.in",
            phone: "Extension No.: - (Internal)",
            image: NamrataG
        },
        {
            name: "Mr. Karthi",
            designation: "Administrative Staff",
            department: "Administration",
            email: "karthi@nitgoa.ac.in",
            phone: "Extension No.: - (Internal)",
            image: KarthiPhoto
        },
        {
            name: "Mr. Sandeep Jai",
            designation: "Administrative Staff",
            department: "Administration",
            email: "sandeep.jai@nitgoa.ac.in",
            phone: "Extension No.: - (Internal)",
            image: SandeepJai
        },
        {
            name: "Ms. Supriya Tiwe",
            designation: "Multi Tasking Staff",
            department: "Administration",
            email: "supriya.tiwe@nitgoa.ac.in",
            phone: "Extension No.: 0832-2404422 (Internal)",
            image: SupriyaTiwe
        },
        {
            name: "Mr. Pritam Nageshkar",
            designation: "Multi Tasking Staff",
            department: "Administration",
            email: "pritam.nageshkar@nitgoa.ac.in",
            phone: "Extension No.: 0832-2404422 (Internal)",
            image: PritamNageshkar
        },
        {
            name: "Ms. Dipti Gaude",
            designation: "Multi Tasking Staff",
            department: "Administration",
            email: "dipti.gaude@nitgoa.ac.in",
            phone: "Extension No.: 0832-2404422 (Internal)",
            image: DiptiGaude
        },
        {
            name: "Ms. Tejubi",
            designation: "Multi Tasking Staff",
            department: "Administration",
            email: "tejubi@nitgoa.ac.in",
            phone: "Extension No.: - (Internal)",
            image: Tejubi
        },
        {
            name: "Ms. Asmita",
            designation: "Multi Tasking Staff",
            department: "Administration",
            email: "asmita@nitgoa.ac.in",
            phone: "Extension No.: - (Internal)",
            image: Asmita
        },
        {
            name: "Mr. Kishor Pariyekar",
            designation: "Multi Tasking Staff",
            department: "Administration",
            email: "kishor.pariyekar@nitgoa.ac.in",
            phone: "Extension No.: 0832-2404695 (Internal)",
            image: KishorPariyekar
        },
        {
            name: "Mr. Aju Milind",
            designation: "Administrative Officer (HR Contract)",
            department: "Administration",
            email: "aju.milind@nitgoa.ac.in",
            phone: "Extension No.: - (Internal)",
            image: Kumaraguru
        },
        {
            name: "Mrs. Archana Darshan Misal",
            designation: "Multi Tasking Staff",
            department: "Administration",
            email: "archana.misal@nitgoa.ac.in",
            phone: "Extension No.: 0832-2404999 (Internal)",
            image: ArchanaMisal
        }
    ];

    return (
        <div className="administrative-staff-page">
            <div className="staff-container">
                <div className="current-department">
                    Administrative Staff
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
                                <p className="staff-department">{staff.department}</p>
                                <div className="staff-contact">
                                    <p><strong>Email:</strong> {staff.email}</p>
                                    <p><strong>Phone:</strong> {staff.phone}</p>
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
