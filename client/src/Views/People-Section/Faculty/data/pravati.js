// Dr. Pravati Swain - Faculty Details
import PravatiImage from '../../../../assets/images/Faculty/CSE/paravati_cse.png';

export const pravatiData = {
    // Basic Information
    id: 'pravati-swain',
    name: 'Dr. Pravati Swain',
    designation: 'Assistant Professor',
    department: 'Computer Science and Engineering',
    image: PravatiImage,
    isHOD: false,
    
    // Contact Information
    contact: {
        email: 'pravati@nitgoa.ac.in',
        phone: {
            mobile: '-',
            office: '',
            residence: '-'
        },
        address: {
            office: 'Assistant Professor, Department of Computer Science and Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
        }
    },
    
    // Personal Information
    personal: {
        gender: 'Female',
        birthDate: '-',
        dateOfJoining: '14th December, 2014',
        experience: '12 Years',
        googleScholar: 'https://scholar.google.co.in/citations?user=7kYjaN4AAAAJ&hl=en'
    },
    
    // Research Areas
    researchAreas: [
        'Quantum Machine learning',
        'AI/ML for communication network: Federated learning',
        'Advanced Mobile Communication (B5G/6G)',
        'IoT-Edge-Cloud Continuum Systems',
        'Game theory and Markov Model'
    ],
    
    // Education
    education: [
        {
            degree: 'Ph.D.',
            institute: 'Indian Institute of Technology Guwahati (IITG), India',
            year: '2014',
            subject: 'Computer Science and Engineering'
        },
        {
            degree: 'Postdoc',
            institute: 'University of Missouri Kansas City (UMKC), USA',
            year: '2014',
            subject: 'Computer Science'
        }
    ],
    
    // Courses Taught
    coursesTeaching: {
        ug: [
            'Artificial Intelligence',
            'Computer Network',
            'Cloud Computing and Virtualization',
            'Wireless Networks',
            'Distributed Computing',
            'Operating System',
            'Relational Database Management System (RDBMS)',
            'Design of Algorithm and Analysis',
            'Theory of Computation',
            'Game Theory',
            'Optimization Techniques'
        ],
        pg: [
            'Artificial Neural Network',
            'Mathematics Foundation for Computer Science',
            'Advance Computer Network',
            'Linear Algebra'
        ]
    },
    
    // Publications
    publications: {
        journals: [
            {
                year: '2021',
                title: 'Using UE-VBS for dynamic virtual small cells deployment and backhauling in 5G Ultra-Dense networks',
                category: 'International'
            },
            {
                year: '2021',
                title: 'Binary-PSO-based energy-efficient small cell deployment in 5G ultra-dense network',
                authors: 'Venkateswararao, Kuna, and Pravati Swain',
                journal: 'The Journal of Supercomputing',
                pages: '1-22',
                impactFactor: '2.6',
                category: 'International'
            },
            {
                year: '2018',
                title: 'Prediction of Human Mobility Using Mobile Traffic Dataset with HMM',
                authors: 'A Rawal, P Swain',
                journal: 'Recent Findings in Intelligent Computing Techniques (Springer)',
                pages: '489-495',
                category: 'International'
            },
            {
                year: '2014',
                title: 'Performance Modelling and Evaluation of IEEE 802.11 IBSS Power Save Mode in Different Traffic Condition',
                authors: 'P. Swain, S. Chakraborty, S. Nandi and P. Bhaduri',
                journal: 'IEEE Transactions on Mobile Computing',
                volume: '14, no 8',
                pages: '1644-1658',
                impactFactor: '5.11',
                category: 'International'
            },
            {
                year: '2014',
                title: 'Probabilistic model checking of IEEE 802.11 IBSS power save mode',
                authors: 'P. Swain, P. Bhaduri and S. Nandi',
                journal: 'Int. Journal of Wireless Mobile Computing',
                volume: '7, no 5',
                pages: '465-474',
                impactFactor: '1.35',
                category: 'International'
            },
            {
                year: '2014',
                title: 'Performance Modeling and Evaluation of IEEE 802.11 IBSS Power Save Mode',
                authors: 'P. Swain, S. Chakraborty, S. Nandi and P. Bhaduri',
                journal: 'Ad Hoc Networks, Elsevier',
                volume: '13',
                pages: '336–350',
                impactFactor: '4.11',
                category: 'International'
            },
            {
                year: '2013',
                title: 'Proportional Fairness in MAC Layer Channel Access of IEEE 802.11s EDCA based Wireless Mesh Networks',
                authors: 'S. Chakraborty, P. Swain, S. Nandi',
                journal: 'Ad Hoc Networks, Elsevier',
                volume: '11, no. 1',
                pages: '570–584',
                impactFactor: '4.11',
                category: 'International'
            }
        ],
        conferences: [
            {
                year: '2021',
                title: 'ChainAccess: Blockchain based Web-Access through Biometrics',
                authors: 'A. Jacob, P. Prakash, P. Karhana, P. Swain',
                conference: '12th International Conference on Computing, Communication and Networking Technologies (ICCCNT), IEEE',
                category: 'International'
            },
            {
                year: '2020',
                title: 'Traffic aware sleeping strategies for Small-Cell Base Station in the Ultra dense 5G Small Cell Networks',
                authors: 'K. Venkateswararao, and P. Swain',
                conference: '2020 IEEE REGION 10 CONFERENCE (TENCON)',
                pages: '102-107',
                publisher: 'IEEE',
                category: 'International'
            },
            {
                year: '2020',
                title: 'An Improved Flow Rule Verification Against the Priority-passing attack in SDN',
                authors: 'R. Kumar, S. Sahoo and P. Swain',
                conference: '2020 IEEE International Symposium on Sustainable Energy, Signal Processing and Cyber Security (iSSSC)',
                pages: '1-6',
                publisher: 'IEEE',
                category: 'International'
            },
            {
                year: '2019',
                title: 'CoDRL: Intelligent Packet Routing in SDN Using Convolutional Deep Reinforcement Learning',
                authors: 'P. Swain, U. Kamalia, R. Bhandarkar, & T. Modi',
                conference: '2019 IEEE International Conference on Advanced Networks and Telecommunications Systems (ANTS)',
                pages: '1-6',
                publisher: 'IEEE',
                category: 'International'
            },
            {
                year: '2019',
                title: 'Dynamic selection of Virtual Small Base Station in 5G Ultra-Dense Network using Initializing Matching Connection Algorithm',
                authors: 'K. Venkateswararao, P. Swain, C. Christophorou, & A. Pitsillides',
                conference: '2019 IEEE International Conference on Advanced Networks and Telecommunications Systems (ANTS)',
                pages: '1-6',
                publisher: 'IEEE',
                category: 'International'
            },
            {
                year: '2019',
                title: 'FlowDCN: Flow Scheduling in Software Defined Data Center Networks',
                authors: 'T. Modi, P. Swain',
                conference: '2019 IEEE International Conference on Electrical, Computer and Communication Technologies (ICECCT)',
                pages: '1-5',
                publisher: 'IEEE',
                category: 'International'
            },
            {
                year: '2018',
                title: 'Selection of UE-based Virtual small cell base stations using Affinity propagation clustering',
                authors: 'P. Swain, C. Christophrous, U Bhattacharjee, C. M. Silva, A. Pitsilides',
                conference: 'The 14th International Wireless Communications and Mobile Computing Conference (IWCMC 2018), Cyprus',
                category: 'International'
            },
            {
                year: '2017',
                title: 'Video Streaming over HetNets with LTE-WiFi integration in Radio level',
                authors: 'P. Swain, B. Nikhil',
                conference: 'IEEE Conference on Information and Communication Technology (CICT), (Nov 3-5, 2017, India)',
                category: 'International'
            },
            {
                year: '2016',
                title: 'Automating Toolpath Generation For 3-Axis CNC',
                authors: 'T. Gahlot, A. Kamat, P.Swain',
                conference: 'IEEE International Conference on Industrial Technology (ICIT), (March 14-17, 2016, Taipei)',
                category: 'International'
            },
            {
                year: '2016',
                title: 'Performance Modeling and Analysis of High Throughput Wireless Media Access with QoS in Noisy Channel for Different Traffic Conditions',
                authors: 'R. Karmakar, P.Swain, S. Chattopadhyay and S. Chakraborty',
                conference: '8th International Conference on Communications, Systems and Networks (COMSNETs), 2016, IEEE',
                category: 'International'
            },
            {
                year: '2014',
                title: 'Dynamic Web Service Composition with QoS Clustering',
                authors: 'A. K. Tripathy, M. R. Patra, M. A. Khan, H. Fatima, P. Swain',
                conference: 'ICWS 2014, USA',
                category: 'International'
            },
            {
                year: '2013',
                title: 'A Survey on Performance Modeling of IEEE 802.11 DCF in Power Save Mode',
                authors: 'P. Swain',
                conference: 'Int. Conference on Green Computing, communication and Conservation of energy, IEEE',
                category: 'International'
            },
            {
                year: '2012',
                title: 'Performance Analysis of IEEE 802.11 IBSS Power Save Mode using a Discrete-Time Markov Model',
                authors: 'P. Swain, S. Chakraborty, S. Nandi, and P. Bhaduri',
                conference: '27th ACM Symposium on Applied Computing (SAC) 2012, @ ACM Press',
                category: 'International'
            },
            {
                year: '2011',
                title: 'Throughput Analysis of the IEEE 802.11 Power Save Mode in Single Hop Ad hoc Networks',
                authors: 'P. Swain, S. Chakraborty, S. Nandi, and P. Bhaduri',
                conference: '10th International Conference on Wireless Networks, ICWN\'11 (July 18-21, 2011, USA), a CSREA Press',
                category: 'International'
            }
        ]
    },
    
    // Research Guidance
    researchGuidance: {
        phdStudents: [
            {
                name: 'Rakshavi Dessai',
                thesis: 'Quantum machine learning',
                status: 'Ongoing',
                joinDate: 'Jan 2025'
            },
            {
                name: 'Deepa A.',
                thesis: 'Traffic prediction and deployment of UAV as base station',
                status: 'Ongoing',
                joinDate: 'Dec 2022'
            },
            {
                name: 'Vivek Sharma',
                thesis: 'Crowdsourced Spectrum sensing',
                status: 'Ongoing',
                joinDate: 'August 2021'
            },
            {
                name: 'Tejas Modi',
                thesis: 'Intelligent Routing in SDN',
                status: 'Completed',
                duration: 'Dec 2017 - Dec 2022'
            },
            {
                name: 'Venkateswararao Kuna',
                thesis: 'Dynamic Virtual Small cell deployment and backhauling in Ultra-Dense network',
                status: 'Completed',
                duration: 'July 2018 – Sep 2022'
            }
        ],
        mtechStudents: [
            {
                name: 'Shubham H. Darshane',
                thesis: 'Federated Learning on Non-IID data',
                year: '2024'
            },
            {
                name: 'Sourav Suresh',
                thesis: 'Deployment of UAV base station using hybrid prediction model',
                year: '2023'
            },
            {
                name: 'Manish Vatsal',
                thesis: 'The graph attention mechanism with graph convolutional LSTM for cellular network prediction',
                year: '2023'
            },
            {
                name: 'Khatsuria Yash Vijaybhai',
                thesis: 'A Novel Optimization strategy for computation Offloading in an UAV-assisted Edge Computing',
                year: '2022'
            },
            {
                name: 'Ankita Joshi',
                thesis: 'Energy Efficient Backhaul routing and switching off strategy',
                year: '2021'
            },
            {
                name: 'Mahantesh Hedge',
                thesis: 'Sleeping Strategy for Small Base Stations by Using Blockchain Technology',
                year: '2021'
            },
            {
                name: 'Romil Kumar',
                thesis: 'Switch-Based Rule Verification in Software-Defined Network',
                year: '2020'
            },
            {
                name: 'S Raghupathi',
                thesis: 'Blockchain Enabled Energy Efficient Small Cell as-a-Service in 5G',
                year: '2020'
            },
            {
                name: 'Vishwas Kumar',
                thesis: 'Load balancing Algorithm in Software Defined Network',
                year: '2019'
            },
            {
                name: 'Upasana Bhattacharjee',
                thesis: 'User Equipment based Virtual Base Station in 5G',
                year: '2018'
            },
            {
                name: 'Anshika Rawal',
                thesis: 'Prediction of Human Mobility Using Mobile Traffic Dataset with HMM',
                year: '2017'
            }
        ]
    },
    
    // Funded Research Projects
    fundedProjects: [
        {
            title: 'Enhanced Automation of 3-Axis CNC Milling Machine using Computer Vision and Artificial Intelligence',
            agency: 'Science and Engineering Research Board (SERB), Department of Science and Technology, Government of India',
            role: 'PI'
        },
        {
            title: 'Smart City Surveillance using Decentralized Multi-camera Networks',
            agency: 'Science and Engineering Research Board (SERB), Department of Science and Technology, Government of India',
            role: 'Co-PI'
        }
    ],
    
    // Training/Conferences Attended
    trainingsAttended: [
        {
            month: 'MAY',
            year: '2015',
            title: 'Summer course on "Enabling Internet of Things with Cloud and Big Data Networking", IIT Kharagpur, India'
        },
        {
            month: 'JUN',
            year: '2014',
            title: '20th GENI Engineering Conference in University of California Davis, USA'
        },
        {
            month: 'MAY',
            year: '2013',
            title: 'Workshop on Android Application Development in IIT Guwahati, India'
        },
        {
            month: 'MAR',
            year: '2013',
            title: 'Workshop on Cyber-Physical Systems: Applications and open challenges in IIT Hyderabad, India'
        },
        {
            month: 'MAR',
            year: '2012',
            title: 'SAC 2012- 27th Symposium On Applied Computing in Riva del Garda (Trento), Italy'
        },
        {
            month: 'OCT',
            year: '2011',
            title: 'Workshop on Introduction to Introduction to Graph and Geometric Algorithms in IIT Guwahati, India'
        },
        {
            month: 'JULY',
            year: '2011',
            title: 'ICWN\'11- The 2011 International Conference on Wireless Network in Las Vegas, Nevada, USA'
        },
        {
            month: 'AUG',
            year: '2010',
            title: 'SIGCOMM, 2010 in Delhi, India'
        }
    ],
    
    // Training/Conferences Conducted
    trainingsConducted: [
        {
            month: 'MAY',
            year: '2016',
            title: 'DST Sponsored Workshop on EMERGING TECHNOLOGIES IN MOBILE COMMUNICATIONS'
        }
    ],
    
    // Professional Experience
    experience: [
        // Add professional experience if available
    ],
    
    // Awards and Honors
    awards: [
        // Add awards if available
    ],
    
    // Administrative Responsibilities
    administrative: [
        // Add administrative roles if available
    ],
    
    // Professional Memberships
    memberships: [
        // Add professional memberships if available
    ]
};

export default pravatiData;
