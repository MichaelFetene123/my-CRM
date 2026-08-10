# Personal CRM — Business Implementation Architecture (v1.3)

Stack: **Laravel 13 (backend) + Inertia.js v3 + React 19 (frontend), single monolithic app**
Based on: `personal-crm-spec-v0.2.md`

---

## 1. Architecture Overview

Monolith, server-rendered-via-Inertia — no separate REST/SPA layer, no API tokens needed for the web app itself.

```
Browser (React components)
   ⇅ Inertia (JSON over HTTP, same-origin)
Laravel Controllers  →  Form Requests (validation)
   ↓
Actions / Services (business rules)
   ↓
Eloquent Models  →  MySQL
   ↓
Jobs/Scheduler (reminders) → Notifications
```

- **Controllers** stay thin: validate (via Form Request) → call an Action → return an Inertia response.
- **Actions** hold business rules from Spec §4 (conversion, stage transitions, won/lost). One class per operation, invokable.
- **Models** hold relationships and scopes only — no business logic in models.

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Backend framework | Laravel 13 (requires PHP 8.2+) |
| Frontend | React 19 + TypeScript (via Inertia v3 + Laravel's React starter kit) |
| Styling | Tailwind + shadcn/ui (Radix-based components, copied into the repo — not an npm dependency) |
| Database | MySQL |
| Auth | Laravel Breeze (bundled with starter kit) — email/password |
| Queue/scheduler | Laravel Queue (database driver) + Task Scheduler, for reminders |
| Notifications | Laravel Notifications (`database` channel for MVP; `mail` post-MVP) |
| HTTP client (frontend) | Inertia v3's built-in client — no Axios dependency needed |

`[ASSUMPTION]` Mail driver is not specified by you — deferred to Post-MVP per spec §7, choose when email notifications are implemented.

**Form handling strategy:**
- Use Inertia's `useForm` hook for all forms in this app (Contact, Lead, Opportunity, Activity, Note, and inline actions like "quick complete" or stage move) — it covers `data`, `errors`, `processing`, and posts straight to the Laravel routes in §6. This is sufficient for every form in the MVP scope.
- Don't introduce React 19's `useActionState` — it would only add value for form-like interactions outside Inertia's page-visit model, and none exist in this app's scope.

**shadcn/ui usage notes:**
- shadcn/ui is installed with TypeScript output by default (the CLI generates `.tsx` components), matching the rest of the frontend — no extra config needed.
- Installed via the shadcn CLI (`npx shadcn@latest add ...`) into `resources/js/Components/ui` — components are copied into the repo, not pulled from node_modules, so they're freely editable.
- Practical mapping to this app: `Dialog` for create/edit modals (Contact, Lead, Opportunity, Activity forms), `Card` for Kanban opportunity cards, `Badge` for overdue/upcoming activity indicators, `Select`/`Command` for stage and contact pickers, `Table` for Contacts/Leads list views, `Form` (with React Hook Form, shadcn's default pairing) for validation-bound Inertia forms.
- Axios is gone by default — Inertia ships its own HTTP client; use the new `useHttp` hook for the non-navigation calls this app needs (e.g. the notification unread-count poll in §8), not a separate `fetch`/`axios` setup.
- `Inertia::defer()` is a good fit for the Dashboard: render the page shell immediately and defer the 6 metric queries (§7) so the initial page load isn't blocked on aggregate SQL.
- `Inertia::merge()` (dot-notation, works in nested arrays) suits partial reloads on the Opportunities Kanban board — merge just the moved card's stage instead of reloading the whole board payload.
- SSR, if ever needed, no longer requires a separate Node process — the new Vite plugin handles it. Not needed for this MVP (no public/SEO-facing pages).

---

## 3. Folder Structure

```
app/
  Actions/
    Leads/ConvertLeadToOpportunity.php
    Leads/DiscardLead.php
    Opportunities/MoveOpportunityStage.php
    Opportunities/MarkOpportunityWon.php
    Opportunities/MarkOpportunityLost.php
    Activities/CompleteActivity.php
  Models/
    Contact.php  Lead.php  Opportunity.php  PipelineStage.php
    Activity.php  Note.php  User.php
  Http/
    Controllers/
      ContactController.php  LeadController.php
      OpportunityController.php  ActivityController.php
      NoteController.php  DashboardController.php
    Requests/
      StoreLeadRequest.php  ConvertLeadRequest.php
      StoreOpportunityRequest.php  MoveStageRequest.php  ...
    Middleware/  (default Breeze/Fortify set)
  Notifications/
    ActivityDueNotification.php
  Policies/
    ContactPolicy.php  OpportunityPolicy.php  (post-MVP multi-user)
  Console/Commands/
    SendActivityReminders.php   (scheduled)

resources/js/
  Pages/
    Dashboard/Index.tsx
    Contacts/Index.tsx  Contacts/Show.tsx
    Leads/Index.tsx
    Opportunities/Index.tsx (Kanban board)  Opportunities/Show.tsx
    Activities/Index.tsx (agenda list)
  Components/
    ui/                                  ← shadcn/ui primitives (button, card, dialog, select, badge, etc.)
    PipelineBoard/StageColumn.tsx  StageColumn/OpportunityCard.tsx
    Timeline/TimelineItem.tsx
    Activities/ActivityForm.tsx  Activities/ReminderBadge.tsx
  Layouts/AppLayout.tsx
  types/
    index.ts                             ← shared TS interfaces (Contact, Lead, Opportunity, Activity, Note, PipelineStage)

database/
  migrations/
  seeders/PipelineStageSeeder.php
```

---

## 4. Database Schema (migrations)

```
users
  id, name, email, password, role (enum: owner|collaborator|viewer, default 'owner'), timestamps

contacts
  id, name, company (nullable), email (nullable), phone (nullable),
  status (enum: prospect|customer|inactive, default 'prospect'), timestamps

leads
  id, contact_id (FK nullable → contacts), name, source (nullable),
  status (enum: new|qualified|converted|discarded, default 'new'),
  discard_reason (nullable), owner_id (FK → users), timestamps

pipeline_stages
  id, name, order (int), is_won (bool, default false), is_lost (bool, default false), timestamps

opportunities
  id, contact_id (FK → contacts), lead_id (FK nullable → leads), title,
  stage_id (FK → pipeline_stages), status (enum: open|won|lost, default 'open'),
  lost_reason (nullable), stage_entered_at (timestamp), owner_id (FK → users), timestamps

activities
  id, entity_type (string: lead|opportunity|contact), entity_id (unsignedBigInteger),
  type (enum: call|meeting|task|email), due_at (timestamp),
  completed_at (nullable timestamp), owner_id (FK → users), timestamps
  -- index on (entity_type, entity_id)

notes
  id, entity_type (string), entity_id (unsignedBigInteger), body (text),
  is_system_generated (bool, default false), created_by (FK nullable → users), timestamps
  -- index on (entity_type, entity_id)
```

Eloquent relationship notes:
- `activities`/`notes` use a **polymorphic morph pattern** — implement with Eloquent's built-in `morphTo`/`morphMany` (`entity_type` stores the morph alias, not a raw class string; register aliases in `AppServiceProvider::boot()` via `Relation::enforceMorphMap()`).
- `Opportunity::stage()` → `belongsTo(PipelineStage::class)`; `PipelineStage::opportunities()` → `hasMany`.
- `Lead::opportunity()` → `hasOne(Opportunity::class)` (enforces the 1—0..1 rule from the spec at the query level; enforce uniqueness at the Action level, see §5).

---

## 5. Business Rules → Implementation Mapping

| Rule (from spec §4) | Where enforced |
|---|---|
| Lead converts to exactly one Opportunity | `ConvertLeadToOpportunity` Action: guard clause rejects if `lead->status !== 'new'/'qualified'` or `lead->opportunity()->exists()` |
| Duplicate-contact check on conversion | Action queries `Contact` by email/name before creating; links if found |
| Converted/Discarded Leads are terminal | Model-level `scopeActive()`; Actions throw domain exception if status is terminal |
| One stage entry at a time; `stage_entered_at` updates on move | `MoveOpportunityStage` Action sets `stage_id` + `stage_entered_at = now()`, wrapped in a DB transaction |
| Won → Contact becomes `customer` | `MarkOpportunityWon` Action updates both `Opportunity.status` and `Contact.status` atomically |
| Lost requires reason | `MarkOpportunityLost` Action validated via `MarkLostRequest` (reason required) |
| Won/Lost Opportunities are terminal | Policy/Action guard: reject stage-move calls if `status !== 'open'` |
| Activity has one owner entity | Enforced by `StoreActivityRequest` (single polymorphic target, required) |
| Overdue = due_at passed, not completed | Computed at query time (`due_at < now() AND completed_at IS NULL`), not stored |
| Stage/convert/won/lost events auto-logged as Notes | Each Action creates a `Note` with `is_system_generated = true` in the same DB transaction |

All state-changing rules live in single-purpose invokable Actions — never in controllers or models — so they're independently testable and reusable (e.g., from an Artisan command or future API).

---

## 6. Routing (web.php, grouped)

```
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::resource('contacts', ContactController::class)->except(['create','edit']);
    Route::resource('leads', LeadController::class)->except(['create','edit']);
    Route::post('leads/{lead}/convert', [LeadController::class, 'convert']);
    Route::post('leads/{lead}/discard', [LeadController::class, 'discard']);

    Route::resource('opportunities', OpportunityController::class)->except(['create','edit']);
    Route::post('opportunities/{opportunity}/move', [OpportunityController::class, 'move']);
    Route::post('opportunities/{opportunity}/won', [OpportunityController::class, 'markWon']);
    Route::post('opportunities/{opportunity}/lost', [OpportunityController::class, 'markLost']);

    Route::resource('activities', ActivityController::class)->except(['create','edit','show']);
    Route::post('activities/{activity}/complete', [ActivityController::class, 'complete']);

    Route::post('notes', [NoteController::class, 'store']);
});
```

Inertia responses: every controller action returns `Inertia::render('Page/Name', [...])`; the Kanban drag-drop and inline forms post back to the `move`/`complete`/`convert` endpoints via `router.post()`. For the drag-drop stage move specifically, use Inertia v3's optimistic updates so the card visually moves before the server confirms, rolling back automatically on failure — no separate JSON API needed either way.

---

## 7. Dashboard Implementation

`DashboardController@index` runs 6 lightweight aggregate queries (one per metric in Spec §6). Wrap each in `Inertia::defer()` so `Dashboard/Index.tsx` renders its layout immediately and streams metrics in as they resolve, rather than blocking the initial response. No caching needed at MVP scale (single user, low volume); revisit if data grows.

---

## 8. Notifications / Reminders

- `activities` table is the source of truth; no separate reminder table.
- Scheduled command `SendActivityReminders` (registered in `routes/console.php`, runs hourly) queries due/overdue activities and dispatches `ActivityDueNotification` via the `database` channel.
- Frontend polls a lightweight `/notifications/unread-count` endpoint via Inertia v3's `useHttp` hook (a non-navigation request, not a page visit) to show a badge — no websockets needed for MVP.
- `[ASSUMPTION]` Email channel deferred to Post-MVP per spec §7.

---

## 9. Auth & Roles

- MVP: Laravel Breeze default auth (single `owner` user), no policy enforcement needed.
- Post-MVP: `role` column already present on `users`; add Laravel **Policies** per model (`ContactPolicy`, `OpportunityPolicy`, etc.) gated by role, and an `owner_id` check for Collaborator-level restriction — schema already supports this without migration changes.

---

## 10. Deployment Notes

- Single Laravel app: standard deployment (Forge, Vapor, or plain VPS with `php artisan serve` behind Nginx).
- Queue worker (`php artisan queue:work`) and scheduler (`* * * * * php artisan schedule:run` in cron) required for reminders.
- No separate frontend build/deploy — Vite bundles React with the Laravel app via the starter kit's default config.