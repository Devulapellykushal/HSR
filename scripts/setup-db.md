# Database Setup Instructions

## Prerequisites

1. **Install PostgreSQL** on your system:
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt-get install postgresql postgresql-contrib`
   - Windows: Download from https://www.postgresql.org/download/

2. **Start PostgreSQL service**:
   - macOS: `brew services start postgresql`
   - Ubuntu: `sudo systemctl start postgresql`
   - Windows: Start from Services or pgAdmin

## Database Setup

1. **Create Database**:
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE kutum_db;
   
   # Create user (optional)
   CREATE USER kutum_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE kutum_db TO kutum_user;
   
   # Exit psql
   \q
   ```

2. **Update Environment Variables**:
   - Copy `env.example` to `.env`
   - Update database credentials in `.env`:
     ```
     DB_HOST=localhost
     DB_PORT=5432
     DB_USERNAME=postgres
     DB_PASSWORD=your_password
     DB_NAME=kutum_db
     ```

3. **Run the Application**:
   ```bash
   npm run start:dev
   ```

   TypeORM will automatically create all tables based on the entities.

## Database Schema

The following tables will be created:
- `users` - User authentication and basic info
- `persons` - Family member profiles
- `documents` - Document vault
- `health_records` - Health tracking data
- `milestones` - Family milestones and events
- `vehicles` - Vehicle management
- `reminders` - Reminders and notifications
- `notifications` - Notification history

## Production Setup

For production, make sure to:
1. Set `DB_SYNCHRONIZE=false`
2. Use proper database credentials
3. Enable SSL if required
4. Set up proper backup strategies
