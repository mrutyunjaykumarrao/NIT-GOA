import React from 'react';
import './FinanceCommittee.css';

const FinanceCommittee = () => {
  return (
    <div className="finance-committee-page">
      <div className="finance-committee-wrapper">
        <header className="finance-committee-page-header">
          <h1>Finance Committee</h1>
          <p className="finance-committee-subtitle">National Institute of Technology Goa</p>
          <p className="finance-committee-description">Financial Governance as per NIT Statute</p>
        </header>
        
        <div className="finance-committee-main-content">
          <div className="finance-committee-table-container">
            <table>
              <tbody>
                <tr>
                  <th>S.No</th>
                  <th>NIT Statute Section: 10</th>
                  <th>Position</th>
                  <th>Name</th>
                  <th>Designation</th>
                </tr>
                <tr>
                  <td>1</td>
                  <td>10(i)</td>
                  <td>Chairperson BoG, ex-officio Chairman</td>
                  <td>Vacant</td>
                  <td>--</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>10(ii)</td>
                  <td>Director, Ex-Officio Member</td>
                  <td>Prof. O.R. Jaiswal</td>
                  <td>Director, National Institute of Technology Goa</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td rowSpan="2">10(ii)</td>
                  <td rowSpan="2">Jt. Secretary Dealing with NIT or his nominee and Finance advisor (MoE) or his nominee</td>
                  <td>Mrs. Saumya Gupta</td>
                  <td>Addnl Secretary/Jt. Secretary (Technical Education), MHRD, Govt. of India</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Sh. Sanjog Kapoor</td>
                  <td>Financial Advisor, Dept of Higher Education, MHRD, Govt. of India</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td rowSpan="2">10(iv)</td>
                  <td rowSpan="2">Two persons nominated by the Board</td>
                  <td>Prof. B. G. Farnandes</td>
                  <td>Professor, Department of Electrical Engineering, IIT Bombay</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>Dr. Sreeraj E. S</td>
                  <td>Associate Professor, Department of Electrical and Electronics Engineering, NIT Goa</td>
                </tr>
                <tr>
                  <td>7</td>
                  <td>10(v)</td>
                  <td>Member Secretary</td>
                  <td>Dr. Shashidhar K. Kudari</td>
                  <td>Registrar, NIT Goa</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceCommittee;
