import React from 'react';
import './Senate.css';

const Senate = () => {
  // Array of PDF files with public folder paths
  const senatePDFs = [
    { number: 1, file: '/pdf/Administration/senate/Senate-1_MOM.pdf' },
    { number: 2, file: '/pdf/Administration/senate/Senate-2_MOM.pdf' },
    { number: 3, file: '/pdf/Administration/senate/Senate-3_MOM.pdf' },
    { number: 4, file: '/pdf/Administration/senate/Senate-4_MOM.pdf' },
    { number: 5, file: '/pdf/Administration/senate/Senate-5_MOM.pdf' },
    { number: 6, file: '/pdf/Administration/senate/Senate-6_MOM.pdf' },
    { number: 7, file: '/pdf/Administration/senate/Senate-7_MOM.pdf' },
    { number: 8, file: '/pdf/Administration/senate/Senate-8_MOM.pdf' },
    { number: 9, file: '/pdf/Administration/senate/Senate-9_MOM.pdf' },
    { number: 10, file: '/pdf/Administration/senate/Senate-10_MOM.pdf' },
    { number: 11, file: '/pdf/Administration/senate/Senate-11_MOM.pdf' },
    { number: 12, file: '/pdf/Administration/senate/Senate-12_MOM.pdf' },
    { number: 13, file: '/pdf/Administration/senate/Senate-13_MOM.pdf' },
    { number: 14, file: '/pdf/Administration/senate/Senate-14_MOM.pdf' },
    { number: 15, file: '/pdf/Administration/senate/Senate-15_MOM.pdf' },
    { number: 16, file: '/pdf/Administration/senate/Senate-16_MOM.pdf' },
    { number: 17, file: '/pdf/Administration/senate/Senate-17_MOM.pdf' },
    { number: 18, file: '/pdf/Administration/senate/Senate-18_MOM.pdf' },
    { number: 19, file: '/pdf/Administration/senate/Senate-19_MOM.pdf' },
    { number: 20, file: '/pdf/Administration/senate/Senate-20_MOM.pdf' },
    { number: 21, file: '/pdf/Administration/senate/Senate-21_MOM.pdf' },
    { number: 22, file: '/pdf/Administration/senate/22Senate_MoM.pdf' },
    { number: 23, file: '/pdf/Administration/senate/23Senate_MoM_5oct2023.pdf' },
    { number: 24, file: '/pdf/Administration/senate/24Senate_MoM.pdf' },
    { number: 25, file: '/pdf/Administration/senate/25Senate_MoM.pdf' },
    { number: 26, file: '/pdf/Administration/senate/26Senate_MoM.pdf' },
    { number: 27, file: '/pdf/Administration/senate/MoM 27th Senate.pdf' },
    { number: 28, file: '/pdf/Administration/senate/MoM 28th Senate.pdf' },
    { number: 29, file: '/pdf/Administration/senate/MoM 29th Senate.pdf' }
  ];

  const handlePDFClick = (pdfFile, senateNumber) => {
    // Open PDF in new tab
    window.open(pdfFile, '_blank');
  };

  return (
    <div className="senate-page">
      <div className="container">
        <div className="page-header">
          <h1>Senate</h1>
          <p className="senate-subtitle">National Institute of Technology Goa</p>
          <p className="senate-description">Academic Senate Meeting Minutes</p>
        </div>

        <div className="senate-content">
          <div className="table-container">
            <table className="senate-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>NIT Act</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Position</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Sec.14(a)</td>
                  <td>Prof. Omprakash Jaiswal</td>
                  <td>Director, NITGoa</td>
                  <td>Chairman Senate</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Sec.14(b)</td>
                  <td>--</td>
                  <td>Deputy Director</td>
                  <td>Member</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Sec.14(c)</td>
                  <td>--</td>
                  <td>The Professors appointed or recognized as such by the institute for the purpose of imparting instructions in the institute.</td>
                  <td>Member</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td rowSpan="3">Sec.14(d)</td>
                  <td>Prof. Prem Pal</td>
                  <td>Department of Physics, Indian Institute of Technology Hyderabad</td>
                  <td>External Member</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>Prof. Vasant Matsagar</td>
                  <td>Dogra Chair Professor,<br/>Multi-Hazard Protective Structures (MHPS) Laboratory<br/>Department of Civil Engineering,<br/>Indian Institute of Technology, Delhi</td>
                  <td>External Member</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>Prof. Smita Jha</td>
                  <td>Professor,<br/>Department of Humanities & Social Science,<br/>Indian Institute of Technology, Roorkee.</td>
                  <td>External Member</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>Sec.18(2)</td>
                  <td>Dr. Shashidhar K. Kudari</td>
                  <td>Registrar</td>
                  <td>Member Secretary</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td rowSpan="2">As per 20<sup>th</sup> BoG resolution of Item number A.3</td>
                  <td>--</td>
                  <td>All Deans</td>
                  <td>Member</td>
                </tr>
                <tr>
                  <td>9</td>
                  <td>--</td>
                  <td>All HoDs</td>
                  <td>Member</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="minutes-section">
            <h3>Minutes of Senate Meeting</h3>
            <div className="minutes-links">
              {senatePDFs.map((senate, index) => (
                <span key={senate.number}>
                  <button 
                    className="senate-link" 
                    onClick={() => handlePDFClick(senate.file, senate.number)}
                  >
                    Senate-{senate.number}
                  </button>
                  {index < senatePDFs.length - 1 && ' | '}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Senate;
