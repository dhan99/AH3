# AHP3 Next.js Application Architecture

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

## Architecture Components Explanation

### Client-Side
- **Browser Client**: End-user interface accessing the application

### Next.js Framework
- **App Router**: Next.js 13+ App Router structure for routing and page organization
- **Pages**: Main sections of the application (Landing, Dashboard, Submission flow)

### Authentication & Database
- **Auth0**: Handles user authentication and authorization
- **Supabase**: Provides database services for storing application data

### State Management
- **Zustand**: Client-side state management library with persistence
- **Stores**:
  - **Submission Store**: Manages submission flow state (DOT info, carrier details, products)
  - **Coverage Plan Store**: Manages coverage plan configuration
  - **Loss History Store**: Manages loss history information
  - **Eligibility Store**: Manages eligibility criteria and validation

### Component Structure
- **UI Components**: Common UI elements like buttons, notifications, forms
- **Domain-Specific Components**:
  - **Landing Components**: Homepage elements
  - **Dashboard Components**: User dashboard elements
  - **Submission Components**: Insurance submission flow components

### Submission Flow
- 4-step process:
  1. **Start New Submission**: Initial carrier and product selection
  2. **Eligibility**: Qualification check for insurance products
  3. **Coverage and Plan Design**: Configure coverage details
  4. **Confirm and Create Proposal**: Review and submit insurance proposal

## Data Flow

1. User authenticates via Auth0
2. Application loads initial state from local storage (persisted Zustand stores)
3. User navigates through the submission flow
4. Each step updates the relevant stores
5. Data is persisted to local storage and synchronized with Supabase as needed
6. On proposal submission, data is sent to backend services
7. Notification system provides feedback on operations (success/error)

## Technical Features

- **Client-side state persistence** using Zustand's persist middleware
- **Form validation** at each step of the submission flow
- **UI component library** for consistent design
- **Responsive design** for all device types
- **Progressive form completion** with ability to save and resume
- **Multi-step wizard pattern** for complex form submission
