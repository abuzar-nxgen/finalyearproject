#!/bin/bash

# Livestock Management System - Automated Setup Script

echo "🐄 Setting up Livestock Management System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js v18 or higher."
        exit 1
    fi
    
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.8 or higher."
        exit 1
    fi
    
    if ! command -v psql &> /dev/null; then
        print_warning "PostgreSQL is not installed. Please install PostgreSQL."
    fi
    
    print_status "Requirements check completed!"
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend (Next.js)..."
    
    if [ ! -d "frontend" ]; then
        npx create-next-app@latest frontend --typescript --tailwind --eslint --app --yes
    fi
    
    cd frontend
    
    # Install dependencies
    npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-checkbox
    npm install @radix-ui/react-popover @radix-ui/react-calendar @radix-ui/react-tabs
    npm install lucide-react date-fns class-variance-authority clsx tailwind-merge
    npm install @hookform/resolvers react-hook-form zod
    
    # Setup shadcn/ui
    npx shadcn@latest init --yes
    npx shadcn@latest add button card input label select textarea checkbox dialog
    npx shadcn@latest add popover calendar tabs toast
    
    # Create environment file
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000/api
EOF
    
    cd ..
    print_status "Frontend setup completed!"
}

# Setup backend
setup_backend() {
    print_status "Setting up backend (Django)..."
    
    # Create virtual environment
    python3 -m venv venv
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Create backend directory
    mkdir -p backend
    cd backend
    
    # Install Django and dependencies
    pip install django djangorestframework djangorestframework-simplejwt
    pip install django-cors-headers psycopg2-binary python-decouple
    
    # Create Django project if it doesn't exist
    if [ ! -f "manage.py" ]; then
        django-admin startproject livestock_management .
        python manage.py startapp accounts
        python manage.py startapp livestock
        python manage.py startapp health_records
    fi
    
    # Create requirements.txt
    pip freeze > requirements.txt
    
    # Create environment file
    cat > .env << EOF
SECRET_KEY=django-insecure-change-this-in-production
DEBUG=True
DB_NAME=livestock_db
DB_USER=livestock_user
DB_PASSWORD=livestock_password
DB_HOST=localhost
DB_PORT=5432
EOF
    
    cd ..
    print_status "Backend setup completed!"
}

# Setup database
setup_database() {
    print_status "Setting up database (PostgreSQL)..."
    
    # Check if PostgreSQL is running
    if ! pgrep -x "postgres" > /dev/null; then
        print_warning "PostgreSQL is not running. Please start PostgreSQL service."
        return 1
    fi
    
    # Create database and user
    sudo -u postgres psql << EOF
CREATE DATABASE livestock_db;
CREATE USER livestock_user WITH PASSWORD 'livestock_password';
GRANT ALL PRIVILEGES ON DATABASE livestock_db TO livestock_user;
ALTER USER livestock_user CREATEDB;
\q
EOF
    
    print_status "Database setup completed!"
}

# Run migrations
run_migrations() {
    print_status "Running database migrations..."
    
    cd backend
    source ../venv/bin/activate
    
    python manage.py makemigrations
    python manage.py makemigrations accounts
    python manage.py makemigrations livestock
    python manage.py makemigrations health_records
    python manage.py migrate
    
    cd ..
    print_status "Migrations completed!"
}

# Create superuser
create_superuser() {
    print_status "Creating Django superuser..."
    
    cd backend
    source ../venv/bin/activate
    
    echo "Please create a superuser account:"
    python manage.py createsuperuser
    
    cd ..
    print_status "Superuser created!"
}

# Main setup function
main() {
    print_status "Starting Livestock Management System setup..."
    
    check_requirements
    setup_frontend
    setup_backend
    setup_database
    run_migrations
    create_superuser
    
    print_status "Setup completed successfully! 🎉"
    echo ""
    echo "To start the system:"
    echo "1. Backend: cd backend && source ../venv/bin/activate && python manage.py runserver"
    echo "2. Frontend: cd frontend && npm run dev"
    echo ""
    echo "Access the application at: http://localhost:3000"
    echo "Access the Django admin at: http://localhost:8000/admin"
}

# Run main function
main
