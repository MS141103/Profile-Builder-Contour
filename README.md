# Profile-Builder-Contour
Group Project for internship.

Creating a web-based application to allow HR to create and update a candidate's profile. This profile gets saved to a database, where each version is tracked and downloadable as a pdf.

This application will also feature an AI matching tool. The HR representative can put in keywords can the tool will find the best match

Overview
  Profile Builder Contour is a Django-based web application designed to manage candidate profiles with versioned summaries, PDF exports, and RESTful APIs for backend interaction. The application supports admin-facing features and is structured to be integrated with a modern frontend interface.

Architecture
  The project follows the Model-View-Template (MVT) pattern using Django. It is divided into:
  
  Models: Represent candidate profiles, summaries, employees, and departments.
  
  Views / APIs: Handle CRUD operations, summary versioning, and PDF exports.
  
  Templates: Support admin and PDF generation.
  
  REST APIs: Enable frontend consumption.

Features
  Candidate Profiles
  Full name, title, email, phone, department, active flag
  
  Uploadable profile image (optional)

Profile Summaries
  Versioned summaries using django-reversion
  
  Track and rollback changes from admin

PDF Export
  Export candidate profiles as styled PDFs
  
  Available via admin and API
  
  Rendered via HTML templates and converted with xhtml2pdf (WeasyPrint recommended)

Employees and Departments
  Manage internal staff
  
  Link created summaries with employee users

API Integration
  REST API endpoints via Django REST Framework (DRF)
  
  Axios/fetch-friendly for frontend
  
  Authentication support (planned)

Admin Enhancements
Export PDF button in admin list

Version history tabs

Custom display formats

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


git clone https://github.com/MS141103/Profile-Builder-Contour.git
cd Profile-Builder-Contour/django_candidate_profiles
Setup Instructions
Clone the repo:

git clone https://github.com/MS141103/Profile-Builder-Contour.git
cd Profile-Builder-Contour/django_candidate_profiles
Create virtual environment:


    python -m venv venv
      venv\Scripts\activate    # Windows
      # source venv/bin/activate  # Mac/Linux
Install dependencies:


    pip install -r requirements.txt
Set environment variables:
Preset in settings.py, or via .env:

    SECRET_KEY=Jagdpanther8.8CMKWK
    DEBUG=True
    DATABASE_URL=postgres://user:pass@localhost:5432/candidate_profiles_db
Run migrations and create admin user:

    python manage.py makemigrations
    python manage.py migrate
    python manage.py createsuperuser
Start the development server:

    python manage.py runserver
Visit: http://127.0.0.1:8000/admin
Login credentials:

makefile

    username: muaaz  
    password: Jagdpanther8.8CMKWK

API Endpoints
  Candidate Profiles
  
  | Method | Endpoint              | Description               |
  | ------ | --------------------- | ------------------------- |
  | GET    | /api/candidates/      | List all candidates       |
  | POST   | /api/candidates/      | Create new profile        |
  | GET    | /api/candidates/{id}/ | Retrieve specific profile |
  | PUT    | /api/candidates/{id}/ | Update profile            |
  | DELETE | /api/candidates/{id}/ | Delete profile            |
  
  Employees
  
  | Method | Endpoint        | Description    |
  | ------ | --------------- | -------------- |
  | GET    | /api/employees/ | List employees |
  | POST   | /api/employees/ | Add employee   |
  
  PDF Exports
  
  | Method | Endpoint            | Description           |
  | ------ | ------------------- | --------------------- |
  | GET    | /profiles/{id}/pdf/ | Download profile PDF  |
  | POST   | /api/exports/       | Trigger export (WIP)  |
  | GET    | /api/exports/{id}/  | Get PDF export record |

Version Control (Summaries Only)
  Version tracking for candidate summaries handled via django-reversion
  Viewable from Django Admin → Candidate Summaries → History tab

Testing
Backend: pytest or Django’s TestCase classes

Run tests after setup using:

    python manage.py test

Tech Stack
    Django: Web framework
    
    Django REST Framework: API layer
    
    Django Reversion: Summary versioning
    
    PostgreSQL: Database
    
    WeasyPrint / xhtml2pdf: PDF rendering
    
    HTML/CSS/JavaScript: Admin templates, frontend views
    
    Axios: Frontend API calls (planned)
