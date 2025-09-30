# Kutum Family Companion Backend

A comprehensive NestJS backend for a mobile-first family companion app with features for managing family profiles, documents, health records, milestones, vehicles, and reminders.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (Parent/Child/Elder)
- **Family Management**: Create and manage family member profiles
- **Document Vault**: Secure document storage with encryption and sharing
- **Health Tracking**: Record and track health vitals with trend analysis
- **Milestones**: Manage family events, birthdays, and recurring milestones
- **Vehicle Management**: Track vehicles, insurance, and service due dates
- **Reminders & Notifications**: Smart reminders with push/email notifications
- **File Upload**: Support for local, AWS S3, and Google Cloud Storage
- **Security**: Helmet, CORS, rate limiting, and input validation

## 🏗 Architecture

```
src/
├── interfaces/          # TypeScript interfaces and DTOs
├── modules/            # Feature modules
│   ├── auth/           # Authentication & authorization
│   ├── profiles/       # Family member management
│   ├── documents/      # Document vault
│   ├── health/         # Health records & vitals
│   ├── milestones/     # Family milestones & events
│   ├── vehicles/       # Vehicle management
│   ├── reminders/      # Reminders & alerts
│   ├── notifications/  # Push/email notifications
│   └── file-upload/    # File upload service
├── utils/              # Utility functions
└── main.ts            # Application entry point
```

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- AWS S3 account (optional)
- Google Cloud Storage account (optional)
- Firebase project (optional)
- SMTP email service (optional)

## 🛠 Installation

1. **Clone and install dependencies:**
```bash
cd kutumbackend
npm install
```

2. **Environment setup:**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Start development server:**
```bash
npm run start:dev
```

4. **Build for production:**
```bash
npm run build
npm run start:prod
```

## 🔧 Configuration

### Required Environment Variables

```env
# Application
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key

# File Upload
UPLOAD_PATH=./uploads
ENCRYPTION_KEY=your-encryption-key
```

### Optional Environment Variables

```env
# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket

# Google Cloud Storage
GCS_PROJECT_ID=your-gcs-project-id
GCS_BUCKET=your-gcs-bucket
GCS_KEY_FILE=path/to/service-account-key.json

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Firebase
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/health

## 🔐 Authentication

The API uses JWT-based authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **PARENT**: Full access to all features
- **ELDER**: Access to most features (limited deletion rights)
- **CHILD**: Read-only access to family data

## 📡 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get current user profile

### Family Profiles
- `POST /profiles` - Add family member
- `GET /profiles` - Get all family members
- `GET /profiles/:id` - Get family member by ID
- `PATCH /profiles/:id` - Update family member
- `DELETE /profiles/:id` - Delete family member

### Document Vault
- `POST /documents` - Upload document
- `GET /documents` - Get all documents
- `GET /documents/expiring` - Get expiring documents
- `GET /documents/:id` - Get document by ID
- `GET /documents/:id/download` - Get document download URL
- `PATCH /documents/:id` - Update document
- `POST /documents/:id/share` - Share document
- `DELETE /documents/:id` - Delete document

### Health Records
- `POST /health` - Add health record
- `GET /health/person/:personId` - Get health records for person
- `GET /health/person/:personId/latest` - Get latest vitals
- `GET /health/person/:personId/trends` - Get health trends
- `GET /health/:id` - Get health record by ID
- `PATCH /health/:id` - Update health record
- `DELETE /health/:id` - Delete health record

### Milestones
- `POST /milestones` - Create milestone
- `GET /milestones` - Get all family milestones
- `GET /milestones/person/:personId` - Get milestones for person
- `GET /milestones/upcoming` - Get upcoming milestones
- `GET /milestones/recurring` - Get recurring milestones
- `POST /milestones/generate-recurring` - Generate recurring milestones
- `GET /milestones/:id` - Get milestone by ID
- `PATCH /milestones/:id` - Update milestone
- `DELETE /milestones/:id` - Delete milestone

### Vehicles
- `POST /vehicles` - Add vehicle
- `GET /vehicles` - Get all family vehicles
- `GET /vehicles/owner/:ownerId` - Get vehicles by owner
- `GET /vehicles/expiring` - Get vehicles with expiring documents
- `GET /vehicles/service-due` - Get vehicles due for service
- `GET /vehicles/:id` - Get vehicle by ID
- `PATCH /vehicles/:id` - Update vehicle
- `DELETE /vehicles/:id` - Delete vehicle

### Reminders
- `POST /reminders` - Create reminder
- `GET /reminders` - Get all family reminders
- `GET /reminders/person/:personId` - Get reminders for person
- `GET /reminders/pending` - Get pending reminders
- `GET /reminders/:id` - Get reminder by ID
- `PATCH /reminders/:id` - Update reminder
- `PATCH /reminders/:id/snooze` - Snooze reminder
- `PATCH /reminders/:id/complete` - Mark reminder as completed
- `DELETE /reminders/:id` - Delete reminder

### Notifications
- `POST /notifications` - Create notification
- `POST /notifications/push` - Send push notification
- `POST /notifications/email` - Send email notification
- `POST /notifications/family` - Send family notification
- `GET /notifications` - Get user notifications
- `GET /notifications/unread-count` - Get unread count
- `PATCH /notifications/:id/read` - Mark notification as read
- `PATCH /notifications/read-all` - Mark all as read

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Granular permissions by user role
- **Input Validation**: Comprehensive validation using class-validator
- **Rate Limiting**: Protection against abuse with throttling
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: Security headers and protection
- **File Encryption**: Optional file encryption for sensitive documents
- **Data Sanitization**: Input sanitization and validation

## 🚀 Deployment

### Docker (Recommended)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

### Environment-specific Configuration

1. **Development**: Uses in-memory storage
2. **Production**: Configure database and external services
3. **Testing**: Mock services for unit tests

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Data Models

### Person
- Basic profile information
- Family relationships
- Contact details
- Role-based permissions

### Document
- File metadata
- Encryption status
- Sharing permissions
- Expiry tracking

### HealthRecord
- Various health metrics
- Trend analysis
- Historical data
- Unit conversions

### Milestone
- Event tracking
- Recurring patterns
- Media attachments
- Category classification

### Vehicle
- Vehicle details
- Document tracking
- Service scheduling
- Insurance management

### Reminder
- Smart scheduling
- Priority levels
- Notification triggers
- Snooze functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api/docs`
- Review the code examples in the controllers

## 🔄 Roadmap

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Real-time notifications with WebSockets
- [ ] Advanced analytics and reporting
- [ ] Mobile app integration
- [ ] Third-party service integrations
- [ ] Advanced security features
- [ ] Performance optimizations
- [ ] Comprehensive testing suite
