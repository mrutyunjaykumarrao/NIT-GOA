import React, { useState } from 'react';
import './Reports.css';

const Reports = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  const englishReports = [
    { year: '2022-2023', file: '/pdf/Administration/reports/english/Annual Report -2022-2023.pdf' },
    { year: '2021-2022', file: '/pdf/Administration/reports/english/Annual Report -2021-2022.pdf' },
    { year: '2020-2021', file: '/pdf/Administration/reports/english/Annual Report -2020-2021.pdf' },
    { year: '2019-2020', file: '/pdf/Administration/reports/english/Annual Report -2019-2020.pdf' },
    { year: '2016-2017', file: '/pdf/Administration/reports/english/Annual Report -2016-2017.pdf' },
    { year: '2015-2016', file: '/pdf/Administration/reports/english/Annual report - 2015-2016.pdf' },
    { year: '2014-2015', file: '/pdf/Administration/reports/english/Annual & Accounts 2014-2015.pdf' },
    { year: '2013-2014', file: '/pdf/Administration/reports/english/Annual_Report_Book_-2013-2014.pdf' },
    { year: '2012-2013', file: '/pdf/Administration/reports/english/Annual_and_Accounts_2012-2013.pdf' },
    { year: '2011-2012', file: '/pdf/Administration/reports/english/Annual_and_Accounts_2011-2012.pdf' },
    { year: '2010', file: '/pdf/Administration/reports/english/annual_report_2010.pdf' }
  ];

  const hindiReports = [
    { year: '2022-2023', file: '/pdf/Administration/reports/hindi/HindiAnnual Report -2022-2023.pdf' },
    { year: '2021-2022', file: '/pdf/Administration/reports/hindi/HindiAnnual-Report-2021-2022.pdf' },
    { year: '2020-2021', file: '/pdf/Administration/reports/hindi/HindiAnnual Report -2020-2021.pdf' },
    { year: '2016-2017', file: '/pdf/Administration/reports/hindi/HindiAnnual Report -2016-2017.pdf' },
    { year: '2015-2016', file: '/pdf/Administration/reports/hindi/HindiAnnual Report- 2015-2016.pdf' },
    { year: '2014', file: '/pdf/Administration/reports/hindi/Hindi_Annual_Report_2014.pdf' },
    { year: '2013', file: '/pdf/Administration/reports/hindi/Hindi_Annual_Report_2013.pdf' },
    { year: '2012', file: '/pdf/Administration/reports/hindi/Hindi_Annual_Report_2012.pdf' },
    { year: '2011', file: '/pdf/Administration/reports/hindi/Hindi_Annual_Report_2011.pdf' },
    { year: '2010', file: '/pdf/Administration/reports/hindi/Hindi_annual_report_2010.pdf' }
  ];

  const handleDownload = (file, year) => {
    window.open(file, '_blank');
  };

  const currentReports = selectedLanguage === 'english' ? englishReports : hindiReports;

  return (
    <div className="reports-page">
      <div className="container">
        <div className="page-header">
          <h1>Annual Reports</h1>
          <p>Access annual reports and institutional publications</p>
        </div>

        <div className="reports-content">
          <div className="language-selector">
            <button 
              className={`lang-btn ${selectedLanguage === 'english' ? 'active' : ''}`}
              onClick={() => setSelectedLanguage('english')}
            >
              English Reports
            </button>
            <button 
              className={`lang-btn ${selectedLanguage === 'hindi' ? 'active' : ''}`}
              onClick={() => setSelectedLanguage('hindi')}
            >
              Hindi Reports (हिंदी रिपोर्ट)
            </button>
          </div>

          <div className="reports-grid">
            {currentReports.map((report, index) => (
              <div key={index} className="report-card">
                <div className="report-icon">📊</div>
                <h3>Annual Report {report.year}</h3>
                <p>
                  {selectedLanguage === 'english' 
                    ? 'Annual institutional report and achievements' 
                    : 'वार्षिक संस्थागत रिपोर्ट और उपलब्धियां'}
                </p>
                <button 
                  className="download-btn"
                  onClick={() => handleDownload(report.file, report.year)}
                >
                  📥 Download PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
