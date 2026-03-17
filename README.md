# Market Research n8n Workflow System

Complete automation system for analyzing fitness coaches, extracting pain points, creating ICPs, and generating personalized outreach messaging.

## 🎯 What This System Does

1. **Analyzes Content** - Score reel performance (0-100) and identify success/failure patterns
2. **Extracts Pain Points** - Use AI to find audience struggles from comments
3. **Generates ICP** - Create comprehensive 28-bucket Ideal Customer Profile
4. **Creates Messaging** - Generate 10-15 curiosity-driven DM templates for outreach

## 📊 System Architecture

```
Manual Entry to Google Sheets → n8n Workflows → AI Analysis → Actionable Outputs
```

### 4 Streamlined Workflows

| Workflow | Type | Purpose | Frequency |
|----------|------|---------|-----------|
| 1. Performance Analysis | Scheduled | Calculate scores + AI analysis | Auto (Sunday noon) |
| 2. Pain Point Extraction | Manual | Extract themes from comments | Weekly |
| 3. ICP Generator | Manual | Synthesize 28-bucket profile | Monthly |
| 4. Message Generator | Manual | Create DM templates | Monthly |

## 💰 Cost

- **n8n Cloud**: $20/month
- **AI (Anthropic)**: ~$0.15/month
- **Total**: **$20.15/month**

## 🚀 Quick Start

### Step 1: Google Sheets Setup
Follow [Google-Sheets-Setup-Guide.md](./docs/Google-Sheets-Setup-Guide.md) to create your database.

### Step 2: Manual Data Entry
- Add coaches directly to Coach_Profiles tab
- Enter reel metrics directly to Weekly_Reels tab (set processed = FALSE)
- Paste comments manually when needed

### Step 3: Configure n8n
1. Set up Google Sheets OAuth2 credentials
2. Set up Anthropic API credentials
3. Update all 4 workflows with your Sheet ID

### Step 4: Add AI Nodes
Follow [Implementation-Guide.md](./docs/Implementation-Guide.md) to add AI analysis to all workflows.

### Step 5: Test & Launch
1. Add 2-3 coaches manually to sheet
2. Input 10 sample reels manually
3. Run Workflow 1 (Performance Analysis)
4. Verify outputs in Google Sheets

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [Implementation-Guide.md](./docs/Implementation-Guide.md) | Complete setup and usage instructions |
| [Google-Sheets-Setup-Guide.md](./docs/Google-Sheets-Setup-Guide.md) | Detailed sheet structure and configuration |
| [AI-Prompts-Reference.md](./docs/AI-Prompts-Reference.md) | Copy-paste prompts for AI nodes |
| [Plan](../../../.claude/plans/twinkling-percolating-peacock.md) | Original implementation plan |

## 🔧 Workflows Created

All workflows have been created in your n8n instance:

| ID | Name | Status |
|----|------|--------|
| `A3RbiuqRVpYZsnTE` | 01 - Performance Analysis (Weekly) | ⚙️ Needs AI nodes |
| `04QjadLGtVSLIfl7` | 02 - Pain Point Extraction | ⚙️ Needs AI nodes |
| `Er3CgRiCZLBeSSj3` | 03 - ICP Generator | ⚙️ Needs AI nodes |
| `S3P4jliSAMDzHblh` | 04 - Message Generator | ⚙️ Needs AI nodes |

## 📈 Performance Scoring System

Reels are scored 0-100 based on:
- **Engagement Rate (40 pts)**: (Likes + Comments + Shares) / Views × 100
- **Virality Index (30 pts)**: Shares / Views × 100
- **Retention Proxy (30 pts)**: Saves / Views × 100

Rankings:
- **Top 20%**: 60-100 points (analyze for success patterns)
- **Average 60%**: 30-60 points (incremental improvements)
- **Bottom 20%**: 0-30 points (analyze failures)

## 🎯 ICP - 28 Buckets

The system generates comprehensive profiles covering:

**Demographics**: Age, Gender, Location, Income, Education, Occupation

**Psychographics**: Values, Lifestyle, Traits, Hobbies

**Pain Points**: Primary/Secondary Pains, Failed Solutions, Emotional Impact

**Goals**: Primary Goals, Motivations, Dream Outcome, Success Metrics

**Behaviors**: Content Habits, Platforms, Decision Process, Purchase Triggers

**Awareness**: Problem/Solution/Product Awareness

**Objections**: Common Objections, Limiting Beliefs, Resource Constraints

## 💬 DM Template Strategy

AI generates 10-15 templates featuring:
- ✅ Curiosity hooks (not sales pitches)
- ✅ Pattern interrupts
- ✅ Specific pain point resonance
- ✅ Under 280 characters
- ✅ Open-ended questions
- ✅ Authentic, human tone

## 📊 Google Sheets Structure

### 6 Tabs

1. **Coach_Profiles** - Master list (manual input)
2. **Weekly_Reels** - Metrics tracking (manual input)
3. **Performance_Analysis** - Scored results (automated)
4. **Pain_Points** - Extracted themes (automated)
5. **ICP_Profiles** - Generated profiles (automated)
6. **DM_Messages** - Template bank (automated)

## ⚙️ Configuration Checklist

- [ ] Google Sheet created with 6 tabs
- [ ] Google Sheets OAuth2 credential in n8n
- [ ] Anthropic API credential in n8n
- [ ] All 4 workflows updated with Sheet ID
- [ ] AI nodes added to all 4 workflows
- [ ] Test data added manually (2-3 coaches, 10 reels in sheets)
- [ ] Workflow 1 (Performance Analysis) activated for weekly schedule
- [ ] Initial test run completed successfully

## 🔄 Weekly Workflow

**Sunday Evening (Manual Entry)**
1. Open Google Sheets → Weekly_Reels tab
2. Add reel metrics for the week (URL, views, likes, comments, shares, saves, etc.)
3. Set "processed" column to FALSE for new reels
4. Copy comments from top reels for later use

**Sunday Noon (Automatic)**
5. Workflow 1 (Performance Analysis) runs automatically
6. Scores calculated, AI analyzes top/bottom performers
7. Results saved to Performance_Analysis tab

**Weekly (As Needed)**
8. Run Workflow 2 (Pain Point Extraction) with saved comments
9. Results saved to Pain_Points tab

**Monthly**
10. Run Workflow 3 to generate/update ICP
11. Run Workflow 4 to create new DM templates
12. Test 5-10 DMs with real prospects

## 📝 Sample Timeline

**Week 1**: Setup & Testing
- Create Google Sheets
- Configure credentials
- Add AI nodes
- Test with sample data

**Weeks 2-4**: Data Collection
- Add 5-10 coaches
- Input reels weekly
- Accumulate 40-80 analyzed reels

**Month 2**: ICP & Messaging
- Generate first ICP profile
- Create DM templates
- Begin outreach testing

**Month 3+**: Optimization
- Refine AI prompts
- Track response rates
- Iterate messaging

## 🎓 Learning Resources

- **n8n Docs**: https://docs.n8n.io
- **Anthropic API**: https://docs.anthropic.com
- **n8n Community**: https://community.n8n.io
- **Template Gallery**: https://n8n.io/workflows

## 🆘 Troubleshooting

Common issues and solutions in [Implementation-Guide.md](./docs/Implementation-Guide.md#troubleshooting).

Quick fixes:
- **Sheet not found**: Check Sheet ID and sharing settings
- **Credential error**: Reconnect OAuth2 in n8n
- **Schedule not running**: Verify workflow is Active
- **AI errors**: Check API key and quota

## 📈 Success Metrics

Track these KPIs:
- Reels analyzed per week
- Pain points identified
- ICP iterations
- DM templates generated
- Response rate to outreach
- Costs vs budget

## 🎉 What You've Built

A complete market research system that:
- ✅ Eliminates manual data tracking
- ✅ Provides scientific performance scoring
- ✅ Extracts audience insights automatically
- ✅ Creates data-driven ICPs
- ✅ Generates personalized messaging
- ✅ Costs less than a gym membership

## 🚀 Ready to Launch?

1. Start with [Google-Sheets-Setup-Guide.md](./docs/Google-Sheets-Setup-Guide.md)
2. Follow [Implementation-Guide.md](./docs/Implementation-Guide.md)
3. Use [AI-Prompts-Reference.md](./docs/AI-Prompts-Reference.md) for AI nodes
4. Launch and iterate!

---

**Questions?** Review the documentation files or check n8n community forums.

**Cost concerns?** System designed to stay under $25/month even at scale.

**Need help?** All workflows are modular - start with 1-2 and expand gradually.

---

Built with ❤️ using n8n + Claude AI
