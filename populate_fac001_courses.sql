-- =================================================================
-- FAC001 Courses Taught Population Script
-- Adds courses taught data from the JSON template
-- =================================================================

USE updated_nitgoa;

-- Insert courses taught data
INSERT INTO faculty_courses_taught (
    employee_code, custom_course_code, custom_course_name, custom_course_level, custom_credits, custom_semester
) VALUES 
('FAC001', 'CS301', 'Introduction to Machine Learning', 'Undergraduate', 3, 'Odd'),
('FAC001', 'CS201', 'Computer Organization and Architecture', 'Undergraduate', 4, 'Even'),
('FAC001', 'CS302', 'Systems Programming', 'Undergraduate', 3, 'Even'),
('FAC001', 'CS401', 'Computer Vision', 'Undergraduate', 3, 'Odd'),
('FAC001', 'CS202', 'Object Oriented Programming', 'Undergraduate', 3, 'Even'),
('FAC001', 'CS203', 'Computer Networks', 'Undergraduate', 3, 'Odd'),
('FAC001', 'CS402', 'Soft Computing', 'Undergraduate', 3, 'Even'),
('FAC001', 'CS303', 'Advanced Java Programming', 'Undergraduate', 3, 'Odd'),
('FAC001', 'CS101', 'Programming in C', 'Undergraduate', 4, 'Odd'),
('FAC001', 'CS102', 'Data Structures', 'Undergraduate', 4, 'Even'),
('FAC001', 'CS204', 'Introduction to Algorithms', 'Undergraduate', 3, 'Odd'),
('FAC001', 'CS501', 'Machine Learning', 'Postgraduate', 3, 'Odd'),
('FAC001', 'CS502', 'Advanced Computer Architecture', 'Postgraduate', 3, 'Even'),
('FAC001', 'CS503', 'Pattern Recognition', 'Postgraduate', 3, 'Even'),
('FAC001', 'CS504', 'Artificial Neural Networks', 'Postgraduate', 3, 'Odd'),
('FAC001', 'CS505', 'Image Processing', 'Postgraduate', 3, 'Even'),
('FAC001', 'CS506', 'Advanced Java Programming', 'Postgraduate', 3, 'Odd'),
('FAC001', 'CS507', 'Relational Database Management Systems', 'Postgraduate', 3, 'Even'),
('FAC001', 'CS508', 'Web Application Development-I', 'Postgraduate', 3, 'Odd'),
('FAC001', 'CS509', 'Web Application Development-II', 'Postgraduate', 3, 'Even');

-- Display summary
SELECT 'Courses Taught Added' as Action, COUNT(*) as Count FROM faculty_courses_taught WHERE employee_code = 'FAC001'
UNION ALL
SELECT 'Undergraduate Courses' as Action, COUNT(*) as Count FROM faculty_courses_taught WHERE employee_code = 'FAC001' AND custom_course_level = 'Undergraduate'
UNION ALL 
SELECT 'Postgraduate Courses' as Action, COUNT(*) as Count FROM faculty_courses_taught WHERE employee_code = 'FAC001' AND custom_course_level = 'Postgraduate';