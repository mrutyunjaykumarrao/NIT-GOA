import React from 'react';
import './Committees.css';

const Committees = () => {
  return (
    <div className="committees-container">
      <div className="content-wrapper">
        <header className="page-header">
          <h1>Committees</h1>
        </header>
        
        <div className="committees-content">
          <div className="table-container">
            <table>
              <tbody>
                <tr>
                  <th width="24%">&nbsp;</th>
                  <th width="36%">Name</th>
                  <th width="25%">E-Mail</th>
                  <th width="15%">Phone Number</th>
                </tr>
                <tr>
                  <td rowSpan="3">Training &amp; Placement Cell</td>
                  <td>Dr. Sarani Ghosal Mondal (Chairperson)</td>
                  <td><span>tpo</span>@nitgoa.ac.in</td>
                  <td>0832-2404741</td>
                </tr>
                <tr>
                  <td>Dr. Venkatanareshbabu Kuppili (Convener)</td>
                  <td>venkatanaresh@nitgoa.ac.in</td>
                  <td>0832-2404402</td>
                </tr>
                <tr>
                  <td>Dr. Prasenjit Dey (Member)</td>
                  <td>prasenjit.dey@nitgoa.ac.in</td>
                  <td>0832-2404834</td>
                </tr>

                <tr>
                  <td rowSpan="4">RTI-Act</td>
                  <td>Dr. Shangerganesh L. (Central Public Information Officer)</td>
                  <td>pio@nitgoa.ac.in</td>
                  <td>0832-2404728</td>
                </tr>
                <tr>
                  <td>Dr. Ragoju Ravi (Assistant Public Information Officer)</td>
                  <td>apio@nitgoa.ac.in</td>
                  <td>0832-2404743</td>
                </tr>
                <tr>
                  <td>Dr. C. Vyjayanthi (First Appellate Authority)</td>
                  <td>faa@nitgoa.ac.in</td>
                  <td>0832-2404632</td>
                </tr>
                <tr>
                  <td>Dr. Velavan Kathirvelu (Chief Vigilance Officer)</td>
                  <td>cvo@nitgoa.ac.in</td>
                  <td>0832-2404726</td>
                </tr>

                <tr>
                  <td>Public Relations Officer</td>
                  <td>Dr. Sarani Ghosal Mondal</td>
                  <td>sarani@nitgoa.ac.in</td>
                  <td>8404528880(Mob)|0832-2404741</td>
                </tr>

                <tr>
                  <td rowSpan="6">Library Committee</td>
                  <td>Dr. Ragoju Ravi (Chairperson)</td>
                  <td>ravi@nitgoa.ac.in</td>
                  <td>0832-2404743</td>
                </tr>
                <tr>
                  <td>Dr. C. Vyjayanthi (Member)</td>
                  <td>c.vyjayanthi@nitgoa.ac.in</td>
                  <td>0832-2404632</td>
                </tr>
                <tr>
                  <td>Dr. Venkatanareshbabu Kuppili (Member)</td>
                  <td>venkatanaresh@nitgoa.ac.in</td>
                  <td>0832-2404402</td>
                </tr>
                <tr>
                  <td>Dr. Saidi Reddy Parne (Member)</td>
                  <td>psreddy@nitgoa.ac.in</td>
                  <td>0832-2404729</td>
                </tr>
                <tr>
                  <td>Dr. B. Santhi (Member)</td>
                  <td>santhi@nitgoa.ac.in</td>
                  <td>0832-2404829</td>
                </tr>
                <tr>
                  <td>Dr. Prashanth G. R. (Member)</td>
                  <td>grprashanth@nitgoa.ac.in</td>
                  <td>0832-2404533</td>
                </tr>

                <tr>
                  <td rowSpan="3">Admissions&nbsp;</td>
                  <td>Dr. Ravi Ragoju (Centre Incharge - JoSAA/CSAB/DASA)<br/><br/> Dr. Sreeraj E.S. (Dy. Centre Incharge)</td>
                  <td>ugadmissions@nitgoa.ac.in<br/>dasa@nitgoa.ac.in</td>
                  <td>0832-2404743<br/>0832-2404617</td>
                </tr>
                <tr>
                  <td>Dr. Venkatanareshbabu Kuppili (Centre Incharge - CCMT)<br/><br/> Dr. Raviprasad K.J (Dy. Centre Incharge)</td>
                  <td>pgadmissions@nitgoa.ac.in</td>
                  <td>0832-2404402</td>
                </tr>
                <tr>
                  <td>Dr. C. Vyjayanthi (Chairperson - Ph.D Admissions)<br/><br/> Dr. Modi Chirag N. (Member)<br/><br/>Dr. Shangerganesh L (Convenor)</td>
                  <td>phdadmissions@nitgoa.ac.in</td>
                  <td>0832-2404632</td>
                </tr>

                <tr>
                  <td>Examination Cell In-Charge</td>
                  <td>Dr. S. Shivnarayan Patidar</td>
                  <td>examcell@nitgoa.ac.in</td>
                  <td>0832-2404532</td>
                </tr>

                <tr>
                  <td rowSpan="5">Disciplinary Committee</td>
                  <td>Dean (Student Welfare) (Chairperson)</td>
                  <td>dean.sw@nitgoa.ac.in</td>
                  <td>0832-2404643</td>
                </tr>
                <tr>
                  <td>Dr. T. Veerakumar (Convener)</td>
                  <td>tveerakumar@nitgoa.ac.in</td>
                  <td>0832-2404520</td>
                </tr>
                <tr>
                  <td>Dr. Saidi Reddy Parne (Member)</td>
                  <td>psreddy@nitgoa.ac.in</td>
                  <td>0832-2404729</td>
                </tr>
                <tr>
                  <td>Dr. Suresh Mikkili (Member)</td>
                  <td>mikkili.suresh@nitgoa.ac.in</td>
                  <td>0832-2404645</td>
                </tr>
                <tr>
                  <td>Dr. Sarani Ghosal Mondal (Member)</td>
                  <td>sarani@nitgoa.ac.in</td>
                  <td>0832-2404741</td>
                </tr>

                <tr>
                  <td rowSpan="4">Research Committee</td>
                  <td>Dr. Nithin Kumar Y.B. (Chairman)</td>
                  <td>nithin.shastri@nitgoa.ac.in</td>
                  <td>0832-2404547</td>
                </tr>
                <tr>
                  <td>Dr. B. Venugopal Reddy (Member)</td>
                  <td>bvenugopal_reddy@nitgoa.ac.in</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Dr. Saidi Reddy Parne (Member)</td>
                  <td>psreddy@nitgoa.ac.in</td>
                  <td>0832-2404729</td>
                </tr>
                <tr>
                  <td>Dr. Pravati Swain (Member)</td>
                  <td>pravati@nitgoa.ac.in</td>
                  <td>0832-2404420</td>
                </tr>

                <tr>
                  <td rowSpan="6">Hostel Wardens</td>
                  <td>Dr. Mallikarjun Erramshetty (Chief Warden / II Year B.Tech Warden - Boys Hostel)</td>
                  <td>emallikarjuna@nitgoa.ac.in</td>
                  <td>0832-2404521</td>
                </tr>
                <tr>
                  <td>Dr. Venkatanareshbabu K (III Year B.Tech Warden - Boys Hostel)</td>
                  <td>venkatanaresh@nitgoa.ac.in</td>
                  <td>0832-2404402</td>
                </tr>
                <tr>
                  <td>Dr. Lokesh Kumar Bramhane(IV Year B.Tech Warden - Boys Hostel)</td>
                  <td>lokesh.bramhane@nitgoa.ac.in</td>
                  <td>0832-2404518</td>
                </tr>
                <tr>
                  <td>Dr. Sunil Kumar A. (I Year B.Tech, M.Tech., Ph.D. Warden &amp; Guests Warden- Boys Hostel)</td>
                  <td>sunilkumar@nitgoa.ac.in</td>
                  <td>0832-2404715</td>
                </tr>
                <tr>
                  <td>Dr. Pravati Swain(III &amp; IV Year B.Tech, II year M.Tech., Ph.D &amp; Guests Warden - Girls Hostel)</td>
                  <td>pravati@nitgoa.ac.in</td>
                  <td>0832-2404420</td>
                </tr>
                <tr>
                  <td>Dr. B.Santhi (I &amp; II Year B.Tech, I M.Tech Warden - Girls Hostel)</td>
                  <td>santhi@nitgoa.ac.in</td>
                  <td>0832-2404829</td>
                </tr>

                <tr>
                  <td rowSpan="5">Community Outreach Cell</td>
                  <td>Dr. Prashanth G.R (Coordinator)</td>
                  <td>grprashanth@nitgoa.ac.in</td>
                  <td>0832-2404533</td>
                </tr>
                <tr>
                  <td>Dr. Sreeraj E.S. (Nodal Officer, Unnat Bharat Abhiyan)</td>
                  <td><span>sreeraj</span>@nitgoa.ac.in</td>
                  <td>0832-2404617</td>
                </tr>
                <tr>
                  <td>Dr. Saidi Reddy Parne (Nodal Officer, Rashtriya Avishkar Abhiyan)</td>
                  <td><span>psreddy@nitgoa.ac.in</span></td>
                  <td>0832-2404729</td>
                </tr>
                <tr>
                  <td>Dr. Venkatanareshbabu Kuppili (Nodal Officer, PMM Scheme)</td>
                  <td><span>venkatanaresh@nitgoa.ac.in</span></td>
                  <td>0832-2404402</td>
                </tr>
                <tr>
                  <td>Dr. Purushothama B.R. (Nodal Officer, Digital India)</td>
                  <td>puru@nitgoa.ac.in</td>
                  <td></td>
                </tr>

                <tr>
                  <td>GIAN Scheme</td>
                  <td>Dr. B.Santhi (Local Coordinator)</td>
                  <td>gian@nitgoa.ac.in</td>
                  <td>0832-2404829</td>
                </tr>

                <tr>
                  <td>Ek Bharat Shreshtha Bharat</td>
                  <td>Dr. Sunil Kumar Ambrammal (Nodal Officer)</td>
                  <td>sunilkumar@nitgoa.ac.in</td>
                  <td>0832-2404715</td>
                </tr>

                <tr>
                  <td>SC/ST Cell &amp; PWD</td>
                  <td>Dr. T Veerakumar (Liaison Officer)</td>
                  <td>scstcell@nitgoa.ac.in</td>
                  <td>0832-2404520</td>
                </tr>

                <tr>
                  <td>OBC &amp; EWS</td>
                  <td>Dr. Ragoju Ravi (Liaison Officer)</td>
                  <td>ravi@nitgoa.ac.in</td>
                  <td>0832-2404743</td>
                </tr>

                <tr>
                  <td>In-charge, Campus Control Center (CCC)</td>
                  <td>Dr. Venkatanareshbabu Kuppili</td>
                  <td>ccc.incharge@nitgoa.ac.in</td>
                  <td>0832-2404402</td>
                </tr>

                <tr>
                  <td>NIRF</td>
                  <td>Dr. Veerakumar T (Convener)</td>
                  <td>nirf@nitgoa.ac.in</td>
                  <td>0832-2404520</td>
                </tr>

                <tr>
                  <td>Student Mentor Programme(SMP)</td>
                  <td>Dr. Trilochan Panigrahi<br/>(Faculty In-Charge)</td>
                  <td>tpanigrahi@nitgoa.ac.in</td>
                  <td>0832-2404502</td>
                </tr>

                <tr>
                  <td>National Service Scheme(NSS)</td>
                  <td>Dr. Lokesh Kumar Bramhane<br/>(Faculty In-Charge)</td>
                  <td>lokesh.bramhane@nitgoa.ac.in</td>
                  <td>0832-2404518</td>
                </tr>

                <tr>
                  <td>New Education Policy(NEP Cell)</td>
                  <td>Dr. Saidi Reddy Parne<br/>(Chairperson)</td>
                  <td>psreddy@nitgoa.ac.in</td>
                  <td>0832-2404729</td>
                </tr>

                <tr>
                  <td>Grievance Redressal Committee</td>
                  <td colSpan="3">
                    <p>Institute Level Committee</p>
                    <p>Dean(FW) - Chairperson</p>
                    <p>Internal BoG Member - Member(Professor/Associate Professor)</p>
                    <p>Dean(SW)- Member</p>
                    <p>SC/ST Liaison Officer - Member</p>
                    <p>OBC/EWS Liaison Officer - Member</p>
                    <p>Assistant Registrar(Estt.) - Member</p>
                    <p>Registrar - Ex-Officiao</p>
                    <p>Departmental Committee Member:</p>
                    <p>Dept. of Applied Sciences &amp; Humanities and Social Sciences :</p>
                    <p>1) HoD - Chairperson</p>
                    <p>2)Dr. Saidi Reddy Parne - Internal Dept. Member</p>
                    <p>3)Dr. Mini S. - Other Dept. Member</p>
                    <p>&nbsp;</p>
                    <p>Department of Computer Science &amp; Engg. :</p>
                    <p>1)HoD - Chairperson</p>
                    <p>2)Dr. Venkatanareshbabu K - Internal Dept. Member</p>
                    <p>3)Dr. Lalat Indu Giri -Other Dept. Member</p>
                    <p>&nbsp;</p>
                    <p>Department of Civil Engg. :</p>
                    <p>1)HoD - Chairman</p>
                    <p>2)Dr. Pragati Patel - External Dept. Member</p>
                    <p>3)Dr. Mallikarjun E - Other Dept. Member</p>
                    <p>&nbsp;</p>
                    <p>Dept. of Electrical &amp; Electronics Engg. :</p>
                    <p>1)HoD - Chairman</p>
                    <p>2)Dr. Sreeraj E.S -Internal Dept. Member</p>
                    <p>3)Dr. Sarani Ghosal Mondal - Other Dept. Member</p>
                    <p>&nbsp;</p>
                    <p>Dept. of Electonics &amp; Communication Engg. :</p>
                    <p>1)HoD - Chairman</p>
                    <p>2)Dr. Anirban Chatterjee - Internal Dept. Member</p>
                    <p>3)Dr. Pravati Swain - Other Dept. Member</p>
                    <p>&nbsp;</p>
                    <p>Department of Mechanical Engg. :</p>
                    <p>1)HoD - Chairperson</p>
                    <p>2)Dr. Prasenjit Dey - Internal Dept. Member</p>
                    <p>3)Dr. Shangerganesh- Other Dept. Member</p>
                  </td>
                </tr>

                <tr>
                  <td rowSpan="6">Institute Anti-Ragging Committee (IARC)</td>
                  <td>Dean SW (Chairman)</td>
                  <td>dean.sw@nitgoa.ac.in</td>
                  <td>0832-2404213</td>
                </tr>
                <tr>
                  <td>Chief Warden (Member)</td>
                  <td>chiefwarden@nitgoa.ac.in</td>
                  <td>0832-2404521</td>
                </tr>
                <tr>
                  <td>Registrar (Member)</td>
                  <td>registrar@nitgoa.ac.in</td>
                  <td>0832-2404202</td>
                </tr>
                <tr>
                  <td>Concerned HoD (Member)</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td>Liaison Officer (Member)</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td>Two 1st year students nominated by Dean (SW) (Member)</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>

                <tr>
                  <td rowSpan="4">Institute Anti-Ragging Squad (IARS)</td>
                  <td>Dr. Venkatanareshbabu Kuppili</td>
                  <td>venkatanaresh@nitgoa.ac.in</td>
                  <td>0832-2404402</td>
                </tr>
                <tr>
                  <td>Dr. Lokesh Kumar</td>
                  <td>lokesh@nitgoa.ac.in</td>
                  <td>0832-2404518</td>
                </tr>
                <tr>
                  <td>Mr. Karteek Dokala</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Ms. Deeksha Yadav</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>

                <tr>
                  <td rowSpan="7">Internal Committee on Gender Harassment</td>
                  <td>Dr. Veena Thenkanidiyoor (Presiding Officer)</td>
                  <td>ic@nitgoa.ac.in</td>
                  <td>0832-2404432</td>
                </tr>
                <tr>
                  <td>Dr. S. Mini (Member)</td>
                  <td>mini@nitgoa.ac.in</td>
                  <td>0832-2404419</td>
                </tr>
                <tr>
                  <td>Dr. Shivnarayan Patidar (Member)</td>
                  <td>shivnarayan.patidar@nitgoa.ac.in</td>
                  <td>0832-2404532</td>
                </tr>
                <tr>
                  <td>Mrs. Sweta Jadhav (Staff Member)</td>
                  <td>sweta.jadhav@nitgoa.ac.in</td>
                  <td>0832-2404318</td>
                </tr>
                <tr>
                  <td>Mr. Anand Gachichinamath&nbsp;(Staff Member)</td>
                  <td>anandg@nitgoa.ac.in</td>
                  <td>0832-2404221</td>
                </tr>
                <tr>
                  <td>NGO - As Nominated by Director (on case to case basis)</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
                <tr>
                  <td>Student -&nbsp;As Nominated by Dean(SW) (on case to case basis)</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>

                <tr>
                  <td rowSpan="4">Research Advisory Committee (RAC)</td>
                  <td>Dr. B. Venugopal Reddy (Chairperson)</td>
                  <td>bvenugopal_reddy@nitgoa.ac.in</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Dr. T. Veerakumar (Member)</td>
                  <td>tveerakumar@nitgoa.ac.in</td>
                  <td>0832-2404520</td>
                </tr>
                <tr>
                  <td>Dr. Purushothama B.R. (Member)</td>
                  <td>puru@nitgoa.ac.in</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Dr. Sreeraj E.S. (Member)</td>
                  <td><span>sreeraj</span>@nitgoa.ac.in</td>
                  <td>0832-2404617</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Committees;
