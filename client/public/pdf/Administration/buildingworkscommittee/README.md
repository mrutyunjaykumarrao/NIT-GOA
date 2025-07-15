# Building and Works Committee PDFs - Public Directory

This folder contains the BWC (Building and Works Committee) meeting minute PDFs served from the public directory.

## Current Files Structure:
- BWC-2.pdf
- BWC-3.pdf
- BWC-4.pdf
- BWC-5.pdf
- BWC-6.pdf
- BWC-7.pdf
- BWC-8.pdf
- BWC-9.pdf
- BWC-10.pdf
- MoM 11th BWC.pdf (referenced as BWC-11)
- MoM 12th BWC.pdf (referenced as BWC-12)
- MoM 13BWC.pdf (referenced as BWC-13)

## Instructions:
1. **Move PDF files** from `src/assets/PDF/administration/buildingworkscommittee/` to this `public/pdf/administration/buildingworkscommittee/` folder
2. **Files should be accessible** at URLs like: `http://localhost:3000/pdf/administration/buildingworkscommittee/BWC-2.pdf`
3. **Component references** these files using paths starting with `/pdf/administration/buildingworkscommittee/`

## Why Public Directory?
- Files in the `public` folder are served directly by the web server
- They can be accessed via direct URLs without import statements
- This is the correct way to serve downloadable PDFs in React applications

## Next Steps:
1. Copy all PDF files from the src/assets location to this public folder
2. Test the links in the Building and Works Committee page
3. Verify PDFs open correctly when clicked
