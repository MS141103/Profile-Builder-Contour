from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from profiles.models import CandidateProfile, ProfileSummary, Employee, PdfExport
import random
from faker import Faker

fake = Faker()

class Command(BaseCommand):
    help = "Seed the database with test data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding database...")

        # Create fake users and employees
        for _ in range(5):
            user = User.objects.create_user(
                username=fake.user_name(),
                email=fake.email(),
                password="testpassword"
            )
            employee = Employee.objects.create(
                user=user,
                employee_id=fake.unique.bothify(text="EMP###"),
                Department=fake.random_element(elements=('IT', 'HR', 'FIN', 'OPS'))
            )

        # Create fake candidates and summaries
        for _ in range(5):
            candidate = CandidateProfile.objects.create(
                name=fake.first_name()[:20],
                title=fake.job()[:20],
                location=fake.state_abbr()[:6],
                email=fake.unique.email(),
                employee_id=fake.bothify(text="INT###")[:10],
                is_active=True
            )
            ProfileSummary.objects.create(
                candidate=candidate,
                summary_text=fake.paragraph(nb_sentences=3)
            )

        self.stdout.write(self.style.SUCCESS("Database successfully seeded!"))
