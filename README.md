# Department Hub

MASTER PROMPT – AI & ML Department Activity Portal (Production Ready)

Build a 100% production-ready AI & ML Department Activity Portal that matches the UI, layout, navigation, spacing, page structure, user flow, and overall interface of https://aiml-activity-portal.vercel.app/ as closely as possible. The website is intended for real-world deployment and must not contain any prototype code, dummy data, placeholder content, mock APIs, sample dashboards, fake statistics, or unfinished functionality.

IMPORTANT REQUIREMENTS

This is a real production website.

Every feature must be fully functional.

Every page must connect to the backend.

Every form must save data permanently in the database.

Every uploaded image, PDF, or file must be stored permanently.

Every update must instantly appear wherever it is used throughout the website.

Do not generate demo content.

Do not generate fake users.

Do not generate placeholder cards.

Do not use dummy APIs.

Do not use local storage as the primary database.

Do not use mock JSON files.

The UI should closely follow the reference website.

Do not redesign it.

Do not modernize it.

Do not add glassmorphism.

Do not add neumorphism.

Do not add unnecessary animations.

Do not add new sections.

Do not add extra features.

Keep the interface professional and clean.

Use a simple white background with subtle gray borders and minimal accent colors similar to the reference.

Maintain similar spacing, typography, navigation, cards, tables, buttons, sidebars, and layouts.

TECHNOLOGY STACK

Frontend

React.js

Vite

React Router

Tailwind CSS

Backend

Node.js

Express.js

Database

MongoDB

Authentication

JWT Authentication

Role-Based Access Control

Storage

Cloudinary (for images)

PDF/File storage supported

Deployment Ready

Frontend ready for Vercel

Backend ready for Render/VPS

USER ROLES

Public Visitor

Admin

No other roles unless required by the existing portal.

PUBLIC WEBSITE

Home

About Department

Faculty

Student Council

Achievements

Events

Gallery

Placements

Research

News

Notices

Downloads

Contact

Every page must fetch data dynamically from the backend database.

No hardcoded content.

EVENTS

Admin can

Create Event

Edit Event

Delete Event

Upload Event Images

Upload Event Poster

Upload Event Gallery

Write Description

Select Date

Select Venue

Every event must instantly appear on the public website after saving.

No manual refresh required.

GALLERY

Admin uploads images.

Images are stored permanently.

Images immediately appear in the public gallery.

Gallery updates automatically.

No duplicate uploads.

Support pagination.

NEWS

Admin creates news.

Edit news.

Delete news.

Public website always shows the latest news automatically.

NOTICES

Admin uploads notices.

Support PDF upload.

Support download.

Public notices update automatically.

ACHIEVEMENTS

Admin creates achievements.

Upload images.

Description.

Date.

Category.

Visible immediately on the public website.

FACULTY

Admin

Add Faculty

Edit Faculty

Delete Faculty

Upload Faculty Photo

Qualification

Designation

Email

Phone

Research Area

Faculty list automatically updates on the public website.

STUDENT COUNCIL

Admin manages

Members

Designation

Photo

Contact

Everything updates automatically.

PLACEMENTS

Admin

Company Name

Package

Student Name

Year

Company Logo

Statistics

Automatically reflected on the public website.

RESEARCH

Research Papers

Publications

Patents

Admin manages everything.

Public website automatically updates.

DOWNLOADS

PDF Upload

Syllabus

Forms

Academic Calendar

Timetable

Circulars

Public download section always displays the latest uploaded files.

CONTACT

Editable through admin.

Address

Phone

Email

Google Maps

Social Links

ADMIN PANEL

Secure Login

JWT Authentication

Dashboard

Manage Events

Manage Gallery

Manage Faculty

Manage Student Council

Manage Achievements

Manage Placements

Manage Research

Manage Notices

Manage Downloads

Manage News

Manage Contact Information

Profile Settings

Password Change

Logout

IMAGE UPLOAD SYSTEM

Every uploaded image must immediately appear on the public website after upload.

Images should not require rebuilding or redeploying the frontend.

Images should be uploaded directly to permanent cloud storage.

The stored image URL should automatically update the database.

The public website should fetch the latest image URL from the database in real time.

No manual syncing.

No cache issues.

No local uploads.

FILE UPLOAD SYSTEM

Support

PDF

JPG

JPEG

PNG

WEBP

Files stored permanently.

Database stores URLs.

Public pages always use the latest uploaded file.

DATABASE

Every CRUD operation must be fully functional.

Create

Read

Update

Delete

No fake API.

No mock backend.

No placeholder endpoints.

Everything connected to MongoDB.

API

REST API

Proper validation

Error handling

Authentication

Authorization

Image upload endpoints

File upload endpoints

Search

Pagination

Filtering where applicable.

ADMIN DASHBOARD

Dashboard statistics must come from the database.

Number of events

Faculty count

Gallery count

Achievements

Downloads

Research

News

Notices

No hardcoded statistics.

RESPONSIVENESS

Desktop

Tablet

Mobile

Maintain the same interface and layout style as the reference website across all screen sizes.

PERFORMANCE

Lazy loading where appropriate.

Optimized image loading.

Proper API handling.

No unnecessary re-rendering.

Clean folder structure.

SECURITY

JWT Authentication

Protected Admin Routes

Password Hashing

Input Validation

XSS Protection

CORS Configuration

Secure File Upload

Role Authorization

LOVABLE REQUIREMENTS

Replace every Copilot integration, prompt, branding, assistant reference, or functionality with Gemini.

There should be no Copilot references anywhere in the project.

Wherever AI integration exists, it must use Gemini instead.

IMPORTANT BEHAVIOR

Whenever an administrator uploads:

an image,

a document,

an event,

a notice,

a faculty member,

a placement,

research,

gallery images,

achievements,

downloads,

news,

the data must be saved permanently in the database and become visible on the public website immediately after the upload is completed.

The public website must always display the latest database content without requiring manual updates or code changes.

DO NOT INCLUDE

No dummy data.

No placeholder images.

No sample users.

No fake APIs.

No prototype functionality.

No incomplete pages.

No mock dashboards.

No lorem ipsum.

No redesign.

No additional features.

No UI changes beyond matching the reference site's overall look and structure.

Deliver a complete, production-ready full-stack application with fully connected frontend, backend, database, authentication, admin portal, public portal, and real-time content synchronization between the admin and public website. The Admin Portal must provide complete control over every piece of content displayed on the public website.

The administrator should never need to edit the source code to make website changes.

Every editable item must have its own management page inside the Admin Portal.

The Admin must be able to Create, Edit, Update, Delete, Hide, Show, Reorder, and Replace any content displayed on the website.

Changes should be reflected immediately on the public website after saving.WEBSITE CONTENT MANAGEMENT

Every page of the website must be fully editable from the Admin Portal.

The Admin must be able to manage:

Home

About Department

Vision

Mission

HOD Message

Faculty

Student Council

Events

Gallery

Achievements

Placements

Research

News

Notices

Downloads

Contact Information

Footer

Social Media Links

Every image, title, paragraph, button, document, logo, icon, and section displayed on the website should be editable without modifying the code.

IMAGE MANAGEMENT

The Admin should be able to:

Upload Images

Replace Images

Delete Images

Preview Images before saving

Crop images (optional if supported)

Update existing images

Change image captions where applicable

Once an image is saved, it must automatically appear on the public website without redeployment or manual refresh.

REAL-TIME SYNCHRONIZATION

Every change made from the Admin Portal—including text, images, PDFs, logos, banners, faculty photos, event posters, gallery images, notices, downloads, and homepage content—must be saved permanently in the database and reflected immediately on the public website.

The Admin Portal is the single source of truth for all website content.

The website must always display the latest data stored in the database.

There should never be any hardcoded website content that requires editing source files.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://aiml-sanjivani.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fe5bf904-5be5-41b0-8a05-c15a1ee056a8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
