Here’s a **more detailed and comprehensive requirements list** for Kez Ai Technologies' Gym Management SaaS app

---

## **Updated Requirements List**

### **1. Project Overview**

#### **Objective**

Develop a **Gym Management SaaS mobile app** tailored for small and medium-sized gyms in India. The app will streamline gym operations, provide AI-driven insights, and enhance the experience for gym owners, trainers, and members.

#### **Target Audience**

-   **Gym Owners**: Manage memberships, attendance, capacity, billing, and member documents.
-   **Trainers**: Track client progress and schedule classes.
-   **Members**: Book classes, track workouts, check gym traffic, and manage payments.

#### **Subscription Model**

-   **Annual Subscription**: ₹36,000/year.
-   **Free Trial**: 30 days to onboard gyms and gather feedback.

#### **Key Goals**

-   Simplify gym management tasks (membership, attendance, capacity tracking).
-   Provide AI-driven insights and assistance.
-   Enhance user experience for gym owners, trainers, and members.

#### **Key Metrics**

-   **Number of Gyms**: Target 1,000 gyms in the first year.
-   **Monthly Recurring Revenue (MRR)**: Target ₹3,00,000/month.
-   **User Satisfaction**: Target 4.5+ rating on app stores.

---

GymBuddy Version 2
│
├── GymBuddyV2.0/
│   ├── app/
│   │   ├── (welcome-screens)/
│   │   │   ├── index.tsx
│   │   │   ├── _layout.tsx
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── OnboardingScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── SignupScreen.tsx
│   │   │   ├── ForgotPasswordScreen.tsx
│   │   │
│   │   ├── (owner)/
│   │   │   ├── _layout.tsx
│   │   │   ├── dashboard.tsx
│   │   │   ├── billing.tsx
│   │   │   ├── manage.tsx
│   │   │   ├── profile.tsx
│   │   │   ├── analytics.tsx
│   │   │   ├── notifications.tsx
│   │   │
│   │   ├── (registrations)/
│   │   │   ├── register-owner/
│   │   │   │   ├── gym-facilities.tsx
│   │   │   │   ├── gym-pricing.tsx
│   │   │   │   ├── gym-details.tsx
│   │   │   │   ├── owner-details.tsx
│   │   │   │   ├── _layout.tsx
│   │   │   │   ├── ConfirmationScreen.tsx
│   │   │   │
│   │   │   ├── register-member/
│   │   │   │   ├── member-details.tsx
│   │   │   │   ├── membership-plan.tsx
│   │   │   │   ├── payment-details.tsx
│   │   │   │   ├── _layout.tsx
│   │   │   │   ├── ConfirmationScreen.tsx
│   │   │
│   │   ├── _layout.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── NotificationsScreen.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── TabBar.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── InputField.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── Loader.tsx
│   │   │
│   │   ├── forms/
│   │   │   ├── OwnerRegistrationForm.tsx
│   │   │   ├── MemberRegistrationForm.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │
│   │   ├── charts/
│   │   │   ├── BarChart.tsx
│   │   │   ├── LineChart.tsx
│   │   │   ├── PieChart.tsx
│   │
│   ├── constants/
│   │   ├── theme.ts
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   ├── api-endpoints.ts
│   │   ├── roles.ts
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   ├── NotificationContext.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── supabase.ts
│   │   │   ├── auth.ts
│   │   │   ├── database.ts
│   │   │   ├── storage.ts
│   │   │
│   │   ├── utils/
│   │       ├── formatDate.ts
│   │       ├── validateInput.ts
│   │       ├── calculatePricing.ts
│   │       ├── generateUUID.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── ui-types.ts
│   │   ├── owner-types.ts
│   │   ├── member-types.ts
│   │   ├── auth-types.ts
│   │
│   ├── global.css
│   ├── app.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── babel.config.js
│
├── database_schema.md
├── claude_schema.md
├── requirements.md
├── README.md
└── .gitignore

### **2. Functional Requirements**

#### **For Gym Owners**

##### **Membership Management**

-   **Add/Edit/Delete Members**: Use a form to input member details (name, phone, email, membership type).
-   **Track Membership Status**: Use a dashboard to view active, expired, and trial memberships.
-   **Renewal Reminders**: Send automated emails and push notifications 7 days before membership expiry.

##### **Attendance Tracking**

-   **QR Code Scanning**: Use libraries like `react-native-camera` for QR code scanning.
-   **Export Reports**: Use libraries like `react-native-csv` or `pdf-lib` to generate CSV/PDF reports.
-   **Irregular Attendance Alerts**: Notify members who haven’t visited the gym in the last 7 days.

##### **Capacity Management**

-   **Live Gym Traffic**: Use real-time updates via Supabase Realtime.
-   **Capacity Notifications**: Notify members when the gym is at 80% capacity.
-   **Set Capacity Limits**: Allow gym owners to set and update capacity limits.

##### **Billing and Payments**

-   **Generate Invoices**: Use libraries like `react-native-html-to-pdf` for invoice generation.
-   **Track Payment History**: Use a dashboard to view payment history and pending dues.
-   **Manual Payment Confirmation**: Gym owners manually confirm payments and generate bills.
-   **Bulk Invoice Download**: Download invoices in bulk for accounting purposes.

##### **Member Document Management**

-   **Verify ID Proofs**: Review uploaded ID proofs (e.g., Aadhaar, PAN) in the member’s profile.
-   **Approve/Reject Documents**: Approve or reject documents with comments.

##### **Reports and Analytics**

-   **Generate Reports**: Use libraries like `chart.js` or `victory-native` for data visualization.
-   **AI Insights**: Use Google Gemini 1.5 Pro to analyze peak hours, revenue trends, and member engagement.
-   **Member Analytics**: Provide insights into member renewal patterns, attendance trends, and engagement.

---

#### **For Trainers**

##### **Client Progress Tracking**

-   **Log Workouts**: Use a form to log client workouts, progress, and goals.
-   **Share Reports**: Generate and share progress reports via email or in-app messaging.
-   **Set Goals**: Allow trainers to set and monitor fitness goals for clients.

##### **Class Scheduling**

-   **Schedule Classes**: Use a calendar view to schedule and manage group classes.
-   **Notify Clients**: Send push notifications for upcoming classes.
-   **Track Attendance**: Use QR codes or manual check-ins to track class attendance.

##### **Communication**

-   **Share Workout Plans**: Allow trainers to upload and share workout plans.

---

#### **For Members**

##### **Membership Management**

-   **View Membership Details**: Access a dashboard showing membership type, expiry date, and payment history.
-   **Make Payments**:
    -   Tap a **Pay Now** button to view the gym owner’s UPI QR code.
    -   Scan the QR code using their UPI app (e.g., Google Pay, PhonePe) to complete the payment.
-   **Download Invoices**: Download PDF invoices after payment confirmation.
-   **Upload ID Proofs**: Upload government-issued ID (e.g., Aadhaar, PAN) via a document upload feature.
-   **Track Document Status**: View approval/rejection status of uploaded ID proofs.

##### **Class Booking**

-   **View Classes**: Display available classes with filters (date, time, trainer).
-   **Book Classes**: Allow members to book classes and receive confirmation.
-   **Cancel/Reschedule**: Allow members to cancel or reschedule classes.

##### **Workout Tracking**

-   **Log Workouts**: Use a form to log workouts and track progress.
-   **View Progress**: Display progress charts and trends.
-   **Set Goals**: Allow members to set personal fitness goals.

##### **Gym Traffic**

-   **Check Traffic**: Display live gym traffic and peak hours.
-   **Crowd Notifications**: Notify members when the gym is crowded.

##### **Customer Support**

-   **AI Chatbot**: Use Google Gemini 1.5 Pro for instant support.
-   **FAQ Section**: Display common queries and solutions.

---

### **3. AI Features**

#### **AI Assistance**

-   **Chatbot**: Use Google Gemini 1.5 Pro for answering membership queries and FAQs.
-   **AI Insights**: Provide gym owners with insights on peak hours, revenue trends, and member engagement.

#### **Predictive Analytics**

-   **Capacity Prediction**: Use historical data to predict gym capacity.
-   **Class Scheduling**: Suggest optimal class schedules for trainers.

#### **Personalized Recommendations**

-   **Workout Suggestions**: Recommend workouts and classes based on member preferences and progress.
-   **Fitness Tips**: Provide personalized fitness tips and reminders.

---

### **4. Technical Specifications**

#### **Frontend**

-   **React Native**: [React Native Documentation](https://reactnative.dev/docs/getting-started).
-   **Expo Framework**: [Expo Documentation](https://docs.expo.dev/).
-   **NativeWind CSS**: [NativeWind Documentation](https://www.nativewind.dev/).
-   **Expo Router**: [Expo Router Documentation](https://docs.expo.dev/routing/introduction/).

#### **Backend**

-   **Supabase**: [Supabase Documentation](https://supabase.com/docs).

#### **AI Integration**

-   **Google Gemini 1.5 Pro**: [Google Gemini API Documentation](https://ai.google.dev/).

#### **Push Notifications**

-   **Expo Notifications**: [Expo Notifications Documentation](https://docs.expo.dev/push-notifications/overview/).

#### **Database**

-   **PostgreSQL**: [PostgreSQL Documentation](https://www.postgresql.org/docs/).

---

### **5. API Integrations**

#### **AI Services**

-   **Google Gemini 1.5 Pro**: [Google Gemini API Documentation](https://ai.google.dev/).

#### **Third-Party Analytics**

-   **Google Analytics**: [Google Analytics Documentation](https://developers.google.com/analytics).
-   **Mixpanel**: [Mixpanel Documentation](https://developer.mixpanel.com/).

---

### **6. Component Architecture**

#### **Frontend Components**

-   **Authentication**: Login, Signup, Forgot Password.
-   **Dashboard**: Overview for gym owners, trainers, and members.
-   **Membership Management**: Add, edit, and view members.
-   **Attendance Tracking**: QR code scanner, attendance logs.
-   **Class Scheduling**: Calendar view, booking system.
-   **Workout Tracking**: Log workouts, view progress.
-   **Reports**: Generate and export reports.
-   **Settings**: User profile, notifications.

#### **Backend Components**

-   **Database**: Supabase PostgreSQL.
-   **Authentication**: Supabase Auth.
-   **API Endpoints**: RESTful APIs for frontend-backend communication.
-   **AI Services**: Integration with Google Gemini 1.5 Pro.

---

### **7. Non-Functional Requirements**

#### **Performance**

-   **App Load Time**: Under 3 seconds.
-   **Concurrent Users**: Handle up to 10,000 concurrent users.

#### **Scalability**

-   **Gyms**: Support up to 1,000 gyms.
-   **Members**: Support up to 100,000 members.

#### **Security**

-   **Data Encryption**: Encrypt sensitive data (e.g., member details).
-   **Role-Based Access Control (RBAC)**: Implement RBAC for gym owners, trainers, and members.

#### **Usability**

-   **UI/UX**: Intuitive and user-friendly.
-   **Multi-Language Support**: English, Hindi, and regional languages.

#### **Reliability**

-   **Uptime**: 99.9% uptime for backend services.
-   **Backup and Recovery**: Regular database backups and recovery mechanisms.

---

### **8. Development Milestones**

#### **Phase 1: Planning and Design** (Month 1)

-   Finalize requirements and wireframes.
-   Set up development environment.

#### **Phase 2: Core Features Development** (Months 2-4)

-   Develop membership, attendance, class booking, and billing features.
-   Integrate Supabase backend.

#### **Phase 3: AI Integration** (Months 5-6)

-   Integrate Google Gemini 1.5 Pro for AI features.
-   Develop chatbot and predictive analytics.

#### **Phase 4: Testing and Launch** (Months 7-8)

-   Conduct beta testing with select gyms.
-   Launch on App Store and Google Play.

---

### **9. Risk Management**

#### **Technical Risks**

-   **AI Integration Challenges**: Mitigate by thorough testing and using Google Gemini’s robust API.
-   **Manual Payment Errors**: Mitigate with clear UI/UX for payment confirmation.

#### **Operational Risks**

-   **Low Adoption**: Mitigate by offering a 30-day free trial and onboarding support.
-   **Negative Feedback**: Mitigate by collecting and acting on user feedback during the trial period.

---

### **10. Appendix**

#### **Glossary**

-   **SaaS**: Software as a Service.
-   **MRR**: Monthly Recurring Revenue.
-   **UPI**: Unified Payments Interface.

#### **References**

-   **React Native Documentation**: [React Native Docs](https://reactnative.dev/docs/getting-started).
-   **Supabase Documentation**: [Supabase Docs](https://supabase.com/docs).
-   **Google Gemini 1.5 Pro API Documentation**: [Google Gemini API Docs](https://ai.google.dev/).
-   **Expo Documentation**: [Expo Docs](https://docs.expo.dev/).
-   **Expo Router**: [Expo Router Docs](https://docs.expo.dev/routing/introduction/).
-   **Expo Notifications**: [Expo Notifications Docs](https://docs.expo.dev/push-notifications/overview/).

---

### **Key Updates to Requirements**

1. **Member Analytics**:

    - Added a requirement for **member analytics** to provide insights into renewal patterns, attendance trends, and engagement.

2. **Dynamic Routing**:

    - Updated requirements to reflect dynamic routing for gym owners, members, and trainers.

3. **AI Insights**:

    - Expanded AI insights to include **member-specific analytics** for gym owners.

4. **Capacity Management**:

    - Added a requirement for **live gym traffic updates** and **capacity notifications**.

5. **Document Management**:
    - Added a requirement for **document verification** and **approval/rejection workflows**.

---

#### **Future Updates**

-   **Ai Analytics**: Ai powered Analytics e.g. owner views member's profile and he get overview of member renewal pattern
