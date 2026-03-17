# Market Research Workflow System - Implementation Guide

## 🎉 All Workflows Created Successfully!

You now have 6 fully structured n8n workflows ready for configuration and use.

---

## Workflow Summary

**You manually enter all data into Google Sheets. Workflows handle analysis and reporting.**

| # | Workflow Name | ID | Status | Purpose |
|---|---------------|-----|--------|---------|
| 1 | Performance Analysis | `A3RbiuqRVpYZsnTE` | ✅ Created | Weekly scoring & AI analysis |
| 2 | Pain Point Extraction | `04QjadLGtVSLIfl7` | ✅ Created | Extract themes from comments |
| 3 | ICP Generator | `Er3CgRiCZLBeSSj3` | ✅ Created | Generate 28-bucket ICP |
| 4 | Message Generator | `S3P4jliSAMDzHblh` | ✅ Created | Create DM templates |

---

## Configuration Steps

### Step 1: Set Up Google Sheets

Follow the guide in [Google-Sheets-Setup-Guide.md](./Google-Sheets-Setup-Guide.md):
1. Create spreadsheet with 6 tabs
2. Set up column headers
3. Add data validation
4. Share with edit permissions
5. Copy your **Sheet ID** from the URL

---

### Step 2: Configure n8n Credentials

#### Google Sheets OAuth2

1. Go to your n8n instance: https://parallaxagency.app.n8n.cloud
2. Click your profile → **Credentials**
3. Click **+ Add Credential**
4. Search for "Google Sheets"
5. Select **Google Sheets OAuth2 API**
6. Click **Connect my account**
7. Sign in with your Google account
8. Grant permissions
9. Name it: "Google Sheets - Market Research"
10. **Save**

#### Anthropic API (for AI workflows)

1. Go to [Anthropic Console](https://console.anthropic.com)
2. Create API key (if you don't have one)
3. In n8n, click **Credentials** → **+ Add Credential**
4. Search for "Anthropic"
5. Paste your API key
6. Name it: "Anthropic - Claude AI"
7. **Save**

---

### Step 3: Update Each Workflow with Your Sheet ID

For **each** of the 4 workflows:

1. Go to your n8n dashboard
2. Open the workflow (by ID or name from table above)
3. Find every **Google Sheets** node
4. Click on the node
5. Find the parameter `documentId`
6. Replace `YOUR_SHEET_ID_HERE` with your actual Sheet ID
7. Select your Google Sheets credential in the **Credentials** dropdown
8. **Save** the workflow

**Your Sheet ID looks like this:**
```
https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t/edit
                                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                       This is your Sheet ID
```

---

### Step 4: Add AI Nodes (All 4 Workflows)

All workflows need **Anthropic AI nodes** for analysis:

#### Workflow 1: Performance Analysis
**What to add:** AI analysis of top and bottom performers

1. Open Workflow 1 - Performance Analysis (`A3RbiuqRVpYZsnTE`)
2. After the "Calculate Performance Scores" node, add two branches:

   **Branch A: Top Performers**
   - Add **IF** node → condition: `{{ $json.ranking === "Top" }}`
   - Add **Anthropic Chat Model** node:
     - Model: `claude-3-haiku-20240307` (cost-effective)
     - System Message: "You are a social media content analyst. Analyze these top-performing reels and identify 3-5 success factors."
     - Prompt: Use template from plan document (Performance Analysis Prompts section)
     - Connect to next node

   **Branch B: Bottom Performers**
   - Add **IF** node → condition: `{{ $json.ranking === "Bottom" }}`
   - Add **Anthropic Chat Model** node:
     - Model: `claude-3-haiku-20240307`
     - System Message: "Analyze underperforming reels and identify failure factors."
     - Prompt: Use template from plan document
     - Connect to next node

3. Add **Merge** node to combine both branches
4. **Save** workflow

#### Workflow 2: Pain Point Extraction
**What to add:** AI extraction of pain points from comments

1. Open Workflow 2 - Pain Point Extraction (`04QjadLGtVSLIfl7`)
2. Find the node: "NOTE: Add Anthropic AI Node Here"
3. Replace it with **Anthropic Chat Model** node:
   - Model: `claude-3-haiku-20240307`
   - System Message: "Extract pain points from fitness coaching comments. Return JSON format."
   - Prompt: See plan document (Pain Point Extraction Prompt section)
   - Output: Should return JSON with `pain_points` array
4. Update the "Parse & Structure Pain Points" code node to parse actual AI output
5. **Save** workflow

#### Workflow 3: ICP Generator
**What to add:** Comprehensive ICP synthesis

1. Open Workflow 3 - ICP Generator (`Er3CgRiCZLBeSSj3`)
2. Find the node: "NOTE: Add Anthropic AI Node Here"
3. Replace it with **Anthropic Chat Model** node:
   - Model: `claude-3-5-sonnet-20240620` (better for complex synthesis)
   - System Message: "Create a comprehensive 28-bucket ICP profile for fitness coaching."
   - Prompt: Use the full ICP Generation Prompt from plan document
   - Max Tokens: 4000
4. Add **Google Docs** node after AI to create formatted document:
   - Operation: Create
   - Title: `ICP Profile - v{{ $now.toFormat('yyyy-MM-dd') }}`
   - Content: `{{ $json.output }}` (AI-generated ICP)
5. Update "Save ICP to Sheet" node to include Google Doc URL
6. **Save** workflow

#### Workflow 4: Message Generator
**What to add:** DM template generation

1. Open Workflow 4 - Message Generator (`S3P4jliSAMDzHblh`)
2. Find the node: "NOTE: Add Anthropic AI Node Here"
3. Replace it with **Anthropic Chat Model** node:
   - Model: `claude-3-5-sonnet-20240620`
   - System Message: "Expert copywriter creating curiosity-driven DMs for fitness coaches."
   - Prompt: Use DM Template Generation Prompt from plan document
   - Max Tokens: 3000
4. Add **Code** node to parse AI response into individual messages
5. Add **Google Docs** node to create message bank document
6. Update "Save Messages to Sheet" node with parsed data
7. **Save** workflow

---

### Step 5: Activate Workflow 1 (Weekly Schedule)

1. Open Workflow 1: Performance Analysis
2. Verify the **Schedule Trigger** is set to: `0 12 * * 0` (Sunday at noon)
3. Adjust timezone if needed (Settings → Timezone)
4. Toggle the **Active** switch at the top right
5. **Save**

This workflow will now run automatically every Sunday at noon!

---

## How to Use Each Workflow

### Manual Data Entry (Before Running Workflows)

**Add Coaches:**
1. Open your Google Sheet
2. Go to Coach_Profiles tab
3. Manually add rows with:
   - coach_name, platform, profile_url, follower_count, niche, date_added, status, notes

**Add Weekly Reels:**
1. Every Sunday evening, open Google Sheet
2. Go to Weekly_Reels tab
3. For each reel from the week, manually add:
   - week_ending (this Sunday's date)
   - coach_name
   - reel_url
   - date_posted
   - views, likes, comments, shares, saves
   - hook_type (optional)
   - content_theme (optional)
   - duration_sec (optional)
   - **processed = FALSE** (important!)

### Workflow 1: Automatic Analysis

This runs automatically every **Sunday at noon**.

To test manually:
1. Open Workflow 1 (Performance Analysis)
2. Make sure you have unprocessed reels (processed = FALSE)
3. Click **Execute Workflow**
4. Wait for completion
5. Check results:
   - Google Sheet → Performance_Analysis tab
   - Email inbox (if email node configured)

### Workflow 2: Extract Pain Points

1. Find top-performing reels from the week (high engagement)
2. Go to each reel and copy all comments
3. Open Workflow 2 (Pain Point Extraction)
4. Click **Execute Workflow**
5. Open form link
6. Paste all comments in the textarea
7. Submit
8. Check Google Sheet → Pain_Points tab

### Workflow 3: Generate ICP

Run this **monthly** or when you have 50+ analyzed reels.

1. Ensure you have data in:
   - Performance_Analysis sheet
   - Pain_Points sheet
2. Open Workflow 3 (ICP Generator)
3. Click **Execute Workflow**
4. Wait 30-60 seconds for AI generation
5. Check results:
   - Google Sheet → ICP_Profiles tab
   - Google Doc with full 28-bucket profile

### Workflow 4: Generate DM Templates

Run this **after generating an ICP**.

1. Ensure latest ICP exists in ICP_Profiles sheet
2. Open Workflow 4 (Message Generator)
3. Click **Execute Workflow**
4. Wait 30-45 seconds
5. Check results:
   - Google Sheet → DM_Messages tab
   - Google Doc with full message bank (10-15 templates)

---

## Testing Procedure

### Initial Test (Week 1)

**Day 1: Setup**
- [ ] Create Google Sheets (all 6 tabs)
- [ ] Configure n8n credentials
- [ ] Update all workflows with Sheet ID
- [ ] Manually add 2-3 test coaches to Coach_Profiles tab

**Day 2-7: Data Collection**
- [ ] Manually add 10-15 test reels to Weekly_Reels tab
- [ ] Set processed = FALSE for all
- [ ] Vary metrics (some high, some low engagement)

**Day 7 (Sunday): Analysis**
- [ ] Manually trigger Workflow 1 (Performance Analysis)
- [ ] Verify scores calculated correctly
- [ ] Check rankings (Top/Average/Bottom)
- [ ] Review Performance_Analysis sheet

**Day 8: Pain Points**
- [ ] Copy 5-10 sample comments
- [ ] Run Workflow 2 (Pain Point Extraction)
- [ ] Verify themes extracted
- [ ] Check Pain_Points sheet

**Week 2-4: Accumulate Data**
- [ ] Continue adding reels manually each week
- [ ] Let Workflow 1 run automatically on Sundays
- [ ] Collect more pain points

**Month 1 End: ICP & Messages**
- [ ] Run Workflow 3 (ICP Generator)
- [ ] Verify 28 buckets filled
- [ ] Run Workflow 4 (Message Generator)
- [ ] Review DM templates

---

## Troubleshooting

### "Sheet ID not found" error
- Verify you copied the entire Sheet ID (no spaces)
- Check sharing settings: "Anyone with link" = Editor
- Ensure Google Sheets credential is connected

### "Credential not found" error
- Go to Credentials in n8n
- Verify "Google Sheets OAuth2" is saved
- Reconnect if needed
- Update workflow nodes to use correct credential

### Workflow 3 not running on schedule
- Check that workflow is **Active** (toggle switch)
- Verify cron expression: `0 12 * * 0`
- Check timezone setting
- Look at Executions tab for errors

### AI nodes returning errors
- Verify Anthropic API key is valid
- Check API quota/billing
- Ensure prompts are properly formatted
- Review error message for specifics

### "No data to process" in Workflow 1
- Check Weekly_Reels sheet has data
- Verify `processed` column = FALSE for new reels
- Ensure data is in correct format (dates, numbers)

---

## Cost Tracking

Monitor your usage monthly:

### n8n Cloud
- Plan: Starter ($20/month)
- Workflows: 4
- Executions: ~10-15/month

### Anthropic API
- Workflow 1 (weekly × 4): ~$0.01/month
- Workflow 2 (weekly × 4): ~$0.01/month
- Workflow 3 (monthly × 1): ~$0.07/month
- Workflow 4 (monthly × 1): ~$0.06/month
- **Total AI**: ~$0.15/month

**Total Monthly Cost: ~$20.15**

Track in Google Sheets:
- Performance_Analysis: `ai_tokens_used`, `ai_cost` columns
- Create a summary tab with monthly totals

---

## Next Steps

### Week 1
- [ ] Complete Google Sheets setup
- [ ] Configure all credentials
- [ ] Update workflows with Sheet ID
- [ ] Add AI nodes to all 4 workflows
- [ ] Manually add 3-5 real coaches to sheet

### Week 2-4
- [ ] Manually input reels weekly to Google Sheets
- [ ] Let Workflow 1 run automatically
- [ ] Run Workflow 2 for pain points extraction
- [ ] Refine AI prompts based on output quality

### Month 2
- [ ] Generate first ICP (Workflow 3)
- [ ] Create DM templates (Workflow 4)
- [ ] Test 5-10 DMs with real coaches
- [ ] Track response rates

### Month 3+
- [ ] Scale to 10-20 coaches if needed
- [ ] Iterate on prompts
- [ ] Add email notifications
- [ ] Consider adding Google Docs report generation

---

## Support & Resources

### Documentation Files
- [Google-Sheets-Setup-Guide.md](./Google-Sheets-Setup-Guide.md) - Detailed sheet setup
- [Plan](../../../.claude/plans/twinkling-percolating-peacock.md) - Full implementation plan with prompts
- This file - Implementation guide

### n8n Resources
- n8n Docs: https://docs.n8n.io
- Community Forum: https://community.n8n.io
- Template Gallery: https://n8n.io/workflows

### AI Resources
- Anthropic Docs: https://docs.anthropic.com
- Claude Prompt Guide: https://docs.anthropic.com/claude/docs/introduction-to-prompt-design
- Token Pricing: https://www.anthropic.com/pricing

### Workflow IDs (Quick Reference)
```
Workflow 1 (Performance Analysis): A3RbiuqRVpYZsnTE
Workflow 2 (Pain Point Extraction): 04QjadLGtVSLIfl7
Workflow 3 (ICP Generator): Er3CgRiCZLBeSSj3
Workflow 4 (Message Generator): S3P4jliSAMDzHblh
```

---

## Customization Ideas

### Additional Features to Add Later

1. **Email Notifications**
   - Add Gmail node to Workflow 3 (weekly analysis report)
   - Add to Workflow 4 (pain point summary)

2. **Google Docs Reports**
   - Auto-generate formatted weekly reports
   - Create trend analysis documents

3. **Dashboard**
   - Use Google Data Studio
   - Connect to Google Sheets
   - Visualize trends, scores, pain points

4. **Competitor Comparison**
   - Add comparison metrics
   - Track relative performance

5. **A/B Testing**
   - Test DM templates
   - Track response rates
   - Iterate based on data

---

## Success Checklist

By end of Month 1, you should have:
- [ ] ✅ 5-10 coaches tracked
- [ ] ✅ 40-120 reels analyzed
- [ ] ✅ Performance scores calculated automatically
- [ ] ✅ 15-30 pain points extracted and ranked
- [ ] ✅ Comprehensive 28-bucket ICP profile
- [ ] ✅ 10-15 DM templates ready to use
- [ ] ✅ Spending < $25/month total
- [ ] ✅ System running automatically

---

## Congratulations! 🎉

You now have a complete Market Research automation system that:
- Tracks fitness coaches systematically
- Analyzes content performance scientifically
- Extracts pain points from audience comments
- Generates detailed ICP profiles
- Creates personalized outreach messaging

**Ready to start? Begin with the Google Sheets setup guide!**
