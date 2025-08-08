import React from 'react';
import './RDProjects.css';
import useScrollToTop from '../../utils/useScrollToTop';
import rdProjectsData from './rdProjects.json';

const RDProjects = () => {
    // Handle smooth scroll to top for quick link navigation
    useScrollToTop();
    
    return (
        <div className="rd-projects-page">
            <div className="rd-projects-container">
                <div className="rd-page-header">
                    <h1 className='rd-header-h1'>{rdProjectsData.page_header.title}</h1>
                </div>

                <div className="rd-projects-table-container">
                    <table className="rd-projects-table">
                        <thead>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Project Name</th>
                                <th>Name of PI</th>
                                <th>Funding Agency</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rdProjectsData.projects.map((project, index) => (
                                <tr key={index}>
                                    <td>{project.sr_no}</td>
                                    <td>{project.project_name}</td>
                                    <td>{project.pi_name}</td>
                                    <td>{project.funding_agency}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RDProjects;