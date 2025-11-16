-- =================================================================
-- FAC001 Database Population Script
-- Populates missing data and updates incorrect information
-- =================================================================

USE updated_nitgoa;

-- First, let's insert education data (completely missing)
INSERT INTO faculty_education (
    employee_code, degree, institute, discipline, graduation_year, display_order
) VALUES 
('FAC001', 'B.E.', 'Manipal Institute of Technology, Manipal Affiliated to Mangalore University', 'Biomedical Engineering', 1998, 1),
('FAC001', 'M.E.', 'MS from Manipal Academy of Higher Education, Manipal', 'Medical Software', 2000, 2),
('FAC001', 'Ph.D.', 'IIT Madras', 'Computer Science and Engineering', 2014, 3);

-- Insert publications (completely missing)
INSERT INTO faculty_publications (
    employee_code, publication_type, title, publication_details, publication_year, publication_month,
    journal_name, volume, issue, pages, citation_count, is_featured, display_order
) VALUES 
('FAC001', 'Journal Paper', 'Visual Semantic-Based Representation Learning Using Deep CNNs for Scene Recognition', 
 'Shikha Gupta, Krishan Sharma, A. D. Dileep, Veena Thenkanidiyoor, ACM Transactions on Multimedia Computing, Communications, and Applications, 17(2)', 
 2021, 'June', 'ACM Transactions on Multimedia Computing, Communications, and Applications', '17', '2', NULL, 0, 1, 1),

('FAC001', 'Journal Paper', 'Recognition of varying size scene images using semantic analysis of deep activation maps',
 'Shikha Gupta, A. D. Dileep, Veena Thenkanidiyoor, Machine Vision and Applications, 32(2), pp. 1-19',
 2021, 'March', 'Machine Vision and Applications', '32', '2', '1-19', 0, 1, 2),

('FAC001', 'Conference Proceeding', 'Application of machine learning techniques to weather forecasting',
 'Samy, V.S, Veena Thenkanidiyoor, International Symposium "Global Collaboration on Data beyond Disciplines", 23-25 September 2020',
 2020, 'September', NULL, NULL, NULL, NULL, 0, 0, 3),

('FAC001', 'Conference Proceeding', 'Kernel based Matching and a Novel Training approach for CNN-based QbE-STD',
 'Prajyot Naik, Manisha Naik Gaonkar, Veena Thenkanidiyoor, Dileep A.D., International Conference on Signal Processing and Communications 2020 (SPCOM 2020), Bengalore, India',
 2020, 'July', NULL, NULL, NULL, NULL, 0, 0, 4);

-- Update faculty profile with correct social links and other information
UPDATE faculty_profiles 
SET 
    linkedin_url = 'https://www.linkedin.com/in/veena-thenkanidiyoor/',
    personal_website_url = 'https://nitgoa.ac.in/faculty/veena',
    google_scholar_url = 'https://scholar.google.com/citations?user=XXXXX',
    research_gate_url = 'https://www.researchgate.net/profile/Veena-Thenkanidiyoor',
    bio_summary = 'Dr. Veena Thenkanidiyoor is an Associate Professor and Head of the Department of Computer Science and Engineering at NIT Goa.'
WHERE employee_code = 'FAC001';

-- Note: The following tables don't exist yet or need to be created:
-- - courses_taught (would need to create this table)
-- - research_guidance (would need to create this table)  
-- - funded_projects (would need to create this table)
-- - awards_and_honors (would need to create this table)
-- - courses_attended (would need to create this table)
-- - courses_conducted (would need to create this table)

-- Display summary of what was added
SELECT 'Education Records Added' as Action, COUNT(*) as Count FROM faculty_education WHERE employee_code = 'FAC001'
UNION ALL
SELECT 'Publications Added' as Action, COUNT(*) as Count FROM faculty_publications WHERE employee_code = 'FAC001'
UNION ALL 
SELECT 'Profile Updated' as Action, 1 as Count;