# Profile-Builder-Contour

The Database side of our project. 


Features of the database:
    
    -Candidate profiles with name, title, email, contact info, department, and active flag
    
    -Profile summaries with version history (django-reversion)
    
    -PDF export of candidate profiles via HTML template
    
    -Employee and Department models supporting internal users
    
    -REST API endpoints for CRUD via Django REST Framework
    
    -Deploy-ready with Railway using Procfile (Work in Progress)

Project Structure:

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

Set-Up instructions: (run on command prompt)

      git clone https://github.com/MS141103/Profile-Builder-Contour.git
      cd Profile-Builder-Contour/django_candidate_profiles
      python -m venv venv
      source venv/bin/activate  # On Windows: venv\Scripts\activate
      pip install -r requirements.txt

Environment Variables:

      (check settings.py this should be preset)
      SECRET_KEY= 'you-secret-key'
      DEBUG=True
      DATABASE_URL=postgres://user:pass@localhost:5432/candidate_profiles_db

Database Setup:

    python manage.py makemigrations
    python manage.py migrate
    python manage.py createsuperuser

Running the Database:

    python manage.py runserver
    
    Visit http://127.0.0.1:8000/admin to create Profiles, Employees, Departments, etc.
    
    Will need login details use:
    muaaz
    Jagdpanther8.8CMKWK

APIS:

  Serializers and viewsets (profiles/serializers.py, views.py) are implemented. The base endpoint is:

    GET/POST /profiles/
    GET /profiles/{id}/
    PATCH /profiles/{id}/

  Vehicle to add version history: /profiles/{id}/versions/, PDF export: /profiles/{id}/pdf/.
  
  Frontend can fetch data via axios/fetch accordingly. (Check templates folder, and modify/create your own as needed)
  
  PDF export handled by xhtml2pdf. Accessible at:

    GET /profiles/{id}/pdf/

  Django admin table shows "Export PDF" links next to each candidate.


Candidate Profiles:

| Method | Endpoint                | Description                 |
| ------ | ----------------------- | --------------------------- |
| GET    | `/api/candidates/`      | List all candidate profiles |
| POST   | `/api/candidates/`      | Create a new profile        |
| GET    | `/api/candidates/<id>/` | Get a specific profile      |
| PUT    | `/api/candidates/<id>/` | Update profile              |
| DELETE | `/api/candidates/<id>/` | Delete profile              |

Employees:

| Method | Endpoint          | Description    |
| ------ | ----------------- | -------------- |
| GET    | `/api/employees/` | List employees |
| POST   | `/api/employees/` | Add employee   |

PDF Exports:

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| GET    | `/api/exports/`      | List all PDF export records |
| POST   | `/api/exports/`      | Trigger PDF export          |
| GET    | `/api/exports/<id>/` | Get specific PDF record     |

  Version Control of Summaries:
  
      (Version control for candidate profile is not implemented)
      django-reversion handles history automatically via admin.
      
      History tab available on candidate summary pages in Django admin.

Testing Integration:

  Backend: clone this repo, pip install, makemigrations & migrate, then run server. API lives under /profiles/ and /admin/.
  
  Frontend: existing HTML templates can be used or integrate fetch/axios to API endpoints.
  
  Frontend can use Django templates or build a separate SPA; just consume the provided API and PDF endpoints.

FOR BACKEND:

    - Work on PDF Export functionality

        Status: Modeel and button in Admin are defined
        Issue: Error in style section of html. Use Weasy print instead of xhtml2

    - Replace views.py with your version in the backend and integrate it

    - Implement API endpoints for CRUD
        Fetch Candidate info
        serve pdfs
        add test cases via pytest or Django's test case


    -Implement API layer and serializers
        Status: REST FRAMEWORK Installed. Missing serializers
        implement Django Rest Framework serializers.py for CandidateProfile, Employee, ProfileSummary and PDFexport


    -Ensure django-reversion installed and applied in admin.py for all models


        
