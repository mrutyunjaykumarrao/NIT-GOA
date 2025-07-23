import React, { useEffect } from 'react';
import './Regulations.css';

const regulationsData = [
	{
		section: 'U.G Rules Regulations:',
		entries: [
			{
				title: 'Batches Admitted for B.Tech from 2023 onwards',
				file: '/pdf/Academics/Rules_Regulations/Batches Admitted for B.Tech from 2023 onwards.pdf',
			},
			{
				title: 'Batches Admitted for B.Tech from 2013 to 2022',
				file: '/pdf/Academics/Rules_Regulations/Batches Admitted for B.Tech from 2013 to 2022.pdf',
			},
			{
				title: 'Batches Admitted for B.Tech in 2010, 2011, 2012',
				file: '/pdf/Academics/Rules_Regulations/Batches Admitted for B.Tech in 2010, 2011, 2012.pdf',
			},
			{
				title: 'P.G Rules & Regulations',
				file: '/pdf/Academics/Rules_Regulations/P.G Rules & Regulations.pdf',
			},
			{
				title: 'Ph.D. Rules & Regulations',
				file: '/pdf/Academics/Rules_Regulations/Ph.D. Rules & Regulations.pdf',
			},
			{
				title: 'Post-Doc Fellowship Rules & Regulations',
				file: '/pdf/Academics/Rules_Regulations/Post-Doc Fellowship Rules & Regulations.pdf',
			},
		],
	},
	{
		section: 'U.G Curriculum:',
		entries: [
			{
				title: 'Academic Handbook for Batches admitted for B.Tech from 2023 onwards',
				file: '/pdf/Academics/Curriculum/Academic Handbook for Batches admitted for B.Tech from 2023 onwards.pdf',
			},
			{
				title: 'Minor Syllabus for Batches Admitted in B.Tech from 2022 onwards',
				file: '#',
			},
			{
				title: 'Academic Handbook for Batches admitted for B.Tech from 2013 to 2022',
				file: '/pdf/Academics/Curriculum/Academic Handbook for Batches admitted for B.Tech from 2013 to 2022.pdf',
			},
			{
				title: 'Academic Handbook for B.Tech in 2010, 2011, 2012',
				file: '/pdf/Academics/Curriculum/Academic Handbook for Batches admitted for B.Tech in 2010, 2011, 2012.pdf',
			},
			{
				title: 'Academic Handbook of courses for PG',
				file: '/pdf/Academics/Curriculum/Academic Handbook of courses for PG.pdf',
			},
		],
	},
];

const Regulations = () => {
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

	return (
		<div className="regulations-page">
			<div className="regulations-container">
				<div className="page-header">
					<h1>Rules and Regulations</h1>
				</div>
				{regulationsData.map((block, i) => (
					<div key={i} className="regulation-block" id={block.section === 'U.G Curriculum:' ? 'ug-curriculum' : undefined}>
						<h2 className="section-title">
							{block.section}
						</h2>
						<div className="events-list">
							{block.entries.map((entry, idx) => (
								<div
									key={idx}
									className="event-card"
								>
									<div className="event-title">
										{entry.title}
									</div>
									<button
										className="pretty-download-btn"
										onClick={() =>
											window.open(entry.file, '_blank')
										}
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
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Regulations;
