TABLE_NAME	COLUMN_NAME	COLUMN_TYPE	IS_NULLABLE	COLUMN_KEY	COLUMN_DEFAULT
audit_log	log_id	int	NO	PRI	NULL
audit_log	user_id	int	YES	MUL	NULL
audit_log	action	varchar(100)	NO		NULL
audit_log	table_name	varchar(100)	YES	MUL	NULL
audit_log	record_id	varchar(100)	YES		NULL
audit_log	old_values	json	YES		NULL
audit_log	new_values	json	YES		NULL
audit_log	ip_address	varchar(45)	YES		NULL
audit_log	user_agent	text	YES		NULL
audit_log	created_at	timestamp	YES	MUL	CURRENT_TIMESTAMP
content_updates	update_id	int	NO	PRI	NULL
content_updates	content_type	enum('faculty','announcement','academics','administration','general')	NO	MUL	NULL
content_updates	content_id	varchar(100)	YES		NULL
content_updates	employee_code	varchar(50)	YES	MUL	NULL
content_updates	update_type	enum('CREATE','UPDATE','DELETE')	YES		NULL
content_updates	update_description	varchar(500)	NO		NULL
content_updates	old_data	json	YES		NULL
content_updates	new_data	json	YES		NULL
content_updates	update_reason	text	YES		NULL
content_updates	updated_by	varchar(100)	YES		NULL
content_updates	updated_at	timestamp	YES	MUL	CURRENT_TIMESTAMP
content_updates	is_major_update	tinyint(1)	YES	MUL	0
course_requests	request_id	int	NO	PRI	NULL
course_requests	employee_code	varchar(50)	NO	MUL	NULL
course_requests	course_code	varchar(20)	NO		NULL
course_requests	course_name	varchar(255)	NO		NULL
course_requests	course_level	enum('Undergraduate','Postgraduate','Diploma','Certificate')	NO		NULL
course_requests	credits	int	YES		NULL
course_requests	semester	varchar(20)	YES		NULL
course_requests	department_id	int	YES	MUL	NULL
course_requests	justification	text	YES		NULL
course_requests	status	enum('pending','approved','rejected')	YES	MUL	pending
course_requests	reviewed_by	varchar(50)	YES		NULL
course_requests	review_comments	text	YES		NULL
course_requests	created_at	timestamp	YES		CURRENT_TIMESTAMP
course_requests	updated_at	timestamp	YES		CURRENT_TIMESTAMP
courses	course_id	int	NO	PRI	NULL
courses	course_code	varchar(20)	NO	UNI	NULL
courses	course_name	varchar(255)	NO		NULL
courses	course_level	enum('Undergraduate','Postgraduate','Diploma','Certificate')	NO		NULL
courses	department_id	int	YES	MUL	NULL
courses	credits	int	YES		NULL
courses	semester	varchar(20)	YES		NULL
courses	is_active	tinyint(1)	YES	MUL	1
courses	created_at	timestamp	YES		CURRENT_TIMESTAMP
courses	updated_at	timestamp	YES		CURRENT_TIMESTAMP
departments	department_id	int	NO	PRI	NULL
departments	department_name	varchar(255)	NO	UNI	NULL
departments	department_code	varchar(10)	YES	UNI	NULL
departments	is_active	tinyint(1)	YES		1
departments	created_at	timestamp	YES		CURRENT_TIMESTAMP
departments	updated_at	timestamp	YES		CURRENT_TIMESTAMP
employees	employee_id	int	NO	PRI	NULL
employees	employee_code	varchar(50)	NO	UNI	NULL
employees	honorific	enum('Dr.','Mr.','Mrs.','Ms.','Prof.')	YES		NULL
employees	full_name	varchar(255)	NO		NULL
employees	gender	enum('Male','Female','Other')	YES		NULL
employees	role	enum('Faculty','Administrative','Technical')	NO	MUL	NULL
employees	email	varchar(255)	NO	UNI	NULL
employees	extension_no	varchar(20)	YES		NULL
employees	phone_mobile	varchar(20)	YES		NULL
employees	phone_residence	varchar(50)	YES		NULL
employees	date_of_joining	date	YES		NULL
employees	is_active	tinyint(1)	YES	MUL	1
employees	is_public_visible	tinyint(1)	YES	MUL	1
employees	created_at	timestamp	YES		CURRENT_TIMESTAMP
employees	updated_at	timestamp	YES		CURRENT_TIMESTAMP
faculty_courses_taught	id	int	NO	PRI	NULL
faculty_courses_taught	employee_code	varchar(50)	NO	MUL	NULL
faculty_courses_taught	course_id	int	YES	MUL	NULL
faculty_courses_taught	custom_course_name	varchar(255)	YES		NULL
faculty_courses_taught	custom_course_code	varchar(20)	YES		NULL
faculty_courses_taught	custom_credits	int	YES		NULL
faculty_courses_taught	custom_course_level	enum('Undergraduate','Postgraduate','Diploma','Certificate')	YES		NULL
faculty_courses_taught	custom_semester	varchar(20)	YES		NULL
faculty_courses_taught	created_at	timestamp	YES		CURRENT_TIMESTAMP
faculty_courses_taught	updated_at	timestamp	YES		CURRENT_TIMESTAMP
faculty_custom_section_entries	entry_id	int	NO	PRI	NULL
faculty_custom_section_entries	custom_section_id	int	NO	MUL	NULL
faculty_custom_section_entries	entry_data	json	NO		NULL
faculty_custom_section_entries	display_order	int	YES		0
faculty_custom_section_entries	created_at	datetime	YES		CURRENT_TIMESTAMP
faculty_custom_section_entries	updated_at	datetime	YES		CURRENT_TIMESTAMP
faculty_custom_section_fields	field_id	int	NO	PRI	NULL
faculty_custom_section_fields	custom_section_id	int	NO	MUL	NULL
faculty_custom_section_fields	field_name	varchar(255)	NO		NULL
faculty_custom_section_fields	field_type	varchar(50)	YES		text
faculty_custom_section_fields	display_order	int	YES		0
faculty_custom_sections	custom_section_id	int	NO	PRI	NULL
faculty_custom_sections	employee_code	varchar(50)	NO	MUL	NULL
faculty_custom_sections	section_title	varchar(255)	NO		NULL
faculty_custom_sections	section_type	enum('table','list','text')	YES		list
faculty_custom_sections	display_order	int	YES		0
faculty_custom_sections	is_visible	tinyint(1)	YES		1
faculty_custom_sections	created_at	datetime	YES		CURRENT_TIMESTAMP
faculty_custom_sections	updated_at	datetime	YES		CURRENT_TIMESTAMP
faculty_designations	designation_id	int	NO	PRI	NULL
faculty_designations	designation_title	varchar(255)	NO	UNI	NULL
faculty_designations	designation_level	int	YES		0
faculty_designations	is_active	tinyint(1)	YES		1
faculty_designations	created_at	timestamp	YES		CURRENT_TIMESTAMP
faculty_designations	updated_at	timestamp	YES		CURRENT_TIMESTAMP
faculty_education	education_id	int	NO	PRI	NULL
faculty_education	employee_code	varchar(50)	NO	MUL	NULL
faculty_education	degree	varchar(100)	NO		NULL
faculty_education	institute	varchar(255)	NO		NULL
faculty_education	discipline	varchar(255)	YES		NULL
faculty_education	graduation_year	year	YES	MUL	NULL
faculty_education	display_order	int	YES		0
faculty_education	created_at	timestamp	YES		CURRENT_TIMESTAMP
faculty_education	updated_at	timestamp	YES		CURRENT_TIMESTAMP
faculty_professional_memberships	membership_id	int	NO	PRI	NULL
faculty_professional_memberships	employee_code	varchar(50)	NO	MUL	NULL
faculty_professional_memberships	organization_name	varchar(255)	NO	MUL	NULL
faculty_professional_memberships	membership_type	varchar(100)	YES		NULL
faculty_professional_memberships	is_active	tinyint(1)	YES		1
faculty_professional_memberships	created_at	timestamp	YES		CURRENT_TIMESTAMP
faculty_professional_memberships	updated_at	timestamp	YES		CURRENT_TIMESTAMP
faculty_profiles	employee_code	varchar(50)	NO	PRI	NULL
faculty_profiles	department_id	int	YES	MUL	NULL
faculty_profiles	designation_id	int	YES	MUL	NULL
faculty_profiles	date_of_birth	date	YES		NULL
faculty_profiles	is_hod	tinyint(1)	YES	MUL	0
faculty_profiles	image_url	varchar(255)	YES		NULL
faculty_profiles	research_teaching_experience	text	YES		NULL
faculty_profiles	address	text	YES		NULL
faculty_profiles	office_location	varchar(100)	YES		NULL
faculty_profiles	office_hours	varchar(255)	YES		NULL
faculty_profiles	linkedin_url	varchar(255)	YES		NULL
faculty_profiles	personal_website_url	varchar(255)	YES		NULL
faculty_profiles	google_scholar_url	varchar(255)	YES		NULL
faculty_profiles	research_gate_url	varchar(255)	YES		NULL
faculty_profiles	other_social_links	json	YES		NULL
faculty_profiles	bio_summary	text	YES		NULL
faculty_profiles	research_interests	text	YES		NULL
faculty_profiles	display_order	int	YES	MUL	0
faculty_profiles	created_at	timestamp	YES		CURRENT_TIMESTAMP
faculty_profiles	updated_at	timestamp	YES		CURRENT_TIMESTAMP
faculty_publications	publication_id	int	NO	PRI	NULL
faculty_publications	employee_code	varchar(50)	NO	MUL	NULL
faculty_publications	publication_type	enum('Journal Paper','Conference Proceeding','Book Chapter','Book Authored','Patent','Technical Report')	NO	MUL	NULL
faculty_publications	title	varchar(500)	NO		NULL
faculty_publications	publication_year	year	YES	MUL	NULL
faculty_publications	publication_month	varchar(20)	YES		NULL
faculty_publications	display_order	int	YES		0
faculty_publications	created_at	timestamp	YES		CURRENT_TIMESTAMP
faculty_publications	updated_at	timestamp	YES		CURRENT_TIMESTAMP
file_attachments	attachment_id	int	NO	PRI	NULL
file_attachments	entity_type	varchar(50)	NO	MUL	NULL
file_attachments	entity_id	varchar(100)	NO		NULL
file_attachments	file_name	varchar(255)	NO		NULL
file_attachments	file_path	varchar(500)	NO		NULL
file_attachments	file_size	int	YES		NULL
file_attachments	file_type	varchar(100)	YES		NULL
file_attachments	mime_type	varchar(100)	YES		NULL
file_attachments	is_public	tinyint(1)	YES		0
file_attachments	uploaded_by	varchar(50)	YES	MUL	NULL
file_attachments	uploaded_at	timestamp	YES		CURRENT_TIMESTAMP
pending_approvals	approval_id	int	NO	PRI	NULL
pending_approvals	employee_code	varchar(50)	NO	MUL	NULL
pending_approvals	old_image_path	varchar(255)	YES		NULL
pending_approvals	new_image_path	varchar(255)	YES		NULL
pending_approvals	requested_by	varchar(50)	NO		NULL
pending_approvals	requested_at	timestamp	YES	MUL	CURRENT_TIMESTAMP
pending_approvals	status	enum('pending','approved','rejected')	YES	MUL	pending
pending_approvals	reviewed_by	varchar(50)	YES		NULL
pending_approvals	reviewed_at	timestamp	YES		NULL
pending_approvals	admin_notes	text	YES		NULL
research_areas	area_id	int	NO	PRI	NULL
research_areas	area_name	varchar(255)	NO	UNI	NULL
research_areas	is_active	tinyint(1)	YES	MUL	1
research_areas	created_at	timestamp	YES		CURRENT_TIMESTAMP
research_areas	updated_at	timestamp	YES		CURRENT_TIMESTAMP
site_analytics	analytics_id	int	NO	PRI	NULL
site_analytics	total_visitors	bigint	YES		0
site_analytics	daily_visitors	int	YES		0
site_analytics	desktop_visits	int	YES		0
site_analytics	mobile_visits	int	YES		0
site_analytics	date_recorded	date	NO	UNI	NULL
site_analytics	last_updated	timestamp	YES		CURRENT_TIMESTAMP
staff_profiles	employee_code	varchar(50)	NO	PRI	NULL
staff_profiles	department_id	int	YES	MUL	NULL
staff_profiles	job_title	varchar(100)	YES	MUL	NULL
staff_profiles	responsibilities	text	YES		NULL
staff_profiles	employment_status	varchar(100)	YES	MUL	NULL
staff_profiles	image_url	varchar(255)	YES		NULL
staff_profiles	display_order	int	YES		0
staff_profiles	created_at	timestamp	YES		CURRENT_TIMESTAMP
staff_profiles	updated_at	timestamp	YES		CURRENT_TIMESTAMP
system_settings	setting_id	int	NO	PRI	NULL
system_settings	setting_key	varchar(100)	NO	UNI	NULL
system_settings	setting_value	text	YES		NULL
system_settings	setting_type	enum('string','number','boolean','json')	YES		string
system_settings	description	text	YES		NULL
system_settings	is_public	tinyint(1)	YES	MUL	0
system_settings	created_at	timestamp	YES		CURRENT_TIMESTAMP
system_settings	updated_at	timestamp	YES		CURRENT_TIMESTAMP
user_accounts	user_id	int	NO	PRI	NULL
user_accounts	username	varchar(100)	NO	UNI	NULL
user_accounts	password_hash	varchar(255)	NO		NULL
user_accounts	password_changed_at	timestamp	YES	MUL	NULL
user_accounts	employee_code	varchar(50)	YES	MUL	NULL
user_accounts	email	varchar(255)	YES		NULL
user_accounts	access_level	enum('Admin','Faculty','Staff')	NO		NULL
user_accounts	is_active	tinyint(1)	YES	MUL	1
user_accounts	last_login	timestamp	YES		NULL
user_accounts	failed_login_attempts	int	YES		0
user_accounts	locked_until	timestamp	YES		NULL
user_accounts	lockout_timestamp	timestamp	YES		NULL
user_accounts	lockout_duration_minutes	int	YES		0
user_accounts	reset_token	varchar(255)	YES	MUL	NULL
user_accounts	reset_token_expires	timestamp	YES		NULL
user_accounts	reset_token_used	tinyint(1)	YES		0
user_accounts	created_at	timestamp	YES		CURRENT_TIMESTAMP
user_accounts	updated_at	timestamp	YES		CURRENT_TIMESTAMP
