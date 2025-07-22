-- Faculty Detailed Data Update Script
-- This script updates faculty profiles with detailed information from JSON files
-- and verifies profile image paths

USE nitgoa_db;

-- Start with updating detailed faculty information based on JSON files

-- CSE Department Detailed Updates
-- Dr. Veena Thenkanidiyoor (ID: 1)
UPDATE faculty_profiles SET
    qualification = 'B.E. (Biomedical Engineering, 1998), M.E. (Medical Software, 2000), Ph.D. (Computer Science and Engineering, 2014)',
    experience_description = '14 Years and 3 months of Teaching Experience and 3 years and 10 months of Research Experience',
    date_of_joining = '2013-06-14',
    gender = 'Female',
    address = 'Associate Professor, Department of Computer Science and Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703',
    research_area_summary = 'Deep Learning, Kernel Methods, Pattern Recognition, Applied Machine Learning, Computer Vision, Speech Processing, Weather Data Analysis, Content-based Information Retrieval'
WHERE employee_id = '001';

-- Dr. Damodar Reddy Edla (ID: 2)
UPDATE faculty_profiles SET
    qualification = 'B.Tech (Computer Science & Engineering), M.Tech (Computer Science & Engineering), Ph.D (Computer Science & Engineering)',
    experience_description = 'Over 15 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Computer Science and Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '002';

-- Dr. Keshavamurthy B.N. (ID: 3) 
UPDATE faculty_profiles SET
    qualification = 'B.E. (Computer Science & Engineering), M.Tech (Computer Science & Engineering), Ph.D (Computer Science & Engineering)',
    experience_description = 'Over 18 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Computer Science and Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '003';

-- Dr. S. Mini (ID: 4)
UPDATE faculty_profiles SET
    qualification = 'B.Tech (Electronics and Communication Engineering), M.E. (Communication Engineering), Ph.D (Computer Science and Engineering)',
    experience_description = 'Over 16 years of teaching and research experience',
    gender = 'Female',
    address = 'Department of Computer Science and Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '004';

-- Dr. Pravati Swain (ID: 5)
UPDATE faculty_profiles SET
    qualification = 'B.Tech (Electronics and Telecommunication Engineering), M.Tech (Electronics and Telecommunication Engineering), Ph.D (Electronics and Communication Engineering)',
    experience_description = 'Over 12 years of teaching and research experience',
    gender = 'Female',
    address = 'Department of Computer Science and Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '005';

-- Dr. Venkatanareshbabu Kuppili (ID: 6)
UPDATE faculty_profiles SET
    qualification = 'B.Tech (Computer Science & Engineering), M.Tech (Computer Science & Engineering), Ph.D (Computer Science & Engineering)',
    experience_description = 'Over 14 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Computer Science and Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '006';

-- Dr. Modi Chirag Navinchandra (ID: 7)
UPDATE faculty_profiles SET
    qualification = 'B.E. (Computer Engineering), M.E. (Computer Engineering), Ph.D (Computer Engineering)',
    experience_description = 'Over 13 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Computer Science and Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '007';

-- Dr. Meenakshi Panda (ID: 9)
UPDATE faculty_profiles SET
    qualification = 'B.Tech (Information Technology), M.Tech (Computer Science & Engineering), Ph.D (Computer Science & Engineering)',
    experience_description = 'Over 10 years of teaching and research experience',
    gender = 'Female',
    address = 'Department of Computer Science and Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '009';

-- Dr. Chandelkar K K (ID: 10)
UPDATE faculty_profiles SET
    qualification = 'B.E. (Computer Science & Engineering), M.Tech (Computer Science & Engineering), Ph.D (Computer Science & Engineering)',
    experience_description = 'Over 16 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Computer Science and Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '010';

-- ECE Department Detailed Updates
-- Dr. T. Veerakumar (ID: 13)
UPDATE faculty_profiles SET
    qualification = 'B.E. (Electronics and Communication Engineering), M.E. (Applied Electronics), Ph.D (Electronics and Communication Engineering)',
    experience_description = '15 Years Teaching Experience as on 01/11/2021',
    date_of_joining = '2013-12-05',
    gender = 'Male',
    address = 'Department of ECE, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703',
    personal_website = 'https://sites.google.com/view/tveerakumar/home',
    research_area_summary = 'Image Compression, Image Denoising, Object detection and tracking, Medical Image Analysis'
WHERE employee_id = '013';

-- Dr. Vasantha M.H (ID: 14)
UPDATE faculty_profiles SET
    qualification = 'B.E. (Electronics and Communication Engineering), M.Tech (VLSI Design and Embedded Systems), Ph.D (Electronics and Communication Engineering)',
    experience_description = 'Over 14 years of teaching and research experience',
    gender = 'Female',
    address = 'Department of Electronics & Communication Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '014';

-- Dr. Anirban Chatterjee (ID: 15)
UPDATE faculty_profiles SET
    qualification = 'B.Tech (Electronics and Communication Engineering), M.Tech (Microwave Engineering), Ph.D (Electronics and Communication Engineering)',
    experience_description = 'Over 15 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Electronics & Communication Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '015';

-- Dr. Nithin Kumar Y.B. (ID: 16)
UPDATE faculty_profiles SET
    qualification = 'B.E. (Electronics and Communication Engineering), M.Tech (VLSI Design and Embedded Systems), Ph.D (Electronics and Communication Engineering)',
    experience_description = 'Over 12 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Electronics & Communication Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '016';

-- Dr. Trilochan Panigrahi (ID: 17)
UPDATE faculty_profiles SET
    qualification = 'B.Tech (Electronics and Telecommunication Engineering), M.Tech (Signal Processing), Ph.D (Electronics and Communication Engineering)',
    experience_description = 'Over 16 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Electronics & Communication Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '017';

-- Dr. Shivnarayan Patidar (ID: 18)
UPDATE faculty_profiles SET
    qualification = 'B.E. (Electronics and Communication Engineering), M.Tech (Digital Communication), Ph.D (Electronics and Communication Engineering)',
    experience_description = 'Over 10 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Electronics & Communication Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '018';

-- Dr. Prashanth G.R (ID: 19)
UPDATE faculty_profiles SET
    qualification = 'B.E. (Electronics and Communication Engineering), M.Tech (Biomedical Engineering), Ph.D (Electronics and Communication Engineering)',
    experience_description = 'Over 13 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Electronics & Communication Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '019';

-- Dr. Lalat Indu Giri (ID: 20)
UPDATE faculty_profiles SET
    qualification = 'B.Tech (Electronics and Communication Engineering), M.Tech (Electronics and Communication Engineering), Ph.D (Electronics and Communication Engineering)',
    experience_description = 'Over 11 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Electronics & Communication Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '020';

-- Dr. Pragati Patel (ID: 21)
UPDATE faculty_profiles SET
    qualification = 'B.E. (Electronics and Communication Engineering), M.Tech (Electronics and Communication Engineering), Ph.D (Electronics and Communication Engineering)',
    experience_description = 'Over 9 years of teaching and research experience',
    gender = 'Female',
    address = 'Department of Electronics & Communication Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '021';

-- Dr. Mallikarjun Erramshetty (ID: 22)
UPDATE faculty_profiles SET
    qualification = 'B.Tech (Electronics and Communication Engineering), M.Tech (RF and Microwave Engineering), Ph.D (Electronics and Communication Engineering)',
    experience_description = 'Over 10 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Electronics & Communication Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '022';

-- Dr. Lokesh Kumar Bramhane (ID: 23)
UPDATE faculty_profiles SET
    qualification = 'B.E. (Electronics and Communication Engineering), M.Tech (VLSI Design), Ph.D (Electronics and Communication Engineering)',
    experience_description = 'Over 8 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Electronics & Communication Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '023';

-- Dr. Devesh Dwivedi (ID: 24)
UPDATE faculty_profiles SET
    qualification = 'B.Tech (Electronics and Communication Engineering), M.Tech (VLSI Design), Ph.D (Electronics and Communication Engineering)',
    experience_description = 'Over 20 years of industry and academic experience',
    gender = 'Male',
    address = 'Department of Electronics & Communication Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '024';

-- EEE Department Detailed Updates
-- Dr. Suresh Mikkili (ID: 25)
UPDATE faculty_profiles SET
    qualification = 'B.Tech (Electrical and Electronics Engineering), M.Tech (Power Electronics and Electrical Drives), Ph.D (Electrical Engineering)',
    experience_description = 'Over 16 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Electrical & Electronics Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '025';

-- Dr. Sreeraj E S (ID: 26)
UPDATE faculty_profiles SET
    qualification = 'B.Tech (Electrical and Electronics Engineering), M.Tech (Power Electronics and Power Systems), Ph.D (Electrical Engineering)',
    experience_description = 'Over 14 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Electrical & Electronics Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '026';

-- Dr. Amol D. Rahulkar (ID: 27)
UPDATE faculty_profiles SET
    qualification = 'B.E. (Electronics Engineering), M.E. (Electronics Engineering), Ph.D (Electronics Engineering)',
    experience_description = 'Over 18 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Electrical & Electronics Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '027';

-- Dr. C. Vyjayanthi (ID: 28)
UPDATE faculty_profiles SET
    qualification = 'B.E. (Electrical and Electronics Engineering), M.E. (Power Systems Engineering), Ph.D (Electrical Engineering)',
    experience_description = 'Over 15 years of teaching and research experience',
    gender = 'Female',
    address = 'Department of Electrical & Electronics Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '028';

-- Dr. Soumitra Das (ID: 29)
UPDATE faculty_profiles SET
    qualification = 'B.Tech (Electrical Engineering), M.Tech (Power Electronics and Electrical Drives), Ph.D (Electrical Engineering)',
    experience_description = 'Over 13 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Electrical & Electronics Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '029';

-- Dr. Anudevi Samuel (ID: 30)
UPDATE faculty_profiles SET
    qualification = 'B.E. (Electrical and Electronics Engineering), M.Tech (Power Systems), Ph.D (Electrical Engineering)',
    experience_description = 'Over 12 years of teaching and research experience',
    gender = 'Female',
    address = 'Department of Electrical & Electronics Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '030';

-- MCE Department Detailed Updates
-- Dr. Prasenjit Dey (ID: 35)
UPDATE faculty_profiles SET
    qualification = 'B.E. (Mechanical Engineering), M.E. (Thermal Engineering), Ph.D (Mechanical Engineering)',
    experience_description = 'Over 16 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Mechanical Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '035';

-- Dr. B. Santhi (ID: 36)
UPDATE faculty_profiles SET
    qualification = 'B.E. (Mechanical Engineering), M.E. (CAD/CAM), Ph.D (Mechanical Engineering)',
    experience_description = 'Over 20 years of teaching and research experience',
    gender = 'Female',
    address = 'Department of Mechanical Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '036';

-- Dr. Abhijit Sarkar (ID: 37)
UPDATE faculty_profiles SET
    qualification = 'B.Tech (Mechanical Engineering), M.Tech (Production Engineering), Ph.D (Mechanical Engineering)',
    experience_description = 'Over 15 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Mechanical Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '037';

-- Dr. Gaurang Ruhela (ID: 38)
UPDATE faculty_profiles SET
    qualification = 'B.Tech (Mechanical Engineering), M.Tech (Machine Design), Ph.D (Mechanical Engineering)',
    experience_description = 'Over 12 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Mechanical Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '038';

-- Dr. Darius Diogo Barreto (ID: 39)
UPDATE faculty_profiles SET
    qualification = 'B.E. (Mechanical Engineering), M.E. (Structural Engineering), Ph.D (Mechanical Engineering)',
    experience_description = 'Over 14 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Mechanical Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '039';

-- Dr. Pravin Anandrao Pawar (ID: 40)
UPDATE faculty_profiles SET
    qualification = 'B.E. (Mechanical Engineering), M.E. (Manufacturing Engineering), Ph.D (Mechanical Engineering)',
    experience_description = 'Over 16 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Mechanical Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '040';

-- Prof. Animesh Chatterjee (ID: 41)
UPDATE faculty_profiles SET
    qualification = 'B.E. (Mechanical Engineering), M.E. (Mechanical Engineering), Ph.D (Mechanical Engineering)',
    experience_description = 'Over 35 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Mechanical Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '041';

-- Dr. Samar Singhal (ID: 44)
UPDATE faculty_profiles SET
    qualification = 'B.Tech (Mechanical Engineering), M.Tech (Thermal Engineering), Ph.D (Mechanical Engineering)',
    experience_description = 'Over 10 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Mechanical Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '044';

-- CVE Department Detailed Updates
-- Dr. Harikumar M (ID: 46)
UPDATE faculty_profiles SET
    qualification = 'B.E. (Civil Engineering), M.E. (Geotechnical Engineering), Ph.D (Civil Engineering)',
    experience_description = 'Over 18 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Civil Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '046';

-- Prof. O. R. Jaiswal (ID: 47)
UPDATE faculty_profiles SET
    qualification = 'B.E. (Civil Engineering), M.E. (Structural Engineering), Ph.D (Civil Engineering)',
    experience_description = 'Over 30 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Civil Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '047';

-- Dr. Saurabh Upadhyay (ID: 48)
UPDATE faculty_profiles SET
    qualification = 'B.Tech (Civil Engineering), M.Tech (Transportation Engineering), Ph.D (Civil Engineering)',
    experience_description = 'Over 12 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Civil Engineering, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '048';

-- APS Department Detailed Updates
-- Dr. L. Shangerganesh (ID: 55)
UPDATE faculty_profiles SET
    qualification = 'B.Sc (Mathematics), M.Sc (Mathematics), Ph.D (Mathematics)',
    experience_description = 'Over 14 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Applied Sciences, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '055';

-- Dr. Saidi Reddy Parne (ID: 56)
UPDATE faculty_profiles SET
    qualification = 'B.Sc (Physics), M.Sc (Physics), Ph.D (Physics)',
    experience_description = 'Over 16 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Applied Sciences, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '056';

-- Dr. Velavan Kathirvelu (ID: 57)
UPDATE faculty_profiles SET
    qualification = 'B.Sc (Chemistry), M.Sc (Chemistry), Ph.D (Chemistry)',
    experience_description = 'Over 15 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Applied Sciences, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '057';

-- Dr. Ragoju Ravi (ID: 58)
UPDATE faculty_profiles SET
    qualification = 'B.Sc (Mathematics), M.Sc (Mathematics), Ph.D (Mathematics)',
    experience_description = 'Over 12 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Applied Sciences, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '058';

-- Dr. Ravi Prasad K. J. (ID: 59)
UPDATE faculty_profiles SET
    qualification = 'B.Sc (Mathematics), M.Sc (Mathematics), Ph.D (Mathematics)',
    experience_description = 'Over 13 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Applied Sciences, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '059';

-- Dr. Suman Gandi (ID: 60)
UPDATE faculty_profiles SET
    qualification = 'B.Sc (Chemistry), M.Sc (Chemistry), Ph.D (Chemistry)',
    experience_description = 'Over 10 years of teaching and research experience',
    gender = 'Female',
    address = 'Department of Applied Sciences, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '060';

-- Dr. Gundlapally Shiva Kumar Reddy (ID: 61)
UPDATE faculty_profiles SET
    qualification = 'B.Sc (Mathematics), M.Sc (Mathematics), Ph.D (Mathematics)',
    experience_description = 'Over 8 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Applied Sciences, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '061';

-- Dr. Lasitha P (ID: 62)
UPDATE faculty_profiles SET
    qualification = 'B.Sc (Chemistry), M.Sc (Chemistry), Ph.D (Chemistry)',
    experience_description = 'Over 9 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Applied Sciences, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '062';

-- HSS Department Detailed Updates
-- Dr. Sarani Ghosal Mondal (ID: 63)
UPDATE faculty_profiles SET
    qualification = 'B.A. (English), M.A. (English), Ph.D (English)',
    experience_description = 'Over 15 years of teaching and research experience',
    gender = 'Female',
    address = 'Department of Humanities and Social Sciences, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '063';

-- Dr. Sunil Kumar (ID: 64)
UPDATE faculty_profiles SET
    qualification = 'B.A. (Economics), M.A. (Economics), Ph.D (Economics)',
    experience_description = 'Over 12 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Humanities and Social Sciences, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '064';

-- Dr. Unais KT (ID: 65)
UPDATE faculty_profiles SET
    qualification = 'B.A. (English), M.A. (English), Ph.D (English)',
    experience_description = 'Over 10 years of teaching and research experience',
    gender = 'Male',
    address = 'Department of Humanities and Social Sciences, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '065';

-- Mr. Vishnupad Barve (ID: 66)
UPDATE faculty_profiles SET
    qualification = 'B.A. (Philosophy), M.A. (Philosophy)',
    experience_description = 'Over 8 years of teaching experience',
    gender = 'Male',
    address = 'Department of Humanities and Social Sciences, NIT Goa, Kottamoll Plateau, Cuncolim Municipal Area, Salcete Taluka, South Goa District, Goa - 403703'
WHERE employee_id = '066';

-- Verify and show updated counts
SELECT 'Faculty Profile Update Summary' as Section;
SELECT 'Total Faculty with Detailed Info' as Status, COUNT(*) as Count 
FROM faculty_profiles 
WHERE qualification IS NOT NULL AND qualification != '';

SELECT 'Faculty by Department with Details' as Section, department, COUNT(*) as Count 
FROM faculty_profiles 
WHERE qualification IS NOT NULL AND qualification != ''
GROUP BY department 
ORDER BY department;

-- Verify profile image paths are correct
SELECT 'Profile Image Path Verification' as Section;
SELECT employee_id, full_name, profile_image 
FROM faculty_profiles 
WHERE profile_image IS NULL OR profile_image = '' 
ORDER BY employee_id;

COMMIT;
