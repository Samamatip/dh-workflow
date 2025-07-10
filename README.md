# DH Workflow MVP Prototype

This document outlines the Minimum Viable Product (MVP) prototype flow for the DH Workflow Overtime Management System.

## Overview

The DH Workflow system enables admins to manage overtime slots and employees to request overtime based on department, shift, and eligibility. The backend uses MongoDB, and authentication is handled via JWT.

---

## Prototype Flow

### 1. Admin Login

- **Action:** Admin navigates to the login page and enters credentials.
- **System:** Authenticates admin using JWT.
- **Outcome:** Redirects to Admin Dashboard.

### 2. Admin Dashboard

- **Action:** Admin views dashboard overview.
- **System:** Loads overtime status from MongoDB.
- **Outcome:** Displays available slots, requests, and upcoming shifts.

### 3. Upload Overtime Slots

- **Action:** Admin clicks "Upload Overtime Slots".
- **System:** Presents form for overtime details:
  - Department (dropdown)
  - Job Role (optional)
  - Shift Type (morning/evening/night)
  - Available Slots
  - Time Window
- **Outcome:** Admin submits overtime slot details.

### 4. Validate Overtime Slot Data

- **Action:** System validates input (conflicts, missing info).
- **System:**
  - If valid: Proceeds to save.
  - If invalid: Displays error message.
- **Outcome:** Admin informed of success/failure.

### 5. Confirm and Save Overtime Slots

- **Action:** Admin confirms and saves.
- **System:** Stores data in MongoDB; slots become visible to eligible employees.
- **Outcome:** Overtime slots uploaded and available.

### 6. Employee Login & View Overtime Slots

- **Action:** Employee logs in.
- **System:** Authenticates and loads Employee Dashboard.
- **Outcome:** Shows eligible overtime slots by department and shift.

### 7. Employee Requests Overtime Slot

- **Action:** Employee selects and requests a slot.
- **System:** Checks eligibility and limits.
- **Outcome:** Registers request or displays error if not eligible.

### 8. Admin Reviews Overtime Requests

- **Action:** Admin reviews requests in Overtime Management.
- **System:** Lists requests with employee, slot, and status.
- **Outcome:** Admin can approve or deny.

### 9. Approve or Deny Requests

- **Action:** Admin approves/denies request.
- **System:** Updates status and notifies employee.
- **Outcome:** Employee receives notification.

### 10. Notify Employees

- **Action:** System sends notifications.
- **System:** Email and in-app notifications.
- **Outcome:** Employees updated in real-time.

### 11. Finalize Slot Availability

- **Action:** Admin adjusts slot visibility for unfilled slots.
- **System:** Updates visibility rules.
- **Outcome:** Slots become available to other eligible employees.

### 12. Generate Reports (Optional)

- **Action:** Admin generates report.
- **System:** Downloads CSV/PDF with requests, approvals, and breakdowns.
- **Outcome:** Enables analysis and adjustment.

---

## Tech Stack

- **Backend:** Node.js, MongoDB
- **Authentication:** JWT
- **Frontend:** (Prototype, not specified)

---

## Notes

- This flow describes the MVP/prototype only.
- Future versions may include more advanced features and integrations.
