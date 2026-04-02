-- Fix employee_id sequence to match current max value
SELECT setval('employees_employee_id_seq', (SELECT MAX(employee_id) FROM employees));
