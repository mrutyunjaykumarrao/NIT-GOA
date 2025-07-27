
import React from 'react';
import './RTI.css';

const rtiData = {
  officers: [
    {
      title: 'Public Information Officer',
      name: 'Dr. Shangerganesh L. (Assistant Professor)',
      contact: '0832-2404728',
      email: 'pio@nitgoa.ac.in',
    },
    {
      title: 'First Appellate Authority',
      name: 'Dr. C. Vyjayanthi (Associate Professor)',
      contact: '0832-2404632',
      email: 'faa@nitgoa.ac.in',
    },
    {
      title: 'Chief Vigilance Officer',
      name: 'Dr. Velavan Kathirvelu (Associate Professor)',
      contact: '0832-2404726',
      email: 'cvo@nitgoa.ac.in',
    },
  ],
  sections: [
    {
      title: 'Recruitment Rules',
      links: [
        { name: 'Faculty Recruitment Rules as per NIT Statutes', file: 'Faculty_Recruitment_Rules_NIT_Statutes.pdf' },
        { name: 'Non Teaching Recruitment Rules as per NIT Statutes', file: 'Non_Teaching_Recruitment_Rules_NIT_Statutes.pdf' },
      ],
    },
    {
      title: 'RTI Manuals',
      links: [
        { name: '2023', file: 'RTI_Manual_2023.pdf' },
        { name: '2024', file: 'RTI_Manual_2024.pdf' },
        { name: '2025', file: 'RTI_Manual_2025.pdf' },
      ],
    },
    {
      title: 'RTI Third Party Audit Reports',
      links: [
        { name: '2022-2023', file: 'RTI_Third_Party_Audit_Report_2022-2023.pdf' },
        { name: '2023-2024', file: 'RTI_Third_Party_Audit_Report_2023-2024.pdf' },
      ],
    },
    {
      title: 'Acts & Statutes',
      links: [
        { name: 'RTI Regulation of Fee and Cost Rules 2005', file: 'RTI_Regulation_of_Fee_and_Cost_Rules_2005.pdf' },
        { name: 'NIT ACT 2007', file: 'NIT_ACT_2007.pdf' },
        { name: 'NIT Amendment Act 2012', file: 'NIT_Amendment_Act_2012.pdf' },
        { name: 'NITSER ACT 2007', file: 'NITSER_ACT_2007.pdf' },
        { name: 'First Statutes NIT 2009', file: 'First_Statutes_NIT_2009.pdf' },
        { name: 'First Statutes NIT Amendment 2017', file: 'First_Statutes_NIT_Amendment_2017.pdf' },
        { name: 'NIT Amendment Statute 2023', file: 'NIT_Amendment_Statute_2023.pdf' },
        { name: 'NIT Goa (Amendment) Statute -2025', file: 'NIT_Goa_Amendment_Statute_2025.pdf' },
        { name: 'RTI Act 2005', file: 'RTI_Act_2005.pdf' },
      ],
    },
    {
      title: 'Minutes of BoG Meeting',
      links: [
        { name: 'BoG-1', file: 'Minutes_of_1st_BoG_Meeting.pdf', type: 'static' },
        { name: 'BoG-2', file: 'Minutes_of_2nd_BoG_Meeting.pdf', type: 'static' },
        { name: 'BoG-3', file: 'Minutes_of_3rd_BoG_Meeting.pdf', type: 'static' },
        { name: 'BoG-4', file: 'Minutes_of_4th_BoG_Meeting.pdf', type: 'static' },
        { name: 'BoG-5', file: 'Minutes_of_5th_BoG_Meeting.pdf', type: 'static' },
        { name: 'BoG-6', file: 'Minutes_of_6th_BoG_Meeting.pdf', type: 'static' },
        { name: 'BoG-7', file: 'Minutes_of_7th_BoG_Meeting.pdf', type: 'static' },
        { name: 'BoG-8', file: 'Minutes_of_8th_BoG_Meeting.pdf', type: 'static' },
        { name: 'BoG-9', file: 'Minutes_of_9th_BoG_Meeting.pdf', type: 'static' },
        { name: 'BoG-10', file: 'Minutes_of_10th_BoG_Meeting.pdf', type: 'static' },
        { name: 'BoG-11', file: 'Minutes_of_11th_BoG_Meeting.pdf', type: 'static' },
        { name: 'BoG-12', file: '12th BoG MoM.pdf', type: 'static' },
        { name: 'BoG-13', file: 'Minutes_of_13th_BoG_Meeting.pdf', type: 'static' },
        { name: 'BoG-14', file: 'Minutes_of_14th_BoG_Meeting.pdf', type: 'static' },
        { name: 'BoG-15', file: 'Minutes_of_15th_BoG_Meeting.pdf', type: 'static' },
        { name: 'BoG-16', file: 'Minutes_of_16th_BoG_Meeting.pdf', type: 'static' },
        { name: 'BoG-17', file: 'Minutes_of_17th_BoG_Meeting.pdf', type: 'static' },
        { name: 'BoG-18', file: '18th_BoG_Minutes.pdf', type: 'static' },
        { name: 'BoG-19', file: '19th_BOG.PDF', type: 'static' },
        { name: 'BoG-20', file: '20th_BOG.PDF', type: 'static' },
        { name: 'BoG-21', file: '21st_BOG.PDF', type: 'static' },
        { name: 'BoG-22', file: '22nd_BOG.PDF', type: 'static' },
        { name: 'BoG-23', file: '23rd_BOG.PDF', type: 'static' },
        { name: 'BoG-24', file: '24th_BOG.PDF', type: 'static' },
        { name: 'BoG-25', file: '25th_BOG.PDF', type: 'static' },
        { name: 'BoG-26', file: '26th BoG Mom.pdf', type: 'static' },
        { name: 'BoG-27', file: '27th BoG Mom.pdf', type: 'static' },
        { name: 'BoG-28', file: '28th BoG Mom.pdf', type: 'static' },
        { name: 'BoG-29', file: '29th BoG Mom.pdf', type: 'static' },
        { name: 'BoG-30', file: '30th BoG Mom.pdf', type: 'static' },
        { name: 'BoG-31', file: '31st BoG Mom.pdf', type: 'static' },
        { name: 'BoG-32', file: '32nd BoG Mom.pdf', type: 'static' },
        { name: 'BoG-33', file: '33rd BoG Mom.pdf', type: 'static' },
        { name: 'BoG-34', file: '34th_BoG_MoM.pdf', type: 'static' },
        { name: 'BoG-35', file: '35th_BoG_MoM.pdf', type: 'static' },
        { name: 'BoG-36', file: '36th_BoG_MoM.pdf', type: 'static' },
        { name: 'BoG-37', file: '37th_BoG_MoM.pdf', type: 'static' },
        { name: 'BoG-38', file: '38th_BoG_MoM.pdf', type: 'static' },
        { name: 'BoG-39', file: 'MoM-BoG-39.pdf', type: 'static' },
        { name: 'BoG-40', file: 'MoM-BoG-40.pdf', type: 'static' },
        { name: 'BoG-41', file: 'MoM-BoG-41.pdf', type: 'static' },
        { name: 'BoG-42', file: 'MoM-BoG-42.pdf', type: 'static' },
        { name: 'BoG-43', file: 'MoM-BoG-43.pdf', type: 'static' },
        { name: 'BoG-44', file: '44-BoG.pdf', type: 'static' },
      ],
    },
    {
      title: 'Minutes of FC Meeting',
      links: [
        { name: 'FC-1', file: 'Minutes_of_1st_FC_Meeting.pdf', type: 'static' },
        { name: 'FC-2', file: 'Minutes_of_2nd_FC_Meeting.pdf', type: 'static' },
        { name: 'FC-3', file: 'Minutes_of_3rd_FC_Meeting.pdf', type: 'static' },
        { name: 'FC-4', file: 'Minutes_of_4th_FC_Meeting.pdf', type: 'static' },
        { name: 'FC-5', file: 'Minutes_of_5th_FC_Meeting.pdf', type: 'static' },
        { name: 'FC-6', file: 'Minutes_of_6th_FC_Meeting.pdf', type: 'static' },
        { name: 'FC-7', file: 'Minutes_of_7th_FC_Meeting.pdf', type: 'static' },
        { name: 'FC-8', file: 'Minutes_of_8th_FC_Meeting.pdf', type: 'static' },
        { name: 'FC-9', file: 'Minutes_of_9th_FC_Meeting.pdf', type: 'static' },
        { name: 'FC-10', file: 'Minutes_of_10th_FC_Meeting.pdf', type: 'static' },
        { name: 'FC-11', file: 'Minutes_of_11th_FC_Meeting.pdf', type: 'static' },
        { name: 'FC-12', file: 'Minutes_of_12th_FC_Meeting.pdf', type: 'static' },
        { name: 'FC-13', file: 'Minutes_of_13th_FC_Meeting.pdf', type: 'static' },
        { name: 'FC-14', file: 'Minutes_of_14th_FC_Meeting.pdf', type: 'static' },
        { name: 'FC-15', file: 'Minutes_of_15th_FC_Meeting.pdf', type: 'static' },
        { name: 'FC-16', file: 'Minutes_of_16th_FC_Meeting.pdf', type: 'static' },
        { name: 'FC-17', file: 'Minutes_of_17th_FC_Meeting.pdf', type: 'static' },
        { name: 'FC-18', file: '18th_FC_Minutes.pdf', type: 'static' },
        { name: 'FC-19', file: '19 FC.pdf', type: 'static' },
        { name: 'FC-20', file: '20th FC MoM.pdf', type: 'static' },
        { name: 'FC-21', file: '21st FC MoM.pdf', type: 'static' },
        { name: 'FC-22', file: '22nd FC MoM.pdf', type: 'static' },
        { name: 'FC-23', file: '23rd FC MoM.pdf', type: 'static' },
        { name: 'FC-24', file: '24th FC MoM.pdf', type: 'static' },
        { name: 'FC-25', file: '25th FC MoM.pdf', type: 'static' },
        { name: 'FC-26', file: '26th FC MoM.pdf', type: 'static' },
        { name: 'FC-27', file: '27th_FC_MoM.pdf', type: 'static' },
        { name: 'FC-28', file: '28th_FC_MoM.pdf', type: 'static' },
        { name: 'FC-29', file: '29th_FC_MoM.pdf', type: 'static' },
        { name: 'FC-30', file: '30th_FC_MoM.pdf', type: 'static' },
        { name: 'FC-31', file: 'MoM-FC-31.pdf', type: 'static' },
        { name: 'FC-32', file: 'MoM-FC-32.pdf', type: 'static' },
        { name: 'FC-33', file: 'MoM-FC-33.pdf', type: 'static' },
        { name: 'FC-34', file: 'MoM-FC-34.pdf', type: 'static' },
        { name: 'FC-35', file: 'MoM-FC-35.pdf', type: 'static' },
        { name: 'FC-36', file: '36-FC.pdf', type: 'static' },
      ],
    },
  ],
};

const RTI = () => {
  return (
    <div className="rti-page-container">
      <div className="rti-page-content">
        <h1 className="rti-page-title">THE RIGHT TO INFORMATION ACT</h1>
        <hr className="rti-page-title-divider" />

        <div className="rti-page-section">
          <h2 className="rti-page-section-title">RTI Officers</h2>
          <div className="rti-officers-list">
            {rtiData.officers.map((officer) => (
              <div className="rti-officer-card" key={officer.title}>
                <div className="rti-officer-title">{officer.title}</div>
                <div className="rti-officer-name">{officer.name}</div>
                <div className="rti-officer-contact">Contact No: {officer.contact}</div>
                <div className="rti-officer-email">E-Mail: <a href={`mailto:${officer.email}`}>{officer.email}</a></div>
              </div>
            ))}
          </div>
        </div>

        {rtiData.sections.map((section) => {
          // Render BoG and FC minutes in horizontal, pipe-separated style
          const isMinutesSection =
            section.title === 'Minutes of BoG Meeting' || section.title === 'Minutes of FC Meeting';
          return (
            <div className="rti-page-section" key={section.title}>
              <h2 className="rti-page-section-title">{section.title}</h2>
              <div className={isMinutesSection ? 'rti-page-list rti-minutes-list' : 'rti-page-list'}>
                {isMinutesSection ? (
                  <>
                    {section.links.map((link) => {
                      let href = '';
                      if (link.type === 'external') {
                        href = link.file;
                      } else {
                        href = `/pdf/RTI/${link.file}`;
                      }
                      return (
                        <a
                          key={link.name}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rti-page-link rti-minutes-link"
                        >
                          {link.name}
                        </a>
                      );
                    })}
                  </>
                ) : (
                  section.links.map((link) => {
                    let href = '';
                    if (link.type === 'external') {
                      href = link.file;
                    } else {
                      href = `/pdf/RTI/${link.file}`;
                    }
                    return (
                      <a
                        key={link.name}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rti-page-link"
                      >
                        {link.name}
                      </a>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RTI;
