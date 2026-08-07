# MR Institute of Learning

MR Institute of Learning is an enterprise educational platform containing a public website, Developer CMS, Office Operations Portal, and a Dynamic Form Engine, powered by Firebase and structured as a Progressive Web App (PWA).

## Project Overview
This repository contains the complete frontend architecture for the institution.
* **Public Website**: SEO-optimized, highly converting interface for potential students.
* **Developer CMS**: A role-based content management system allowing zero-code updates to website content, courses, and settings.
* **Office Operations Portal**: An internal CRM and application management portal for the admissions and office teams.
* **Dynamic Form Engine**: A robust form builder that generates shareable forms directly from the CMS.
* **Progressive Web App**: Offline resilience, push notifications, and app-like installation capabilities.

## Technology Stack
* **Framework**: React + TypeScript
* **Build Tool**: Vite
* **Styling**: Tailwind CSS + custom UI components
* **Backend**: Firebase Auth, Firestore, Firebase Storage
* **Hosting**: Prepared for Vercel
* **PWA**: vite-plugin-pwa (Workbox)

## Local Development Setup

### 1. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
Ensure you fill in your Firebase configuration and Recaptcha keys for development.

### 3. Development Server
Start the local development server:
```bash
npm run dev
```

### 4. Production Build
To create a production-ready build:
```bash
npm run build
```
The output will be generated in the `dist/` folder.
