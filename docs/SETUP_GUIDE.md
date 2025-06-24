# Livestock Management System - Complete Setup Guide

## 🚀 Quick Start Commands

### Prerequisites
Make sure you have installed:
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- PostgreSQL (v12 or higher)
- Git

## 📁 Project Structure
\`\`\`
livestock-management/
├── frontend/          # Next.js application
├── backend/           # Django REST API
├── docs/             # Documentation
└── database/         # Database scripts
\`\`\`

## 🔧 Setup Instructions

### 1. Clone and Setup Frontend (Next.js)

\`\`\`bash
# Create project directory
mkdir livestock-management
cd livestock-management

# Initialize Next.js project
npx create-next-app@latest frontend --typescript --tailwind --eslint --app
cd frontend

# Install additional dependencies
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-checkbox
npm install @radix-ui/react-popover @radix-ui/react-calendar @radix-ui/react-tabs
npm install lucide-react date-fns class-variance-authority clsx tailwind-merge
npm install @hookform/resolvers react-hook-form zod

# Install shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button card input label select textarea checkbox dialog
npx shadcn@latest add popover calendar tabs toast

# Start development server
npm run dev
\`\`\`

### 2. Setup Backend (Django)

\`\`\`bash
# Go back to root directory
cd ..

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Create backend directory
mkdir backend
cd backend

# Install Django and dependencies
pip install django djangorestframework djangorestframework-simplejwt
pip install django-cors-headers psycopg2-binary python-decouple

# Create Django project
django-admin startproject livestock_management .

# Create Django apps
python manage.py startapp accounts
python manage.py startapp livestock
python manage.py startapp health_records

# Create requirements.txt
pip freeze > requirements.txt
\`\`\`

### 3. Database Setup (PostgreSQL)

\`\`\`bash
# Install PostgreSQL (if not already installed)
# On Ubuntu/Debian:
sudo apt update
sudo apt install postgresql postgresql-contrib

# On macOS (using Homebrew):
brew install postgresql
brew services start postgresql

# On Windows: Download from https://www.postgresql.org/download/

# Create database and user
sudo -u postgres psql

# In PostgreSQL shell:
CREATE DATABASE livestock_db;
CREATE USER livestock_user WITH PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE livestock_db TO livestock_user;
ALTER USER livestock_user CREATEDB;
\q
\`\`\`

### 4. Environment Configuration

\`\`\`bash
# Create .env file in backend directory
cd backend
touch .env

# Add to .env file:
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=livestock_db
DB_USER=livestock_user
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432
\`\`\`

\`\`\`bash
# Create .env.local file in frontend directory
cd ../frontend
touch .env.local

# Add to .env.local file:
NEXT_PUBLIC_API_URL=http://localhost:8000/api
\`\`\`

### 5. Django Database Migration

\`\`\`bash
cd ../backend

# Make migrations
python manage.py makemigrations
python manage.py makemigrations accounts
python manage.py makemigrations livestock
python manage.py makemigrations health_records

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start Django server
python manage.py runserver
\`\`\`

## 🗄️ Database Commands

### Essential PostgreSQL Commands

\`\`\`bash
# Connect to database
psql -U livestock_user -d livestock_db -h localhost

# View all tables
\dt

# View table structure
\d table_name

# View all users
\du

# Backup database
pg_dump -U livestock_user -h localhost livestock_db > backup.sql

# Restore database
psql -U livestock_user -h localhost livestock_db < backup.sql

# Drop and recreate database (if needed)
DROP DATABASE livestock_db;
CREATE DATABASE livestock_db;
\`\`\`

### Django Database Commands

\`\`\`bash
# Reset migrations (if needed)
python manage.py migrate --fake-initial

# Reset specific app migrations
python manage.py migrate accounts zero
python manage.py migrate livestock zero

# Show migration status
python manage.py showmigrations

# Create custom migration
python manage.py makemigrations --empty accounts

# Load sample data (if fixtures exist)
python manage.py loaddata sample_data.json

# Dump data to fixture
python manage.py dumpdata accounts.User --indent 2 > users.json
\`\`\`

## 🏃‍♂️ Running the Complete System

### Terminal 1 - Backend (Django)
\`\`\`bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python manage.py runserver
# Server runs on http://localhost:8000
\`\`\`

### Terminal 2 - Frontend (Next.js)
\`\`\`bash
cd frontend
npm run dev
# Server runs on http://localhost:3000
\`\`\`

### Terminal 3 - Database (PostgreSQL)
\`\`\`bash
# Monitor database connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity WHERE datname='livestock_db';"

# Monitor database size
sudo -u postgres psql -c "SELECT pg_size_pretty(pg_database_size('livestock_db'));"
\`\`\`

## 🔍 Testing the System

### 1. Test API Endpoints
\`\`\`bash
# Test authentication
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your_password"}'

# Test livestock endpoint
curl -X GET http://localhost:8000/api/livestock/ \
  -H "Authorization: Bearer your_jwt_token"
\`\`\`

### 2. Test Frontend Pages
- Login: http://localhost:3000/login
- Dashboard: http://localhost:3000/dashboard
- Livestock: http://localhost:3000/dashboard/livestock
- Breeding: http://localhost:3000/dashboard/breeding
- Feeding: http://localhost:3000/dashboard/feeding
- Finances: http://localhost:3000/dashboard/finances
- Reports: http://localhost:3000/dashboard/reports

## 🐛 Troubleshooting

### Common Issues and Solutions

1. **Port already in use**
\`\`\`bash
# Kill process on port 3000
npx kill-port 3000
# Kill process on port 8000
npx kill-port 8000
\`\`\`

2. **Database connection error**
\`\`\`bash
# Check PostgreSQL status
sudo systemctl status postgresql
# Restart PostgreSQL
sudo systemctl restart postgresql
\`\`\`

3. **Migration errors**
\`\`\`bash
# Reset migrations
python manage.py migrate --fake-initial
# Or delete migration files and recreate
rm */migrations/0*.py
python manage.py makemigrations
python manage.py migrate
\`\`\`

4. **CORS errors**
\`\`\`bash
# Ensure django-cors-headers is installed and configured
pip install django-cors-headers
# Add to INSTALLED_APPS and MIDDLEWARE in settings.py
\`\`\`

## 📊 System Architecture

### Frontend (Next.js)
- **Pages**: Authentication, Dashboard, Management sections
- **Components**: Reusable UI components with shadcn/ui
- **Services**: API integration layer
- **Hooks**: Custom React hooks for data fetching

### Backend (Django)
- **Models**: Database schema definitions
- **Views**: API endpoints with DRF
- **Serializers**: Data validation and transformation
- **Permissions**: Role-based access control

### Database (PostgreSQL)
- **Tables**: Users, Livestock, Health Records, Financial Records
- **Relationships**: Foreign keys and constraints
- **Indexes**: Performance optimization

## 🔐 Security Features

- JWT token authentication
- Role-based permissions
- CORS protection
- SQL injection prevention
- XSS protection
- CSRF protection

## 📈 Performance Optimization

- Database indexing
- API pagination
- Frontend caching
- Image optimization
- Code splitting

## 🚀 Deployment

### Production Environment Variables
\`\`\`bash
# Backend (.env)
DEBUG=False
ALLOWED_HOSTS=your-domain.com
DATABASE_URL=postgresql://user:pass@host:port/db

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
\`\`\`

### Docker Deployment (Optional)
\`\`\`bash
# Create Dockerfile for backend
# Create Dockerfile for frontend
# Create docker-compose.yml
docker-compose up -d
\`\`\`

This setup guide provides everything you need to run the livestock management system locally and in production!
