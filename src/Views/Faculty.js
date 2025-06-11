import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Faculty.css';

// Import hero image
import heroImg1 from '../assets/images/Home/HeroImages/HeroImg1.jpg';

// Import faculty images
// CSE Department
import VeenaThenkanidiyoor from '../assets/images/Faculty/CSE/Dr. Veena Thenkanidiyoor.png';
import DamodarReddyEdla from '../assets/images/Faculty/CSE/Dr. Damodar Reddy Edla.png';
import Purushothama from '../assets/images/Faculty/CSE/Dr. Purushothama.jpg';
import KeshavamurthyBN from '../assets/images/Faculty/CSE/Dr. Keshavamurthy B.N..png';
import SMini from '../assets/images/Faculty/CSE/Dr. S. Mini.png';
import VenkatanareshbabuKuppili from '../assets/images/Faculty/CSE/Dr. Venkatanareshbabu Kuppili.jpg';
import ModiChiragNavinchandra from '../assets/images/Faculty/CSE/Dr. Modi Chirag Navinchandra.png';
import Antara from '../assets/images/Faculty/CSE/Antara.jpg';
import Kashinath from '../assets/images/Faculty/CSE/kashinath.jpg';
import MeenakshiPanda from '../assets/images/Faculty/CSE/meenakshipanda.jpeg';
import ParavatiCSE from '../assets/images/Faculty/CSE/paravati_cse.png';
import Pasha from '../assets/images/Faculty/CSE/pasha.jpg';
import Srividya from '../assets/images/Faculty/CSE/srividya.jpeg';

// ECE Department
import AnirbanChatterjee from '../assets/images/Faculty/ECE/Dr. Anirban Chatterjee.png';
import DeveshDwivedi from '../assets/images/Faculty/ECE/Dr. Devesh Dwivedi.png';
import LalatInduGiri from '../assets/images/Faculty/ECE/Dr. Lalat Indu Giri.png';
import LokeshKumarBramhane from '../assets/images/Faculty/ECE/Dr. Lokesh Kumar Bramhane.png';
import MallikarjunErramshetty from '../assets/images/Faculty/ECE/Dr. Mallikarjun Erramshetty.png';
import NithinKumarYB from '../assets/images/Faculty/ECE/Dr. Nithin Kumar Y.B..png';
import PragatiPatel from '../assets/images/Faculty/ECE/Dr. Pragati Patel.png';
import PrashanthGR from '../assets/images/Faculty/ECE/Dr. Prashanth G.R.jpg';
import ShivnarayanPatidar from '../assets/images/Faculty/ECE/Dr. Shivnarayan Patidar.png';
import TrilochanPanigrahi from '../assets/images/Faculty/ECE/Dr. Trilochan Panigrahi.jpg';
import Vasantha from '../assets/images/Faculty/ECE/Dr. Vasantha (1).jpg';
import DrVeerakumar from '../assets/images/Faculty/ECE/drveerakumar.jpeg';

// EEE Department
import AnkeshwarapuSunil from '../assets/images/Faculty/EEE/Ankeshwarapu Sunil.jpg';
import AmolRahulkar from '../assets/images/Faculty/EEE/Dr. Amol D. Rahulkar.jpg';
import AnudeviSamuel from '../assets/images/Faculty/EEE/Dr. Anudevi Samuel.png';
import VenugopalReddy from '../assets/images/Faculty/EEE/Dr. B. Venugopal Reddy.png';
import Vyjayanthi from '../assets/images/Faculty/EEE/Dr. C.Vyjayanthi.png';
import Raghavendra from '../assets/images/Faculty/EEE/Dr. K Raghavenrda Reddy.jpeg';
import SoumitraDas from '../assets/images/Faculty/EEE/Dr. Soumitra Das.png';
import SreerajES from '../assets/images/Faculty/EEE/Dr. Sreeraj E S.png';
import SureshMikkili from '../assets/images/Faculty/EEE/Dr. Suresh Mikkili.png';
import SenthamizSelvan from '../assets/images/Faculty/EEE/SENTHAMIZH SELVAN S.jpeg';

// MCE Department
import ChaitanyaVundru from '../assets/images/Faculty/MCE/Chaitanya Vundru.jpeg';
import AbhijitSarkar from '../assets/images/Faculty/MCE/Dr. Abhijit Sarkar.png';
import SanthiB from '../assets/images/Faculty/MCE/Dr. B. Santhi.png';
import DariusBarreto from '../assets/images/Faculty/MCE/Dr. Darius Diogo Barreto.png';
import GaurangRuhela from '../assets/images/Faculty/MCE/Dr. Gaurang Ruhela.png';
import PrasenjitDey from '../assets/images/Faculty/MCE/Dr. PRASENJIT DEY.png';
import PravinPawar from '../assets/images/Faculty/MCE/Dr. Pravin Anandrao Pawar.png';
import SamarSinghal from '../assets/images/Faculty/MCE/Samar Singhal.jpg';
import AnimeshMCE from '../assets/images/Faculty/MCE/animesh.jpeg';
import HiruMCE from '../assets/images/Faculty/MCE/hiru.jpg';
import ThirupathiMCE from '../assets/images/Faculty/MCE/thirupathi.jpg';

// CVE Department
import BapiMondal from '../assets/images/Faculty/CVE/Bapi Mondal.jpg';
import HarikumarM from '../assets/images/Faculty/CVE/Dr. Harikumar M.png';
import SaurabhUpadhyay from '../assets/images/Faculty/CVE/Dr. Saurabh Upadhyay.jpg';
import ORJaiswal from '../assets/images/Faculty/CVE/Prof. O. R. Jaiswal.png';
import RanendraBhowmik from '../assets/images/Faculty/CVE/Ranendra Nath Bhowmik.jpg';
import ChandraCVE from '../assets/images/Faculty/CVE/chandra_cve.jpeg';
import ManiCVE from '../assets/images/Faculty/CVE/mani.jpg';
import SaiduluCVE from '../assets/images/Faculty/CVE/saidulu.png';
import SuryatejaCVE from '../assets/images/Faculty/CVE/suryateja.jpg';
import VNMCVE from '../assets/images/Faculty/CVE/vnm.jpeg';

// APS Department
import ShivaKumarReddy from '../assets/images/Faculty/APS/Dr. Gundlapally Shiva Kumar Reddy.png';
import Shangerganesh from '../assets/images/Faculty/APS/Dr. L. Shangerganesh.png';
import LasithaP from '../assets/images/Faculty/APS/Dr. Lasitha P.png';
import RagojuRavi from '../assets/images/Faculty/APS/Dr. Ragoju Ravi.png';
import RaviPrasad from '../assets/images/Faculty/APS/Dr. Ravi Prasad K. J..png';
import SaidiReddy from '../assets/images/Faculty/APS/Dr. Saidi Reddy Parne.png';
import SumanGandi from '../assets/images/Faculty/APS/Dr. Suman Gandi.png';
import VelavanKathirvelu from '../assets/images/Faculty/APS/Dr. Velavan Kathirvelu.png';

// HSS Department
import SaraniMondal from '../assets/images/Faculty/HSS/Dr. Sarani Ghosal Mondal.jpg';
import SunilKumar from '../assets/images/Faculty/HSS/Dr. Sunil Kumar.png';
import UnaisKT from '../assets/images/Faculty/HSS/Dr. Unais KT.png';
import VishanupadBarve from '../assets/images/Faculty/HSS/Mr. Vishnupad Barve.jpg';

const Faculty = () => {
    const [selectedDepartment, setSelectedDepartment] = useState('CSE');
    const [searchParams] = useSearchParams();

    // Handle URL parameters for department selection
    useEffect(() => {
        const deptParam = searchParams.get('dept');
        if (deptParam) {
            const deptCode = deptParam.toUpperCase();
            const validDepts = ['CSE', 'ECE', 'EEE', 'MCE', 'CVE', 'APS', 'HSS'];
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
        { code: 'APS', name: 'Applied Sciences' },
        { code: 'HSS', name: 'Humanities & Social Sciences' }
    ];

    const facultyData = {
        CSE: [
            {
                name: 'Dr. Veena Thenkanidiyoor',
                designation: 'Associate Professor & HOD',
                department: 'Computer Science and Engineering',
                email: 'veena@nitgoa.ac.in',
                phone: 'Extension No.: 6854 (Internal)',
                researchAreas: 'Artificial Intelligence, Cognitive Neuroscience, Brain Computer Interface, Medical Imaging, Wireless Sensor Networks, Machine Learning/Deep Learning',
                image: VeenaThenkanidiyoor,
                isHOD: true
            },
            {
                name: 'Dr. Damodar Reddy Edla',
                designation: 'Associate Professor',
                department: 'Computer Science and Engineering',
                email: 'dr.damodar@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Machine Learning, Data Mining, Big Data Analytics, IoT',
                image: DamodarReddyEdla
            },
            {
                name: 'Dr. Purushothama B.R',
                designation: 'Associate Professor',
                department: 'Computer Science and Engineering',
                email: 'purushothama@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Information Security, Cryptography, Cyber Security, IoT Management, Security Analytics',
                image: Purushothama
            },
            {
                name: 'Dr. Keshavamurthy B.N.',
                designation: 'Associate Professor',
                department: 'Computer Science and Engineering',
                email: 'keshavamurthy@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Data Mining, Privacy Preserving Data Mining, Information Security',
                image: KeshavamurthyBN
            },
            {
                name: 'Dr. S. Mini',
                designation: 'Associate Professor',
                department: 'Computer Science and Engineering',
                email: 's.mini@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Wireless Sensor Networks, Supply Chain Management, Optimization Techniques',
                image: SMini
            },
            {
                name: 'Dr. Venkatanareshbabu Kuppili',
                designation: 'Associate Professor',
                department: 'Computer Science and Engineering',
                email: 'venkatanareshbabu@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Big Data Analytics, Machine Learning, IoT, Intelligent, Deep Learning, Soft Computing',
                image: VenkatanareshbabuKuppili
            },
            {
                name: 'Dr. Modi Chirag Navinchandra',
                designation: 'Associate Professor',
                department: 'Computer Science and Engineering',
                email: 'cmodhi@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Network Security, Information System and Privacy Management, Computational Intelligence',
                image: ModiChiragNavinchandra
            },
            {
                name: 'Ms. Suniliya S.',
                designation: 'Faculty (on Contract)',
                department: 'Computer Science and Engineering',
                email: 'suniliya@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Computer Networks, Information System Analysis, Fluid Substance in WSN',
                image: Srividya
            },
            {
                name: 'Dr. Meenakshi Panda',
                designation: 'Faculty (on Contract)',
                department: 'Computer Science and Engineering',
                email: 'meenakshi@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Data Analytics, Process Mining, Data Mining, Web Mining',
                image: MeenakshiPanda
            },
            {
                name: 'Ms. Antara',
                designation: 'Assistant Professor',
                department: 'Computer Science and Engineering',
                email: 'antara@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Software Engineering, Programming Languages, Algorithms',
                image: Antara
            },
            {
                name: 'Mr. Kashinath',
                designation: 'Assistant Professor',
                department: 'Computer Science and Engineering',
                email: 'kashinath@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Database Systems, Information Systems, Data Analytics',
                image: Kashinath
            },
            {
                name: 'Ms. Paravati',
                designation: 'Assistant Professor',
                department: 'Computer Science and Engineering',
                email: 'paravati@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Computer Networks, Distributed Systems, IoT',
                image: ParavatiCSE
            },
            {
                name: 'Mr. Pasha',
                designation: 'Assistant Professor',
                department: 'Computer Science and Engineering',
                email: 'pasha@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Machine Learning, Artificial Intelligence, Data Science',
                image: Pasha
            }
        ],
        ECE: [
            {
                name: 'Dr. Anirban Chatterjee',
                designation: 'Professor',
                department: 'Electronics & Communication Engineering',
                email: 'anirban@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Signal Processing, Image Processing, Pattern Recognition',
                image: AnirbanChatterjee
            },
            {
                name: 'Dr. Devesh Dwivedi',
                designation: 'Associate Professor',
                department: 'Electronics & Communication Engineering',
                email: 'devesh@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'VLSI Design, Digital Signal Processing',
                image: DeveshDwivedi
            },
            {
                name: 'Dr. Lalat Indu Giri',
                designation: 'Associate Professor',
                department: 'Electronics & Communication Engineering',
                email: 'lalat@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Wireless Communication, Digital Signal Processing',
                image: LalatInduGiri
            },
            {
                name: 'Dr. Lokesh Kumar Bramhane',
                designation: 'Associate Professor',
                department: 'Electronics & Communication Engineering',
                email: 'lokesh@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Microwave Engineering, Antenna Design',
                image: LokeshKumarBramhane
            },
            {
                name: 'Dr. Mallikarjun Erramshetty',
                designation: 'Associate Professor',
                department: 'Electronics & Communication Engineering',
                email: 'mallikarjun@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Digital Communications, Signal Processing',
                image: MallikarjunErramshetty
            },
            {
                name: 'Dr. Nithin Kumar Y.B.',
                designation: 'Associate Professor',
                department: 'Electronics & Communication Engineering',
                email: 'nithin@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'VLSI Design, Embedded Systems',
                image: NithinKumarYB
            },
            {
                name: 'Dr. Pragati Patel',
                designation: 'Associate Professor',
                department: 'Electronics & Communication Engineering',
                email: 'pragati@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Digital Signal Processing, Image Processing',
                image: PragatiPatel
            },
            {
                name: 'Dr. Prashanth G.R.',
                designation: 'Associate Professor',
                department: 'Electronics & Communication Engineering',
                email: 'prashanth@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'RF & Microwave Engineering, Antenna Design',
                image: PrashanthGR
            },
            {
                name: 'Dr. Shivnarayan Patidar',
                designation: 'Associate Professor',
                department: 'Electronics & Communication Engineering',
                email: 'shivnarayan@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Digital Communications, Signal Processing',
                image: ShivnarayanPatidar
            },
            {
                name: 'Dr. Trilochan Panigrahi',
                designation: 'Associate Professor',
                department: 'Electronics & Communication Engineering',
                email: 'trilochan@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Power Electronics, Control Systems',
                image: TrilochanPanigrahi
            },
            {
                name: 'Dr. Vasantha',
                designation: 'Associate Professor',
                department: 'Electronics & Communication Engineering',
                email: 'vasantha@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Wireless Communications, Mobile Computing',
                image: Vasantha
            },
            {
                name: 'Dr. Veerakumar',
                designation: 'Associate Professor & HOD',
                department: 'Electronics & Communication Engineering',
                email: 'veerakumar@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'VLSI Design, Digital Electronics',
                image: DrVeerakumar,
                isHOD: true
            }
        ],
        EEE: [
            {
                name: 'Dr. Anudevi Samuel',
                designation: 'Associate Professor',
                department: 'Electrical & Electronics Engineering',
                email: 'anudevi@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Power Systems, Renewable Energy, Smart Grid',
                image: AnudeviSamuel
            },
            {
                name: 'Dr. B. Venugopal Reddy',
                designation: 'Associate Professor',
                department: 'Electrical & Electronics Engineering',
                email: 'venugopal@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Power Electronics, Electric Drives, Control Systems',
                image: VenugopalReddy
            },
            {
                name: 'Dr. C. Vyjayanthi',
                designation: 'Associate Professor',
                department: 'Electrical & Electronics Engineering',
                email: 'vyjayanthi@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Power Systems, Power Quality, FACTS Devices',
                image: Vyjayanthi
            },
            {
                name: 'Dr. Soumitra Das',
                designation: 'Associate Professor',
                department: 'Electrical & Electronics Engineering',
                email: 'soumitra@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Power Electronics, Electric Machines, Motor Drives',
                image: SoumitraDas
            },
            {
                name: 'Dr. Sreeraj E S',
                designation: 'Associate Professor',
                department: 'Electrical & Electronics Engineering',
                email: 'sreeraj@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Power Systems, Protection, Smart Grid',
                image: SreerajES
            },
            {
                name: 'Dr. Suresh Mikkili',
                designation: 'Associate Professor & HOD',
                department: 'Electrical & Electronics Engineering',
                email: 'suresh@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Power Electronics, Renewable Energy Systems',
                image: SureshMikkili,
                isHOD: true
            },
            {
                name: 'Dr. Amol D. Rahulkar',
                designation: 'Associate Professor',
                department: 'Electrical & Electronics Engineering',
                email: 'amol@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Power Systems, Smart Grid Technology',
                image: AmolRahulkar
            },
            {
                name: 'Dr. K. Raghavendra Reddy',
                designation: 'Associate Professor',
                department: 'Electrical & Electronics Engineering',
                email: 'raghavendra@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Electric Machines, Power Electronics',
                image: Raghavendra
            },
            {
                name: 'Ankeshwarapu Sunil',
                designation: 'Assistant Professor',
                department: 'Electrical & Electronics Engineering',
                email: 'sunil@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Control Systems, Automation',
                image: AnkeshwarapuSunil
            },
            {
                name: 'Senthamizh Selvan S',
                designation: 'Assistant Professor',
                department: 'Electrical & Electronics Engineering',
                email: 'senthamizh@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Power Systems, Electrical Machines',
                image: SenthamizSelvan
            }
        ],
        MCE: [
            {
                name: 'Dr. Abhijit Sarkar',
                designation: 'Associate Professor',
                department: 'Mechanical Engineering',
                email: 'abhijit@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Heat Transfer, Thermal Engineering, CFD',
                image: AbhijitSarkar
            },
            {
                name: 'Dr. B. Santhi',
                designation: 'Associate Professor',
                department: 'Mechanical Engineering',
                email: 'santhi@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Manufacturing Technology, Materials Science',
                image: SanthiB
            },
            {
                name: 'Dr. Darius Diogo Barreto',
                designation: 'Associate Professor',
                department: 'Mechanical Engineering',
                email: 'darius@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Fluid Mechanics, Turbo Machinery, Energy Systems',
                image: DariusBarreto
            },
            {
                name: 'Dr. Gaurang Ruhela',
                designation: 'Associate Professor',
                department: 'Mechanical Engineering',
                email: 'gaurang@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Machine Design, Vibrations, Finite Element Analysis',
                image: GaurangRuhela
            },
            {
                name: 'Dr. Prasenjit Dey',
                designation: 'Associate Professor & HOD',
                department: 'Mechanical Engineering',
                email: 'prasenjit@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Robotics, Automation, Control Systems',
                image: PrasenjitDey,
                isHOD: true
            },
            {
                name: 'Dr. Pravin Anandrao Pawar',
                designation: 'Associate Professor',
                department: 'Mechanical Engineering',
                email: 'pravin@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Manufacturing, Materials, Industrial Engineering',
                image: PravinPawar
            },
            {
                name: 'Chaitanya Vundru',
                designation: 'Assistant Professor',
                department: 'Mechanical Engineering',
                email: 'chaitanya@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Thermal Engineering, Heat Transfer',
                image: ChaitanyaVundru
            },
            {
                name: 'Samar Singhal',
                designation: 'Assistant Professor',
                department: 'Mechanical Engineering',
                email: 'samar@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Manufacturing Technology, CAD/CAM',
                image: SamarSinghal
            },
            {
                name: 'Mr. Animesh',
                designation: 'Assistant Professor',
                department: 'Mechanical Engineering',
                email: 'animesh@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Fluid Mechanics, Thermodynamics',
                image: AnimeshMCE
            },
            {
                name: 'Mr. Hiru',
                designation: 'Assistant Professor',
                department: 'Mechanical Engineering',
                email: 'hiru@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Machine Design, Mechanics',
                image: HiruMCE
            },
            {
                name: 'Mr. Thirupathi',
                designation: 'Assistant Professor',
                department: 'Mechanical Engineering',
                email: 'thirupathi@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Manufacturing, Production Engineering',
                image: ThirupathiMCE
            }
        ],
        CVE: [
            {
                name: 'Prof. O. R. Jaiswal',
                designation: 'Professor',
                department: 'Civil Engineering',
                email: 'orjaiswal@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Structural Engineering, Earthquake Engineering, Concrete Technology',
                image: ORJaiswal
            },
            {
                name: 'Dr. Harikumar M',
                designation: 'Associate Professor & HOD',
                department: 'Civil Engineering',
                email: 'harikumar@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Geotechnical Engineering, Foundation Engineering, Soil Mechanics',
                image: HarikumarM,
                isHOD: true
            },
            {
                name: 'Dr. Saurabh Upadhyay',
                designation: 'Associate Professor',
                department: 'Civil Engineering',
                email: 'saurabh@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Environmental Engineering, Water Resources, Hydrology',
                image: SaurabhUpadhyay
            },
            {
                name: 'Ranendra Nath Bhowmik',
                designation: 'Assistant Professor',
                department: 'Civil Engineering',
                email: 'ranendra@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Transportation Engineering, Traffic Engineering, Highway Design',
                image: RanendraBhowmik
            },
            {
                name: 'Bapi Mondal',
                designation: 'Assistant Professor',
                department: 'Civil Engineering',
                email: 'bapi@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Structural Engineering, Concrete Technology',
                image: BapiMondal
            },
            {
                name: 'Mr. Chandra',
                designation: 'Assistant Professor',
                department: 'Civil Engineering',
                email: 'chandra@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Geotechnical Engineering, Soil Mechanics',
                image: ChandraCVE
            },
            {
                name: 'Mr. Mani',
                designation: 'Assistant Professor',
                department: 'Civil Engineering',
                email: 'mani@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Environmental Engineering, Water Resources',
                image: ManiCVE
            },
            {
                name: 'Mr. Saidulu',
                designation: 'Assistant Professor',
                department: 'Civil Engineering',
                email: 'saidulu@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Structural Analysis, Design',
                image: SaiduluCVE
            },
            {
                name: 'Mr. Suryateja',
                designation: 'Assistant Professor',
                department: 'Civil Engineering',
                email: 'suryateja@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Construction Management, Project Planning',
                image: SuryatejaCVE
            },
            {
                name: 'Mr. VNM',
                designation: 'Assistant Professor',
                department: 'Civil Engineering',
                email: 'vnm@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Hydraulics, Water Engineering',
                image: VNMCVE
            }
        ],
        APS: [
            {
                name: 'Dr. Gundlapally Shiva Kumar Reddy',
                designation: 'Associate Professor',
                department: 'Applied Sciences',
                email: 'shivakumar@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Mathematical Analysis, Differential Equations, Numerical Methods',
                image: ShivaKumarReddy
            },
            {
                name: 'Dr. L. Shangerganesh',
                designation: 'Associate Professor & HOD',
                department: 'Applied Sciences',
                email: 'shangerganesh@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Partial Differential Equations, Mathematical Modeling, Fluid Dynamics',
                image: Shangerganesh,
                isHOD: true
            },
            {
                name: 'Dr. Lasitha P',
                designation: 'Associate Professor',
                department: 'Applied Sciences',
                email: 'lasitha@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Solid State Physics, Materials Science, Nanotechnology',
                image: LasithaP
            },
            {
                name: 'Dr. Ragoju Ravi',
                designation: 'Associate Professor',
                department: 'Applied Sciences',
                email: 'ragoju@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Condensed Matter Physics, Computational Physics',
                image: RagojuRavi
            },
            {
                name: 'Dr. Suman Gandi',
                designation: 'Associate Professor',
                department: 'Applied Sciences',
                email: 'suman@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Organic Chemistry, Medicinal Chemistry, Drug Design',
                image: SumanGandi
            },
            {
                name: 'Dr. Ravi Prasad K. J.',
                designation: 'Associate Professor',
                department: 'Applied Sciences',
                email: 'raviprasad@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Theoretical Physics, Quantum Mechanics',
                image: RaviPrasad
            },
            {
                name: 'Dr. Saidi Reddy Parne',
                designation: 'Associate Professor',
                department: 'Applied Sciences',
                email: 'saidi@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Applied Mathematics, Numerical Analysis',
                image: SaidiReddy
            },
            {
                name: 'Dr. Velavan Kathirvelu',
                designation: 'Associate Professor',
                department: 'Applied Sciences',
                email: 'velavan@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Physical Chemistry, Materials Chemistry',
                image: VelavanKathirvelu
            }
        ],
        HSS: [
            {
                name: 'Dr. Sarani Ghosal Mondal',
                designation: 'Associate Professor & HOD',
                department: 'Humanities & Social Sciences',
                email: 'sarani@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Applied Linguistics, English Language Teaching, Literature',
                image: SaraniMondal,
                isHOD: true
            },
            {
                name: 'Dr. Sunil Kumar',
                designation: 'Associate Professor',
                department: 'Humanities & Social Sciences',
                email: 'sunilkumar@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Economics, Development Economics, Industrial Economics',
                image: SunilKumar
            },
            {
                name: 'Dr. Unais KT',
                designation: 'Associate Professor',
                department: 'Humanities & Social Sciences',
                email: 'unais@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Philosophy, Ethics, Social Philosophy',
                image: UnaisKT
            },
            {
                name: 'Mr. Vishnupad Barve',
                designation: 'Assistant Professor',
                department: 'Humanities & Social Sciences',
                email: 'vishnupad@nitgoa.ac.in',
                phone: 'Extension No.: - (Internal)',
                researchAreas: 'Management Studies, Organizational Behavior, Human Resources',
                image: VishanupadBarve
            }
        ]
    };

    const handleDepartmentFilter = (dept) => {
        setSelectedDepartment(dept);
    };

    // Sort faculty to show HODs first
    const getSortedFaculty = (facultyList) => {
        return [...facultyList].sort((a, b) => {
            if (a.isHOD && !b.isHOD) return -1;
            if (!a.isHOD && b.isHOD) return 1;
            return 0;
        });
    };

    return (
        <div className="faculty-page">
            <div className="faculty-container">
                {/* Hero Section */}
                <div className="faculty-hero">
                    <div className="hero-image">
                        <img src={heroImg1} alt="NIT Goa Faculty Group" />
                    </div>
                </div>

                {/* Department Filter Buttons */}
                <div className="department-section">
                    <h2 className="current-department">
                        {departments.find(dept => dept.code === selectedDepartment)?.name || 'Department'}
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

                {/* Faculty Grid */}
                <div className="faculty-grid">
                    {facultyData[selectedDepartment].length > 0 ? (
                        getSortedFaculty(facultyData[selectedDepartment]).map((faculty, index) => (
                            <div key={index} className={`faculty-card ${faculty.isHOD ? 'hod-card' : ''}`}>
                                <div className="faculty-image">
                                    <img src={faculty.image} alt={faculty.name} />
                                </div>
                                <div className="faculty-info">
                                    <h3 className="faculty-name">{faculty.name}</h3>
                                    <p className="faculty-designation">{faculty.designation}</p>
                                    <p className="faculty-department">{faculty.department}</p>
                                    <div className="faculty-contact">
                                        <p><strong>Email:</strong> {faculty.email}</p>
                                        <p><strong>Phone:</strong> {faculty.phone}</p>
                                    </div>
                                    <div className="research-areas">
                                        <p><strong>Research Areas:</strong> {faculty.researchAreas}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-faculty">
                            <p>Faculty information for {selectedDepartment} department will be updated soon.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Faculty;
