import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import './Faculty.css';




// Import faculty images
// CSE Department
import VeenaThenkanidiyoor from '../../../assets/images/Faculty/CSE/Dr. Veena Thenkanidiyoor.png';
import DamodarReddyEdla from '../../../assets/images/Faculty/CSE/Dr. Damodar Reddy Edla.png';
import KeshavamurthyBN from '../../../assets/images/Faculty/CSE/Dr. Keshavamurthy B.N..png';
import SMini from '../../../assets/images/Faculty/CSE/Dr. S. Mini.png';
import VenkatanareshbabuKuppili from '../../../assets/images/Faculty/CSE/Dr. Venkatanareshbabu Kuppili.jpg';
import ModiChiragNavinchandra from '../../../assets/images/Faculty/CSE/Dr. Modi Chirag Navinchandra.png';
import Antara from '../../../assets/images/Faculty/CSE/Antara.jpg';
import Kashinath from '../../../assets/images/Faculty/CSE/kashinath.jpg';
import MeenakshiPanda from '../../../assets/images/Faculty/CSE/meenakshipanda.jpeg';
import ParavatiCSE from '../../../assets/images/Faculty/CSE/paravati_cse.png';
import Pasha from '../../../assets/images/Faculty/CSE/pasha.jpg';
import Srividya from '../../../assets/images/Faculty/CSE/srividya.jpeg';

// ECE Department
import AnirbanChatterjee from '../../../assets/images/Faculty/ECE/Dr. Anirban Chatterjee.png';
import DeveshDwivedi from '../../../assets/images/Faculty/ECE/Dr. Devesh Dwivedi.png';
import LalatInduGiri from '../../../assets/images/Faculty/ECE/Dr. Lalat Indu Giri.png';
import LokeshKumarBramhane from '../../../assets/images/Faculty/ECE/Dr. Lokesh Kumar Bramhane.png';
import MallikarjunErramshetty from '../../../assets/images/Faculty/ECE/Dr. Mallikarjun Erramshetty.png';
import NithinKumarYB from '../../../assets/images/Faculty/ECE/Dr. Nithin Kumar Y.B..png';
import PragatiPatel from '../../../assets/images/Faculty/ECE/Dr. Pragati Patel.png';
import PrashanthGR from '../../../assets/images/Faculty/ECE/Dr. Prashanth G.R.jpg';
import ShivnarayanPatidar from '../../../assets/images/Faculty/ECE/Dr. Shivnarayan Patidar.png';
import TrilochanPanigrahi from '../../../assets/images/Faculty/ECE/Dr. Trilochan Panigrahi.jpg';
import Vasantha from '../../../assets/images/Faculty/ECE/Dr. Vasantha (1).jpg';
import DrVeerakumar from '../../../assets/images/Faculty/ECE/drveerakumar.jpeg';

// EEE Department
import AnkeshwarapuSunil from '../../../assets/images/Faculty/EEE/Ankeshwarapu Sunil.jpg';
import AmolRahulkar from '../../../assets/images/Faculty/EEE/Dr. Amol D. Rahulkar.jpg';
import AnudeviSamuel from '../../../assets/images/Faculty/EEE/Dr. Anudevi Samuel.png';
import VenugopalReddy from '../../../assets/images/Faculty/EEE/Dr. B. Venugopal Reddy.png';
import Vyjayanthi from '../../../assets/images/Faculty/EEE/Dr. C.Vyjayanthi.png';
import Raghavendra from '../../../assets/images/Faculty/EEE/Dr. K Raghavenrda Reddy.jpeg';
import SoumitraDas from '../../../assets/images/Faculty/EEE/Dr. Soumitra Das.png';
import SreerajES from '../../../assets/images/Faculty/EEE/Dr. Sreeraj E S.png';
import SureshMikkili from '../../../assets/images/Faculty/EEE/Dr. Suresh Mikkili.png';
import SenthamizSelvan from '../../../assets/images/Faculty/EEE/SENTHAMIZH SELVAN S.jpeg';
import DrVijayaBhaskarSomu from '../../../assets/images/Faculty/EEE/somu.jpeg';

// MCE Department
import ChaitanyaVundru from '../../../assets/images/Faculty/MCE/Chaitanya Vundru.jpeg';
import AbhijitSarkar from '../../../assets/images/Faculty/MCE/Dr. Abhijit Sarkar.png';
import SanthiB from '../../../assets/images/Faculty/MCE/Dr. B. Santhi.png';
import DariusBarreto from '../../../assets/images/Faculty/MCE/Dr. Darius Diogo Barreto.png';
import GaurangRuhela from '../../../assets/images/Faculty/MCE/Dr. Gaurang Ruhela.png';
import PrasenjitDey from '../../../assets/images/Faculty/MCE/Dr. PRASENJIT DEY.png';
import PravinPawar from '../../../assets/images/Faculty/MCE/Dr. Pravin Anandrao Pawar.png';
import SamarSinghal from '../../../assets/images/Faculty/MCE/Samar Singhal.jpg';
import AnimeshMCE from '../../../assets/images/Faculty/MCE/animesh.jpeg';
import HiruMCE from '../../../assets/images/Faculty/MCE/hiru.jpg';
import ThirupathiMCE from '../../../assets/images/Faculty/MCE/thirupathi.jpg';

// CVE Department
import BapiMondal from '../../../assets/images/Faculty/CVE/Bapi Mondal.jpg';
import HarikumarM from '../../../assets/images/Faculty/CVE/Dr. Harikumar M.png';
import SaurabhUpadhyay from '../../../assets/images/Faculty/CVE/Dr. Saurabh Upadhyay.jpg';
import ORJaiswal from '../../../assets/images/Faculty/CVE/Prof. O. R. Jaiswal.png';
import RanendraBhowmik from '../../../assets/images/Faculty/CVE/Ranendra Nath Bhowmik.jpg';
import ChandraCVE from '../../../assets/images/Faculty/CVE/chandra_cve.jpeg';
import ManiCVE from '../../../assets/images/Faculty/CVE/mani.jpg';
import SaiduluCVE from '../../../assets/images/Faculty/CVE/saidulu.png';
import SuryatejaCVE from '../../../assets/images/Faculty/CVE/suryateja.jpg';
import VNMCVE from '../../../assets/images/Faculty/CVE/vnm.jpeg';

// APS Department
import ShivaKumarReddy from '../../../assets/images/Faculty/APS/Dr. Gundlapally Shiva Kumar Reddy.png';
import Shangerganesh from '../../../assets/images/Faculty/APS/Dr. L. Shangerganesh.png';
import LasithaP from '../../../assets/images/Faculty/APS/Dr. Lasitha P.png';
import RagojuRavi from '../../../assets/images/Faculty/APS/Dr. Ragoju Ravi.png';
import RaviPrasad from '../../../assets/images/Faculty/APS/Dr. Ravi Prasad K. J..png';
import SaidiReddy from '../../../assets/images/Faculty/APS/Dr. Saidi Reddy Parne.png';
import SumanGandi from '../../../assets/images/Faculty/APS/Dr. Suman Gandi.png';
import VelavanKathirvelu from '../../../assets/images/Faculty/APS/Dr. Velavan Kathirvelu.png';

// HSS Department
import SaraniMondal from '../../../assets/images/Faculty/HSS/Dr. Sarani Ghosal Mondal.jpg';
import SunilKumar from '../../../assets/images/Faculty/HSS/Dr. Sunil Kumar.png';
import UnaisKT from '../../../assets/images/Faculty/HSS/Dr. Unais KT.png';
import VishanupadBarve from '../../../assets/images/Faculty/HSS/Mr. Vishnupad Barve.jpg';

const Faculty = () => {
    const [selectedDepartment, setSelectedDepartment] = useState('CSE');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { theme } = useTheme();

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
        { code: 'CSE', name: 'Department of Computer Science & Engineering' },
        { code: 'ECE', name: 'Department of Electronics & Communication Engineering' },
        { code: 'EEE', name: 'Department of Electrical & Electronics Engineering' },
        { code: 'MCE', name: 'Department of Department of Mechanical Engineering' },
        { code: 'CVE', name: 'Department of Department of Civil Engineering'},
        { code: 'APS', name: 'Department of Department of Applied Sciences' },
        { code: 'HSS', name: 'Department of Humanities and Social Sciences' }
    ];

    const facultyData = {
        CSE: [
            {
                id: 'veena-thenkanidiyoor',
                name: 'Dr. Veena Thenkanidiyoor',
                designation: 'Associate Professor & HOD',
                department: 'Computer Science & Engineering',
                email: 'veenat@nitgoa.ac.in',
                phone: '0832-2404432',
                researchAreas: 'Deep Learning, Kernel Methods, Pattern Recognition, Applied Machine Learning, Computer Vision, Speech Processing, Weather Data Analysis, Content based Information Retrieval',
                image: VeenaThenkanidiyoor,
                isHOD: true
            },
            {
                id: 'damodar-reddy-edla',
                name: 'Dr. Damodar Reddy Edla',
                designation: 'Associate Professor',
                department: 'Computer Science & Engineering',
                email: 'dr.reddy@nitgoa.ac.in',
                phone: '0832-2404433',
                researchAreas: 'Artificial Intelligence; Cognitive Neuroscience; Brain Computer Interface; Medical Imaging; Wireless Sensor Networks; Machine Learning/Deep Learning; Internet of Medical Things (IoMT);',
                image: DamodarReddyEdla
            },
            {
                id: 'keshavamurthy-bn',
                name: 'Dr. Keshavamurthy B.N.',
                designation: 'Associate Professor',
                department: 'Computer Science & Engineering',
                email: 'bnkeshav.fcse@nitgoa.ac.in',
                phone: '0832-2404403',
                researchAreas: ' Data Mining, Privacy Preserving Data Mining, Stream Data Mining, Social Media Mining',
                image: KeshavamurthyBN
            },
            {
                id: 's-mini',
                name: 'Dr. S. Mini',
                designation: 'Associate Professor',
                department: 'Computer Science & Engineering',
                email: 'mini@nitgoa.ac.in',
                phone: '0832-2404419',
                researchAreas: 'Wireless Sensor Networks, Swarm Intelligence, Combinatorial Optimization, Internet of Things',
                image: SMini
            },
            {
                id: 'paravati',
                name: 'Dr. Pravati Swain',
                designation: 'Assistant Professor',
                department: 'Computer Science & Engineering',
                email: 'pravati@nitgoa.ac.in',
                phone: '0832-2404420',
                researchAreas: 'Quantum Machine learning, AI/ML for communication network: Federated learning, Advanced Mobile Communication (B5G/6G), IoT-Edge- Cloud Continuum Systems. Game theory and Markov Model',
                image: ParavatiCSE
            },
            {
                id: 'venkatanareshbabu-kuppili',
                name: 'Dr. Venkatanareshbabu Kuppili',
                designation: 'Assistant Professor',
                department: 'Computer Science & Engineering',
                email: 'venkatanaresh@nitgoa.ac.in',
                phone: '0832-2404402',
                researchAreas: 'Big Data Analytics, Artificial Intelligence, Deep Learning, Soft Computing',
                image: VenkatanareshbabuKuppili
            },
            {
                id: 'modi-chirag-navinchandra',
                name: 'Dr. Modi Chirag Navinchandra',
                designation: 'Associate Professor',
                department: 'Computer Science & Engineering',
                email: 'cnmodi@nitgoa.ac.in',
                phone: '0832-2404431',
                researchAreas: 'Blockchain, Cryptography and Network Security, Information Security and Privacy, Cloud Computing, Visual Computing',
                image: ModiChiragNavinchandra
            },
            {
                id: 'suniliya-s',
                name: 'Mrs. Sreedivya I.',
                designation: 'Faculty on Contract',
                department: 'Computer Science & Engineering',
                email: 'sreedivya@nitgoa.ac.in',
                phone: '0832-2404413',
                researchAreas: 'Machine Learning, Data Mining',
                image: Srividya
            },
            
            {
                id: 'meenakshi-panda',
                name: 'Dr. Meenakshi Panda',
                designation: 'Faculty on Contract',
                department: 'Computer Science & Engineering',
                email: 'meenakshi.panda@nitgoa.ac.in',
                phone: '0832-2404418',
                researchAreas: 'Wireless Sensor Networks (WSNs), Internet of Things (IoT), Machine Learning, Data Analytics, Fault Tolerance in WSN',
                image: MeenakshiPanda
            },
            {
                id: 'kashinath',
                name: 'Dr. Chandelkar K K',
                designation: 'Faculty on Contract',
                department: 'Computer Science & Engineering',
                email: 'kashinath@nitgoa.ac.in',
                phone: '0832-2404401',
                researchAreas: 'Data Mining & Warehousing, cloud computing, Information retrieval, Cyber security, Digital Forensics, Content based Information Retrieval',
                image: Kashinath
            },
            {
                id: 'antara',
                name: 'Ms. Antara Dessai',
                designation: 'Faculty on Contract',
                department: 'Computer Science & Engineering',
                email: 'antaradessai@nitgoa.ac.in',
                phone: '0832-2404401',
                researchAreas: 'Software Engineering, Programming Languages, Algorithms',
                image: Antara
            },
            
            
            {
                id: 'pasha',
                name: 'Mr. MOHD. JAHANGEER PASHA',
                designation: 'Faculty on Contract',
                department: 'Computer Science & Engineering',
                email: 'jahangeer@nitgoa.ac.in',
                phone: '0832-2404401',
                researchAreas: '',
                image: Pasha
            }
        ],
        ECE: [
            {
                name: 'Dr. T. Veerakumar',
                designation: 'Associate Professor & HOD',
                department: 'Electronics & Communication Engineering',
                email: 'tveerakumar@nitgoa.ac.in',
                phone: '0832-2404520',
                researchAreas: 'Image Compression, Image Denoising, Object detection and tracking,and Medical Image Analysis',
                image: DrVeerakumar,
                isHOD: true
            },
            {
                name: 'Dr. Vasantha M.H',
                designation: 'Associate Professor',
                department: 'Electronics & Communication Engineering',
                email: 'vasanthmh@nitgoa.ac.in',
                phone: '0832-2404546',
                researchAreas: 'Low voltage, Low power analog mixed signal circuits, Continuous-time filter Circuits, System on Chip, FPGA based algorithm Implementation',
                image: Vasantha
            },
            {
                name: 'Dr. Anirban Chatterjee',
                designation: 'Associate Professor',
                department: 'Electronics & Communication Engineering',
                email: 'snanirban@nitgoa.ac.in',
                phone: '0832-2404519',
                researchAreas: "Antennas Modeling, Antenna Array, Microstrip Antenna Design, Fractal Antennas, Antenna Measurements, Beam Steerable Antennas, Wearable Antennas, Microstrip Reflectarray, DRA's",
                image: AnirbanChatterjee
            },
             {
                name: 'Dr. Nithin Kumar Y.B.',
                designation: 'Associate Professor',
                department: 'Electronics & Communication Engineering',
                email: 'nithin.shastri@nitgoa.ac.in',
                phone: '0832-2404547',
                researchAreas: 'Analog and Mixed Signal Design, Data Converter',
                image: NithinKumarYB
            },
            {
                name: 'Dr. Trilochan Panigrahi',
                designation: 'Associate Professor',
                department: 'Electronics & Communication Engineering',
                email: 'tpanigrahi@nitgoa.ac.in',
                phone: '0832-2404502',
                researchAreas: 'Distributed Signal Processing, Array Signal Processing, IoT and Nano WSN',
                image: TrilochanPanigrahi
            },
            {
                name: 'Dr. Shivnarayan Patidar',
                designation: 'Assistant Professor',
                department: 'Electronics & Communication Engineering',
                email: 'shivnarayan.patidar@nitgoa.ac.in',
                phone: '0832-2404532',
                researchAreas: 'Biomedical Signal Analysis and Processing, Machine Learning, Multi-resolution Analysis, Time-frequency Analysis, Wavelet Transforms, and Tensor Analysis',
                image: ShivnarayanPatidar
            },
            {
                name: 'Dr. Prashanth G.R',
                designation: 'Associate Professor',
                department: 'Electronics & Communication Engineering',
                email: 'grprashanth@nitgoa.ac.in',
                phone: '0832-2404533',
                researchAreas: 'Bio-photonics, Bio-Sensors',
                image: PrashanthGR
            },
            {
                name: 'Dr. Lalat Indu Giri',
                designation: 'Assistant Professor',
                department: 'Electronics & Communication Engineering',
                email: 'lig@nitgoa.ac.in',
                phone: '0832-2404531',
                researchAreas: 'Infrared Thermography, One dimensional nanostructures, Clean energy sources and systems',
                image: LalatInduGiri
            },
            {
                name: 'Dr. Pragati Patel',
                designation: 'Assistant Professor',
                department: 'Electronics & Communication Engineering',
                email: 'pragati@nitgoa.ac.in',
                phone: '0832-2404534',
                researchAreas: 'Dielectric Resonator Antennas, RF and Microwave Engineering, Wireless Power Transmission',
                image: PragatiPatel
            },
            {
                name: 'Dr. Mallikarjun Erramshetty',
                designation: 'Assistant Professor',
                department: 'Electronics & Communication Engineering',
                email: 'emallikarjuna@nitgoa.ac.in',
                phone: '0832-2404521',
                researchAreas: 'Microwave Imaging, Terahertz Imaging, Inverse Problems',
                image: MallikarjunErramshetty
            },
            {
                name: 'Dr. Lokesh Kumar Bramhane',
                designation: 'Assistant Professor',
                department: 'Electronics & Communication Engineering',
                email: 'lokesh.bramhane@nitgoa.ac.in',
                phone: '0832-2404518',
                researchAreas: 'VLSI Circuit Design, Semiconductor Devices, Biosensors, Memristors, IC design, Antenna Design & Fabrication',
                image: LokeshKumarBramhane
            },
            {
                name: 'Dr. Devesh Dwivedi',
                designation: 'Visiting Faculty',
                department: 'Electronics & Communication Engineering',
                email: '',
                phone: '- (Internal)',
                researchAreas: 'Memory, Analog and Mixed Signal, High Speed Serial Links, Cores, Test Chip, Custom Layout',
                image: DeveshDwivedi
            }   
        ],
        EEE: [
            {
                name: 'Dr. Suresh Mikkili',
                designation: 'Associate Professor & HOD',
                department: 'Electrical & Electronics Engineering',
                email: 'mikkili.suresh@nitgoa.ac.in',
                phone: '0832-2404645 | HoD Office : 252',
                researchAreas: 'Smart Electric Grid, Electric vehicles, Grid connected/Stand-Alone PV Systems, Wireless Power Transfer, Renewable Energy Systems, Power Quality Issues and Applications of Soft Computing Techniques',
                image: SureshMikkili,
                isHOD: true
            },
            {
                name: 'Dr. Sreeraj E S',
                designation: 'Associate Professor',
                department: 'Electrical & Electronics Engineering',
                email: 'sreeraj@nitgoa.ac.in',
                phone: '0832-2404617',
                researchAreas: 'Power electronics, Renewable energy',
                image: SreerajES
            },
             {
                name: 'Dr. Amol D. Rahulkar',
                designation: 'Associate Professor',
                department: 'Electrical & Electronics Engineering',
                email: 'amol.rahulkar@nitgoa.ac.in',
                phone: '0832-2404630',
                researchAreas: 'Digital Signal/Image Processing, Design of Wavelets, FPGA based Hardware Accelerators,Design of Neural Networks, Biometrics, Control Systems',
                image: AmolRahulkar
            },
            {
                name: 'Dr. C.Vyjayanthi',
                designation: 'Associate Professor',
                department: 'Electrical & Electronics Engineering',
                email: 'c.vyjayanthi@nitgoa.ac.in',
                phone: '0832-2404632',
                researchAreas: 'Restructured Power Systems; Planning, Operation and Control of Power Systems; Electric Arc Furnace Operations; Smart Electric Grids; FACTS; AC/DC Microgrids, Electric Vehicles.',
                image: Vyjayanthi
            },
            {
                name: 'Dr. Soumitra Das',
                designation: 'Associate Professor',
                department: 'Electrical & Electronics Engineering',
                email: 'sdas@nitgoa.ac.in',
                phone: '0832-2404643',
                researchAreas: 'Power Electronics, Multilevel Converter, Pulsewidth Modulation, Switched Reluctance Motor and Drives, Renewable Energy Sources',
                image: SoumitraDas
            },
            {
                name: 'Dr. Anudevi Samuel',
                designation: 'Faculty on contract',
                department: 'Electrical & Electronics Engineering',
                email: 'ad.dksamuel@nitgoa.ac.in',
                phone: '0832-2404618',
                researchAreas: 'Power System, Distributed Generation, Fuzzy controllers and Fuzzy Clustering',
                image: AnudeviSamuel
            },
            {
                name: 'Dr. Senthamizh Selvan S',
                designation: 'Faculty on contract',
                department: 'Electrical & Electronics Engineering',
                email: 'senthamizh@nitgoa.ac.in',
                phone: '0832-2404644',
                researchAreas: 'Maximum power point tracking of partial shaded solar photovoltaic array system. Fault analysis in solar PV system, its detection and location identification',
                image: SenthamizSelvan
            },
            {
                name: 'Dr. Ankeshwarapu Sunil',
                designation: 'Faculty on contract',
                department: 'Electrical & Electronics Engineering',
                email: 'ankeshwarapu.sunil@nitgoa.ac.in',
                phone: '0832-2404635',
                researchAreas: 'Active Distribution Systems, AI applications to Power and Energy Systems, Soft Computing Techniques for Optimization Problems',
                image: AnkeshwarapuSunil
            },
            {
                name: 'Dr. K. Raghavendra Reddy',
                designation: 'Faculty on contract',
                department: 'Electrical & Electronics Engineering',
                email: 'raghavendrareddy@nitgoa.ac.in',
                phone: '0832-2404634',
                researchAreas: 'Power converters, Multilevel Inverters, Electric and Hybrid Vehicles, Renewable Energy Systems',
                image: Raghavendra
            },
            
            {
                name: 'Dr. Vijaya Bhaskar Somu',
                designation: 'Faculty on contract',
                department: 'Electrical and Electronics Engineering',
                email: 'somu@nitgoa.ac.in',
                phone: '0832-2404633',
                researchAreas: 'Lightning Electromagnetics, Pulsed power technology, High voltage engineering and High power electromagnetics',
                image: DrVijayaBhaskarSomu
            },
            
            
            
           
            
            
        ],
        MCE: [
            {
                name: 'Dr. Prasenjit Dey',
                designation: 'Associate Professor & HOD',
                department: 'Department of Mechanical Engineering',
                email: 'prasenjit.dey@nitgoa.ac.in',
                phone: '0832-2404834',
                researchAreas: 'Experimental and Numerical Fluid Flow, CFD, Multi-Phase Flow, Micro and Nano Heat Transfer.',
                image: PrasenjitDey,
                isHOD: true
            },
            {
                name: 'Dr. B. Santhi',
                designation: 'Associate Professor',
                department: 'Department of Mechanical Engineering',
                email: 'santhi@nitgoa.ac.in',
                phone: '0832-2404829',
                researchAreas: 'Design for Assembly,Ergonomics, Virtual Reality, Reverse Engineering,Product Design for Elderly and Kids, Creative Engineering Design',
                image: SanthiB
            },
            {
                name: 'Dr. Abhijit Sarkar',
                designation: 'Faculty on Contract',
                department: 'Department of Mechanical Engineering',
                email: 'sarkarabhijit@nitgoa.ac.in',
                phone: '0832-2404835',
                researchAreas: 'Manufacturing Technology, Welding',
                image: AbhijitSarkar
            },
            {
                name: 'Dr. Gaurang Ruhela',
                designation: 'Faculty on Contract',
                department: 'Department of Mechanical Engineering',
                email: 'gaurang@nitgoa.ac.in',
                phone: '0832-2404836',
                researchAreas: 'Nonlinear Dynamics, Waves and Mechanical Vibrations, Vibrations Induced Particle Motion',
                image: GaurangRuhela
            },
            {
                name: 'Dr. Darius Diogo Barreto',
                designation: 'Faculty on Contract',
                department: 'Department of Mechanical Engineering',
                email: '',
                phone: '0832-2404820',
                researchAreas: 'Computational Mechanics, Non linear Finite Element Methods, Magneto-electro-elastic effects in Cosserat rods',
                image: DariusBarreto
            },
            {
                name: 'Dr. Pravin Anandrao Pawar',
                designation: 'Faculty on Contract',
                department: 'Department of Mechanical Engineering',
                email: 'pravinpawar@nitgoa.ac.in',
                phone: '0832-2404836',
                researchAreas: 'Traditional and Non-Traditional Machining Processes, Manufacturing Engineering, Materials Science',
                image: PravinPawar
            },
            {
                name: 'Prof. Animesh Chatterjee',
                designation: 'Adjunct Faculty',
                department: 'Department of Mechanical Engineering',
                email: 'achatterjee@mec.vnit.ac.in',
                phone: '0832-2404802',
                researchAreas: 'Machine Dynamics, Fracture Mechanics, Power Plant Engineering',
                image: AnimeshMCE
            },
            {
                name: 'Dr. Nadimetla Thirupathi',
                designation: 'Faculty on Contract',
                department: 'Department of Mechanical Engineering',
                email: 'thirupathi@nitgoa.ac.in',
                phone: '0832-2404821',
                researchAreas: 'Electromagnetic Impulse Forming Process, Electromagnetic Powder Compaction and Electromagnetic Forming Process FEM Modelling, Electromagnetic Welding, Powder Metallurgy, Electro Hydro Forming Process, Vaporized Foil Actuator Forming, WAM (Wire Arc Additive Manufacturing Process), and Friction Stir Welding',
                image: ThirupathiMCE
            },
            {
                name: 'Dr. Hiru Purushothaman Hirudayanathan',
                designation: 'Faculty on Contract',
                department: 'Department of Mechanical Engineering',
                email: 'hirupurushothaman@nitgoa.ac.in',
                phone: '0832-2404835',
                researchAreas: 'Manufacturing, Minimum Quantity Lubrication, Automation, Mechatronics',
                image: HiruMCE
            },
            {
                name: 'Dr. Samar Singhal',
                designation: 'Faculty on Contract',
                department: 'Department of Mechanical Engineering',
                email: 'samarsinghal@nitgoa.ac.in',
                phone: '0832-2404820',
                researchAreas: 'Numerical Heat transfer, Experimental Heat transfer and its applications, Computational fluid dynamics',
                image: SamarSinghal
            },
            {
                name: 'Dr. Chaitanya Vundru',
                designation: 'Faculty on Contract',
                department: 'Department of Department of Mechanical Engineering',
                email: 'chaitanya.vundru@nitgoa.ac.in',
                phone: '0832-2404820',
                researchAreas: 'Additive manufacturing, Cold spray process, Directed energy deposition, Computational mechanics, Sintering',
                image: ChaitanyaVundru
            }  
        ],
        CVE: [
            {
                name: 'Dr. Harikumar M',
                designation: 'Associate Professor & HOD',
                department: 'Department of Civil Engineering',
                email: 'harikumar@nitgoa.ac.in',
                phone: '0832-2404846',
                researchAreas: 'Experimental Soil Mechanics, Hybrid Geosynthetics for soil slopes, Sustainability in Geotechnical Engineering, Model Foundation studies, Unconventional Earth Reinforcement Techniques, Expert Systems in Geotechnical',
                image: HarikumarM,
                isHOD: true
            },
            {
                name: 'Prof. O. R. Jaiswal',
                designation: 'Professor',
                department: 'Department of Civil Engineering',
                email: 'orjaiswal@nitgoa.ac.in',
                phone: '',
                researchAreas: '',
                image: ORJaiswal
            },
            {
                name: 'Dr. Saurabh Upadhyay',
                designation: 'Faculty on Contract',
                department: 'Department of Civil Engineering',
                email: 'supadhyay@nitgoa.ac.in',
                phone: '0832-2404833',
                researchAreas: 'Traffic Noise Modelling, Traffic Noise Barrier, Sustainable Transportation Systems, Public Transportation Systems(Bus Rapid Transit System)',
                image: SaurabhUpadhyay
            },
            {
                name: 'Dr. Ranendra Nath Bhowmik',
                designation: 'Faculty on Contract',
                department: 'Department of Civil Engineering',
                email: 'rbhowmik@nitgoa.ac.in',
                phone: '0832-2404816',
                researchAreas: 'Concrete Technology, Low-cost housing, Non-destructive testing of concrete, Durability study of concrete.',
                image: RanendraBhowmik
            },
            {
                name: 'Dr. Bapi Mondal',
                designation: 'Faculty on Contract',
                department: 'Department of Civil Engineering',
                email: 'bapimondal@nitgoa.ac.in',
                phone: '0832-2404848',
                researchAreas: 'Material characterization, Structural Analysis, Design of RC and Steel structures, Reliability Analysis, Bamboo based structures',
                image: BapiMondal
            },
            {
                name: 'Dr. Vinamra Mishra',
                designation: 'Faculty on Contract',
                department: 'Department of Civil Engineering',
                email: 'vinamramishra@nitgoa.ac.in',
                phone: '0832-2404832',
                researchAreas: 'Material Characterization: Aggregate, Bitumen, Soil Asphalt mix design: Marshall method and Superpave mix design specifications.',
                image: VNMCVE
            },
            
            {
                name: 'Dr. Sathishraj Mani',
                designation: 'Faculty on Contract',
                department: 'Department of Civil Engineering',
                email: 'sathishraj@nitgoa.ac.in',
                phone: '0832-2404832',
                researchAreas: 'Geopolymer Concrete, Microstructure and Durability Studies in Concrete, Construction Management',
                image: ManiCVE
            },
            {
                name: 'Dr. Duduku Saidulu',
                designation: 'Faculty on Contract',
                department: 'Department of Civil Engineering',
                email: 'dudukusaidulu@nitgoa.ac.in',
                phone: '0832-2404832',
                researchAreas: 'Emerging Contaminants Removal; Biofilm-based Treatment Techniques, Nutrient Recovery; 3D printing Applications in Water and Wastewater; Photocatalysis; PFAS Detection and Remediation.',
                image: SaiduluCVE
            },
            {
                name: 'Mr. Guntakala Venkatanaga Chandra',
                designation: 'Faculty on Contract',
                department: 'Department of Civil Engineering',
                email: 'gvnchandra@nitgoa.ac.in',
                phone: '0832-2404832',
                researchAreas: 'Contamination level, Risk Assessment, Ecological risk Assessment, Source Apportionment Groundwater Quality, Soil contamination, Anaerobic Treatment',
                image: ChandraCVE
            }
            // {
            //     name: 'Mr. Suryateja',
            //     designation: 'Assistant Professor',
            //     department: 'Department of Civil Engineering',',
            //     email: 'suryateja@nitgoa.ac.in',
            //     phone: '- (Internal)',
            //     researchAreas: 'Construction Management, Project Planning',
            //     image: SuryatejaCVE
            // }
            
        ],
        APS: [
            {
                name: 'Dr. L. Shangerganesh',
                designation: 'Associate Professor & HOD (APS & HSS)',
                department: 'Department of Applied Sciences',
                email: 'shangerganesh@nitgoa.ac.in',
                phone: '0832-2404728',
                researchAreas: 'Mathematical Biology, Finite Element Methods & Partial Differential Equations',
                image: Shangerganesh,
                isHOD: true
            },
            {
                name: 'Dr. Saidi Reddy Parne',
                designation: 'Associate Professor of Physics',
                department: 'Department of Applied Sciences',
                email: 'psreddy@nitgoa.ac.in',
                phone: '0832-2404729',
                researchAreas: '• Photonics • Fiber Bragg Grating Sensors • Fiber Optic Sensors • Superconducting Motor • Material Characterization • Nanoscale Matter Radar Absorption Materials',
                image: SaidiReddy
            },
            {
                name: 'Dr. Velavan Kathirvelu',
                designation: 'Associate Professor of Chemistry',
                department: 'Department of Applied Sciences',
                email: 'velavan@nitgoa.ac.in',
                phone: '0832-2404726',
                researchAreas: '(i) Electron Paramagnetic Resonance (EPR) of Transition Metal Ions and Organic Free Radicals (ii) Application of EPR towards Biology (ii) Chemistry of Lanthanides and Actinides',
                image: VelavanKathirvelu
            },
            {
                name: 'Dr. Ragoju Ravi',
                designation: 'Associate Professor of Mathematics',
                department: 'Department of Applied Sciences',
                email: 'ravi@nitgoa.ac.in',
                phone: '0832-2404743',
                researchAreas: 'Applied Mathematics; Fluid Mechanics; Convective Instability problems; Heat and Mass Transfer',
                image: RagojuRavi
            },
            {
                name: 'Dr. Ravi Prasad K. J.',
                designation: 'Associate Professor of Mathematics',
                department: 'Department of Applied Sciences',
                email: 'k.j.raviprasad@nitgoa.ac.in',
                phone: '0832-2404727',
                researchAreas: 'Bio-medical Imaging, Inverse problems and Numerical Optimization',
                image: RaviPrasad
            },
             {
                name: 'Dr. Suman Gandi',
                designation: 'Faculty on contract',
                department: 'Department of Applied Sciences',
                email: 'gandisuman@nitgoa.ac.in',
                phone: '0832-2404730',
                researchAreas: 'Sodium/Lithium-Ion batteries, glass and glass-ceramic materials for energy storage systems.',
                image: SumanGandi
            },
            {
                name: 'Dr. Gundlapally Shiva Kumar Reddy',
                designation: 'Faculty on contract',
                department: 'Department of Applied Sciences',
                email: 'gshivakumarreddy913@nitgoa.ac.in',
                phone: '0832-2404742',
                researchAreas: 'Applied Mathematics, Fluid Dynamics, Hydrodynamic Stability, Linear and Non-linear instability analysis',
                image: ShivaKumarReddy
            },
            {
                name: 'Dr. Lasitha P',
                designation: 'Faculty on contract',
                department: 'Department of Applied Sciences',
                email: 'lasitha@nitgoa.ac.in',
                phone: '0832-2404716',
                researchAreas: 'Self-assembly, Sensing, and Luminescent materials',
                image: LasithaP
            }   
        ],
        HSS: [
            {
                name: 'Dr. Sarani Ghosal Mondal',
                designation: 'Associate Professor of English',
                department: 'Department of Humanities and Social Sciences',
                email: 'sarani@nitgoa.ac.in',
                phone: '0832-2404741',
                researchAreas: 'Culture Studies, Applied Linguistics and Comparative Mysticism',
                image: SaraniMondal
            },
            {
                name: 'Dr. Sunil Kumar',
                designation: 'Assistant Professor of Economics',
                department: 'Department of Humanities and Social Sciences',
                email: 'sunilkumar@nitgoa.ac.in',
                phone: '0832-2404715',
                researchAreas: 'R&D, Patents, and Productivity. IPR, Firms innovation, and growth. Innovation and Sustainable Development',
                image: SunilKumar
            },
            {
                name: 'Dr. Unais KT',
                designation: 'Faculty on contract',
                department: 'Department of Humanities and Social Sciences',
                email: 'unaiskt@nitgoa.ac.in',
                phone: '0832-2404705',
                researchAreas: 'Postcolonial Literature, Gothic Writing, Indian Writing in English',
                image: UnaisKT
            },
            {
                name: 'Mr. Vishnupad Barve',
                designation: 'Guest Faculty',
                department: 'Department of Humanities and Social Sciences',
                email: '',
                phone: '0832-2404705',
                researchAreas: '',
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
        <div className={`faculty-page ${theme}`}>
            <div className="faculty-container">
                

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
                                        <p><strong>Extension No.:</strong> {faculty.phone}</p>
                                    </div>
                                    <div className="faculty-actions">
                                        <button className="view-profile-btn" onClick={() => {
                                            navigate(`/faculty/${faculty.id}`);
                                        }}>
                                            View Profile
                                        </button>
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
