# Skidulo.com: AI-Powered Appointment Booking System

## Project Overview

Skidulo.com is an intelligent, affordable alternative to Calendly that empowers professionals to manage their appointments with AI-driven features. The platform allows service providers to offer both free and paid consultation slots, with integrated payment processing and smart scheduling capabilities powered by DeepSeek AI.

## Core Features

### 1. User Account & Profile Management
- **Registration & Authentication**
  - Email/password registration
  - Social login options (Google, Microsoft)
  - Two-factor authentication
- **Profile Customization**
  - Professional profile with service descriptions
  - Profile image and branding options
  - Custom booking link (username.skidulo.com)
  - Timezone settings and management

### 2. Calendar Management
- **Calendar Integration**
  - Google Calendar sync (sole integration for MVP)
  - Microsoft Outlook integration (future phase, based on demand)
  - Apple Calendar integration (future phase)
- **Availability Settings**
  - Custom working hours
  - Buffer time between appointments
  - Blackout dates and recurring breaks
  - Multiple calendar management for different services

### 3. Appointment Types
- **Service Configuration**
  - Multiple appointment types/durations
  - Group/individual appointment options
  - In-person/virtual meeting toggle
  - Detailed description fields
- **Pricing Options**
  - Free appointment settings
  - Paid consultation configuration
  - Custom pricing per appointment type
  - Subscription packages (future phase)

### 4. Booking Experience
- **Client Interface**
  - Clean, mobile-responsive booking pages
  - Simple date/time selection process
  - Intake form customization
  - Location or video conferencing details
- **Notifications & Reminders**
  - Confirmation emails
  - Email-based reminders
  - Custom reminder schedules
  - Cancellation/reschedule options via email links

### 5. Payment Processing
- **Payment Methods**
  - Credit/debit card processing
  - PayPal integration
  - Stripe Connect for direct payments to service providers
  - Invoice generation for business clients
- **Financial Management**
  - Transaction history and reporting
  - Payout schedules to providers
  - Refund processing
  - Tax documentation helpers

### 6. AI-Powered Features
- **Intelligent Scheduling**
  - Smart availability suggestions based on past booking patterns
  - Optimal meeting time recommendations based on provider energy levels
  - Automatic buffer adjustment based on meeting type complexity
- **Client Intake Enhancement**
  - AI-powered form customization based on service type
  - Automatic categorization of client queries
  - Pre-meeting brief generation based on client information
- **Productivity Tools**
  - Meeting preparation suggestions
  - Post-meeting follow-up recommendations
  - Service improvement insights based on booking patterns
  - Client engagement optimization

### 7. Integration Ecosystem
- **Meeting Tools**
  - Google Meet automatic generation (via Google Calendar)
  - Custom meeting URL support (for provider's own Zoom links)
  - Meeting link field for any conferencing tool (Zoom, Teams, etc.)
  - Optional: Meeting instructions text field
- **Business Tools**
  - CRM system connections (basic Salesforce, HubSpot)
  - Note-taking app integrations (Notion, Evernote)
  - Project management tools (Asana, Trello)
- **Marketing Extensions**
  - Social media booking links
  - Website embedding options
  - Email campaign tool connections

## Technical Architecture

### Frontend
- **Framework**: React with Next.js
- **UI Components**: Tailwind CSS with custom theming
- **State Management**: React Context API or Redux
- **Form Handling**: React Hook Form with Zod validation

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Serverless Functions**: Supabase Edge Functions
- **Email Service**: Nodemailer with Google Workspace SMTP

### AI Implementation
- **Model**: DeepSeek AI
- **Integration Method**: API-based calls for scheduling intelligence
- **Data Processing**: Trained on anonymized scheduling patterns
- **Feature Implementation**:
  - Pattern recognition for optimal scheduling
  - Natural language processing for availability settings
  - Recommendation engine for business optimization

### APIs & External Services

#### Essential APIs
1. **Google Calendar API**
   - Purpose: Primary calendar integration
   - Endpoints needed:
     - Events (create, read, update, delete)
     - Calendars (list, get, update)
     - FreeBusy (query)
   - Authentication: OAuth 2.0
   - Documentation: https://developers.google.com/calendar/api

2. **Stripe API**
   - Purpose: Payment processing and subscription management
   - Endpoints needed:
     - Payments (create, capture, refund)
     - Customers (create, update)
     - Connect (for service provider payouts)
     - Subscriptions (for recurring packages)
   - Documentation: https://stripe.com/docs/api

3. **DeepSeek AI API**
   - Purpose: AI-powered scheduling features
   - Implementation:
     - Scheduling optimization
     - Pattern recognition
     - Natural language understanding
   - Integration: REST API or SDK

4. **Email Handling with Nodemailer**
   - Purpose: All email notifications and reminders
   - Implementation: 
     - Nodemailer library integrated with existing Google Workspace SMTP
     - Email templates stored in the application
     - Queue system to manage email sending within Google's limits
   - Benefits:
     - No additional email service costs
     - Up to 2,000 emails per day with Google Workspace
     - Simple integration with existing business email

#### Secondary APIs
1. **Microsoft Graph API** (Future enhancement - not in MVP)
   - Purpose: Potential future Outlook calendar integration
   - Would be implemented only based on user demand
   - Not required for initial product launch

2. **Google Meet Integration**
   - Purpose: Video meeting creation via Google Calendar
   - Implementation: Utilize existing Google Calendar API connection
   - Authentication: Same OAuth 2.0 as Google Calendar
   - Note: No direct Zoom API costs as users can paste their own Zoom links

3. **SendGrid API** (Future phase - not in MVP)
   - Purpose: Advanced email capabilities for marketing
   - Endpoints needed: Mail Send, Templates
   - Documentation: https://docs.sendgrid.com/api-reference

4. **PayPal API**
   - Purpose: Alternative payment processing
   - Endpoints needed: Payments, Orders, Payouts
   - Documentation: https://developer.paypal.com/api/rest/

## Database Schema (Supabase)

### Primary Tables
1. **users**
   - id (primary key)
   - email
   - first_name
   - last_name
   - timezone
   - profile_image_url
   - created_at
   - updated_at

2. **service_providers**
   - id (primary key)
   - user_id (foreign key)
   - business_name
   - description
   - custom_url
   - default_availability
   - payment_details
   - commission_rate

3. **appointment_types**
   - id (primary key)
   - provider_id (foreign key)
   - name
   - description
   - duration
   - price
   - is_paid
   - color
   - location_type (in-person, virtual, phone)
   - meeting_url
   - buffer_before
   - buffer_after

4. **availability**
   - id (primary key)
   - provider_id (foreign key)
   - day_of_week
   - start_time
   - end_time
   - is_recurring
   - date (for non-recurring)

5. **blackout_dates**
   - id (primary key)
   - provider_id (foreign key)
   - start_date
   - end_date
   - reason

6. **bookings**
   - id (primary key)
   - appointment_type_id (foreign key)
   - client_name
   - client_email
   - client_phone
   - start_time
   - end_time
   - status (confirmed, cancelled, completed)
   - payment_status (if applicable)
   - payment_id (if applicable)
   - notes
   - created_at

7. **calendar_connections**
   - id (primary key)
   - user_id (foreign key)
   - provider (google, microsoft, apple)
   - access_token
   - refresh_token
   - expiry
   - calendar_id
   - is_primary

8. **payment_transactions**
   - id (primary key)
   - booking_id (foreign key)
   - amount
   - currency
   - provider (stripe, paypal)
   - transaction_id
   - status
   - fee
   - payout_status
   - created_at

9. **forms**
   - id (primary key)
   - appointment_type_id (foreign key)
   - title
   - is_required

10. **form_fields**
    - id (primary key)
    - form_id (foreign key)
    - label
    - type (text, select, checkbox, etc.)
    - options (for select types)
    - is_required
    - order

11. **form_responses**
    - id (primary key)
    - booking_id (foreign key)
    - form_field_id (foreign key)
    - response_value

### Views & Functions
- **provider_availability_view**: Combines calendar connections, availability, and blackout dates
- **upcoming_bookings_view**: Shows all upcoming bookings with client details
- **revenue_report_function**: Calculates earnings over specified periods

## User Flows

### Service Provider Flow
1. Provider signs up and creates account
2. Connects calendar(s) and sets availability
3. Creates appointment types (free and/or paid)
4. Customizes booking page and forms
5. Shares booking link with clients
6. Receives and manages appointments
7. (For paid appointments) Receives payments

### Client Booking Flow
1. Client visits provider's booking page
2. Selects service/appointment type
3. Views available time slots based on provider's availability
4. Selects preferred time slot
5. Fills out booking form
6. (For paid appointments) Enters payment information
7. Receives confirmation and calendar invite

## AI Features Implementation

### Intelligent Scheduling
- **Data Collection**: Analyze past booking patterns, cancellations, and rescheduling
- **DeepSeek Implementation**: Train model on optimal meeting clustering and provider productivity patterns
- **Features**:
  - Suggest best times for specific meeting types
  - Recommend buffer adjustments based on past meeting overruns
  - Optimize availability for provider energy levels

### Smart Intake Forms
- **Data Analysis**: Process form responses across similar service types
- **DeepSeek Implementation**: Natural language processing to identify key information needs
- **Features**:
  - Dynamic form field suggestions based on appointment type
  - Auto-categorization of client needs from intake responses
  - Priority flagging for urgent appointment requests

### Business Intelligence
- **Data Utilization**: Aggregate booking patterns, client demographics, and revenue
- **DeepSeek Implementation**: Predictive analytics for business optimization
- **Features**:
  - Service pricing recommendations
  - Availability optimization suggestions
  - Client retention insights
  - Marketing opportunity identification

## Development Roadmap

### Phase 1: MVP (Months 1-3)
- Core user accounts and profiles
- Google Calendar integration
- Free appointment booking functionality
- Simple booking page customization
- Email notifications via Nodemailer with Google Workspace SMTP
- Mobile-responsive design

### Phase 2: Payment Integration (Months 4-5)
- Stripe payment processing
- Paid appointment types
- Basic reporting
- Cancellation policies
- Expanded notification options

### Phase 3: AI Enhancement (Months 6-8)
- DeepSeek AI integration
- Intelligent scheduling suggestions
- Initial smart form capabilities
- Basic analytics dashboard

### Phase 4: Advanced Features (Months 9-12)
- Additional calendar integrations (Microsoft/Apple, only if high user demand)
- Group booking options
- Advanced customization
- Additional payment methods
- Full AI feature suite
- API for developers
- Direct video conferencing integrations (if demanded by users)

## Monetization Strategy

### Pricing Tiers
1. **Free Tier**
   - Up to 5 appointments per month
   - 1 calendar connection
   - Basic customization
   - Email confirmations only

2. **Professional Tier ($12/month)**
   - Unlimited appointments
   - Multiple calendars
   - Advanced customization
   - Enhanced email reminders (more frequent)
   - Basic AI features
   - Payment acceptance (2% fee)

3. **Business Tier ($25/month)**
   - Everything in Professional
   - Team management
   - Advanced AI scheduling
   - White-labeling options
   - Lower payment fees (1%)
   - Priority support

4. **Enterprise Tier (Custom pricing)**
   - Custom integration options
   - Dedicated account manager
   - API access
   - Custom branding
   - Volume discounts

### Revenue Streams
- Subscription fees
- Transaction fees on paid appointments
- Premium add-ons
- API usage for enterprise clients

## Marketing & Growth Strategy

### Initial Launch
- Focus on specific professional niches (lawyers, consultants, coaches)
- Highlight AI-powered scheduling as a key differentiator
- Emphasize affordability vs. Calendly
- Showcase payment capability for consultants

### Growth Tactics
- Referral program for existing users
- SEO optimization for booking-related keywords
- Content marketing on scheduling efficiency
- Partnerships with professional organizations
- Limited-time promotional pricing

## Conclusion

Skidulo.com represents a comprehensive solution for appointment scheduling that combines the best features of existing platforms with innovative AI capabilities. By leveraging Supabase for the backend, Google Calendar for integration, Stripe for payments, and DeepSeek AI for intelligent features, the platform offers a compelling alternative to Calendly at a more affordable price point.

The focus on both free and paid appointment types provides flexibility for various service providers, while the AI-powered features create a unique selling proposition in a competitive market. With careful phased development and targeted marketing, Skidulo.com is positioned to capture market share from users seeking more intelligent and cost-effective scheduling solutions.