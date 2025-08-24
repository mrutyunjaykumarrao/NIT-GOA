import React from 'react';
import './MoUDetails.css';
import mouData from './mouDetails.json';

const MoUDetails = () => {
    return (
        <div className="mou-details-page">
            <div className="mou-container">
                <div className="mou-page-header">
                    <h1 className='mou-header-h1'>{mouData.page_header.title}</h1>
                </div>

                <div className="mou-table-container">
                    <table className="mou-table">
                        <thead>
                            <tr>
                                {mouData.table_headers.map((header, index) => (
                                    <th key={index}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {mouData.mous.map((mou, index) => (
                                <tr key={index}>
                                    <td>{mou.sno}</td>
                                    <td>{mou.date}</td>
                                    <td>{mou.duration}</td>
                                    <td>{mou.organization}</td>
                                    <td>{mou.scope}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MoUDetails;
