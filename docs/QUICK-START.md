# Quick Start Guide - Streamlined System

## ✅ What's Ready

You have a **simplified, manual-entry system** with 4 powerful automation workflows:

| Workflow | ID | Purpose |
|----------|-----|---------|
| 1. Performance Analysis | `A3RbiuqRVpYZsnTE` | Auto-analyzes reels weekly |
| 2. Pain Point Extraction | `04QjadLGtVSLIfl7` | Extracts pain points from comments |
| 3. ICP Generator | `Er3CgRiCZLBeSSj3` | Creates 28-bucket profile |
| 4. Message Generator | `S3P4jliSAMDzHblh` | Generates DM templates |

---

## 🎯 How It Works

```
You enter data manually → Google Sheets → n8n reads & analyzes → AI insights → Reports
```

**No forms, no complicated input workflows. Just pure analysis and reporting.**

---

## 📝 Your Weekly Process

### Sunday Evening (5-10 minutes)
1. Open Google Sheet
2. Add this week's reels to **Weekly_Reels** tab:
   - week_ending, coach_name, reel_url
   - views, likes, comments, shares, saves
   - Set **processed = FALSE**

### Sunday Noon (Automatic)
3. **Workflow 1** runs automatically
4. Scores calculated (0-100 system)
5. AI analyzes top/bottom performers
6. Results → **Performance_Analysis** tab

### Weekly (As Needed)
7. Copy comments from top reels
8. Run **Workflow 2** (Pain Point Extraction)
9. Results → **Pain_Points** tab

### Monthly
10. Run **Workflow 3** (ICP Generator)
11. Run **Workflow 4** (Message Generator)
12. Test DMs with real prospects

---

## 🚀 Setup Checklist (30-45 minutes total)

### ☐ Step 1: Google Sheets (15 min)
Follow: [Google-Sheets-Setup-Guide.md](./Google-Sheets-Setup-Guide.md)
- Create spreadsheet with 6 tabs
- Add column headers
- Copy your Sheet ID

### ☐ Step 2: n8n Credentials (10 min)
1. Go to https://parallaxagency.app.n8n.cloud
2. Add **Google Sheets OAuth2** credential
3. Add **Anthropic API** credential

### ☐ Step 3: Update Workflows (5 min)
For each of 4 workflows:
1. Open in n8n
2. Replace `YOUR_SHEET_ID_HERE` with your actual ID
3. Select credentials
4. Save

### ☐ Step 4: Add AI Nodes (20-30 min)
Follow: [AI-Prompts-Reference.md](./AI-Prompts-Reference.md)
- Add Anthropic nodes to all 4 workflows
- Copy-paste prompts from reference
- Configure models (Haiku for 1-2, Sonnet for 3-4)

### ☐ Step 5: Test (10 min)
1. Manually add 2 coaches to sheet
2. Manually add 5-10 reels
3. Run Workflow 1
4. Verify scores in Performance_Analysis tab

### ☐ Step 6: Activate (2 min)
- Activate Workflow 1 (weekly schedule)
- Done! 🎉

---

## 💰 Cost

- **n8n Cloud**: $20/month
- **AI**: ~$0.15/month
- **Total**: **$20.15/month**

---

## 📊 What You Get

After 1 month:
- ✅ 40-120 reels analyzed scientifically
- ✅ Performance scores (0-100) with AI insights
- ✅ 15-30 pain points extracted and ranked
- ✅ Comprehensive 28-bucket ICP
- ✅ 10-15 curiosity-driven DM templates
- ✅ Data-driven market intelligence

---

## 📚 Full Documentation

| File | When to Use |
|------|-------------|
| [README.md](./README.md) | System overview |
| [Google-Sheets-Setup-Guide.md](./Google-Sheets-Setup-Guide.md) | Setting up your database |
| [Implementation-Guide.md](./Implementation-Guide.md) | Detailed configuration steps |
| [AI-Prompts-Reference.md](./AI-Prompts-Reference.md) | Copy-paste AI prompts |

---

## 🎯 Today's Action Items

1. ☐ Read [Google-Sheets-Setup-Guide.md](./Google-Sheets-Setup-Guide.md)
2. ☐ Create Google Sheet with 6 tabs
3. ☐ Copy your Sheet ID
4. ☐ Set up n8n credentials
5. ☐ Update 4 workflows with Sheet ID

**Tomorrow:**
6. ☐ Add AI nodes using [AI-Prompts-Reference.md](./AI-Prompts-Reference.md)
7. ☐ Test with sample data
8. ☐ Activate Workflow 1

---

## ✨ Why This Approach is Better

**Before (6 workflows):**
- Complex form-based data entry
- Extra workflows to maintain
- More points of failure

**Now (4 workflows):**
- ✅ Simpler: Direct data entry to sheets
- ✅ Faster: No form submissions
- ✅ Flexible: Edit data anytime
- ✅ Reliable: Fewer moving parts
- ✅ Same powerful AI analysis

---

## 🆘 Common Questions

**Q: How do I add a new coach?**
A: Open Google Sheet → Coach_Profiles tab → Add a new row manually

**Q: How do I add weekly reels?**
A: Open Google Sheet → Weekly_Reels tab → Add rows for each reel, set processed = FALSE

**Q: When does Workflow 1 run?**
A: Automatically every Sunday at noon (once activated)

**Q: Can I test before Sunday?**
A: Yes! Open Workflow 1 in n8n and click "Execute Workflow"

**Q: What if I make a mistake in the sheet?**
A: Just edit the cell directly. Workflows read from sheets in real-time.

**Q: Do I need to use forms at all?**
A: No! Only Workflow 2 (Pain Point Extraction) uses a form to paste comments. Everything else reads from sheets.

---

## 🎉 Ready?

**Start here:** [Google-Sheets-Setup-Guide.md](./Google-Sheets-Setup-Guide.md)

You're 30-45 minutes away from a complete market research automation system!

---

*Questions? Check [Implementation-Guide.md](./Implementation-Guide.md) for detailed troubleshooting.*
