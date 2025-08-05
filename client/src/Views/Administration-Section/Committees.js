import React from 'react';
import './Committees.css';
import committeesData from './committees.json';

const Committees = () => {
  const renderCommitteeRow = (committee, index) => {
    if (committee.name === "Grievance Redressal Committee") {
      return (
        <tr key={index}>
          <td>{committee.name}</td>
          <td colSpan="3">
            {committee.description.split('\n').map((line, lineIndex) => (
              <p key={lineIndex}>{line || '\u00A0'}</p>
            ))}
          </td>
        </tr>
      );
    }

    return committee.members.map((member, memberIndex) => (
      <tr key={`${index}-${memberIndex}`}>
        {memberIndex === 0 && (
          <td rowSpan={committee.members.length}>{committee.name}</td>
        )}
        <td>
          {member.role && `${member.name} (${member.role})`}
          {!member.role && member.name}
          {member.additional_info && (
            <>
              <br/><br/>{member.additional_info}
            </>
          )}
        </td>
        <td>
          {member.email && (
            <span dangerouslySetInnerHTML={{ __html: member.email.replace(/@/g, '</span>@<span>').replace(/^<\/span>/, '').replace(/<span>$/, '') }} />
          )}
        </td>
        <td>{member.phone}</td>
      </tr>
    ));
  };

  return (
    <div className="committees-page">
      <div className="committees-wrapper">
        <header className="committees-page-header">
          <h1>{committeesData.page_info.title}</h1>
          <p className="committees-subtitle">{committeesData.page_info.subtitle}</p>
          <p className="committees-description">{committeesData.page_info.description}</p>
        </header>
        
        <div className="committees-main-content">
          <div className="committees-table-container">
            <table>
              <tbody>
                <tr>
                  <th width="24%">&nbsp;</th>
                  <th width="36%">Name</th>
                  <th width="25%">E-Mail</th>
                  <th width="15%">Phone Number</th>
                </tr>
                {committeesData.committees.map((committee, index) => 
                  renderCommitteeRow(committee, index)
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Committees;
