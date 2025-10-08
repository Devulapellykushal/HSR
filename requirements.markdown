Kutum App Requirements Specification
1. Overview

App Name: Kutum
Purpose: A mobile/web app for users to manage their family members' details and associated documents. Each user acts as the sole admin ("superhero") of their own account, managing their family members and documents. Family members are non-login entities (data entries only), but a user can be added as a family member in another user's account (optional).
Target Audience: Individuals (e.g., parents, guardians) managing family documents and details for personal, legal, or administrative purposes.
Platform: Mobile (iOS/Android) and Web (responsive design for cross-device access).
Key Features:
User account creation and management.
Adding/editing family members (non-login entities).
Uploading, categorizing, and associating documents with family members.
Viewing, sharing, and downloading documents.
Optional: Users can be added as family members in other accounts.



2. User Roles

User (Superhero/Admin): The account owner who has full control over their account. They add family members, upload/manage documents, and control sharing/downloading. Each user manages their own family independently.
Family Member: A non-login entity added by the user, representing a family member (e.g., spouse, child). Contains details like name, relationship, and associated documents. No access to the app.
Other Users as Family Members: A user can be added as a family member in another user's account (e.g., you in your wife's account). This is optional and does not grant login access unless they have their own account.

3. Functional Requirements
3.1 User Authentication & Account Management

Users register with email/phone and password, or via social login (e.g., Google, Apple).
Support password reset, profile editing (name, photo, contact info).
Each user has their own isolated account with no shared access unless explicitly added as a family member in another account.
Multi-factor authentication (optional for security).

3.2 Family Member Management

Add family members: Input details like name, relationship (e.g., spouse, child, parent), date of birth, photo, contact info, and optional custom fields (e.g., blood group, cloth size).
Edit or remove family members.
View family list: Display all family members in a dashboard with quick links to their documents.
Optional linking: A user can add another registered user as a family member (e.g., wife adds husband) by entering their email or unique ID. This does not grant access to the account unless the added user logs into their own account.
Family members are non-login entities unless they are registered users with their own accounts.

3.3 Document Management

Upload documents: Support formats like PDF, images, Word, etc., from device storage, camera, or cloud (e.g., Google Drive integration).
Categorize documents: Pre-defined categories (e.g., Identification - Passport/ID; Health - Medical Records; Education - Certificates; Financial - Bank Statements; Legal - Wills/Deeds) with custom category option.
Associate documents: Link each document to one or more family members (e.g., a family health insurance policy linked to multiple members).
View documents: In-app preview for supported formats; support zoom and text search (for PDFs).
Edit metadata: Add tags, notes, expiration dates (with reminders), or descriptions.
Search: Search documents by keyword, category, family member, or date.
Delete/Archive: Soft delete with recovery option; archive old documents.

3.4 Sharing & Downloading

Share documents: Generate shareable links (with expiration, password protection) for individual documents or folders. Share via email, SMS, WhatsApp, or in-app.
Download: Single or bulk download to device storage or cloud.
Access control: Only the user (superhero) can share or download documents. Family members (non-login) have no access.
Audit logs: Track when documents are shared/downloaded (visible only to the user).
Sharing with other users: If a user is added as a family member (e.g., you in your wife's account), the admin can share specific documents with them via their registered email, viewable only if they log into their own account.

3.5 Additional Features

Notifications: Push/email alerts for document expirations or new shares.
Backup/Sync: Automatic cloud backup for data recovery.
Offline Access: Cache documents for viewing/downloading without internet (sync when online).
Import/Export: Bulk import from scan apps or export family data as ZIP/CSV.

4. Non-Functional Requirements

Security:
Encrypt all stored documents (end-to-end encryption preferred).
Compliance with data privacy laws (e.g., GDPR, CCPA) – user consent for data storage/sharing.
User accounts are isolated; no access to another user's data unless explicitly shared.


Performance:
Load times: <2 seconds for document previews; handle up to 1,000 documents per user.
Scalability: Support 1M+ users with cloud infrastructure.


Usability:
Intuitive UI: Simple dashboard with tabs for Family, Documents, Shares.
Accessibility: Support screen readers, high contrast modes, multi-language (English + regional languages like Hindi).
Mobile-first design with responsive web version.


Reliability:
99.9% uptime; automatic backups every 24 hours.
Error handling: User-friendly messages (e.g., "File too large – max 50MB").


Technical:
Backend: RESTful APIs with JWT authentication.
Storage: Cloud storage for documents (e.g., AWS S3).
Database: PostgreSQL for user/family data; NoSQL for document metadata (optional).



5. Data Model (High-Level)

Users Table: ID, Email, Password Hash, Profile Info (name, photo, contact).
Family Members Table: ID, User ID (owner), Name, Relationship, DOB, Photo URL, Custom Fields (e.g., blood group).
Documents Table: ID, User ID (owner), Member IDs (array), Category, File URL, Metadata (tags, notes, expiration), Upload Date.
Shares Table: ID, Document ID, Share Link, Expiration, Access Logs.

6. Assumptions & Scope

Assumptions:
Users have basic tech literacy; app focuses on simplicity.
Family members are data entries only, with no login unless they are registered users.
Documents are personal/family-only; no enterprise features.
Integration with external services (e.g., OCR for scanning) is out-of-scope initially.
Free basic version; premium for unlimited storage/shares.


Out of Scope:
Advanced analytics (e.g., document insights).
Physical document scanning hardware integration.
Real-time collaboration.
Payment processing for premium features.


Risks: Data privacy breaches – mitigate with encryption. High storage costs – optimize with compression.
Next Steps: Ready for prototyping. Can expand into user stories, API endpoints, or UI wireframes if needed.
