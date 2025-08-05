import React from 'react';
import './BoardOfGovernors.css';
import boardData from './boardOfGovernors.json';

const BoardOfGovernors = () => {
  return (
    <div className="board-of-governors-page">
      <div className="board-container">
        <div className="board-page-header">
          <h1>{boardData.page_info.title}</h1>
          <p className="board-subtitle">{boardData.page_info.subtitle}</p>
          <p className="board-description">{boardData.page_info.description}</p>
        </div>

        <div className="board-of-governors-content">
          <div className="board-table-container">
            <table className="board-table">
              <thead>
                <tr>
                  <th>Sr.No.</th>
                  <th>NIT Act Sec.</th>
                  <th>Position</th>
                  <th>Name</th>
                  <th>Designation</th>
                </tr>
              </thead>
              <tbody>
                {boardData.board_members.map((member, index) => {
                  if (member.names) {
                    // Handle multiple names in a single section (with rowspan)
                    return member.names.map((person, personIndex) => (
                      <tr key={`${index}-${personIndex}`}>
                        {personIndex === 0 ? (
                          <>
                            <td rowSpan={member.names.length}>{member.sr_no}</td>
                            <td rowSpan={member.names.length}>{member.nit_act_sec}</td>
                            <td rowSpan={member.names.length}>{member.position}</td>
                          </>
                        ) : null}
                        <td>{person.name}</td>
                        <td>{person.designation}</td>
                      </tr>
                    ));
                  } else {
                    // Handle single name rows
                    return (
                      <tr key={index}>
                        <td>{member.sr_no}</td>
                        <td>{member.nit_act_sec}</td>
                        <td>{member.position}</td>
                        <td>{member.name}</td>
                        <td>{member.designation}</td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardOfGovernors;
