import React from 'react';
import './BoardOfGovernors.css';

const BoardOfGovernors = () => {
  const boardMembers = [
    {
      srNo: 1,
      nitActSec: "11(a)",
      position: "Chairperson",
      name: "Vacant",
      designation: "--"
    },
    {
      srNo: 2,
      nitActSec: "11(b)",
      position: "Director, Ex-Officio Member",
      name: "Prof. G. R. Jaiswal",
      designation: "Director, National Institute of Technology Goa"
    },
    {
      srNo: 3,
      nitActSec: "11(c)",
      position: "Two persons not below the rank of JS to the Govt. of India to be nominated by the Central Govt. from amongst persons dealing with tech. edu. And finance",
      names: [
        { name: "Mrs. Saumya Gupta", designation: "Addl. Secretary/Jt. Secretary (Technical Education), MHRD, Govt. of India" },
        { name: "Sh. Sanjog Kapoor", designation: "Financial Advisor, Dept of Higher Education, MHRD, Govt. of India" }
      ]
    },
    {
      srNo: 5,
      nitActSec: "11(d)",
      position: "Two persons nominated by the Govt. of the States in which the Institute is situated.",
      names: [
        { name: "Dr. Venkatesh Ganesh Prabhu Desai", designation: "Chairman, Chandranath Education Society, Assolda, Quepem, Goa" },
        { name: "Dr. Mahesh Dhawalkar", designation: "Professor, Department of Mechanical Engineering, Goa Engineering College, Farmagudi, Ponda, Goa" }
      ]
    },
    {
      srNo: 7,
      nitActSec: "11(e)",
      position: "Two persons at least one whom shall be a woman having special knowledge or practical experience in respect of education, engineering or science to be nominated by the council",
      names: [
        { name: "Vacant", designation: "--" },
        { name: "Vacant", designation: "--" }
      ]
    },
    {
      srNo: 9,
      nitActSec: "11(f)",
      position: "One Professor and one Assistant Professor or a Lecturer nominated by Senate",
      names: [
        { name: "Dr. Sreeraj E. S", designation: "Associate Professor, Department of Electrical and Electronics Engineering" },
        { name: "Dr. Mallikarjun Eramshetty", designation: "Assistant Professor, Department of Electronics and Communication Engineering" }
      ]
    },
    {
      srNo: 11,
      nitActSec: "11(g)",
      position: "Director of IIT in whose zone the Institute is located, or his nominee not below the rank of Professor",
      name: "Prof. B. G. Fernandes",
      designation: "Professor & Head of Department of Electrical Engineering, IIT Bombay"
    },
    {
      srNo: 12,
      nitActSec: "18(2)",
      position: "Member Secretary",
      name: "Dr. Shashidhar K. Kudari",
      designation: "Registrar, NIT Goa"
    }
  ];

  return (
    <div className="board-of-governors-page">
      <div className="board-container">
        <div className="board-page-header">
          <h1>Board of Governors</h1>
          <p className="board-subtitle">National Institute of Technology Goa</p>
          <p className="board-description">Governing Body as per NIT Act 2007</p>
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
                {boardMembers.map((member, index) => {
                  if (member.names) {
                    // Handle multiple names in a single section (with rowspan)
                    return member.names.map((person, personIndex) => (
                      <tr key={`${index}-${personIndex}`}>
                        {personIndex === 0 ? (
                          <>
                            <td rowSpan={member.names.length}>{member.srNo}</td>
                            <td rowSpan={member.names.length}>{member.nitActSec}</td>
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
                        <td>{member.srNo}</td>
                        <td>{member.nitActSec}</td>
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
