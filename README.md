Mini Wallet Application

A Mini Wallet web application built with React + Vite that allows users to manage wallet balance, add money, transfer funds to other users, and view transaction history with clear UI states and business rule enforcement.

This project uses a mock backend powered by json-server and focuses on clean architecture, predictable state handling, and graceful UX.

Features
Dashboard

View current wallet balance (derived from transactions)

View recent transaction history

Loading, error, and empty states

Add Money

Add funds to wallet using a simple form

Validates positive numeric input

Creates a credit transaction

Shows processing and success feedback

Transfer Money

Transfer money to another user

Configurable transaction fee (default 2%)

Enforces maximum per-transaction limit (10,000)

Validates sufficient wallet balance

Confirmation modal before final submission

Simulates success/failure scenarios

Records:

debit transaction

corresponding fee transaction

Transaction History

List of transactions with:

Status (pending / success / failed)

Date & time

Amount and fee (grouped with debit)

Filters:

Status

Date range

Soft delete support (removes from UI only, balance unchanged)

Empty state when no results match filters

UX & Error Handling

Global loading screen

Inline validation errors

Toast notifications for success/failure

Confirmation dialogs for destructive actions

Tech Stack
Frontend

React 19

Vite

React Hooks

Axios

Day.js

React Toastify

Backend (Mock)

json-server

JSON file storage

Tooling

ESLint

Jest + Testing Library (configured)

Architecture Overview
src/
├─ api/ # Axios instance
├─ hooks/ # Business logic & data fetching
│ ├─ configure.js # Fetches fee & limit config
│ └─ transac.js # Transactions, users, balance logic
├─ components/
│ ├─ Actions.jsx # Loading, ErrorState, AddMoney
│ ├─ TransferMoney.jsx
│ └─ TransactionHistory.jsx
├─ App.jsx # App shell & view orchestration
└─ main.jsx # App entry

Key Design Decisions

Balance is derived, not stored:
credits - debits - fees (only successful transactions)

Business rules are config-driven via /config API

Soft delete preserves data integrity

Custom hooks encapsulate domain logic cleanly

Business Rules
Rule Description
Fee Default 2% of transfer amount
Limit Max transfer amount 10,000
Status pending → success / failed
Fee reversal Fee marked failed when transfer fails

All rules are configurable via data.json.

Mock API

Powered by json-server.

Endpoints Used

GET /users

GET /config

GET /transactions

POST /transactions

PATCH /transactions/:id

DELETE /transactions/:id (soft delete via patch)

Setup & Run

1. Install dependencies
   npm install

2. Start mock API
   npx json-server --watch data.json --port 4000

3. Start frontend
   npm run dev

App will be available at:

http://localhost:5173

Scripts
Command Description
npm run dev Start Vite dev server
npm run build Production build
npm run preview Preview build
npm run lint Run ESLint
Assumptions

Single wallet (no authentication)

Balance is derived from transaction history

Transfer failures are simulated randomly

Deleted transactions should not affect balance

Fee is always charged with a transfer attempt

Known Limitations

No real authentication or authorization

No persistent backend (mock only)

No pagination on large transaction lists

Failure simulation is random, not deterministic

Testing

Jest and React Testing Library are used for testing.

Covered Tests:

- Unit and component tests for core UI and business logic:
  - Add Money validation and submission
  - Transfer Money validation (limit, balance, fee calculation)
  - Transaction History rendering, filtering, and deletion
- Business rule enforcement (fee calculation and transaction limits)
- One integration test covering the critical money transfer flow:
  - User initiates transfer
  - Confirmation modal
  - Transaction creation
  - Balance and history UI update

Total:

- 12 unit/component tests
- 1 integration test for the most critical user flow

Testing focuses on correctness, business rules, and user-visible behavior rather than implementation details.
