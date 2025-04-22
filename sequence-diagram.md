# AHP3 Send Proposal Flow Sequence Diagram

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

## Proposal Submission Process Details

### User Flow
1. User completes all required confirmation checkboxes:
   - "What has been entered is true to the best of my knowledge"
   - "I have read and understand the full proposal including terms and conditions"
2. User clicks the "Send Proposal" button (only enabled when both checkboxes are checked)
3. System shows a success notification confirming the email was sent
4. System redirects user to the submissions dashboard after a brief delay

### Technical Implementation

#### Frontend Components Involved
- **ConfirmProposalPage**: Main page component handling the proposal workflow
- **Notification Component**: UI element that displays status messages
- **Button Component**: UI element that triggers the proposal submission
- **Zustand Stores**: State management for the submission data

#### Data Flow
1. **State Management**:
   - Checkbox states are managed via React useState hooks
   - Submission data is stored in Zustand stores with persistence

2. **Validation**:
   - Button is conditionally enabled based on checkbox states
   - Validation ensures all required data is present before submission

3. **Submission Process**:
   - handleCreateProposal function orchestrates the submission
   - Shows notification via state update (setNotification)
   - Delays redirect to allow notification viewing
   - Navigates to dashboard via Next.js Router

4. **Behind the Scenes**:
   - Backend API processes the submission
   - Emails are generated and sent to contact email address
   - Proposal data is stored in database with status tracking
   - Dashboard data is updated to reflect new submission

### State Transitions

1. **Submission State**: Active → Pending → Submitted
2. **UI State**: Form → Processing → Success Notification → Dashboard
3. **Data State**: Local State → API Submission → Database Record
