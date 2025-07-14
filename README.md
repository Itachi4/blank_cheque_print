# Cheque Generation App

A full-stack application for generating, managing, and printing cheques for multiple companies and banks. Built with Node.js (Express, Prisma, PDF-lib) for the backend and Angular for the frontend.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Directory Structure](#directory-structure)
- [Backend](#backend)
  - [Stack & Dependencies](#stack--dependencies)
  - [API Endpoints](#api-endpoints)
  - [Database Schema](#database-schema)
  - [How to Run (Backend)](#how-to-run-backend)
- [Frontend](#frontend)
  - [Stack & Dependencies](#stack--dependencies-1)
  - [Main Components & Services](#main-components--services)
  - [How to Run (Frontend)](#how-to-run-frontend)
  - [User Guide](#user-guide)
- [Environment Variables](#environment-variables)
- [Common Tasks](#common-tasks)
- [Troubleshooting & Tips](#troubleshooting--tips)

---

## Project Overview
This app allows accountants and admins to generate cheque PDFs for various companies and banks, manage cheque templates, and keep track of cheque numbers. It features a secure login, batch cheque generation, and a user-friendly web interface.

---

## Directory Structure
```
cheque-app/
├── backend/         # Node.js backend (Express, Prisma, PDF generation)
│   ├── generateCheque.js
│   ├── printCheque.js
│   ├── index.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── templates/   # Cheque template backgrounds (PDFs/images)
│   ├── fonts/       # MICR and other fonts
│   └── output/      # Generated cheque PDFs
├── frontend/        # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── pages/
│   │   └── assets/
│   └── ...
└── README.md        # This file
```

---

## Backend

### Stack & Dependencies
- Node.js, Express
- Prisma ORM (`@prisma/client`, `prisma`)
- PDF-lib (`pdf-lib`, `@pdf-lib/fontkit`)
- PostgreSQL (default, see `prisma/schema.prisma`)
- Other: `dotenv`, `cors`, `nodemon`

### API Endpoints
- `POST   /api/login` — Authenticate user
- `GET    /api/companies` — List companies
- `GET    /api/banks/:companyId` — List banks for a company
- `GET    /api/accounts/:bankId` — List accounts for a bank
- `GET    /api/last-cheque/:accountId` — Get last cheque number
- `POST   /api/templates` — Create/update cheque template
- `GET    /api/templates/:companyId/:bankId` — Get cheque template
- `POST   /api/generate` — Generate cheques (batch)
- `PATCH  /api/accounts/:accountId/last-cheque` — Update last cheque number
- Static: `/templates` (template backgrounds), `/output` (generated PDFs)

### Database Schema
Defined in `backend/prisma/schema.prisma` (PostgreSQL):
- **User**: id, email, password, role, name, timestamps
- **Company**: id, name, timestamps, banks, templates
- **Bank**: id, name, companyId, routingNumber, timestamps, accounts, template
- **Account**: id, number, bankId, lastCheck, timestamps
- **ChequeTemplate**: id, companyId, bankId, background, fieldMap (JSON), timestamps

### How to Run (Backend)
1. Install dependencies:
   ```
   cd backend
   npm install
   ```
2. Set up your `.env` file (see [Environment Variables](#environment-variables)).
3. Run migrations and generate Prisma client:
   ```
   npx prisma migrate dev
   npx prisma generate
   ```
4. Start the server:
   ```
   npm run dev
   # or
   npm start
   ```
5. (Optional) View/edit DB with Prisma Studio:
   ```
   npx prisma studio
   ```

---

## Frontend

### Stack & Dependencies
- Angular 18, Angular Material
- RxJS, Fabric.js

### Main Components & Services
- **ChequeGeneratorComponent**: Main UI for selecting company, bank, account, cheque count, and generating cheques. Shows template preview and generation history.
- **ChequeService**: Handles API calls for companies, banks, accounts, templates, cheque generation, and updating cheque numbers.
- **AuthService**: Handles login and authentication.

### How to Run (Frontend)
1. Install dependencies:
   ```
   cd frontend
   npm install
   ```
2. Start the Angular dev server:
   ```
   npm start
   # or
   ng serve
   ```
3. Open [http://localhost:4200/](http://localhost:4200/) in your browser.

### User Guide
(Adapted from the existing frontend README)

#### 1. Logging In
- Go to [http://localhost:4200/](http://localhost:4200/)
- Enter your email and password.

#### 2. Generating Cheques
- Select company, bank, and account.
- Enter the number of cheques to generate.
- Preview the template and cheque numbers.
- Click **Generate Cheques**. Download the PDF from the history section.

#### 3. Update Cheque Number
- Use the update box to correct the last cheque number if needed.

#### 4. Tips
- If dropdowns or PDFs don't load, check your selections and browser pop-up settings.
- Use the **Update Cheque Number** feature to fix numbering before generating new cheques.

---

## Environment Variables
Create a `.env` file in the backend directory. Example:
```
DATABASE_URL=postgresql://user:password@localhost:5432/chequedb
```

---

## Common Tasks
- **Run migrations:** `npx prisma migrate dev`
- **Deploy migrations (prod):** `npx prisma migrate deploy`
- **Generate Prisma client:** `npx prisma generate`
- **View DB in browser:** `npx prisma studio`

---

## Troubleshooting & Tips
- If you see errors about missing packages, run `npm install` in the relevant directory.
- For database errors, check your `DATABASE_URL` and that PostgreSQL is running.
- For PDF/font/template issues, ensure the `fonts/` and `templates/` folders are populated.
- For frontend issues, ensure the backend is running at `http://localhost:3000/`.

---

**For further help, see the user guide above or contact your IT support.** 