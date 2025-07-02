import React from 'react';
import './Regulations.css';

const regulationsData = [
	{
		section: 'U.G Rules Regulations:',
		entries: [
			{
				title: 'Batches Admitted for B.Tech from 2023 onwards',
				file: '/src/assets/AcademicsSection/Rules & Regulations/U.G Rules Regulations/Batches Admitted for B.Tech from 2023 onwards.pdf',
			},
			{
				title: 'Batches Admitted for B.Tech from 2013 to 2022',
				file: '/src/assets/AcademicsSection/Rules & Regulations/U.G Rules Regulations/Batches Admitted for B.Tech from 2013 to 2022.pdf',
			},
			{
				title: 'Batches Admitted for B.Tech in 2010, 2011, 2012',
				file: '/src/assets/AcademicsSection/Rules & Regulations/U.G Rules Regulations/Batches Admitted for B.Tech in 2010, 2011, 2012.pdf',
			},
			{
				title: 'P.G Rules & Regulations',
				file: '/src/assets/AcademicsSection/Rules & Regulations/U.G Rules Regulations/P.G Rules & Regulations.pdf',
			},
			{
				title: 'Ph.D. Rules & Regulations',
				file: '/src/assets/AcademicsSection/Rules & Regulations/U.G Rules Regulations/Ph.D. Rules & Regulations.pdf',
			},
			{
				title: 'Post-Doc Fellowship Rules & Regulations',
				file: '/src/assets/AcademicsSection/Rules & Regulations/U.G Rules Regulations/Post-Doc Fellowship Rules & Regulations.pdf',
			},
		],
	},
	{
		section: 'U.G Curriculum:',
		entries: [
			{
				title: 'Academic Handbook for Batches admitted for B.Tech from 2023 onwards',
				file: '/src/assets/AcademicsSection/Rules & Regulations/U.G Curriculum/Academic Handbook for Batches admitted for B.Tech from 2023 onwards.pdf',
			},
			{
				title: 'Academic Handbook for Batches admitted for B.Tech from 2013 to 2022',
				file: '/src/assets/AcademicsSection/Rules & Regulations/U.G Curriculum/Academic Handbook for Batches admitted for B.Tech from 2013 to 2022.pdf',
			},
			{
				title: 'Academic Handbook for Batches admitted for B.Tech in 2010, 2011, 2012',
				file: '/src/assets/AcademicsSection/Rules & Regulations/U.G Curriculum/Academic Handbook for Batches admitted for B.Tech in 2010, 2011, 2012.pdf',
			},
			{
				title: 'Academic Handbook of courses for PG',
				file: '/src/assets/AcademicsSection/Rules & Regulations/U.G Curriculum/Academic Handbook of courses for PG.pdf',
			},
		],
	},
];

const Regulations = () => {
	return (
		<div className="regulations-page">
			<div className="regulations-container">
				<h1
					style={{
						fontWeight: 700,
						fontSize: '2.2rem',
						marginBottom: '2.5rem',
						color: '#2c3e50',
					}}
				>
					Rules and Regulations
				</h1>
				{regulationsData.map((block, i) => (
					<div key={i} style={{ marginBottom: '2.5rem' }}>
						<h2
							style={{
								fontWeight: 700,
								fontSize: '1.4rem',
								marginBottom: '1.2rem',
								color: '#222',
								borderBottom: '3px solid #1976d2',
								display: 'inline-block',
								paddingBottom: 4,
							}}
						>
							{block.section}
						</h2>
						<div className="events-list">
							{block.entries.map((entry, idx) => (
								<div
									key={idx}
									className="event-card"
									style={{
										justifyContent: 'space-between',
										alignItems: 'center',
										display: 'flex',
										marginBottom: 20,
										background: '#fff',
										borderRadius: 16,
										boxShadow: '0 2px 8px #0001',
										padding: 24,
									}}
								>
									<div
										className="event-title"
										style={{
											fontSize: '1.1rem',
											fontWeight: 600,
											color: '#1565c0',
										}}
									>
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
											style={{ marginRight: 8 }}
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
