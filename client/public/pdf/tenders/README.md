# Tenders PDF Directory

This directory contains all the tender documents for NIT Goa based on the data from tender.html.

## File Structure

Place all tender PDF files in this directory with the following naming convention:
- Use descriptive names as shown in the tender.html file
- Maintain the original file names for consistency

## Required PDF Files:

### Active Tenders (2025):
- CA Tender 01july2025.pdf
- Corrigendum GIAN 26june2025.pdf
- HORTICULTURE 19june2025.pdf
- Extension cafeteria 12june2025.pdf
- Video Recording for GIAN EEE 9june2025.pdf
- CorrigendumCafeteria 4june2025.pdf
- New Tender Cafetaria 22may2025.pdf
- Horticulture Tender.pdf

### Archive Tenders (2024-2025):
- corrigendum running general stores 24april2025.pdf
- Corrigendum Mobile Tower 15april2025.pdf
- CorrigendumRunningGeneralStore 9april2025.pdf
- CorrigendumCricketPracticeNet 9april2025.pdf
- Corrigendum Installation and Erection of a Land  Based Mobile Tower 1April2025.pdf
- Tender Incinerator 27march2025.pdf
- Tender for Cricket Net 17march2025.pdf
- Tender for running general store 17march2025.pdf
- Corrigendum - Tender for Installation and Erection of a Land Based Mobile Tower.pdf
- VideoRecordingfor GIAN 26feb2025.pdf
- Tender for installation of mobile tower 20feb2025.pdf
- TenderRunningGeneral store 10jan2025.pdf
- TenderRunningGeneralStore 14nov2024.pdf

## Usage

The React application will look for these files at the path `/pdf/tenders/[filename]` when users click the "Download PDF" button on each tender card.

## Data Source

All tender information is sourced from the tender.html file in the ReferenceMaterial folder, which contains the actual tender data from the NIT Goa website.

## Note

Make sure all PDF files are placed in this directory for the download functionality to work properly. The application displays both current active tenders and archived completed tenders in separate tabs.
