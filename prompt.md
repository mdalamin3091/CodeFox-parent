You are a senior backend architect and Node.js engineer.

I am building a multi-tenant SaaS application using:
- Node.js (Express)
- Prisma ORM
- PostgreSQL
- Better Auth (with organization plugin)
- Queue system (BullMQ preferred)

I want to implement a COMPLETE email system focusing first on:
👉 Team member invitation flow via email
But the system must be designed for FULL SaaS email management (not just invites).

---

# ⚠️ VERY IMPORTANT INSTRUCTIONS

1. DO NOT start coding immediately.
2. FIRST give me a DETAILED IMPLEMENTATION PLAN.
3. After I review and approve the plan, ONLY THEN proceed to implementation.

---

# 🧩 CONTEXT

My SaaS supports:
- Multi-tenancy (organizations)
- Each organization has:
  - Owner
  - Team members (roles & permissions exist)
- I am using Better Auth organization plugin for managing orgs and members

---

# 🎯 GOAL

Design and implement a scalable email system that includes:

### Phase 1 (must implement)
- Invite team member via email
- Accept invitation flow
- Secure token-based invitation system

### Phase 2 (design-ready, not necessarily fully implemented)
- Password reset emails
- Email verification
- Notification emails

---

# 🏗️ REQUIREMENTS

## 1. Invitation Flow

Flow should include:
- Owner invites user via email
- System creates invitation record with:
  - token (secure, hashed)
  - expiration
  - organizationId
  - role
  - email
- Email sent with invite link
- User clicks link:
  - If new user → signup + join org
  - If existing user → login + join org
- Token validation:
  - expiration check
  - already used check
  - email match check

---

## 2. Multi-Tenant Considerations

- System must support:
  - Organization-specific email templates (optional fallback to global)
  - Future support for custom domains (design only)
- Emails should include organization branding info (name at least)

---

## 3. Email System Architecture

Design a clean architecture:

- Email Service Layer
- Provider abstraction (e.g. SendGrid/Mailgun/Brevo)
- Queue-based sending (BullMQ)

Structure example:
- email/
  - providers/
  - templates/
  - services/
  - queue/

---

## 4. Queue System

- Use BullMQ
- Jobs:
  - send_invitation_email
- Must include:
  - retry logic
  - failure handling

---

## 5. Database Design (Prisma)

Design models for:
- Invitation
- EmailLog (optional but recommended)

Include:
- indexes
- relations
- constraints

---

## 6. Security (VERY IMPORTANT)

Handle ALL edge cases:

- Token hashing (never store raw token)
- Token expiration
- Prevent reuse
- Prevent inviting same user repeatedly (optional strategy)
- Rate limiting (basic design)
- Validate user/org permissions before sending invite

---

## 7. API Design

Endpoints:

- POST /organizations/:orgId/invite
- GET /invitations/:token
- POST /invitations/accept

Include:
- request validation
- error handling
- proper status codes

---

## 8. Better Auth Integration

- Integrate with Better Auth organization plugin:
  - Add user to organization after accepting invite
- Respect existing auth/session flow

---

## 9. Email Templates

- Use dynamic variables:
  - {{orgName}}
  - {{inviteLink}}
- Template system should be extendable

---

## 10. Code Quality

- Use modular structure
- Follow service pattern
- Use TypeScript types everywhere
- Keep functions reusable and clean

---

# 🧠 EDGE CASES YOU MUST COVER

Think deeply and include handling for:

- Expired invitation
- Already accepted invitation
- User already part of organization
- Inviting same email multiple times
- Invalid token
- Email sending failure (retry)
- Race conditions (double accept)
- User logged in as different email than invited email
- Organization deleted before invite accepted

---

# 📋 OUTPUT FORMAT (IMPORTANT)

## STEP 1: PLAN

Provide:

1. High-level architecture
2. Database schema (Prisma models)
3. Flow diagrams (text-based is fine)
4. API design
5. Folder structure
6. Edge case strategy
7. Step-by-step implementation plan

👉 STOP after this and WAIT for my approval.

---

## STEP 2: IMPLEMENTATION (ONLY AFTER APPROVAL)

Then implement:

- Prisma schema
- Services
- Controllers
- Queue setup (BullMQ)
- Email provider abstraction
- Invitation flow logic

---

# ❗ DO NOT SKIP THINKING

Act like a senior engineer designing a production SaaS system.
Think deeply before proposing anything.

Now start with STEP 1: PLAN ONLY.