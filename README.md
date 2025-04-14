Job Portal Modules (Frontend Only)

This project includes two mock frontend modules:

## 1. Job Requirement Module
Allows companies to create, view, and edit job postings.

**Fields:**
- Title, Location, Job Type, Education, Skills, Experience, Description, Status

## 2. Resume Module
Manages candidate resumes in two modes:

- **Manual Entry:** 
Form with fields like Name, Email, Education, Skills, Experience, etc.
- **PDF Upload:** 
Upload PDF resume → extract text(using regex) → 
Prefill form for review.

## Notes
- Built collaboratively by 3 frontend developers.

## Tech Stack
React | HTML/CSS | pdfjs-dist (for PDF parsing)

## Setup
npm install
npm start