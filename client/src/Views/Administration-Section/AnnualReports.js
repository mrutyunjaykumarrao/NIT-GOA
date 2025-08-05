import React from 'react';
import './AnnualReports.css';

const annualReportsData = [
  {
    section: 'Annual Reports & Annual Accounts (English Version)',
    entries: [
      {
        title: 'Annual Report and Annual Accounts of 2010-11',
        file: '/pdf/Administration/reports/english/annual_report_2010.pdf',
      },
      {
        title: 'Annual Report and Annual Accounts of 2011-12',
        file: '/pdf/Administration/reports/english/Annual_and_Accounts_2011-2012.pdf',
      },
      {
        title: 'Annual Report and Annual Accounts of 2012-13',
        file: '/pdf/Administration/reports/english/Annual_and_Accounts_2012-2013.pdf',
      },
      {
        title: 'Annual Report and Annual Accounts of 2013-14',
        file: '/pdf/Administration/reports/english/Annual_Report_Book_-2013-2014.pdf',
      },
      {
        title: 'Annual Report and Annual Accounts of 2014-15',
        file: '/pdf/Administration/reports/english/Annual & Accounts 2014-2015.pdf',
      },
      {
        title: 'Annual Report and Annual Accounts of 2015-16',
        file: '/pdf/Administration/reports/english/Annual report - 2015-2016.pdf',
      },
      {
        title: 'Annual Report and Annual Accounts of 2016-17',
        file: '/pdf/Administration/reports/english/Annual Report -2016-2017.pdf',
      },
      {
        title: 'Annual Report and Annual Accounts of 2019-20',
        file: '/pdf/Administration/reports/english/Annual Report -2019-2020.pdf',
      },
      {
        title: 'Annual Report and Annual Accounts of 2020-21',
        file: '/pdf/Administration/reports/english/Annual Report -2020-2021.pdf',
      },
      {
        title: 'Annual Report and Annual Accounts of 2021-22',
        file: '/pdf/Administration/reports/english/Annual Report -2021-2022.pdf',
      },
      {
        title: 'Annual Report and Annual Accounts of 2022-23',
        file: '/pdf/Administration/reports/english/Annual Report -2022-2023.pdf',
      },
    ],
  },
  {
    section: 'Annual Reports & Annual Accounts (Hindi Version)',
    entries: [
      {
        title: 'Annual Report and Annual Accounts of 2010-11',
        file: '/pdf/Administration/reports/hindi/Hindi_annual_report_2010.pdf',
      },
      {
        title: 'Annual Report and Annual Accounts of 2011-12',
        file: '/pdf/Administration/reports/hindi/Hindi_Annual_Report_2011.pdf',
      },
      {
        title: 'Annual Report and Annual Accounts of 2012-13',
        file: '/pdf/Administration/reports/hindi/Hindi_Annual_Report_2012.pdf',
      },
      {
        title: 'Annual Report and Annual Accounts of 2013-14',
        file: '/pdf/Administration/reports/hindi/Hindi_Annual_Report_2013.pdf',
      },
      {
        title: 'Annual Report and Annual Accounts of 2014-15',
        file: '/pdf/Administration/reports/hindi/Hindi_Annual_Report_2014.pdf',
      },
      {
        title: 'Annual Report and Annual Accounts of 2015-16',
        file: '/pdf/Administration/reports/hindi/HindiAnnual Report- 2015-2016.pdf',
      },
      {
        title: 'Annual Report and Annual Accounts of 2016-17',
        file: '/pdf/Administration/reports/hindi/HindiAnnual Report -2016-2017.pdf',
      },
      {
        title: 'Annual Report and Annual Accounts of 2020-21',
        file: '/pdf/Administration/reports/hindi/HindiAnnual Report -2020-2021.pdf',
      },
      {
        title: 'Annual Report and Annual Accounts of 2021-22',
        file: '/pdf/Administration/reports/hindi/HindiAnnual-Report-2021-2022.pdf',
      },
      {
        title: 'Annual Report and Annual Accounts of 2022-23',
        file: '/pdf/Administration/reports/hindi/HindiAnnual Report -2022-2023.pdf',
      },
    ],
  },
];

const AnnualReports = () => {
  return (
    <div className="annual-reports-page">
      <div className="annual-reports-container">
        <div className="page-header">
          <h1>Annual Reports & Annual Accounts</h1>
        </div>
        {annualReportsData.map((block, i) => (
          <div key={i} className="reports-section">
            <h2 className="section-title">
              {block.section}
            </h2>
            <div className="reports-list">
              {block.entries.map((entry, idx) => (
                <div
                  key={idx}
                  className="report-card"
                >
                  <div className="report-title">
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

export default AnnualReports;
