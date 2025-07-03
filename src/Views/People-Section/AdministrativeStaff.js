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
            extension: "0832-2404422",
            image: AmitKabiraj
        },
        {
            name: "Mr. Amit Naik",
            designation: "Junior Assistant",
            department: "Administration",
            email: "amit.naik@nitgoa.ac.in",
            extension: "0832-2404218",
            image: AmitNaik
        },
        {
            name: "Ms. Rashmi",
            designation: "Assistant Librarian",
            department: "Library",
            email: "rashmi@nitgoa.ac.in",
            extension: "0832-2404399",
            image: RashmiAsstLib
        },
        {
            name: "Ms. Sweta",
            designation: "Technical Assistant",
            department: "Administration",
            email: "sweta@nitgoa.ac.in",
            extension: "0832-2404533",
            image: SwetaNew
        },
        {
            name: "Ms. Tallulah Rodrigues",
            designation: "Assistant Registrar",
            department: "Administration",
            email: "tallulah@nitgoa.ac.in",
            extension: "0832-2404826",
            image: Tallulah
        },
        {
            name: "Estate Engineer",
            designation: "Estate Engineer",
            department: "Estate Management",
            email: "estate@nitgoa.ac.in",
            extension: "0832-2404237",
            image: EstateEngg
        },
        {
            name: "Mr. Manmohan Sakhuja",
            designation: "Assistant Registrar",
            department: "Accounts | Establishment | General Administration | Student Cell",
            email: "msakhuja@nitgoa.ac.in",
            extension: "0832-2404218",
            image: ManmohanAsstReg
        },
        {
            name: "Mr. Digamber D. Manekar",
            designation: "Accountant",
            department: "",
            email: "digamber.manekar@nitgoa.ac.in",
            extension: "0832-2404422",
            image: DigambarManekar
        },
        {
            name: "Mr. Anand Gachchinamath",
            designation: "Superintendent",
            department: "",
            email: "a.anand@nitgoa.ac.in",
            extension: "0832-2404721",
            image: AnandGachchinamath
        },
        {
            name: "Dr. S. Munirangarju",
            designation: "Medical and Sports Officer (On Contract)",
            department: "",
            email: "sports.officer@nitgoa.ac.in",
            extension: "0832-2404047",
            image: AOP
        },
        {
            name: "Mrs. Reshma B. Castelino",
            designation: "Technical Assistant/Typist",
            department: "",
            email: "reshma.estevelo@nitgoa.ac.in",
            extension: "0832-2404399",
            image: ReshmaNoronha
        },
        {
            name: "Mrs. Lolitkar Swara Swarnesh",
            designation: "Stenographer",
            department: "",
            email: "swara@nitgoa.ac.in",
            extension: "0832-2404533",
            image: StenoPhoto
        },
        {
            name: "Mrs. Namrata Pragnesh Sawant",
            designation: "Junior Assistant",
            department: "",
            email: "namrata@nitgoa.ac.in",
            extension: "0832-2404826",
            image: NamrataG
        },
        {
            name: "Mr. Karthilayan M.",
            designation: "Junior Assistant [Accounts on Deputation]",
            department: "",
            email: "karthilayan@nitgoa.ac.in",
            extension: "0832-2404237",
            image: KarthiPhoto
        },
        {
            name: "Mr. Sandeep Jaishwar",
            designation: "Junior Assistant",
            department: "",
            email: "sandeep.jaishwar@nitgoa.ac.in",
            extension: "0832-2404569",
            image: SandeepJai
        },
        {
            name: "Mrs. Supriya S Shet Tiwe",
            designation: "Junior Assistant - Dept. of E&E",
            department: "",
            email: "supriya.s.shet@nitgoa.ac.in",
            extension: "0832-2404505",
            image: SupriyaTiwe
        },
        {
            name: "Mr. Pritam Nagarkar",
            designation: "Multi Tasking Staff",
            department: "",
            email: "pritamnagarkar@nitgoa.ac.in",
            extension: "0832-2404341",
            image: PritamNageshkar
        },
        {
            name: "Mrs. Dipti Devilidas Gaude",
            designation: "Multi Tasking Staff",
            department: "",
            email: "dipti@nitgoa.ac.in",
            extension: "0832-2404909",
            image: DiptiGaude
        },
        {
            name: "Mrs. Ajmer Ashok Naik",
            designation: "Safai Karamchari",
            department: "",
            email: "ajmernaik@nitgoa.ac.in",
            extension: "0832-2404423",
            image: Tejubi
        },
        {
            name: "Mr. Vinay Acharya",
            designation: "Social Engineer (HR Contract Basis)",
            department: "",
            email: "vinayacharya@nitgoa.ac.in",
            extension: "",
            image: Asmita
        },
        {
            name: "Mr. Kishor Pariyekar",
            designation: "Junior Assistant (Personnel-PH Contract Basis)",
            department: "",
            email: "pariyekarpo@nitgoa.ac.in",
            extension: "0832-2404695",
            image: KishorPariyekar
        },
        {
            name: "Mr. Aju Milind",
            designation: "Administrative Officer (HR Contract)",
            department: "",
            email: "aju.milind@nitgoa.ac.in",
            extension: "",
            image: Kumaraguru
        },
        {
            name: "Mrs. Archana Darshan Misal",
            designation: "Multi Tasking Staff",
            department: "",
            email: "archana.misal@nitgoa.ac.in",
            extension: "0832-2404999",
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

export default AdministrativeStaff;
