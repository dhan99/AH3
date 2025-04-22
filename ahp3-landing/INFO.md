# AHP3 System Architecture Documentation

This document provides a comprehensive view of the AHP3 Next.js application architecture from multiple perspectives.

## Table of Contents

1. [System Overview](#system-overview)
2. [Component Architecture](#component-architecture)
3. [System Interactions](#system-interactions)
4. [Feature Implementations](#feature-implementations)
   - [Send Proposal Feature](#send-proposal-feature)
5. [Technical Stack](#technical-stack)
6. [Development Patterns](#development-patterns)
7. [Diagrams](#diagrams)
   - [System Architecture Diagram](#system-architecture-diagram)
   - [Component Structure Diagram](#component-structure-diagram)
   - [Send Proposal Sequence Diagram](#send-proposal-sequence-diagram)

## System Overview

AHP3 is a Next.js-based web application designed for insurance submission and proposals. The system follows a modern React architecture with Next.js 13+ App Router, client-side state management using Zustand, and external services integration including Auth0 for authentication and Supabase for database storage.

The application enables users to:
- Create insurance submissions
- Navigate through a multi-step qualification process
- Configure coverage plans
- Generate and send proposals to motor carriers
- Track submission status through a dashboard

## Component Architecture

The application uses a component-based architecture with several layers:

### UI Layer
- **UI Components**: Reusable, presentational components (buttons, notifications, forms)
- **Domain Components**: Business-domain specific components grouped by function:
  - Submission-related components
  - Dashboard-related components
  - Landing page components

### Page Layer
- Next.js page components representing routes in the application
- Responsible for layout, data fetching, and composing domain components

### State Management Layer
- Zustand stores organized by domain:
  - Submission Store
  - Coverage Plan Store 
  - Loss History Store
  - Eligibility Store
- Local React state for UI-specific concerns

### Service Layer
- Authentication services (Auth0)
- Data persistence services (Supabase)
- API integrations

## System Interactions

The application primarily follows a client-side rendering model with persistent local state:

1. **Authentication Flow**:
   - User authenticates via Auth0
   - JWT tokens are managed by Auth0 SDK
   - Protected routes check authentication status

2. **Data Persistence**:
   - User session data persists in browser localStorage via Zustand persist middleware
   - Server data is synchronized with Supabase as needed
   - Form state is maintained across navigation

3. **Submission Workflow**:
   - Step-by-step wizard pattern guides users through submission process
   - Each step has validation before proceeding
   - Form data is collected and aggregated in stores
   - Final submission creates proposal and notifies motor carrier

## Feature Implementations

### Send Proposal Feature

The Send Proposal feature is implemented in the Confirm Proposal Page with the following components:

1. **UI Components**:
   - Confirmation checkboxes for user agreement
   - Send Proposal button (conditionally enabled)
   - Notification component for user feedback

2. **Workflow**:
   - User reviews proposal details across multiple tabs
   - User checks confirmation boxes
   - User clicks Send Proposal button when enabled
   - System displays notification confirming email was sent
   - System redirects to dashboard after brief delay

3. **Code Implementation**:
   - `handleCreateProposal` function manages the submission process
   - Notification state is updated to show success message
   - Timeout function manages delayed redirect
   - Next.js router handles navigation to dashboard

## Technical Stack

- **Frontend Framework**: Next.js 13+ with App Router
- **UI Library**: React
- **State Management**: Zustand with persist middleware
- **Styling**: Tailwind CSS
- **Authentication**: Auth0
- **Database**: Supabase
- **Type Safety**: TypeScript
- **Testing**: Jest and React Testing Library

## Development Patterns

The application implements several key development patterns:

1. **Custom Hooks Pattern**:
   - Domain-specific hooks encapsulate business logic
   - Zustand store hooks provide centralized state access

2. **Component Composition Pattern**:
   - Small, reusable UI components composed into larger features
   - Clear separation between UI and container components

3. **Multi-Step Form Pattern**:
   - Progressive disclosure of form fields
   - State persistence between steps
   - Validation at each step

4. **Notification Pattern**:
   - Centralized notification system
   - Temporary, non-intrusive user feedback
   - Automatic dismissal with manual override

5. **Progressive Enhancement**:
   - Core functionality works without JavaScript
   - Enhanced experience with client-side interactions

## Diagrams

### System Architecture Diagram

```mermaid
graph TB
    %% Client-Side Components
    Client([Client Browser])
    
    %% Next.js Application
    NextApp[Next.js Application]
    
    %% App Router Structure
    AppRouter[App Router]

    %% Main Pages
    LandingPage[Landing Page]
    DashboardPage[Dashboard Page]
    SubmissionPage[Submission Flow Pages]
    
    %% Auth & Backend Services
    Auth0[Auth0 Authentication]
    Supabase[(Supabase Database)]
    
    %% Store & State Management
    ZustandStore[Zustand State Management]
    
    %% Individual Stores
    SubmissionStore[Submission Store]
    CoveragePlanStore[Coverage Plan Store]
    LossHistoryStore[Loss History Store]
    EligibilityStore[Eligibility Store]
    
    %% UI Components Structure
    UIComponents[UI Components]
    SubmissionComponents[Submission Components]
    DashboardComponents[Dashboard Components]
    LandingComponents[Landing Components]
    
    %% Connections from Client to App
    Client --> NextApp
    
    %% Next.js Structure
    NextApp --> AppRouter
    AppRouter --> LandingPage
    AppRouter --> DashboardPage
    AppRouter --> SubmissionPage
    
    %% Auth Connections
    NextApp <--> Auth0
    
    %% Database Connections
    NextApp <--> Supabase
    
    %% State Management
    NextApp <--> ZustandStore
    ZustandStore --> SubmissionStore
    ZustandStore --> CoveragePlanStore
    ZustandStore --> LossHistoryStore
    ZustandStore --> EligibilityStore
    
    %% Component Usage
    LandingPage --> LandingComponents
    DashboardPage --> DashboardComponents
    SubmissionPage --> SubmissionComponents
    
    %% UI Components
    LandingComponents --> UIComponents
    DashboardComponents --> UIComponents
    SubmissionComponents --> UIComponents
    
    %% Submission Flow Details
    subgraph "Submission Flow"
        SubmissionStart[Start New Submission]
        Eligibility[Eligibility Check]
        CoveragePlan[Coverage and Plan Design]
        ConfirmProposal[Confirm and Create Proposal]
        
        SubmissionStart --> Eligibility
        Eligibility --> CoveragePlan
        CoveragePlan --> ConfirmProposal
    end
    
    SubmissionPage --> SubmissionFlow
    
    %% Stores Connections to Pages
    SubmissionStore <-.-> SubmissionPage
    CoveragePlanStore <-.-> SubmissionPage
    LossHistoryStore <-.-> SubmissionPage
    EligibilityStore <-.-> SubmissionPage

    %% Legend
    classDef page fill:#f9f,stroke:#333,stroke-width:2px;
    classDef service fill:#bbf,stroke:#33f,stroke-width:2px;
    classDef store fill:#bfb,stroke:#3b3,stroke-width:2px;
    classDef component fill:#fbb,stroke:#b33,stroke-width:2px;
    
    class LandingPage,DashboardPage,SubmissionPage page;
    class Auth0,Supabase service;
    class ZustandStore,SubmissionStore,CoveragePlanStore,LossHistoryStore,EligibilityStore store;
    class UIComponents,SubmissionComponents,DashboardComponents,LandingComponents component;
```

### Component Structure Diagram

```mermaid
classDiagram
    %% Main Layout Components
    class Layout {
        +Header
        +Main Content
        +Footer
    }
    
    %% Provider Components
    class Providers {
        +Auth0Provider
        +MockAuthProvider
        +Other Context Providers
    }
    
    %% UI Components
    class UIComponents {
        +Button
        +Notification
        +ResponsiveImage
        +Other UI components
    }
    
    %% Domain Components
    class SubmissionComponents {
        +Breadcrumb
        +ProgressStepper
        +ProductCard
        +ProductDetails
        +SubmissionCard
        +MotorCarrierContact
        +CustomerInfoCard
    }
    
    class DashboardComponents {
        +Header
        +MainNavigation
        +StatusTabs
        +TaskList
        +ActivityFeed
    }
    
    %% Page Components
    class ConfirmProposalPage {
        -router: useRouter()
        -authUser: useMockAuth()
        -notification: useState()
        -activeTab: useState()
        -expandedSections: useState()
        -confirmationChecks: useState()
        +handlePreviousStep()
        +handleEditNavigation()
        +handleCreateProposal()
        +handleTabChange()
        +toggleSection()
        +handleCheckboxChange()
        +render()
    }
    
    %% Stores
    class ZustandStores {
        +useSubmissionStore
        +useCoveragePlanValueStore
        +useLossHistoryStore
        +useEligibilityStore
    }
    
    %% Relationships
    Layout --> Providers : contains
    Layout --> UIComponents : uses
    Layout --> SubmissionComponents : uses for submission flow
    Layout --> DashboardComponents : uses for dashboard
    
    ConfirmProposalPage --> UIComponents : uses Button, Notification
    ConfirmProposalPage --> SubmissionComponents : uses Breadcrumb, ProgressStepper
    ConfirmProposalPage --> DashboardComponents : uses Header
    ConfirmProposalPage --> ZustandStores : uses for state management
    
    SubmissionComponents --> UIComponents : uses base components
    DashboardComponents --> UIComponents : uses base components
```

### Send Proposal Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant UI as UI Components
    participant PropPage as Confirm Proposal Page
    participant Store as Zustand Stores
    participant API as Backend API
    participant DB as Supabase

    User->>UI: Checks confirmation boxes
    User->>UI: Clicks "Send Proposal" button
    
    UI->>PropPage: Triggers handleCreateProposal()
    
    PropPage->>UI: Shows notification
    Note over PropPage,UI: "Email is sent to contact email address requesting<br/>to Motor Carrier to accept the proposal"
    
    PropPage->>API: Sends proposal data to backend
    API->>DB: Stores proposal data
    API->>API: Processes proposal submission
    API->>API: Generates email to Motor Carrier
    
    PropPage->>Store: Resets submission state if needed
    
    PropPage->>UI: Redirects to dashboard/submissions page
    UI->>User: Shows dashboard with updated submission
    
    Note over User,DB: The actual email delivery and background processes<br/>happen asynchronously after user is redirected
```

## Conclusion

The AHP3 application demonstrates a modern, component-based architecture that leverages Next.js, Zustand, and external services to create a robust insurance submission platform. The architecture prioritizes:

1. **User Experience**: Multi-step form with persistent state and clear navigation
2. **Code Organization**: Logical separation of concerns across components and stores
3. **Maintainability**: Reusable components and centralized state management
4. **Extensibility**: Clean abstractions that allow for adding new features

This architecture enables rapid development of new features while maintaining a clean and maintainable codebase.
