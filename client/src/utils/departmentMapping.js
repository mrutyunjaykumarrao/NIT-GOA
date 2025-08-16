/**
 * Department Code Mapping Utility
 * Centralizes department name to code mapping for staff management
 */

export const departmentCodes = {
  'Department of Civil Engineering': 'CVE',
  'Department of Computer Science and Engineering': 'CSE', 
  'Department of Electrical and Electronics Engineering': 'EEE',
  'Department of Electronics and Communication Engineering': 'ECE',
  'Department of Mechanical Engineering': 'MCE',
  'Department of Applied Sciences': 'APS',
  'Department of Humanities and Social Sciences': 'HSS',
  'Campus Control Centre': 'CCC'
};

export const validCodes = new Set(['CVE', 'CSE', 'EEE', 'ECE', 'MCE', 'APS', 'HSS', 'CCC', 'APS & HSS']);

/**
 * Convert department name or existing code to standardized department code
 * @param {string} department - Department name or code
 * @returns {string} - Standardized department code or 'N/A'
 */
export const getDepartmentCode = (department) => {
  if (!department) return 'N/A';
  
  // If already a valid code, pass through
  if (validCodes.has(department)) return department;
  
  // Handle partial matches for combined departments
  if (typeof department === 'string') {
    if (department.includes('Applied Sciences')) return 'APS';
    if (department.includes('Humanities and Social Sciences')) return 'HSS';
  }
  
  // Map full department names to codes
  return departmentCodes[department] || 'N/A';
};

/**
 * Get dynamic department filter options from staff data
 * @param {Array} staffList - Array of staff objects
 * @returns {Array} - Ordered array of department codes
 */
export const getDynamicDepartmentOptions = (staffList) => {
  const deptCodeSet = new Set(
    staffList
      .map((staff) => getDepartmentCode(staff.department_name || staff.department))
      .filter((code) => code && code !== 'N/A')
  );
  
  // Include aggregated APS & HSS option if either appears in data
  // and remove individual APS/HSS codes
  if (deptCodeSet.has('APS') || deptCodeSet.has('HSS')) {
    deptCodeSet.add('APS & HSS');
    deptCodeSet.delete('APS');
    deptCodeSet.delete('HSS');
  }
  
  // Define preferred order
  const preferredOrder = ['CSE', 'ECE', 'EEE', 'MCE', 'CVE', 'APS & HSS', 'CCC'];
  
  // Filter to only include departments that exist in the data, in preferred order
  const orderedDepts = preferredOrder.filter(dept => deptCodeSet.has(dept));
  
  // Add any remaining departments not in the preferred order
  const remainingDepts = Array.from(deptCodeSet)
    .filter(dept => !preferredOrder.includes(dept))
    .sort((a, b) => a.localeCompare(b));
  
  return [...orderedDepts, ...remainingDepts];
};

/**
 * Check if staff member matches department filter
 * @param {Object} staff - Staff object
 * @param {string} departmentFilter - Selected department filter
 * @returns {boolean} - Whether staff matches filter
 */
export const matchesDepartmentFilter = (staff, departmentFilter) => {
  if (!departmentFilter) return true;
  
  const code = getDepartmentCode(staff.department_name || staff.department);
  
  // Handle combined APS & HSS filter
  if (departmentFilter === 'APS & HSS') {
    return code === 'APS' || code === 'HSS';
  }
  
  return code === departmentFilter;
};
