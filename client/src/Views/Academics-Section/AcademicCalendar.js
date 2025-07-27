import React from 'react';
import './AcademicCalendar.css';

const academicCalendarData = [
  {
    section: 'Academic Calendar 2024-25:',
    entries: [
      {
        title: 'Academic Calendar (ODD Semester 2024-25) - First Year',
        file: '/pdf/Academics/Academic_Calendar/Academic Calendar(ODD Semester of AY- 2024-25) For B.Tech, M.Tech & Ph.D (First Year).pdf',
      },
      {
        title: 'Academic Calendar (ODD Semester 2024-25) - Higher Semesters',
        file: '/pdf/Academics/Academic_Calendar/Academic Calendar(ODD Semester of AY- 2024-25) For B.Tech, M.Tech & Ph.D (Higher Semesters).pdf',
      },
      {
        title: 'Academic Calendar (EVEN Semester 2024-25)',
        file: '/pdf/Academics/Academic_Calendar/Academic Calendar(EVEN Semester of AY- 2024-25) For B.Tech, M.Tech & Ph.D (All Semesters).pdf',
      },
    ],
  },
  {
    section: 'Academic Calendar 2025-26:',
    entries: [
      {
        title: 'Academic Calendar (ODD Semester 2025-26) - Higher Semesters',
        file: '/pdf/Academics/Academic_Calendar/Academic Calendar(ODD Semester of AY- 2025-26) For B.Tech, M.Tech & Ph.D (Higher Semesters).pdf',
      },
    ],
  },
  {
    section: 'Holiday Lists:',
    entries: [
      {
        title: 'List of Closed Holidays for the Year 2024',
        file: '/pdf/Academics/Academic_Calendar/List of Closed Holidays for the Year 2024.pdf',
      },
      {
        title: 'List of Closed Holidays for the Year 2025',
        file: '/pdf/Academics/Academic_Calendar/List of Closed Holidays for the Year 2025.pdf',
      },
    ],
  },
];

const AcademicCalendar = () => {
  return (
    <div className="academic-calendar-page">
      <div className="academic-calendar-container">
        <div className="page-header">
          <h1>Academic Calendar</h1>
        </div>
        {academicCalendarData.map((block, i) => (
          <div key={i} className="calendar-section">
            <h2 className="section-title">
              {block.section}
            </h2>
            <div className="events-list">
              {block.entries.map((entry, idx) => (
                <div
                  key={idx}
                  className="event-card"
                >
                  <div className="event-title">
                    {entry.title}
                  </div>
                  <button
                    className="pretty-download-btn"
                    onClick={() =>
                      window.open(entry.file, '_blank')
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      style={{ marginRight: 8 }}
                    >
                      <rect
                        width="18"
                        height="22"
                        x="3"
                        y="1"
                        fill="#fff"
                        stroke="#1976d2"
                        strokeWidth="1.5"
                        rx="3"
                      />
                      <rect
                        width="14"
                        height="2"
                        x="5"
                        y="4"
                        fill="#e3eafc"
                      />
                      <rect
                        width="10"
                        height="2"
                        x="7"
                        y="8"
                        fill="#e3eafc"
                      />
                      <rect
                        width="10"
                        height="2"
                        x="7"
                        y="12"
                        fill="#e3eafc"
                      />
                      <rect
                        width="10"
                        height="2"
                        x="7"
                        y="16"
                        fill="#e3eafc"
                      />
                    </svg>
                    Download PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademicCalendar;
