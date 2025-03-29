## **Folder Structure**
GymBuddyV2.0/
├── app/
│   ├── (auth)/                      # Auth stack
│   │   ├── login.tsx                # Login screen
│   │   ├── register.tsx             # Role selection screen
│   │   ├── register-member.tsx      # Member registration screen
│   │   ├── register-owner/          # Owner registration stack
│   │   │   ├── personal-info.tsx    # Owner personal info screen
│   │   │   ├── gym-details.tsx      # Gym details screen
│   │   │   ├── gym-facilities.tsx   # Gym facilities screen
│   │   │   ├── gym-pricing.tsx      # Gym pricing screen
│   │   │   ├── gym-capacity.tsx     # Gym capacity screen
│   │   │   └── _layout.tsx          # Stack layout for owner registration
│   │   ├── register-trainer.tsx     # Trainer registration screen
│   │   ├── forgot-password.tsx      # Forgot password screen
│   │   └── _layout.tsx              # Stack layout for auth
│   ├── (welcome screens)/           # Onboarding stack
│   │   ├── index.tsx                # Onboarding screen
│   │   └── _layout.tsx              # Stack layout for onboarding
│   ├── (member)/                    # Member tabs
│   │   ├── [memberId]/              # Dynamic route for each member
│   │   │   ├── home.tsx             # Member-specific home screen
│   │   │   ├── workouts/            # Workouts feature
│   │   │   │   ├── index.tsx        # Workouts list (uses WorkoutCard)
│   │   │   │   └── [workoutId].tsx  # Workout details screen
│   │   │   ├── profile.tsx          # Profile screen (uses ProfileForm)
│   │   │   ├── payments/            # Payments feature
│   │   │   │   ├── index.tsx        # Payment history (uses PaymentCard)
│   │   │   │   └── [invoiceId].tsx  # Invoice details screen
│   │   │   ├── documents/           # Documents feature
│   │   │   │   ├── index.tsx        # Documents list (uses DocumentCard)
│   │   │   │   └── [documentId].tsx # Document details screen
│   │   │   ├── classes/             # Classes feature
│   │   │   │   ├── index.tsx        # Class list (uses GymClassCard)
│   │   │   │   └── [classId].tsx    # Class details screen
│   │   │   └── _layout.tsx          # Member tab layout
│   │   └── _layout.tsx              # Root layout for member stack
│   ├── (trainer)/                   # Trainer tabs
│   │   ├── [trainerId]/             # Dynamic route for each trainer
│   │   │   ├── dashboard.tsx        # Trainer-specific dashboard
│   │   │   ├── clients/             # Clients feature
│   │   │   │   ├── index.tsx        # Client list (uses ClientCard)
│   │   │   │   └── [clientId].tsx   # Client details screen
│   │   │   ├── classes/             # Classes feature
│   │   │   │   ├── index.tsx        # Class list (uses ClassCard)
│   │   │   │   └── [classId].tsx    # Class details screen
│   │   │   └── _layout.tsx          # Trainer tab layout
│   │   └── _layout.tsx              # Root layout for trainer stack
│   ├── (owner)/                     # Owner tabs 
│   │   │   ├── dashboard.tsx        # Owner dashboard
│   │   │   ├── manage/              # Management feature
│   │   │   │   ├── index.tsx        # Member list (uses MemberCard)
│   │   │   │   └── [memberId].tsx   # Member details screen
│   │   │   ├── analytics/           # Analytics feature
│   │   │   │   ├── reports/         # Reports feature
│   │   │   │   ├── index.tsx        # Reports list (uses ReportCard)
│   │   │   │   └── [reportId].tsx   # Report details screen
│   │   │   ├── billing/             # Billing feature
│   │   │   │   ├── index.tsx        # Billing list (uses InvoiceCard)
│   │   │   │   └── [invoiceId].tsx  # Invoice details screen
│   │   │   │   ├── index.tsx        # Analytics dashboard (uses RevenueChart, AttendanceChart)
│   │   │   │   └── [memberId].tsx   # Member-specific analytics
│   │   │   └── _layout.tsx          # Owner tab layout
│   │   └── _layout.tsx              # Root layout for owner section
│   ├── _layout.tsx                  # Root layout
│   └── index.tsx                    # Entry point (redirects to onboarding or role-based screens)
├── components/                      # Reusable UI elements
│   ├── ui/                          # Common UI components
│   │   ├── button.tsx               # Custom button component
│   │   ├── calendar.tsx             # Interactive calendar component
│   │   ├── input.tsx                # Custom input component
│   │   ├── chart.tsx                # Data visualization charts
│   │   ├── modal.tsx                # Reusable modal component
│   │   ├── tabs.tsx                 # Tabbed interface component
│   │   ├── accordion.tsx            # Collapsible section component
│   │   ├── file-upload.tsx          # Universal file upload component
│   │   ├── payment-modal.tsx        # Payment method and success modal
│   │   └── loader.tsx               # Skeleton loading component
│   └── role-specific/               # Role-specific components
│       ├── member/                  # Member-specific components
│       │   ├── WorkoutCard.tsx      # Tapping navigates to /workouts/[workoutId]
│       │   ├── PaymentCard.tsx      # Tapping navigates to /payments/[invoiceId]
│       │   ├── DocumentCard.tsx     # Tapping navigates to /documents/[documentId]
│       │   ├── GymClassCard.tsx     # Tapping navigates to /classes/[classId]
│       │   ├── ProfileForm.tsx      # Profile form component
│       │   ├── ProgressChart.tsx    # Progress chart component
│       │   └── CapacityIndicator.tsx # Live gym capacity indicator
│       ├── trainer/                 # Trainer-specific components
│       │   ├── ClientCard.tsx       # Tapping navigates to /clients/[clientId]
│       │   ├── ClassCard.tsx        # Tapping navigates to /classes/[classId]
│       │   ├── ProgressChart.tsx    # Progress visualization chart
│       │   └── AttendanceList.tsx   # Class attendance list
│       └── owner/                   # Owner-specific components
│           ├── MemberCard.tsx       # Tapping navigates to /manage/[memberId]
│           ├── InvoiceCard.tsx      # Tapping navigates to /billing/[invoiceId]
│           ├── ReportCard.tsx       # Tapping navigates to /reports/[reportId]
│           ├── RevenueChart.tsx     # Revenue trends chart
│           ├── AttendanceChart.tsx  # Attendance trends chart
│           └── DocumentVerification.tsx # Document verification component
├── lib/                             # Shared utilities and libraries
│   ├── supabase/                    # Supabase integration
│   │   ├── client.ts                # Supabase client initialization
│   │   ├── types.ts                 # Database schema types
│   │   ├── auth.ts                  # Auth utilities (login/logout/sessions)
│   │   ├── subscriptions.ts         # Realtime data subscriptions
│   │   └── queries/                 # Database CRUD operations
│   │       ├── members.ts           # Member-related queries
│   │       ├── attendance.ts        # Attendance-related queries
│   │       ├── classes.ts           # Class-related queries
│   │       ├── payments.ts          # Payment-related queries
│   │       ├── workouts.ts          # Workout-related queries
│   │       └── trainers.ts          # Trainer-related queries
│   ├── api/                         # API service layer
│   │   ├── auth.ts                  # Auth API calls
│   │   ├── members.ts               # Member API calls
│   │   ├── trainers.ts              # Trainer API calls
│   │   ├── classes.ts               # Class API calls
│   │   ├── payments.ts              # Payment API calls
│   │   └── documents.ts             # Document upload/verification API calls
│   ├── utils/                       # Utility functions
│   │   ├── date.ts                  # Date formatting utilities
│   │   ├── validation.ts            # Form validation utilities
│   │   ├── permissions.ts           # Role-based permission checks
│   │   ├── qr.ts                    # QR code utilities
│   │   ├── pdf.ts                   # PDF generation utilities
│   │   └── helpers.ts               # General helper functions
│   └── ai/                          # AI integration
│       ├── gemini.ts                # Google Gemini 1.5 Pro integration
│       ├── chatbot.ts               # AI chatbot logic
│       └── insights.ts              # AI insights and analytics
├── types/                           # TypeScript type definitions
│   ├── database.d.ts                # Supabase-generated DB types
│   ├── app-types.ts                 # Custom app types
│   ├── api-types.ts                 # API response/request types
│   └── ai-types.ts                  # AI-related types
├── hooks/                           # Custom React hooks
│   ├── use-auth.ts                  # Authentication state hook
│   ├── use-subscription.ts          # Realtime data subscription hook
│   ├── use-query.ts                 # Data fetching/caching hook
│   ├── use-permissions.ts           # Role-based permissions hook
│   └── use-ai.ts                    # AI integration hook
├── constants/                       # App constants
│   ├── supabase.ts                  # Supabase config constants
│   ├── roles.ts                     # User role definitions
│   ├── routes.ts                    # App route configuration
│   ├── theme.ts                     # App theme (colors, fonts, etc.)
│   └── ai.ts                        # AI configuration constants
├── assets/                          # Static assets
│   ├── images/                      # Optimized images
│   │   ├── logo.png                 # App logo
│   │   ├── workout-placeholder.jpg  # Placeholder workout image
│   │   └── gym-map.png              # Gym map image
│   └── locales/                     # Localization files
│       ├── en.json                  # English translations
│       ├── hi.json                  # Hindi translations
│       └── index.ts                 # Locale initialization
├── services/                        # Business logic/services
│   ├── billing.ts                   # Payment gateway integration
│   ├── notifications.ts             # Push/email notification service
│   ├── ai.ts                        # Gemini AI integration logic
│   ├── analytics.ts                 # Analytics service (tracking, logging)
│   └── documents.ts                 # Document management service
├── contexts/                        # React contexts
│   ├── auth-context.tsx             # Auth state context
│   ├── theme-context.tsx            # Theme state context
│   └── user-context.tsx             # User data context
├── package.json                     # Project dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
└── app.json                         # Expo app configuration