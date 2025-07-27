import React from 'react';
import './Tenders.css';
import useScrollToTop from '../../utils/useScrollToTop';

const Tenders = () => {
    // Handle smooth scroll to top for quick link navigation
    useScrollToTop();
    
    // All tenders from tender.html (complete list in chronological order)
    const tenders = [
        {
            title: "Tender for CA Empanelment at National Institute of Technology Goa(Ref No:-NITG/ADMIN/2025/OW/208 Dated 01.07.2025)",
            pdfPath: "/pdf/tenders/CA Tender 01july2025.pdf",
            isNew: true
        },
        {
            title: "Corrigendum - Video Recording for GIAN Course(Ref No:-NITGOA/ADMIN/CORRIGENDUM/2025/OW/188 Dated 26.06.2025)",
            pdfPath: "/pdf/tenders/Corrigendum_Video_Recording_for_GIAN_Course_26june2025.pdf",
            isNew: true
        },
        {
            title: "Corrigendum-Annual Maintenance Contract for Landscape And Horticulture Works at NIT GOA(Ref No:- NITGOA/ADMIN/CORRIGENDUM/2025/OW/177 Dated 19.06.2025)",
            pdfPath: "/pdf/tenders/HORTICULTURE 19june2025.pdf",
            isNew: true
        },
        {
            title: "Corrigendum - Expression of Interest for Running Cafeteria at National Institute of Technology Goa Campus(Ref No:- NITGOA/ADMIN/CORRIGENDUM/2025/OW/169 Dated 12.06.2025)",
            pdfPath: "/pdf/tenders/Extension cafeteria 12june2025.pdf",
            isNew: true
        },
        {
            title: "Video Recording for GIAN Course(Ref No:-NITGOA/EEE/GIAN/PUR/2025-26/OW/167 Dated 09.06.2025)",
            pdfPath: "/pdf/tenders/Video Recording for GIAN EEE 9june2025.pdf",
            isNew: true
        },
        {
            title: "Corrigendum-Expression of Interest for Running Cafeteria at National Institute of Technology Goa Campus(Ref No:-NITGOA/ADMIN/CORRIGENDUM/2025/OW/166 Dated 04.06.2025)",
            pdfPath: "/pdf/tenders/CorrigendumCafeteria 4june2025.pdf",
            isNew: true
        },
        {
            title: "Expression of Interest for Running Cafeteria at National Institute of Technology Goa Campus (Ref No:- NITG/ADMIN/2025/OW/158 Dated 21.05.2025)",
            pdfPath: "/pdf/tenders/New Tender Cafetaria 22may2025.pdf",
            isNew: true
        },
        {
            title: "Annual Maintenance Contract for Landscape And Horticulture Works at NIT GOA (Ref No:- NITG/PUR/FMC/2025-26/OW/157 Dated 21.05.2025.)",
            pdfPath: "/pdf/tenders/Horticulture Tender.pdf",
            isNew: true
        },
        {
            title: "Corrigendum - Tender for Running General Store at NIT Goa Campus, Cuncolim-Goa (Ref. No. NITGOA/Gen Store/2025/OW/135 dated 24.04.2025)",
            pdfPath: "/pdf/tenders/corrigendum running general stores 24april2025.pdf",
            isNew: true
        },
        {
            title: "Corrigendum - Tender for Installation and Erection of a Land Based Mobile Tower at NIT Goa Cuncolim(Ref. No. NITGOA/ADMIN/CORRIGENDUM/2025/OW/124 dated 15.04.2025)",
            pdfPath: "/pdf/tenders/Corrigendum Mobile Tower 15april2025.pdf",
            isNew: true
        },
        {
            title: "Corrigendum - Running General Store at NIT GOA.(Ref. No. NITGOA/Gen Store/CORRIGENDUM/2025/OW/120 dated 09.04.2025)",
            pdfPath: "/pdf/tenders/CorrigendumRunningGeneralStore 9april2025.pdf",
            isNew: true
        },
        {
            title: "Corrigendum - Establishment of Cricket Practice Net at NIT Goa Campus, Cuncolim - Goa.(Ref. No.NITGOA/SPORTS/CORRIGENDUM/PUR/OW/121 dated 09.04.2025)",
            pdfPath: "/pdf/tenders/CorrigendumCricketPracticeNet 9april2025.pdf",
            isNew: true
        },
        {
            title: "Corrigendum-Tender for Installation and Erection of a Land Based Mobile Tower at NIT Goa Cuncolim(Ref. No. NITGOA/ADMIN/CORRIGENDUM/2025/OW/108 dated 01.04.2025)",
            pdfPath: "/pdf/tenders/Corrigendum Installation and Erection of a Land Based Mobile Tower 1April2025.pdf",
            isNew: true
        },
        {
            title: "Procurement of Sanitary Napkins Incinerator (Ref No:- NITGOA/HOSTEL/PUR/2025/OW/103 dated 26.03.2025)",
            pdfPath: "/pdf/tenders/Tender Incinerator 27march2025.pdf",
            isNew: true
        },
        {
            title: "Establishment of Cricket Practice Net at NIT GOA Campus, Cuncolim-Goa(Ref No:NITGOA/SPORTS/PUR/OW/84 Dated 11.03.2025)",
            pdfPath: "/pdf/tenders/Tender for Cricket Net 17march2025.pdf",
            isNew: true
        },
        {
            title: "Running General Store at NIT GOA(Ref No:-NITGOA/Gen Store/2025/OW/88 Dated 13.03.2025)",
            pdfPath: "/pdf/tenders/Tender for running general store 17march2025.pdf",
            isNew: true
        },
        {
            title: "Corrigendum-Tender for Installation and Erection of a Land Based Mobile Tower at NIT Goa Cuncolim(Ref No:-NITGOA/ADMIN/CORRIGENDUM/2025/OW/77 dated 06.03.2025)",
            pdfPath: "/pdf/tenders/Corrigendum - Tender for Installation and Erection of a Land Based Mobile Tower.pdf",
            isNew: true
        },
        {
            title: "Video Recording for GIAN Course(Ref No:- NITG/CSE/GIAN/PUR/2025/OW/62 dated 26.02.2025)",
            pdfPath: "/pdf/tenders/VideoRecordingfor GIAN 26feb2025.pdf",
            isNew: true
        },
        {
            title: "Tender for Installation and Erection of a Land Based Mobile Tower at NIT Goa Cuncolim. (Ref No:-NITG/ADMIN/2025/OW/58 dated 19.02.2025)",
            pdfPath: "/pdf/tenders/Tender for installation of mobile tower 20feb2025.pdf",
            isNew: true
        },
        {
            title: "Corrigendum - Tender for Running General Store(Ref. No. NITGOA/ADMIN/CORRIGENDUM/2025/OW/09 dated 10.01.2025)",
            pdfPath: "/pdf/tenders/TenderRunningGeneral store 10jan2025.pdf",
            isNew: true
        },
        {
            title: "Corrigendum - Tender for Running General Store(Ref No. NITGOA/ADMIN/CORRIGENDUM/2024/OW/495 dated 05.12.2024)",
            pdfPath: "/pdf/tenders/CorrigendumRunningGeneralStore 5dec2024.pdf",
            isNew: true
        },
        {
            title: "Tender for Running General Store(NITG/ADMIN/2024/OW/463 Dated 14-11-2024)",
            pdfPath: "/pdf/tenders/TenderRunningGeneralStore 14nov2024.pdf",
            isNew: true
        },
        {
            title: "Tender for Running Stationery Shop(Ref. No. NITG/ADMIN/2024/OW/430 dated 21.10.2024)",
            pdfPath: "/pdf/tenders/Tender_StationeryShop 21oct2024.pdf",
            isNew: true
        },
        {
            title: "Corrigendum - Venue Preparations for the 10th Convocation 2024(Ref. No. NITGOA/CONV 2024/PUR/OW/386 dated 11.09.2024)",
            pdfPath: "/pdf/tenders/Corrigendum for 10th Convocation Venue Preparation16sept2024.pdf",
            isNew: true
        },
        {
            title: "Venue Preparations for the 10th Convocation 2024(Ref. No. NITGOA/CONV 2024/PUR/OW/386 dated 11.09.2024)",
            pdfPath: "/pdf/tenders/TenderVenue 11sept2024.pdf",
            isNew: true
        },
        {
            title: "Audio/Photography for the 10th Convocation of NIT Goa (Ref. No. NITGOA/CONV 2024/PUR/OW/352 dated 03.09.2024)",
            pdfPath: "/pdf/tenders/10thConvocation Audio and Photography 3september2024.pdf",
            isNew: true
        },
        {
            title: "Catering services for the 10th convocation of NIT Goa",
            pdfPath: "/pdf/tenders/Catering Service 30august2024.pdf",
            isNew: true
        },
        {
            title: "Convocation Dress for 10th Convocation 2024(Ref.No. NITGOA/CONV 2024/PUR/OW/300 dated 21.08.2024)",
            pdfPath: "/pdf/tenders/TenderConvocation Dress 21august2024.pdf",
            isNew: true
        },
        {
            title: "Design, Editing and Colour printing of Convocation Brochure for 10th Convocation 2024(Ref. No. NITGOA/Conv 2024/PUR/OW/301 dated 21.08.2024)",
            pdfPath: "/pdf/tenders/Tender 10convo brochure design 21august2024.pdf",
            isNew: true
        },
        {
            title: "Supply of Library Books at NIT Goa Campus(Reference No: NITGOA/PUR/LIBRARY/2024/OW/197 Dated 03.06.2024)",
            pdfPath: "/pdf/tenders/Tender Library Books 3june2024.pdf",
            isNew: true
        },
        {
            title: "Venue Preparation for the event Saavyas 2024.",
            pdfPath: "/pdf/tenders/tenderSaavyas 2april2024.pdf",
            isNew: false
        },
        {
            title: "Cancellation of Tender - Repair and maintenance work of GEC Hostel - III left wing (G+1) 28 rooms NITGOA/PUR/HOSTEL/OW/444 dated 04.10.2023",
            pdfPath: "/pdf/tenders/Cancellation_of_Tender_4oct2023.pdf",
            isNew: false
        },
        {
            title: "Corrigendum - Catering service for 9th Convocation at NIT Goa campus, Cuncolim - Goa (NITGOA/PUR/CORRIGENDUM/2023-24/OW/424 Date: 29/09/2023)",
            pdfPath: "/pdf/tenders/CORRIGENDIUM_CATERING_SERVICE_29sept2023.pdf",
            isNew: false
        },
        {
            title: "Renewal of ANSYS Software License(Ref No.NITGOA/OT/MECH/2023-24/OW/403 Dated 21.09.2023)",
            pdfPath: "/pdf/tenders/Renewal_of_Ansys_software_21sept2023.pdf",
            isNew: false
        },
        {
            title: "Corrigendum - Convocation Degree Folder(Ref No.NITGOA/CONV PUR/OW/358 Dated 13.09.2023)",
            pdfPath: "/pdf/tenders/Corrigendum_18sept2023.pdf",
            isNew: false
        },
        {
            title: "Catering Service for the 9th convocation at NIT Goa Campus, Cuncolim- Goa(Ref No.NITGOA/CONV 2023/PUR/OW/387 dated 15.09.2023)",
            pdfPath: "/pdf/tenders/Tender_for_food_service_for_convocation_15sept2023.pdf",
            isNew: false
        },
        {
            title: "Corrigendum - Convocation Venue Preparation(Ref No.NITGOA/PUR/CORRIGENDUM/2023-24/OW/386 dated 15.09.2023)",
            pdfPath: "/pdf/tenders/Corrigendum_15sept2023.pdf",
            isNew: false
        },
        {
            title: "Corrigendum for the Annual Maintenance Contract for DG Set Ref. No. NITGOA/PUR/Corrigendum/2023-24/OW/364 dated 13.09.2023.",
            pdfPath: "/pdf/tenders/Extension_DG_Set_13sept2023.pdf",
            isNew: false
        },
        {
            title: "Convocation Venue Preparation(Ref No.NITGOA/CONV 2023/PUR/OW/362 dated 13.09.2023)",
            pdfPath: "/pdf/tenders/Convocation_Venue_Preparation_13sept2023.pdf",
            isNew: false
        },
        {
            title: "Convocation Degree Folder(Ref No.NITGOA/CONV 2023/PUR/OW/358 dated 13.09.2023)",
            pdfPath: "/pdf/tenders/TenderDegree_Folder_13sept2023.pdf",
            isNew: false
        },
        {
            title: "Convocation Dress(Ref No.NITGOA/CONV 2023/PUR/OW/361 dated 13.09.2023)",
            pdfPath: "/pdf/tenders/Convocation_Dress_13sept2023.pdf",
            isNew: false
        },
        {
            title: "Transportation Service for 9th Convocation 2023(Ref.No. NITGOA/Conv 2023/PUR/OW/351 dated 08.09.2023)",
            pdfPath: "/pdf/tenders/Transportation_Service_for_Convocation_8september2023.pdf",
            isNew: false
        },
        {
            title: "Audio/Photography for 9th Convocation(Ref. No. NITGOA/Conv 2023/PUR/OW/350 dated 08.09.2023)",
            pdfPath: "/pdf/tenders/Audio_and__Photography_8sept2023.pdf",
            isNew: false
        },
        {
            title: "Convocation Brochure for 9th Convocation 2023(Ref. No. NITGOA/Conv 2023/PUR/OW/349 dated 08.09.2023)",
            pdfPath: "/pdf/tenders/Convocation_Brochure_8sept2023.pdf",
            isNew: false
        },
        {
            title: "Corrigendum for the Annual Maintenance Contract for DG Set(Ref. No. NITGOA/PUR/Corrigendum/2023-24/OW/326dated 22.08.2023)",
            pdfPath: "/pdf/tenders/Extension_of_AMC_22august2023.pdf",
            isNew: false
        },
        {
            title: "Corrigendum for the Repair and maintenance work at GEC Hostel-3 - 28 rooms(Ref. No. NITGOA/HOSTEL/Corrigendum/2023-24/OW/319 dated 16.08.2023)",
            pdfPath: "/pdf/tenders/Corrigendum_-_Repair_and_Maintenance_work_at_GEC_Hostel_16august2023.pdf",
            isNew: false
        },
        {
            title: "Corrigendum for the Repair work at D1, D3, D4 and D6 at Transit Campus of NIT GOA(Ref.No.NITGOA/HOSTEL/Corrigendum/2023-24/OW/317 dated 16.08.2023)",
            pdfPath: "/pdf/tenders/Corrigendum_-_Repair_of_quarters_in_Transit_Campus_16august2023.pdf",
            isNew: false
        },
        {
            title: "1. Stationary and computer consumables 2. Consumables (Ref No. NITGOA/MECH/PUR/2023-24/OW/304 dated 08.08.2023)",
            pdfPath: "/pdf/tenders/Consumables_8august2023.pdf",
            isNew: false
        },
        {
            title: "Repair work at D1, D3, D4 and D6 at Transit Campus of NIT GOA(Ref. No. NITGOA/OT/HOSTEL/WORKS/2023-24/OW/298 dated 03.08.2023)",
            pdfPath: "/pdf/tenders/Repair_Hostels_5august2023.pdf",
            isNew: false
        },
        {
            title: "Repair and maintenance work at Hostel-3(Ref. No. NITGOA/OT/HOSTEL/WORKS/2023-24/OW/299 dated 03.08.2023)",
            pdfPath: "/pdf/tenders/Repair_works_GEC_Hostel_4august2023.pdf",
            isNew: false
        },
        {
            title: "Annual Maintenance Contract for DG Set(Ref. No.NITGOA/EEE/PUR/2023-24/OW/294 dated 28.07.2023)",
            pdfPath: "/pdf/tenders/AMC_Tender_28july2023.pdf",
            isNew: false
        },
        {
            title: "Renewal of Subscription of Turnitun (Ref. No. NITGOA/PUR/LIBRARY/2023-24/OW/292 dated 28.07.2023)",
            pdfPath: "/pdf/tenders/Subscription_of_Turnitin_28july2023.pdf",
            isNew: false
        },
        {
            title: "Subscription of CMIE Prowess IQ Database(Ref. No.NITGOA/PUR/LIBRARY/2023-24/OW/293 dated 28.07.2023)",
            pdfPath: "/pdf/tenders/CMIE_Prowess_IQ_Database_28july2023.pdf",
            isNew: false
        },
        {
            title: "Repair work for blockage of sewer and waste lines including soak pit for D1,D3,D4 hostels Ref.No.NITGOA/OT/HOSTEL/WORKS/2023-24/OW/281 dated 21.07.2023",
            pdfPath: "/pdf/tenders/Soakpit_tender_21july2023.pdf",
            isNew: false
        },
        {
            title: "Tender For Providing Canteen Service at NIT GOA",
            pdfPath: "/pdf/tenders/Canteen_Tender_7july2023.pdf",
            isNew: false
        },
        {
            title: "Procurement of Monitor (Ref No.NITGOA/CSE/PUR/2023-24/OW/198 Dt.22.05.2023)",
            pdfPath: "/pdf/tenders/Tender_for_Monitor_22may2023.pdf",
            isNew: false
        },
        {
            title: "Procurement of Server Rack(Ref No.NITGOA/CSE/PUR/2023-24/OW/197 Dt.22.05.2023)",
            pdfPath: "/pdf/tenders/Tender_for_Server_Rack_22may2023.pdf",
            isNew: false
        },
        {
            title: "Various repairs to toilets and other affected areas of E/E and E/C quarters of NIT GOA",
            pdfPath: "/pdf/tenders/tender_22dec2022.pdf",
            isNew: false
        },
        {
            title: "Repair of UPS and Replacement of Battery with buy back of old batteries",
            pdfPath: "/pdf/tenders/tender_16dec2022_.pdf",
            isNew: false
        },
        {
            title: "Supply of Library Books at NIT GOA Campus,Farmagudi(NITGOA/OT/LIBRARY/2022-23/OW/414 dated Dated:12.12.2022)",
            pdfPath: "/pdf/tenders/Library_Books_Tender_12dec2022.pdf",
            isNew: false
        },
        {
            title: "Answer Booklets of 24 pages-4000 nos.(NITGOA/EXAM CELL/PUR/2022-23/OW/386 dated Dated:11.11.2022)",
            pdfPath: "/pdf/tenders/Notice_Answer_Booklet_11nov2022.pdf",
            isNew: false
        },
        {
            title: "Licensing and Subscription of LabView Software for 3 years-Full Software Bundle(NITGOA/CSE/SERB-IMPRINT/PUR/2022-23/OW/382 Dated:04.11.2022)",
            pdfPath: "/pdf/tenders/Licensing_and_Subscription_of_Lab_View_Software_for_3_yrs_4nov2022.pdf",
            isNew: false
        },
        {
            title: "Corrigendum for extension for Institute Magazine (NITGOA/CORRIGENDUM/2022-23/OW/371 Dated: 20.10.2022)",
            pdfPath: "/pdf/tenders/Institute_Magazine_20oct2022.pdf",
            isNew: false
        },
        {
            title: "Corrigendum for Extension of Notice Inviting Quotation for Procurement of Institute Magazine",
            pdfPath: "/pdf/tenders/Corrigendum_Extension_Institute_Magazine_7oct2022.pdf",
            isNew: false
        },
        {
            title: "Corrigendum for Extension of Tender for Procurement of Projector Qty 04 Nos",
            pdfPath: "/pdf/tenders/Extension_of_projector_6oct2022.pdf",
            isNew: false
        },
        {
            title: "Second Extension of Tender for Empanelment of Pharmacy",
            pdfPath: "/pdf/tenders/Second_Extension_of_Empanellemnt_of_Pharmacy_04oct2022.pdf",
            isNew: false
        },
        {
            title: "Corrigendum for Extension of Geology Lab Equipments(NITGOA/CORRIGENDUM/2022-23/OW/321 Dated:27.09.2022)",
            pdfPath: "/pdf/tenders/geology_lab_equipment_extension_27sept2022.pdf",
            isNew: false
        },
        {
            title: "Procurement of Institute Magazine(NITGOA/INST/PUR/2022/OW/320 Dated: 27.09.2022)",
            pdfPath: "/pdf/tenders/institute_magazine_27sept2022.pdf",
            isNew: false
        },
        {
            title: "Tansportation Service for 8th Convocation 2022 held at Raj Bhavan Dona Paula (NITGOA/CONV2022/PUR/OW/312 Dated: 16.09.2022)",
            pdfPath: "/pdf/tenders/TRANSPORT_SERVICE_FOR_CONVOCATION_16sept2022.pdf",
            isNew: false
        },
        {
            title: "Procurement of Projector (NITGOA/PUR/DEAN ACAD/2-22-23/OW/310 Dtd: 15.09.2022)",
            pdfPath: "/pdf/tenders/Tender_Projector_15sept2022.pdf",
            isNew: false
        },
        {
            title: "Corrigendum for Extension of Tender for Empanelment of Pharmacy at NIT Goa",
            pdfPath: "/pdf/tenders/Tender_Empanellement_of_Pharmacy_15sept2022.pdf",
            isNew: false
        },
        {
            title: "Convocation Stoles (NITGOA/CONV2022/PUR/OW/299 Dated: 09.09.2022)",
            pdfPath: "/pdf/tenders/Convocation_Stole_9sept2022.pdf",
            isNew: false
        },
        {
            title: "Geology Lab Equipment (NITGOA/CIVIL/PUR/2022-23/OW/298 Dated: 09.09.2022)",
            pdfPath: "/pdf/tenders/Geology_Lab_Equipment_9sept2022.pdf",
            isNew: false
        },
        {
            title: "VMware vSphere Essential Kit with a support of 03 Years (Ref No: NITGOA/CSE/SERB-IMPRINT/PUR/2022-23/OW/297 DATED: 09.09.2022",
            pdfPath: "/pdf/tenders/VMware_vSphere_Essentials_kit_9sept2022.pdf",
            isNew: false
        },
        {
            title: "Convocation Brochures Design and Printing (NITGOA/CONV2022/PUR/2022/OW/270 Dated:29.08.2022",
            pdfPath: "/pdf/tenders/convocation_brouchers_29aug2022.pdf",
            isNew: false
        },
        {
            title: "Licensing and Subscription of Lab View Software for 03 Years- Full Software Bundle NITGOA/CSE/SERB-IMPRINT/PUR/2022-23/OW/276 DATED: 07/09/2022",
            pdfPath: "/pdf/tenders/Lab_View_Software_7sept2022.pdf",
            isNew: false
        },
        {
            title: "Quotation Notice for Procurement of Convocation-2022 folders",
            pdfPath: "/pdf/tenders/tender_26aug2022.pdf",
            isNew: false
        },
        {
            title: "Tender for Empanelment of Pharmacy at NIT Goa",
            pdfPath: "/pdf/tenders/Tender_for_Empanellement_of_Pharmacy_17aug2022.pdf",
            isNew: false
        },
        {
            title: "Repair renovation and strengthening of building D1 for NITGoa Hostel at farmagudi(Ref No:NITGOA/OT/HOSTEL/WORKS/22-23/OW/233 Dated:26.07.2022)",
            pdfPath: "/pdf/tenders/D1_Hostel_Repair_26july2022.pdf",
            isNew: false
        },
        {
            title: "Notice Inviting Quotation - Physics Lab Consumables ( NITGOA/PUR/APS/2022-23/OW/211 Dated: 20.06.2022)",
            pdfPath: "/pdf/tenders/quotation_for_PhysicsLab_20june2022.pdf",
            isNew: false
        },
        {
            title: "CORRIGENDUM-MANUAL HYDRAULIC PELLITIZER OR PELLET PRESS AND DESKTOP FILAMENT EXTRUDER",
            pdfPath: "/pdf/tenders/CORRIGENDUM-MANUAL_HYDRAULIC_PELLITIZER_3june2022.pdf",
            isNew: false
        },
        {
            title: "Tender for Water Supply to NITGOA AS ON CALL BASIS(NITGOA/PUR/HOSTEL/2022-23/OW/175 DTD:27.05.2022)",
            pdfPath: "/pdf/tenders/Water_Tender_27may2022.pdf",
            isNew: false
        },
        {
            title: "Corrigendum-Extension of Tender Submission dated for MATLAB Procurement-NITGOA/INST/2022-23/OW/143",
            pdfPath: "/pdf/tenders/Corrigendum-Extension_of_Matlab_Tender_20may2022.pdf",
            isNew: false
        },
        {
            title: "Corrigendum-Extension of Due date for submission of bid for Repair of CNC Milling Machine",
            pdfPath: "/pdf/tenders/Corrigendum-Repair_of_CNC_Milling_Machine_13may2022.pdf",
            isNew: false
        },
        {
            title: "Tender for Procurement of Manual Hydraulic Pelletizer or Pellet Press and Desktop Filament Extruder",
            pdfPath: "/pdf/tenders/Procurement_of_Manual_Hydraulic_Pelletizer_and_Desktop_Filament_Extruder_11may2022.pdf",
            isNew: false
        },
        {
            title: "CORRIGENDUM-EXTENSION for submission of bids for Repair of CNC Milling Machine",
            pdfPath: "/pdf/tenders/Corrigendum-Extension_of_Repair_of_CNC_Milling_Machine_02may2022.pdf",
            isNew: false
        },
        {
            title: "Corrigendum-Licesning and Subscription of Lab View Software for 03 years-Full Software Bundle",
            pdfPath: "/pdf/tenders/Corrigendum-Licensing_and_Subscription_of_lab_view_software_27april2022.pdf",
            isNew: false
        }
    ];

    const handleDownload = (pdfPath) => {
        window.open(pdfPath, '_blank');
    };

    return (
        <div className="tender-page-container">
            <div className="tender-page-header">
                    <h1 className="tender-page-title">Tenders</h1>
            </div>
            <div className="tender-page-content">
                <div className="tender-page-section">
                    <div className="tender-page-list">
                        {tenders.map(tender => (
                            <a 
                                key={tender.pdfPath}
                                href={tender.pdfPath}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="tender-page-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDownload(tender.pdfPath);
                                }}
                            >
                                {tender.title}
                                {tender.isNew && <span className="tender-page-new-badge">NEW</span>}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tenders;
