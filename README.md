# Profile-Builder-Contour
Group Project for internship.

Creating a web-based application to allow HR to create and update a candidate's profile. This profile gets saved to a database, where each version is tracked and downloadable as a pdf.

This application will also feature an AI matching tool. The HR representative can put in keywords can the tool will find the best match

Profile Builder Contour - Full Documentation
===========================================

1. Overview
----------
Profile Builder Contour is a full-stack web application with:
- Django backend for managing candidate profiles with versioned summaries, PDF exports, and RESTful APIs
- React frontend for dynamic form building and user interaction

2. Architecture
--------------
Backend (Django):
- Follows Model-View-Template (MVT) pattern
- Divided into:
  * Models: Candidate profiles, summaries, employees, departments
  * Views/APIs: CRUD operations, versioning, PDF exports
  * Templates: Admin and PDF generation
  * REST APIs: Frontend consumption

Frontend (React):
- Component-based architecture
- Key structures:
  * FormBuilder: Dynamic form rendering
  * Redux: State management
  * Services: API communication

3. Full Tech Stack
-----------------
Backend:
- Django
- Django REST Framework
- Django Reversion
- PostgreSQL
- WeasyPrint/xhtml2pdf

Frontend:
- React.js
- Redux Toolkit
- React Router
- Axios
- CSS Modules
- react-icons, react-loader-spinner

4. Installation & Setup
----------------------

Backend Setup:
1. Clone the repo:
   git clone https://github.com/MS141103/Profile-Builder-Contour.git
   cd Profile-Builder-Contour/django_candidate_profiles

2. Create virtual environment:
   python -m venv venv
   venv\Scripts\activate    # Windows
   # source venv/bin/activate  # Mac/Linux

3. Install dependencies:
   pip install -r requirements.txt

4. Set environment variables:
   SECRET_KEY=Jagdpanther8.8CMKWK
   DEBUG=True
   DATABASE_URL=postgres://user:pass@localhost:5432/candidate_profiles_db

5. Run migrations:
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser

6. Start server:
   python manage.py runserver

Frontend Setup:
1. Switch to frontend branch:
   git checkout Frontend-MS

2. Install dependencies:
   npm install

3. Configure environment:
   Create .env file with:
   REACT_APP_API_BASE_URL=http://localhost:8000/api
   REACT_APP_AUTH_KEY=your_key_here

4. Start development server:
   npm start

5. Project Structure
-------------------
Backend:
django_candidate_profiles/
├── manage.py
├── Procfile
├── requirements.txt
├── myproject/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── profiles/
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── serializers.py
    ├── views.py
    ├── urls.py
    └── templates/profiles/
        └── candidate_pdf_template.html

Frontend:
src/
├── assets/
├── components/
│   ├── FormBuilder/
│   ├── Loader/
│   └── ...
├── pages/
│   ├── Dashboard/
│   ├── Profile/
│   └── ...
├── redux/
│   ├── slices/
│   └── store.js
├── services/
├── styles/
├── utils/
├── App.js
└── index.js

6. Features
----------
Backend:
- Candidate Profiles management
- Versioned summaries using django-reversion
- PDF export functionality
- Employee and department management
- REST API endpoints

Frontend:
- Dynamic form rendering from JSON schemas
- Multi-step form workflows
- Form validation
- API integration with backend
- State management for user data

7. API Endpoints
---------------
Candidate Profiles:
| Method | Endpoint              | Description               |
| ------ | --------------------- | ------------------------- |
| GET    | /api/candidates/      | List all candidates       |
| POST   | /api/candidates/      | Create new profile        |
| GET    | /api/candidates/{id}/ | Retrieve specific profile |
| PUT    | /api/candidates/{id}/ | Update profile            |
| DELETE | /api/candidates/{id}/ | Delete profile            |

Employees:
| Method | Endpoint        | Description    |
| ------ | --------------- | -------------- |
| GET    | /api/employees/ | List employees |
| POST   | /api/employees/ | Add employee   |

PDF Exports:
| Method | Endpoint            | Description           |
| ------ | ------------------- | --------------------- |
| GET    | /profiles/{id}/pdf/ | Download profile PDF  |
| POST   | /api/exports/       | Trigger export (WIP)  |
| GET    | /api/exports/{id}/  | Get PDF export record |

8. Deployment
------------
Backend:
- Configure production settings
- Set up PostgreSQL database
- Deploy via gunicorn/nginx or platform-as-a-service

Frontend:
1. Build production version:
   npm run build
2. Deploy build/ folder to:
   - Vercel/Netlify (static hosting)
   - Node.js server (if using SSR)

9. Testing
---------
Backend:
python manage.py test

Frontend:
(To be implemented)
- Jest + React Testing Library
- Cypress for E2E

10. Future Improvements
----------------------
Backend:
- Enhanced PDF styling
- API authentication
- Performance optimization

Frontend:
- Add unit tests
- Improve error handling
- Optimize bundle size
- Enhanced form UX

11. Default Admin Credentials
----------------------------
should be the same as the one used to setup the POSTGRES SQL server on your machine
username: 
password: 
    HTML/CSS/JavaScript: Admin templates, frontend views
    
    Axios: Frontend API calls (planned)

VIDEO DEMONSTRATION


The video is included as a zip file to view at "Profile Builder and 1 more page - Work - Microsoft_ Edge 2025-07-31 16-46-54.zip", click view raw to download the zip and a setup guide for postgres SQL
