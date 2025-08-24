import React from 'react';
import './FinanceCommittee.css';
import financeData from './financeCommittee.json';

const FinanceCommittee = () => {
  return (
    <div className="finance-committee-page">
      <div className="finance-committee-wrapper">
        <header className="finance-committee-page-header">
          <h1>{financeData.page_info.title}</h1>
          <p className="finance-committee-subtitle">{financeData.page_info.subtitle}</p>
          <p className="finance-committee-description">{financeData.page_info.description}</p>
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
                {financeData.finance_committee_members.map((member, index) => (
                  <tr key={index}>
                    <td>{member.s_no}</td>
                    <td>
                      {member.nit_statute_section && (
                        member.rowspan ? (
                          index === 2 || index === 4 ? 
                            <span rowSpan={member.rowspan}>{member.nit_statute_section}</span> : 
                            null
                        ) : member.nit_statute_section
                      )}
                    </td>
                    <td>
                      {member.position && (
                        member.rowspan ? (
                          index === 2 || index === 4 ? 
                            <span rowSpan={member.rowspan}>{member.position}</span> : 
                            null
                        ) : member.position
                      )}
                    </td>
                    <td>{member.name}</td>
                    <td>{member.designation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceCommittee;
