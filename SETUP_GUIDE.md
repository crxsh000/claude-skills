# ICP Problem Cluster Report Generator — Setup Guide

## Overview

This n8n workflow analyzes a fitness coach's Google Docs questionnaire, generates ICP problem clusters + scoring + tiering using the Anthropic Claude API, and outputs two Google Docs reports (internal + coach-facing) while tracking everything in Google Sheets.

**Workflow file:** `icp-report-generator.json`

---

## Prerequisites

- An n8n instance (cloud or self-hosted)
- A Google Cloud project with OAuth2 credentials
- An Anthropic API key
- A Google Sheets spreadsheet with two tabs set up (instructions below)

---

## Step 1: Create the Google Sheets Spreadsheet

Create a new Google Sheets spreadsheet. Note its ID from the URL:
```
https://docs.google.com/spreadsheets/d/THIS_IS_YOUR_SPREADSHEET_ID/edit
```

### Tab 1: "Coaches"

Create a tab named exactly `Coaches` with these column headers in row 1:

| coach_id | coach_name | coach_email | doc_url | run_notes | internal_report_url | coach_report_url | timestamp_last_run | status |
|----------|------------|-------------|---------|-----------|--------------------|--------------------|-------------------|--------|

- `coach_id` — unique identifier you assign (e.g., "COACH_001")
- `coach_name` — the coach's name
- `coach_email` — the coach's email
- `doc_url` — full URL to their Google Doc questionnaire
- `run_notes` — optional notes for the analysis run
- `internal_report_url` — filled automatically by the workflow
- `coach_report_url` — filled automatically by the workflow
- `timestamp_last_run` — filled automatically by the workflow
- `status` — filled automatically (DONE, NEEDS_FOLLOWUP, or ERROR)

### Tab 2: "Cluster_Library"

Create a tab named exactly `Cluster_Library` with these column headers in row 1:

| canonical_cluster_name | definition | common_symptoms | typical_objections | created_at | times_seen |
|-----------------------|------------|-----------------|-------------------|------------|------------|

This tab starts empty and grows over time as you process coaches.

---

## Step 2: Set Up Google Cloud OAuth2 Credentials

### Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. Enable these APIs:
   - **Google Sheets API**
   - **Google Docs API**
   - **Google Drive API**

   Go to *APIs & Services → Library* and search for each one.

### Create OAuth2 Credentials

1. Go to *APIs & Services → Credentials*
2. Click **Create Credentials → OAuth Client ID**
3. If prompted, configure the OAuth consent screen first:
   - User type: External (or Internal if using Google Workspace)
   - App name: "n8n ICP Reports"
   - Add scopes: `https://www.googleapis.com/auth/spreadsheets`, `https://www.googleapis.com/auth/documents`, `https://www.googleapis.com/auth/drive`
   - Add yourself as a test user
4. Create the OAuth Client ID:
   - Application type: **Web application**
   - Name: "n8n"
   - Authorized redirect URIs: Add your n8n OAuth callback URL
     - For n8n Cloud: `https://YOUR_INSTANCE.app.n8n.cloud/rest/oauth2-credential/callback`
     - For self-hosted: `https://YOUR_N8N_DOMAIN/rest/oauth2-credential/callback`
5. Save the **Client ID** and **Client Secret**

### Add Credentials in n8n

You need to create **three** OAuth2 credentials in n8n:

#### Google Sheets OAuth2
1. In n8n, go to **Credentials → Add Credential**
2. Search for "Google Sheets OAuth2 API"
3. Enter your Client ID and Client Secret
4. Click **Connect** and authorize with your Google account

#### Google Docs OAuth2
1. **Add Credential → Google Docs OAuth2 API**
2. Enter the same Client ID and Client Secret
3. Connect and authorize

#### Google Drive OAuth2
1. **Add Credential → Google Drive OAuth2 API**
2. Enter the same Client ID and Client Secret
3. Connect and authorize

> **Tip:** All three use the same Google Cloud project credentials, but n8n treats them as separate credential types.

---

## Step 3: Set the Anthropic API Key

1. Get your API key from [Anthropic Console](https://console.anthropic.com/)
2. In n8n, go to **Settings → Environment Variables**
   - For n8n Cloud: Settings → Environment Variables in the sidebar
   - For self-hosted: Set `ANTHROPIC_API_KEY=sk-ant-...` in your environment or `.env` file
3. Add a variable:
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your Anthropic API key (starts with `sk-ant-...`)

---

## Step 4: Import the Workflow

1. In n8n, go to **Workflows → Import from File**
2. Select `icp-report-generator.json`
3. The workflow will appear with all 36 nodes and 5 sticky notes

---

## Step 5: Configure the Workflow

### Replace Spreadsheet ID

In the following nodes, update `YOUR_SPREADSHEET_ID` with your actual spreadsheet ID:

1. **Read Coaches Tab** — `documentId` URL
2. **Read Cluster Library** — `documentId` URL
3. **Update Coaches Tab** — `documentId` URL
4. **Update Cluster Library** — `documentId` URL
5. **Write Error to Coaches Sheet** — `documentId` URL

Replace this in each node:
```
https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
```
With:
```
https://docs.google.com/spreadsheets/d/YOUR_ACTUAL_ID_HERE/edit
```

### Assign Credentials

Click on each Google node and select your configured credentials:
- All **Google Sheets** nodes → select your Google Sheets OAuth2 credential
- All **Google Docs** nodes → select your Google Docs OAuth2 credential
- All **Google Drive** nodes → select your Google Drive OAuth2 credential

---

## Step 6: Run the Workflow

### Prepare a Coach Entry

1. Add a row to the **Coaches** tab:
   - `coach_id`: e.g., `COACH_001`
   - `coach_name`: e.g., `John Smith`
   - `coach_email`: e.g., `john@example.com`
   - `doc_url`: The full URL to their filled-out Google Doc questionnaire
   - Leave `internal_report_url`, `coach_report_url`, `timestamp_last_run`, and `status` empty

2. Make sure the Google Doc is accessible to the Google account connected to n8n

### Set the Coach ID

1. Open the workflow in n8n
2. Click on the **Set Coach ID** node
3. Change `coach_id_to_process` from `COACH_001` to the coach_id you want to process
4. Optionally add `override_run_notes`
5. Save

### Execute

Click **Execute Workflow** (the play button).

### Expected Results

On success:
- Two Google Docs created in `Google Drive → ICP Reports → {coach_id} - {coach_name}/`
- Coaches sheet updated with report URLs, timestamp, and status = `DONE` or `NEEDS_FOLLOWUP`
- Cluster_Library updated with new or incremented clusters

---

## Google Docs Questionnaire Template

The coach's Google Doc should have these headings (exact or close — minor variations are handled):

```
Coach Overview
(Coach describes themselves, their background, their business)

Target Client
(Who they serve, demographics, psychographics)

Prospect Complaints (Voice of Prospect)
(What prospects say about their problems — this is the PRIMARY source for clusters)

Desired Outcomes
(What prospects want to achieve)

Objections
(Common objections prospects raise)

Offer
(What the coach offers — program details, deliverables)

Proof
(Testimonials, case studies, results)

Acquisition
(How they currently get clients)

Numbers (Optional)
- Total program price bucket: <$300, $300-$750, $750-$1500, $1500+
- Program length/retention bucket: 4w, 8w, 12w, 6mo, ongoing
- Capacity bucket: <10, 10-20, 20-40, 40+
```

If sections are missing, the workflow still runs but marks `status = NEEDS_FOLLOWUP` and generates follow-up questions.

---

## Troubleshooting

### "Coach not found" error
- Check that the `coach_id_to_process` in the Set Coach ID node exactly matches a `coach_id` in the Coaches tab (case-sensitive)
- Verify the Coaches tab is named exactly "Coaches"

### "No doc_url" error
- The matching coach row has an empty `doc_url` column
- Add the Google Doc URL and re-run

### Google Docs permission error
- The Google Doc must be accessible to the Google account used in n8n credentials
- Share the doc with the account or make it viewable via link

### Anthropic API errors
- **401 Unauthorized**: Check that `ANTHROPIC_API_KEY` environment variable is set correctly
- **429 Rate Limited**: The workflow retries 3 times with 5-second delays. If it still fails, wait and retry
- **529 Overloaded**: Same as 429 — retries are built in
- **Timeout**: The API has a 120-second timeout. Very large documents may need the timeout increased in the HTTP Request node

### JSON parse error from LLM
- The LLM occasionally returns invalid JSON. The workflow will set status = ERROR
- Re-run the same coach — results are non-deterministic and usually succeed on retry
- If persistent, the questionnaire doc may have unusual formatting. Try cleaning it up

### Google Drive folder not found
- On first run, the workflow creates "ICP Reports" in your Google Drive root
- If you moved or deleted it, the workflow will create a new one

### Cluster Library issues
- The `Cluster_Library` tab must have exact column headers as specified
- If the tab is empty (no data rows), that's fine — it starts empty
- Cluster matching uses lowercase normalization — "Accountability Issues" matches "accountability issues"

---

## Workflow Architecture

```
Manual Trigger → Set Coach ID → Read Coaches → Validate
  → Fetch Google Doc → PII Redaction → Read Cluster Library
  → Build Prompt → Anthropic API (Claude Sonnet 4) → Parse JSON
  → Render Internal Report → Render Coach Report
  → Create/Find Drive Folders → Create Google Docs
  → Update Coaches Tab → Update Cluster Library
```

**Error handling:** API failures and missing data route to an error branch that writes `status = ERROR` to the Coaches sheet while preserving any existing report URLs.

**Reports generated:**
- **Internal Report**: Full diagnostic with exec summary, clusters, 5-factor scoring, tier list, messaging guidance, video talking points, follow-up questions
- **Coach Report**: Client-appropriate version with insights, clusters, scoring, recommended segment, messaging principles, content themes, follow-up questions (NO hooks/scripts/calendars/DM scripts)

---

## Cost Estimate

Each run makes one Anthropic API call:
- Input: ~2,000-5,000 tokens (questionnaire + prompt)
- Output: ~4,000-8,000 tokens (analysis JSON)
- Estimated cost per run with Claude Sonnet 4: ~$0.03-$0.08

---

## Assumptions

- The Google account connected to n8n has access to the coach's Google Doc
- The spreadsheet is in your Google Drive (not a shared drive — if shared drive, update the `driveId` in nodes)
- One coach is processed per execution (edit Set Coach ID before each run)
- The Anthropic API key has sufficient quota for the model used
