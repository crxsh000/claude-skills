# Google Sheets Setup Guide
## Market Research Workflow System

This guide will help you set up the Google Sheets database that serves as the foundation for all 6 workflows.

## Step 1: Create the Master Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click "Blank" to create a new spreadsheet
3. Name it: **"Market Research - Fitness Coach Tracking"**

## Step 2: Create 6 Tabs

Rename the default sheet and create 5 additional tabs:

1. **Coach_Profiles**
2. **Weekly_Reels**
3. **Performance_Analysis**
4. **Pain_Points**
5. **ICP_Profiles**
6. **DM_Messages**

---

## Tab 1: Coach_Profiles

### Column Headers (Row 1):
```
coach_id | coach_name | platform | profile_url | follower_count | niche | date_added | status | notes
```

### Data Validation:
- **platform**: Dropdown → Instagram, TikTok, YouTube
- **status**: Dropdown → Active, Paused, Archived
- **follower_count**: Number format
- **date_added**: Date format

### Sample Data (Row 2):
```
1 | John Fitness Coach | Instagram | https://instagram.com/johnfit | 45000 | Muscle building 40+ | 2026-01-28 | Active | Top competitor
```

---

## Tab 2: Weekly_Reels

### Column Headers (Row 1):
```
reel_id | week_ending | coach_id | coach_name | reel_url | date_posted | views | likes | comments | shares | saves | hook_type | content_theme | duration_sec | processed
```

### Data Validation:
- **week_ending**: Date format (Sundays only)
- **date_posted**: Date format
- **views, likes, comments, shares, saves, duration_sec**: Number format
- **processed**: Checkbox (defaults to FALSE)

### Formula for coach_name (Column D, starting Row 2):
```
=IFERROR(VLOOKUP(C2,Coach_Profiles!A:B,2,FALSE),"")
```
This auto-fills the coach name based on coach_id.

### Sample Data (Row 2):
```
1 | 2026-01-26 | 1 | [auto-filled] | https://instagram.com/reel/abc123 | 2026-01-22 | 12500 | 450 | 38 | 67 | 145 | Question hook | Nutrition myths | 45 | FALSE
```

---

## Tab 3: Performance_Analysis

### Column Headers (Row 1):
```
analysis_id | week_ending | reel_id | coach_name | reel_url | performance_score | engagement_rate | virality_index | retention_proxy | ranking | ai_success_factors | ai_failure_factors | analysis_date | ai_tokens_used | ai_cost
```

### Data Validation:
- **performance_score, engagement_rate, virality_index, retention_proxy**: Number format
- **ranking**: Text (Top/Average/Bottom)
- **analysis_date**: Timestamp format
- **ai_cost**: Currency format

### Note:
This sheet is **automated** - data is populated by Workflow 3. Leave it empty initially.

---

## Tab 4: Pain_Points

### Column Headers (Row 1):
```
pain_point_id | week_ending | theme | specific_statement | frequency | urgency_score | coach_source | reel_url | extraction_date | ai_category
```

### Data Validation:
- **frequency, urgency_score**: Number format
- **extraction_date**: Timestamp format

### Note:
This sheet is **automated** - data is populated by Workflow 4. Leave it empty initially.

---

## Tab 5: ICP_Profiles

### Column Headers (Row 1):
```
icp_version | generation_date | google_doc_url | target_age_range | primary_pain_points | goals | objections | awareness_level | preferred_platforms | data_sources_used | ai_tokens_used
```

### Data Validation:
- **generation_date**: Timestamp format
- **google_doc_url**: URL format

### Note:
This sheet is **automated** - data is populated by Workflow 5. Leave it empty initially.

---

## Tab 6: DM_Messages

### Column Headers (Row 1):
```
message_id | icp_version | message_text | pain_point_addressed | curiosity_hook | cta_type | character_count | tone | generation_date | google_doc_url
```

### Data Validation:
- **character_count**: Number format
- **generation_date**: Timestamp format

### Note:
This sheet is **automated** - data is populated by Workflow 6. Leave it empty initially.

---

## Step 3: Format the Sheets

For each tab:

1. **Freeze Row 1**: View → Freeze → 1 row (keeps headers visible)
2. **Bold Headers**: Select row 1, make text bold
3. **Auto-fit Columns**: Select all → Format → Fit to data
4. **Add Filters**: Select row 1 → Data → Create a filter

### Recommended Column Widths:
- IDs: 80px
- Names/Themes: 150-200px
- URLs: 300px
- Text fields (notes, statements, analysis): 400-500px
- Numbers/Dates: 100-120px

---

## Step 4: Set Up Data Validation

### Coach_Profiles Tab:

**Platform (Column C):**
1. Select column C (starting from C2)
2. Data → Data validation
3. Criteria: List of items
4. Enter: `Instagram,TikTok,YouTube`
5. Check "Show dropdown list in cell"
6. Check "Reject input"

**Status (Column H):**
1. Select column H (starting from H2)
2. Data → Data validation
3. Criteria: List of items
4. Enter: `Active,Paused,Archived`
5. Check "Show dropdown list in cell"

### Weekly_Reels Tab:

**Processed (Column O):**
1. Select column O (starting from O2)
2. Data → Data validation
3. Criteria: Checkbox
4. Default: Unchecked

---

## Step 5: Add Conditional Formatting (Optional but Recommended)

### Weekly_Reels - Highlight Unprocessed:
1. Select column O (Processed)
2. Format → Conditional formatting
3. Format cells if: Checkbox is unchecked
4. Formatting style: Light red background

### Performance_Analysis - Color-code Rankings:
1. Select column J (Ranking)
2. Format → Conditional formatting
3. Add 3 rules:
   - Text contains "Top" → Green background
   - Text contains "Bottom" → Red background
   - Text contains "Average" → Yellow background

---

## Step 6: Share Settings

For n8n to access your sheet:

### Option A: Make Sheet Editable via Link (Easiest)
1. Click "Share" button
2. Change to "Anyone with the link"
3. Change permission to "Editor"
4. Copy the link - you'll need this for n8n workflows

### Option B: Service Account (More Secure)
1. Create a Google Cloud Project
2. Enable Google Sheets API
3. Create Service Account credentials
4. Download JSON key file
5. Share your sheet with the service account email

**For this project, Option A is recommended** for simplicity.

---

## Step 7: Get Your Sheet ID

From your sheet URL:
```
https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
```

Copy the **SHEET_ID** - you'll need this when configuring n8n workflows.

---

## Step 8: Test Data Entry

Add test data to verify your setup:

### Coach_Profiles (add 1-2 test coaches):
```
1 | Test Coach 1 | Instagram | https://instagram.com/test1 | 10000 | Fitness basics | [today] | Active | Test entry
2 | Test Coach 2 | TikTok | https://tiktok.com/@test2 | 25000 | Weight loss | [today] | Active | Test entry
```

### Weekly_Reels (add 2-3 test reels):
```
1 | [this Sunday] | 1 | Test Coach 1 | https://instagram.com/reel/test1 | [recent date] | 5000 | 200 | 15 | 30 | 50 | Question | Nutrition | 30 | FALSE
```

Verify that:
- ✅ Coach name auto-fills in Weekly_Reels
- ✅ Dropdowns work in Coach_Profiles
- ✅ Date formats are correct
- ✅ Processed checkbox works

---

## Step 9: Create a Backup

1. File → Make a copy
2. Name it: **"Market Research - BACKUP - [Date]"**
3. Store in a dedicated folder

**Recommendation**: Set up automatic backups via Google Takeout or a third-party service.

---

## Next Steps

Once your Google Sheets is set up:

1. ✅ **Share the Sheet URL** with yourself via email or notes
2. ✅ **Note the Sheet ID** from the URL
3. ✅ **Ready for n8n integration** - we'll use this in Workflow 1

---

## Quick Reference Card

### Sheet Purpose Summary:

| Tab | Purpose | Data Entry |
|-----|---------|------------|
| Coach_Profiles | Master list of coaches | **Manual** |
| Weekly_Reels | Reel metrics input | **Manual** |
| Performance_Analysis | Scored analysis | **Automated** |
| Pain_Points | Extracted themes | **Automated** |
| ICP_Profiles | ICP versions | **Automated** |
| DM_Messages | Message templates | **Automated** |

### Key URLs to Save:
- [ ] Full Sheet URL
- [ ] Sheet ID
- [ ] Backup Sheet URL

---

## Troubleshooting

**Formula not working in Weekly_Reels (coach_name)?**
- Check that coach_id in Weekly_Reels matches coach_id in Coach_Profiles
- Verify the VLOOKUP formula range: `Coach_Profiles!A:B`

**n8n can't access the sheet?**
- Verify sharing settings (Anyone with link = Editor)
- Check that you copied the full Sheet ID correctly
- Ensure Google Sheets API is enabled if using service account

**Data validation not appearing?**
- Make sure you applied validation to the entire column, not just one cell
- Start from row 2 (not row 1 which has headers)

---

## Ready!

Your Google Sheets database is now ready to power the Market Research workflow system. Proceed to building the n8n workflows!
