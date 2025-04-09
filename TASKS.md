Project Setup & Core:
[ ] Finalize UI/UX wireframes and design system based on theme.ts, constants/colors.ts, constants/fonts.ts.
[x] Set up Supabase project (Auth, Database, Storage).
[x] Implement base navigation structure using Expo Router (as seen in app subfolders like (welcome-screens), (owner), (registrations)).
[x] Implement core UI components (Button, InputField, Card, Modal, etc. - check components/ui/).
[x] Set up AuthContext (contexts/AuthContext.tsx) for managing user sessions.
[x] Implement basic ThemeContext (contexts/ThemeContext.tsx).
[x] Implement NotificationContext (contexts/NotificationContext.tsx) and integrate Expo Notifications.
[x] Define all necessary TypeScript types (check types/).

Authentication & Onboarding:
[x] Implement Welcome Screen (app/(welcome-screens)/WelcomeScreen.tsx).
[x] Implement Onboarding Screen (app/(welcome-screens)/OnboardingScreen.tsx).
[x] Implement Login Screen (app/(auth)/login.tsx) with LoginForm (components/forms/LoginForm.tsx).
[x] Implement Signup Screen (app/(auth)/sign-up.tsx) with SignupForm (components/forms/SignupForm.tsx).
[x] Implement Forgot Password Screen (app/(auth)/forgot-password.tsx).
[x] Implement Role Selection Screen (app/(auth)/(registrations)/role-selection.tsx) using RoleCard (components/ui/RoleCard.tsx).
[x] Implement dynamic routing based on user role after login.

Owner Registration:
[x] Implement Owner Details screen (app/(auth)/register-owner/personal-info.tsx).
[x] Implement Gym Details screen (app/(auth)/(registrations)/(register-owner)/gym-details.tsx).
[x] Implement Gym Facilities screen (app/(auth)/(registrations)/(register-owner)/gym-facilities.tsx).
[x] Implement Gym Pricing screen (app/(auth)/(registrations)/(register-owner)/gym-pricing.tsx) including plan/discount creation (using insert_membership_plan, insert_discount from DB_helper_Funcs.md).
[x] Implement Gym Capacity screen (app/(auth)/(registrations)/(register-owner)/gym-capacity.tsx) for setting limits and peak hours.
[ ] Implement Owner Registration Confirmation Screen (app/(auth)/(registrations)/(register-owner)/ConfirmationScreen.tsx).

Member Registration:
[x] Implement Member Details screen (app/(auth)/(registrations)/register-member.tsx).
[ ] Implement Membership Plan selection screen (app/(auth)/(registrations)/(register-member)/membership-plan.tsx).
[ ] Implement Payment Details screen (showing QR code) (app/(auth)/(registrations)/(register-member)/payment-details.tsx).
[ ] Implement Member Registration Confirmation Screen (app/(auth)/(registrations)/(register-member)/ConfirmationScreen.tsx).

Gym Owner Features:
[x] Implement Owner Dashboard (app/(auth)/(owner)/dashboard.tsx) showing key metrics.
[x] Implement Membership Management (Add/Edit/Delete Members, Track Status) in app/(auth)/(owner)/manage.tsx.
[ ] Implement Renewal Reminder logic (Push Notifications/Emails).
[ ] Implement Attendance Tracking (QR Scanner integration, Reports) - potentially in manage.tsx or a dedicated screen.
[ ] Implement Irregular Attendance Alert logic.
[ ] Implement Capacity Management (Live Traffic View using Supabase Realtime, Set Limits) - likely on dashboard.tsx and manage.tsx.
[x] Implement Billing & Payments (Invoice Generation - PDF, Payment History, Manual Confirmation) in app/(auth)/(owner)/billing.tsx.
[ ] Implement Bulk Invoice Download feature.
[ ] Implement Member Document Management (View, Approve/Reject) in app/(auth)/(owner)/manage.tsx or member detail view.
[x] Implement Reports & Analytics screen (app/(auth)/(owner)/analytics.tsx) using chart components (components/charts/).
[x] Implement Owner Profile screen (app/(auth)/(owner)/profile.tsx).
[ ] Implement Owner Notifications screen (app/(auth)/(owner)/notifications.tsx).

Trainer Features:
[x] Implement Trainer Dashboard (app/(auth)/(trainer)/dashboard.tsx).
[ ] Implement Client Progress Tracking (Log Workouts, Share Reports, Set Goals) - potentially in a client detail screen linked from the dashboard.
[x] Implement Class Scheduling (app/(auth)/(trainer)/schedule.tsx) (Calendar View, Manage Classes).
[ ] Implement Class Attendance Tracking (QR or manual).
[x] Implement Workout Plan Sharing feature (app/(auth)/(trainer)/workouts.tsx).
[x] Implement Trainer Profile screen (app/(auth)/(trainer)/profile.tsx).

Member Features:
[x] Implement Member Dashboard (app/(auth)/(member)/dashboard.tsx) (View Membership, Payment History).
[x] Implement Payment Screen (View/Scan Owner UPI QR) (app/(auth)/(member)/payments.tsx).
[ ] Implement Invoice Download feature.
[ ] Implement ID Proof Upload feature.
[ ] Implement Document Status Tracking.
[x] Implement Class Booking (View, Book, Cancel/Reschedule) (app/(auth)/(member)/classes.tsx).
[x] Implement Workout Tracking (Log Workouts, View Progress, Set Goals) (app/(auth)/(member)/workouts.tsx).
[ ] Implement Gym Traffic View (Live Traffic, Peak Hours).
[ ] Implement Crowd Notification logic.
[x] Implement Member Profile/Settings screen (app/(auth)/(member)/profile.tsx).

AI Features:
[ ] Integrate Google Gemini 1.5 Pro API (lib integration).
[ ] Implement AI Chatbot for FAQs (Member section).
[ ] Implement AI Insights for Owners (Peak hours, revenue, engagement) (app/(auth)/(owner)/analytics.tsx).
[ ] Implement Capacity Prediction feature (Owner dashboard/analytics).
[ ] Implement Class Scheduling Suggestions (Trainer section).
[ ] Implement Personalized Workout/Class Recommendations (Member section).
[ ] Implement Personalized Fitness Tips (Member section).
[ ] Implement Member-specific analytics insights for Owners (requirements.md#L448).

Non-Functional & Deployment:
[ ] Implement Data Encryption checks for sensitive data.
[x] Implement comprehensive RLS policies (verify RLS.md covers all tables and access patterns).
[ ] Implement Multi-Language Support (i18n library).
[ ] Performance Optimization (Load time < 3s, handle concurrent users).
[ ] Scalability Testing (Simulate target gyms/members).
[ ] Set up Database Backups in Supabase.
[ ] Conduct Beta Testing.
[ ] Prepare for App Store & Google Play deployment.
[ ] Set up third-party analytics (Google Analytics, Mixpanel).
