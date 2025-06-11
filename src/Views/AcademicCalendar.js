import React, { useState } from 'react';
import './AcademicCalendar.css';

const AcademicCalendar = () => {
  const [selectedSemester, setSelectedSemester] = useState('odd');
  const [selectedYear, setSelectedYear] = useState('2024-25');

  const academicEvents = {
    'odd': {
      '2024-25': [
        {
          date: 'July 15, 2024',
          event: 'Commencement of Odd Semester',
          type: 'academic',
          description: 'Classes begin for all programs'
        },
        {
          date: 'August 15, 2024',
          event: 'Independence Day',
          type: 'holiday',
          description: 'National Holiday'
        },
        {
          date: 'September 10, 2024',
          event: 'Mid-Semester Examinations Begin',
          type: 'exam',
          description: 'Mid-semester examinations for all courses'
        },
        {
          date: 'September 20, 2024',
          event: 'Mid-Semester Examinations End',
          type: 'exam',
          description: 'End of mid-semester examinations'
        },
        {
          date: 'October 2, 2024',
          event: 'Gandhi Jayanti',
          type: 'holiday',
          description: 'National Holiday'
        },
        {
          date: 'October 31, 2024',
          event: 'Diwali Vacation Begins',
          type: 'vacation',
          description: 'Festival vacation period'
        },
        {
          date: 'November 10, 2024',
          event: 'Classes Resume',
          type: 'academic',
          description: 'Classes resume after Diwali vacation'
        },
        {
          date: 'November 25, 2024',
          event: 'End Semester Examinations Begin',
          type: 'exam',
          description: 'Final examinations for odd semester'
        },
        {
          date: 'December 15, 2024',
          event: 'End Semester Examinations End',
          type: 'exam',
          description: 'End of final examinations'
        },
        {
          date: 'December 25, 2024',
          event: 'Christmas',
          type: 'holiday',
          description: 'National Holiday'
        }
      ]
    },
    'even': {
      '2024-25': [
        {
          date: 'January 8, 2025',
          event: 'Commencement of Even Semester',
          type: 'academic',
          description: 'Classes begin for even semester'
        },
        {
          date: 'January 26, 2025',
          event: 'Republic Day',
          type: 'holiday',
          description: 'National Holiday'
        },
        {
          date: 'March 3, 2025',
          event: 'Mid-Semester Examinations Begin',
          type: 'exam',
          description: 'Mid-semester examinations for all courses'
        },
        {
          date: 'March 13, 2025',
          event: 'Mid-Semester Examinations End',
          type: 'exam',
          description: 'End of mid-semester examinations'
        },
        {
          date: 'March 14, 2025',
          event: 'Holi',
          type: 'holiday',
          description: 'Festival Holiday'
        },
        {
          date: 'April 14, 2025',
          event: 'Good Friday',
          type: 'holiday',
          description: 'National Holiday'
        },
        {
          date: 'May 5, 2025',
          event: 'End Semester Examinations Begin',
          type: 'exam',
          description: 'Final examinations for even semester'
        },
        {
          date: 'May 25, 2025',
          event: 'End Semester Examinations End',
          type: 'exam',
          description: 'End of final examinations'
        },
        {
          date: 'June 15, 2025',
          event: 'Summer Vacation Begins',
          type: 'vacation',
          description: 'Summer break for students'
        }
      ]
    }
  };

  const importantDates = [
    {
      title: 'Last Date for Registration',
      date: 'July 31, 2024',
      description: 'Final date for course registration and fee payment'
    },
    {
      title: 'Convocation',
      date: 'September 30, 2024',
      description: 'Annual convocation ceremony'
    },
    {
      title: 'Alumni Meet',
      date: 'December 28, 2024',
      description: 'Annual alumni gathering'
    },
    {
      title: 'Cultural Fest - Technovanza',
      date: 'February 15-17, 2025',
      description: 'Annual technical and cultural festival'
    }
  ];

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'academic':
        return '📚';
      case 'exam':
        return '📝';
      case 'holiday':
        return '🎉';
      case 'vacation':
        return '🏖️';
      default:
        return '📅';
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'academic':
        return '#4facfe';
      case 'exam':
        return '#ff6b6b';
      case 'holiday':
        return '#51cf66';
      case 'vacation':
        return '#ffd43b';
      default:
        return '#868e96';
    }
  };

  return (
    <div className="academic-calendar-page">
      <div className="calendar-container">
        <div className="calendar-header">
          <h1 className="calendar-title">Academic Calendar</h1>
          <p className="calendar-subtitle">
            Stay updated with important academic dates, examinations, holidays, and institutional events
          </p>
        </div>

        {/* Controls */}
        <div className="calendar-controls">
          <div className="control-group">
            <label htmlFor="year-select">Academic Year:</label>
            <select 
              id="year-select"
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="calendar-select"
            >
              <option value="2024-25">2024-25</option>
              <option value="2023-24">2023-24</option>
            </select>
          </div>
          <div className="control-group">
            <label htmlFor="semester-select">Semester:</label>
            <select 
              id="semester-select"
              value={selectedSemester} 
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="calendar-select"
            >
              <option value="odd">Odd Semester</option>
              <option value="even">Even Semester</option>
            </select>
          </div>
        </div>

        {/* Main Calendar Events */}
        <div className="calendar-content">
          <div className="events-section">
            <h2 className="section-title">
              📅 {selectedSemester === 'odd' ? 'Odd' : 'Even'} Semester Events
            </h2>
            <div className="events-list">
              {academicEvents[selectedSemester][selectedYear]?.map((event, index) => (
                <div key={index} className={`event-card event-${event.type}`}>
                  <div className="event-icon">
                    {getEventTypeIcon(event.type)}
                  </div>
                  <div className="event-content">
                    <div className="event-date" style={{ color: getEventTypeColor(event.type) }}>
                      {event.date}
                    </div>
                    <div className="event-title">{event.event}</div>
                    <div className="event-description">{event.description}</div>
                  </div>
                  <div className="event-type-badge" style={{ backgroundColor: getEventTypeColor(event.type) }}>
                    {event.type}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Dates Sidebar */}
          <div className="important-dates-section">
            <h2 className="section-title">⭐ Important Dates</h2>
            <div className="important-dates-list">
              {importantDates.map((date, index) => (
                <div key={index} className="important-date-card">
                  <div className="important-date-title">{date.title}</div>
                  <div className="important-date-date">{date.date}</div>
                  <div className="important-date-description">{date.description}</div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="calendar-legend">
              <h3 className="legend-title">Legend</h3>
              <div className="legend-items">
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#4facfe' }}></span>
                  <span>Academic Events</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#ff6b6b' }}></span>
                  <span>Examinations</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#51cf66' }}></span>
                  <span>Holidays</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: '#ffd43b' }}></span>
                  <span>Vacations</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="download-section">
          <h2 className="section-title">📥 Download Calendar</h2>
          <p className="download-description">
            Download the complete academic calendar for offline reference
          </p>
          <div className="download-buttons">
            <button className="download-btn pdf-btn">
              📄 Download PDF
            </button>
            <button className="download-btn excel-btn">
              📊 Download Excel
            </button>
            <button className="download-btn ical-btn">
              📅 Add to Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicCalendar;
