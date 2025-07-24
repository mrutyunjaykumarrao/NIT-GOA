# NIT Goa Announcement Section - PDF Integration

## Overview
The announcement section now supports dynamic PDF loading for notices and documents.

## PDF Directory Structure
```
client/public/pdf/notice/
├── ieee_conference_stpec_2025.pdf
├── pdf_positions_2024_25.pdf
├── sustainability_conference_2025.pdf
├── computing_workshop_2025.pdf
└── industry_academia_program_2025.pdf
```

## How to Add New Announcements with PDF

### 1. Add PDF File
1. Place your PDF file in: `client/public/pdf/notice/`
2. Use a descriptive filename (e.g., `new_announcement_2025.pdf`)

### 2. Update Announcement Data
In `HomePage.js`, add your announcement to the `announcements` array:

```javascript
{
    text: "Your announcement text here",
    pdf: "your_pdf_filename.pdf" // Just the filename, no path needed
}
```

### Example:
```javascript
{
    text: "New Research Grant Application - Deadline March 15, 2025",
    pdf: "research_grant_2025.pdf"
}
```

For announcements without PDF:
```javascript
{
    text: "General announcement without PDF",
    pdf: null
}
```

## Features

### 1. Marquee Animation
- Each announcement scrolls as a marquee
- 8-second duration per announcement
- Smooth transition between announcements

### 2. Navigation Controls
- **Previous (❮)**: Go to previous announcement
- **Pause/Play (⏸/▶)**: Pause/resume marquee animation
- **Next (❯)**: Go to next announcement

### 3. PDF Integration
- **PDF Button (📄)**: Appears only for announcements with PDF
- **Dynamic Loading**: PDFs load from `/pdf/notice/` directory
- **New Tab**: PDFs open in a new browser tab

### 4. Professional Design
- Wider announcement section (1400px max-width)
- Responsive design for mobile devices
- Smooth hover effects and animations

## Technical Implementation

### PDF Access
PDFs are accessed via the public folder:
- File path: `client/public/pdf/notice/filename.pdf`
- URL path: `/pdf/notice/filename.pdf`
- No additional server configuration needed

### Responsive Behavior
- Mobile: Smaller PDF button and adjusted spacing
- Desktop: Full-sized controls and optimal spacing

## Usage Tips

1. **PDF Naming**: Use descriptive, URL-safe filenames (no spaces, special characters)
2. **File Size**: Keep PDFs under 5MB for faster loading
3. **Testing**: Always test PDF links after adding new files
4. **Organization**: Use consistent naming conventions for easier management

## Maintenance

### Adding New PDFs
1. Save PDF to `client/public/pdf/notice/`
2. Update `announcements` array in `HomePage.js`
3. Test the link functionality

### Removing PDFs
1. Delete PDF file from `client/public/pdf/notice/`
2. Update announcement entry to `pdf: null`
3. Verify no broken links remain
