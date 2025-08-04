import React, { useEffect, useState } from 'react';
import './Regulations.css';
import regulationsData from './regulationsData.json';

const Regulations = () => {
	const [expandedDropdowns, setExpandedDropdowns] = useState({});

	useEffect(() => {
		// Check if there's a hash in the URL and scroll to it
		if (window.location.hash) {
			const targetId = window.location.hash.substring(1); // Remove the # symbol
			const targetElement = document.getElementById(targetId);
			if (targetElement) {
				setTimeout(() => {
					targetElement.scrollIntoView({ 
						behavior: 'smooth', 
						block: 'start' 
					});
				}, 100); // Small delay to ensure the component is fully rendered
			}
		}
	}, []);

	const toggleDropdown = (blockIndex, entryIndex) => {
		const key = `${blockIndex}-${entryIndex}`;
		setExpandedDropdowns(prev => ({
			...prev,
			[key]: !prev[key]
		}));
	};

	const handlePDFOpen = (file) => {
		if (file && file !== '#') {
			window.open(file, '_blank');
		}
	};

	const renderSimpleEntry = (entry) => (
		<div className="event-card">
			<div className="event-title">
				{entry.title}
			</div>
			<button
				className="pretty-download-btn"
				onClick={() => handlePDFOpen(entry.file)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					fill="none"
					viewBox="0 0 24 24"
					className="download-icon"
				>
					<rect
						width="18"
						height="22"
						x="3"
						y="1"
						fill="#fff"
						stroke="#1976d2"
						strokeWidth="1.5"
						rx="3"
					/>
					<rect
						width="14"
						height="2"
						x="5"
						y="4"
						fill="#e3eafc"
					/>
					<rect
						width="10"
						height="2"
						x="7"
						y="8"
						fill="#e3eafc"
					/>
					<rect
						width="10"
						height="2"
						x="7"
						y="12"
						fill="#e3eafc"
					/>
					<rect
						width="10"
						height="2"
						x="7"
						y="16"
						fill="#e3eafc"
					/>
				</svg>
				Download PDF
			</button>
		</div>
	);

	const renderDepartmentButtons = (departments) => (
		<div className="department-buttons-container">
			{departments.map((dept, deptIndex) => (
				<button
					key={deptIndex}
					className="department-btn"
					onClick={(e) => {
						e.stopPropagation();
						handlePDFOpen(dept.file);
					}}
				>
					{dept.name}
				</button>
			))}
		</div>
	);

	const renderDropdownEntry = (entry, blockIndex, entryIndex) => {
		const key = `${blockIndex}-${entryIndex}`;
		const isExpanded = expandedDropdowns[key];

		return (
			<div 
				className="event-card dropdown-card"
				onClick={() => toggleDropdown(blockIndex, entryIndex)}
				style={{ cursor: 'pointer' }}
			>
				<div className="dropdown-header">
					<div className="event-title">
						{entry.title}
					</div>
					<svg
						className={`dropdown-arrow ${isExpanded ? 'expanded' : ''}`}
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<polyline points="6,9 12,15 18,9"></polyline>
					</svg>
				</div>
				
				<div className={`dropdown-content ${isExpanded ? 'open' : ''}`}>
					{entry.dropdownItems.map((item, itemIndex) => (
						<div 
							key={itemIndex} 
							className="dropdown-item"
							onClick={(e) => e.stopPropagation()}
						>
							{item.type === 'department_buttons' ? (
								<>
									<div className="dropdown-item-title">
										{item.title}
									</div>
									{renderDepartmentButtons(item.departments)}
								</>
							) : (
								<div className="dropdown-simple-item">
									<div className="dropdown-item-title">
										{item.title}
									</div>
									<button
										className="dropdown-download-btn"
										onClick={(e) => {
											e.stopPropagation();
											handlePDFOpen(item.file);
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="18"
											height="18"
											fill="none"
											viewBox="0 0 24 24"
											className="download-icon"
										>
											<rect
												width="18"
												height="22"
												x="3"
												y="1"
												fill="#fff"
												stroke="#1976d2"
												strokeWidth="1.5"
												rx="3"
											/>
											<rect
												width="14"
												height="2"
												x="5"
												y="4"
												fill="#e3eafc"
											/>
											<rect
												width="10"
												height="2"
												x="7"
												y="8"
												fill="#e3eafc"
											/>
											<rect
												width="10"
												height="2"
												x="7"
												y="12"
												fill="#e3eafc"
											/>
											<rect
												width="10"
												height="2"
												x="7"
												y="16"
												fill="#e3eafc"
											/>
										</svg>
										Download PDF
									</button>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<div className="regulations-page">
			<div className="regulations-container">
				<div className="page-header">
					<h1>{regulationsData.regulations_page.title}</h1>
				</div>
				{regulationsData.regulations_page.sections.map((block, i) => (
					<div key={i} className="regulation-block" id={block.id}>
						<h2 className="section-title">
							{block.section}
						</h2>
						<div className="events-list">
							{block.entries.map((entry, idx) => (
								<div key={idx}>
									{entry.type === 'dropdown' ? 
										renderDropdownEntry(entry, i, idx) :
										renderSimpleEntry(entry)
									}
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Regulations;
