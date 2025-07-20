// Enhanced Faculty Data - Centralized Import
// Import existing faculty data
import { facultyData as originalFacultyData } from '../facultyData';

// Import detailed faculty profiles
import venkatanareshbabuData from './venkatanareshbabu';
import pravatiData from './pravati';
import miniData from './mini';
import keshavamurthyData from './keshavamurthy';
import damodarData from './damodar';
import veenaData from './veena';

// Enhanced faculty data with detailed profiles
export const enhancedFacultyData = {
    CSE: [
        // Existing faculty from original data (keep those without detailed profiles)
        ...originalFacultyData.CSE,
        
        // Enhanced faculty with detailed profiles
        {
            ...venkatanareshbabuData,
            id: 'venkatanareshbabu-kuppili',
            image: originalFacultyData.CSE.find(f => f.id === 'venkatanareshbabu-kuppili')?.image
        },
        {
            ...pravatiData,
            id: 'pravati-swain',
            image: originalFacultyData.CSE.find(f => f.id === 'pravati-swain')?.image
        },
        {
            ...miniData,
            id: 'mini-s',
            image: originalFacultyData.CSE.find(f => f.id === 'mini-s')?.image
        },
        {
            ...keshavamurthyData,
            id: 'keshavamurthy-bn',
            image: originalFacultyData.CSE.find(f => f.id === 'keshavamurthy-bn')?.image
        },
        {
            ...damodarData,
            id: 'damodar-reddy-edla',
            image: originalFacultyData.CSE.find(f => f.id === 'damodar-reddy-edla')?.image
        },
        {
            ...veenaData,
            id: 'veena-thenkanidiyoor',
            image: originalFacultyData.CSE.find(f => f.id === 'veena-thenkanidiyoor')?.image
        }
    ],
    ECE: originalFacultyData.ECE || [],
    EEE: originalFacultyData.EEE || [],
    MCE: originalFacultyData.MCE || [],
    CVE: originalFacultyData.CVE || [],
    APS: originalFacultyData.APS || [],
    HSS: originalFacultyData.HSS || []
};

// Helper function to find faculty by ID across all departments
export const findEnhancedFacultyById = (id) => {
    for (const department of Object.values(enhancedFacultyData)) {
        const faculty = department.find(f => f.id === id);
        if (faculty) return faculty;
    }
    return null;
};

// Helper function to check if faculty has detailed profile
export const hasDetailedProfile = (id) => {
    const detailedFacultyIds = [
        'venkatanareshbabu-kuppili',
        'pravati-swain',
        'mini-s',
        'keshavamurthy-bn',
        'damodar-reddy-edla',
        'veena-thenkanidiyoor'
    ];
    return detailedFacultyIds.includes(id);
};

// Export individual faculty data for direct import
export {
    venkatanareshbabuData,
    pravatiData,
    miniData,
    keshavamurthyData,
    damodarData
};

// Default export
export default enhancedFacultyData;
