#!/usr/bin/env python3
"""
Diagnosis-First Outreach System v2
===================================
A system for managing fitness coach outreach using SPIN Selling,
Sandler Up-Front Contracts, and Challenger principles.
"""

import json
import csv
import random
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).parent


def load_json(filename):
    """Load a JSON file from the system directory."""
    with open(BASE_DIR / filename, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_json(filename, data):
    """Save data to a JSON file."""
    with open(BASE_DIR / filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)


class OutreachSystem:
    def __init__(self):
        self.hooks = load_json('hooks.json')
        self.flows = load_json('conversation-flows.json')
        self.objections = load_json('objection-handling.json')
        self.offer = load_json('offer.json')
        self.tracking = load_json('tracking.json')

    # ==================== HOOKS ====================

    def get_random_hook(self, tier=None):
        """Get a random hook, optionally filtered by tier (a or b)."""
        if tier and tier.lower() == 'a':
            hooks = self.hooks['tier_a_professional']['hooks']
        elif tier and tier.lower() == 'b':
            hooks = self.hooks['tier_b_casual']['hooks']
        else:
            hooks = (self.hooks['tier_a_professional']['hooks'] +
                     self.hooks['tier_b_casual']['hooks'])
        return random.choice(hooks) if hooks else None

    def get_all_hooks(self, tier=None):
        """Get all hooks, optionally filtered by tier."""
        if tier and tier.lower() == 'a':
            return {'tier_a': self.hooks['tier_a_professional']['hooks']}
        elif tier and tier.lower() == 'b':
            return {'tier_b': self.hooks['tier_b_casual']['hooks']}
        return {
            'tier_a': self.hooks['tier_a_professional']['hooks'],
            'tier_b': self.hooks['tier_b_casual']['hooks']
        }

    def print_hooks(self, tier=None):
        """Print all hooks."""
        print("\n" + "="*60)
        print("HOOK LIBRARY")
        print("="*60)
        print(f"\nFormula: {self.hooks['hook_formula']}")

        hooks = self.get_all_hooks(tier)

        if 'tier_a' in hooks:
            print("\n--- TIER A: PROFESSIONAL ---")
            print(f"({self.hooks['tier_a_professional']['description']})")
            for h in hooks['tier_a']:
                print(f"\n  [{h['id']}] {h['template']}")
                print(f"       When: {h['when_to_use']}")
                print(f"       Detail: {h['observable_detail']}")

        if 'tier_b' in hooks:
            print("\n--- TIER B: CASUAL ---")
            print(f"({self.hooks['tier_b_casual']['description']})")
            for h in hooks['tier_b']:
                print(f"\n  [{h['id']}] {h['template']}")
                print(f"       When: {h['when_to_use']}")
                print(f"       Detail: {h['observable_detail']}")

        print("\n" + "="*60)

    # ==================== SPIN ====================

    def get_spin_questions(self, category=None):
        """Get SPIN questions, optionally filtered by category."""
        spin = self.flows['spin_questions']
        if category:
            return spin.get(category.lower(), {})
        return spin

    def print_spin(self, category=None):
        """Print SPIN discovery questions."""
        print("\n" + "="*60)
        print("SPIN DISCOVERY QUESTIONS")
        print("="*60)

        spin = self.get_spin_questions(category)

        if category:
            cat = spin
            if cat:
                print(f"\n--- {category.upper()} ({cat['description']}) ---")
                print(f"Pick: {cat['pick']}")
                for q in cat['questions']:
                    print(f"\n  [{q['id']}] {q['text']}")
        else:
            for cat_name, cat_data in spin.items():
                print(f"\n--- {cat_name.upper()} ({cat_data['description']}) ---")
                print(f"Pick: {cat_data['pick']}")
                for q in cat_data['questions']:
                    print(f"\n  [{q['id']}] {q['text']}")

        print("\n--- REFLECT-BACK PROMPTS ---")
        for prompt in self.flows['reflect_back_prompts']:
            print(f"  - {prompt}")

        print("\n--- BRANCHING PATHS ---")
        for path_id, path_data in self.flows['branching_paths'].items():
            print(f"\n  {path_data['name']}")
            print(f"    Focus: {path_data['focus']}")
            print(f"    Questions: {', '.join(path_data['questions_to_prioritize'])}")
            print(f"    Angle: \"{path_data['angle']}\"")

        print("\n" + "="*60)

    # ==================== MINI-AUDIT ====================

    def get_audit_examples(self):
        """Get all mini-audit examples."""
        return self.flows['mini_audit_examples']

    def print_audit(self):
        """Print mini-audit examples."""
        print("\n" + "="*60)
        print("MINI-AUDIT EXAMPLES")
        print("="*60)
        print("\nShow competence through observation before pitching.")

        for audit in self.get_audit_examples():
            print(f"\n--- {audit['name']} ---")
            print(f"\n  \"{audit['script']}\"")

        print("\n--- RULES ---")
        print("  - Be specific (reference actual things you saw)")
        print("  - Be observational, not judgmental")
        print("  - Show the gap, don't pitch the solution yet")
        print("  - Let them react before continuing")

        print("\n" + "="*60)

    # ==================== TEACH MOMENTS ====================

    def get_teach_moments(self):
        """Get all teach moments."""
        return self.flows['teach_moments']

    def print_teach(self):
        """Print teach moment library."""
        print("\n" + "="*60)
        print("TEACH MOMENT LIBRARY")
        print("="*60)
        print("\nShare one insight that shifts their perspective.")

        for teach in self.get_teach_moments():
            print(f"\n--- {teach['name']} ---")
            print(f"\n  \"{teach['script']}\"")

        print("\n--- RULES ---")
        print("  - Wait until you have 2-3 facts about their situation")
        print("  - Make it relevant to what they told you")
        print("  - One insight, not a lecture")
        print("  - Pause and let them respond")

        print("\n" + "="*60)

    # ==================== UP-FRONT CONTRACT ====================

    def get_upfront_contracts(self):
        """Get all up-front contract templates."""
        return self.flows['upfront_contracts']

    def print_upfront(self):
        """Print up-front contract templates."""
        print("\n" + "="*60)
        print("UP-FRONT CONTRACT TEMPLATES")
        print("="*60)
        print("\nSet clear expectations before the call (Sandler method).")

        for contract_id, contract in self.get_upfront_contracts().items():
            print(f"\n--- {contract['name']} ---")
            print(f"\n{contract['script']}")

        print("\n--- 'NO IS OKAY' PHRASES ---")
        for phrase in self.flows['no_is_okay_phrases']:
            print(f"  - \"{phrase}\"")

        print("\n" + "="*60)

    # ==================== SCORECARD ====================

    def get_scorecard(self):
        """Get the quality scorecard."""
        return self.tracking['quality_scorecard']

    def print_scorecard(self):
        """Print the quality scorecard."""
        scorecard = self.get_scorecard()

        print("\n" + "="*60)
        print("QUALITY SCORECARD")
        print("="*60)
        print(f"\n{scorecard['description']}")
        print(f"Passing: {scorecard['passing_score']}/{scorecard['max_score']}")

        for cat in scorecard['categories']:
            print(f"\n--- {cat['id']}. {cat['name']} ---")
            print(f"    {cat['description']}")
            for score, desc in cat['scores'].items():
                print(f"    [{score}] {desc}")

        print("\n" + "="*60)

    def score_conversation(self):
        """Interactive scoring of a conversation."""
        scorecard = self.get_scorecard()
        total = 0

        print("\n" + "="*60)
        print("SCORE A CONVERSATION")
        print("="*60)

        for cat in scorecard['categories']:
            print(f"\n{cat['id']}. {cat['name']}: {cat['description']}")
            for score, desc in cat['scores'].items():
                print(f"   [{score}] {desc}")
            while True:
                try:
                    score = int(input("   Score (0-2): ").strip())
                    if 0 <= score <= 2:
                        total += score
                        break
                    print("   Please enter 0, 1, or 2")
                except ValueError:
                    print("   Please enter a number")

        print(f"\n--- TOTAL: {total}/{scorecard['max_score']} ---")
        if total >= scorecard['passing_score']:
            print("PASSED - Quality conversation")
        else:
            print(f"NEEDS WORK - Below {scorecard['passing_score']} threshold")

        print("\n" + "="*60)

    # ==================== OFFER & PRICE ====================

    def print_offer(self):
        """Print the offer details."""
        print("\n" + "="*60)
        print("THE OFFER")
        print("="*60)

        details = self.offer['offer_details']
        print(f"\n{self.offer['offer_statement']['clear_statement']}")

        print("\n--- DETAILS ---")
        print(f"  What You Do: {details['what_you_do']}")
        print(f"  Deliverable: {details['deliverable']}")
        print(f"  Proof Period: {details['proof_period']}")
        print(f"  Price After: {details['price_after_proof']}")
        print(f"  What They Do: {details['what_they_do']}")

        print("\n" + "="*60)

    def print_price_ladder(self):
        """Print the price handling ladder."""
        print("\n" + "="*60)
        print("PRICE LADDER")
        print("="*60)
        print(f"\n{self.offer['price_ladder']['description']}")

        for level in self.offer['price_ladder']['levels']:
            print(f"\n--- Level {level['level']}: {level['stage']} ---")
            print(f"\n  \"{level['response']}\"")
            print(f"\n  Note: {level['notes']}")

        print("\n" + "="*60)

    def print_fit_check(self):
        """Print fit-check questions."""
        print("\n" + "="*60)
        print("FIT-CHECK QUESTIONS")
        print("="*60)
        print("\nAsk these BEFORE making an offer:")

        fit = self.offer['fit_check']
        for i, q in enumerate(fit['questions'], 1):
            print(f"\n  {i}. \"{q}\"")

        print(f"\nIf NO to any: \"{fit['if_no_to_any']}\"")
        print("\n" + "="*60)

    def print_risk_reversal(self):
        """Print risk reversal levels."""
        print("\n" + "="*60)
        print("RISK REVERSAL LEVELS")
        print("="*60)

        for level in self.offer['risk_reversal']['levels']:
            print(f"\n--- Level {level['level']}: {level['name']} ---")
            print(f"\n  \"{level['script']}\"")
            print(f"\n  When: {level['when_to_use']}")

        print("\n--- DO/DON'T ---")
        print("\nDO say:")
        for item in self.offer['guarantee_language']['do_say']:
            print(f"  + {item}")
        print("\nDON'T say:")
        for item in self.offer['guarantee_language']['dont_say']:
            print(f"  - {item}")

        print("\n" + "="*60)

    # ==================== OBJECTIONS ====================

    def handle_objection(self, objection_text):
        """Find and return the appropriate objection handler."""
        objection_text_lower = objection_text.lower()
        for obj_key, obj_data in self.objections['objections'].items():
            for trigger in obj_data['trigger_phrases']:
                if trigger in objection_text_lower:
                    return obj_data
        return None

    def print_objections(self):
        """Print all objection handlers."""
        print("\n" + "="*60)
        print("OBJECTION HANDLING")
        print("="*60)
        print(f"\nFormat: {self.objections['format']}")

        for obj_key, obj_data in self.objections['objections'].items():
            print(f"\n--- \"{obj_data['objection']}\" ---")
            print(f"\n  ACKNOWLEDGE: {obj_data['acknowledge']}")
            print(f"\n  CLARIFY: {obj_data['clarify']}")
            print("\n  REFRAME:")
            for branch, response in obj_data['reframe'].items():
                print(f"    - {branch}: {response}")
            print(f"\n  CTA: {obj_data['cta']}")

        print("\n" + "="*60)

    # ==================== FOLLOW-UPS ====================

    def print_followups(self):
        """Print follow-up sequences."""
        print("\n" + "="*60)
        print("FOLLOW-UP SYSTEM")
        print("="*60)

        print("\n--- RULES ---")
        for rule in self.flows['follow_up_rules']:
            print(f"  - {rule}")

        for fu_id, fu_data in self.flows['follow_ups'].items():
            print(f"\n--- {fu_data['name']} ---")
            print(f"Purpose: {fu_data['purpose']}")
            print("\nTemplates:")
            for template in fu_data['templates']:
                print(f"\n  \"{template}\"")

        print("\n" + "="*60)

    # ==================== TEST PLAN ====================

    def print_test_plan(self):
        """Print the test plan."""
        test_plan = self.tracking['test_plan']

        print("\n" + "="*60)
        print("TEST PLAN")
        print("="*60)
        print(f"\n{test_plan['description']}")

        for exp in test_plan['experiments']:
            print(f"\n--- Experiment {exp['id']}: {exp['name']} ---")
            print(f"  Hypothesis: {exp['hypothesis']}")
            print(f"  Control: {exp['variants']['control']}")
            print(f"  Test: {exp['variants']['test']}")
            print(f"  Track: {', '.join(exp['metrics_to_track'])}")
            print(f"  Sample: {exp['sample_size']}")
            print(f"  Duration: {exp['duration']}")

        print("\n" + "="*60)

    # ==================== METRICS ====================

    def print_metrics(self):
        """Print success metrics."""
        print("\n" + "="*60)
        print("SUCCESS METRICS")
        print("="*60)

        print("\n--- CURRENT ---")
        for metric, value in self.tracking['current_metrics'].items():
            print(f"  {metric.replace('_', ' ').title()}: {value}")

        print("\n--- TARGETS ---")
        for metric, target in self.tracking['success_metrics'].items():
            print(f"  {metric.replace('_', ' ').title()}: {target}")

        print("\n--- VOLUME ---")
        vol = self.tracking['volume_targets']
        print(f"  DMs/day: {vol['dms_per_day']}")
        print(f"  Accounts: {vol['accounts']}")
        print(f"  Goal: {vol['goal']}")

        print("\n" + "="*60)

    # ==================== FLOW ====================

    def print_flow(self):
        """Print the conversation flow."""
        print("\n" + "="*60)
        print("CONVERSATION FLOW")
        print("="*60)

        print("\n")
        for i, step in enumerate(self.flows['conversation_flow']):
            print(f"  {step}")
            if i < len(self.flows['conversation_flow']) - 1:
                print("      |")
                print("      v")

        print("\n--- STAGE OBJECTIVES ---")
        for stage_id, stage_data in self.flows['stages'].items():
            print(f"\n  {stage_data['name']}")
            print(f"    Objective: {stage_data['objective']}")
            print(f"    Success: {stage_data['success_criteria']}")

        print("\n" + "="*60)

    # ==================== MINDSETS ====================

    def print_mindsets(self):
        """Print stage mindsets."""
        print("\n" + "="*60)
        print("STAGE MINDSETS")
        print("="*60)

        for stage, data in self.tracking['stage_mindsets'].items():
            print(f"\n--- {stage.upper()} ---")
            print(f"  Your mindset: {data['your_mindset']}")
            print(f"  Their mindset: \"{data['their_mindset']}\"")

        print("\n" + "="*60)

    # ==================== LOGGING ====================

    def log_prospect(self, prospect_data):
        """Add a prospect to the tracking CSV."""
        csv_path = BASE_DIR / 'outreach-tracker.csv'
        fieldnames = [
            'prospect_name', 'platform', 'hook_tier', 'hook_id',
            'date_sent', 'stage', 'last_action', 'replied', 'reply_quality',
            'discovery_complete', 'call_booked', 'call_date',
            'showed_up', 'closed', 'quality_score', 'notes'
        ]

        file_exists = csv_path.exists()
        with open(csv_path, 'a', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            if not file_exists:
                writer.writeheader()
            writer.writerow(prospect_data)


def interactive_mode():
    """Run the interactive CLI."""
    system = OutreachSystem()

    print("\n" + "="*60)
    print("DIAGNOSIS-FIRST OUTREACH SYSTEM v2")
    print("="*60)
    print("\nMethodology: SPIN + Sandler + Challenger")
    print("\nCommands:")
    print("  hook [a|b]         - Get a random hook (tier a or b)")
    print("  hooks [a|b]        - List all hooks")
    print("  spin [category]    - Show SPIN questions (situation/problem/implication/need_payoff)")
    print("  audit              - Show mini-audit examples")
    print("  teach              - Show teach moment library")
    print("  upfront            - Show up-front contract templates")
    print("  flow               - Show conversation flow")
    print("  followups          - Show follow-up sequences")
    print("  objection <text>   - Get response for an objection")
    print("  objections         - Show all objection handlers")
    print("  offer              - Show the offer")
    print("  price              - Show price ladder")
    print("  fitcheck           - Show fit-check questions")
    print("  risk               - Show risk reversal levels")
    print("  scorecard          - Show quality scorecard")
    print("  score              - Score a conversation interactively")
    print("  testplan           - Show test plan")
    print("  metrics            - Show success metrics")
    print("  mindsets           - Show stage mindsets")
    print("  log                - Log a new prospect")
    print("  help               - Show this help")
    print("  quit               - Exit")

    while True:
        try:
            cmd = input("\n> ").strip().lower()
        except (EOFError, KeyboardInterrupt):
            print("\nGoodbye!")
            break

        if not cmd:
            continue

        parts = cmd.split(maxsplit=1)
        action = parts[0]
        args = parts[1] if len(parts) > 1 else None

        if action in ('quit', 'exit'):
            print("Goodbye!")
            break

        elif action == 'hook':
            hook = system.get_random_hook(args)
            if hook:
                print(f"\n>>> [{hook['id']}] {hook['template']}")
                print(f"    When: {hook['when_to_use']}")
                print(f"    Observable: {hook['observable_detail']}")
            else:
                print("No hooks found.")

        elif action == 'hooks':
            system.print_hooks(args)

        elif action == 'spin':
            system.print_spin(args)

        elif action == 'audit':
            system.print_audit()

        elif action == 'teach':
            system.print_teach()

        elif action == 'upfront':
            system.print_upfront()

        elif action == 'flow':
            system.print_flow()

        elif action == 'followups':
            system.print_followups()

        elif action == 'objection':
            if args:
                handler = system.handle_objection(args)
                if handler:
                    print(f"\n--- \"{handler['objection']}\" ---")
                    print(f"\nACKNOWLEDGE: {handler['acknowledge']}")
                    print(f"\nCLARIFY: {handler['clarify']}")
                    print("\nREFRAME:")
                    for branch, response in handler['reframe'].items():
                        print(f"  - {branch}: {response}")
                    print(f"\nCTA: {handler['cta']}")
                else:
                    print("No matching objection handler found.")
            else:
                print("Usage: objection <their objection text>")

        elif action == 'objections':
            system.print_objections()

        elif action == 'offer':
            system.print_offer()

        elif action == 'price':
            system.print_price_ladder()

        elif action == 'fitcheck':
            system.print_fit_check()

        elif action == 'risk':
            system.print_risk_reversal()

        elif action == 'scorecard':
            system.print_scorecard()

        elif action == 'score':
            system.score_conversation()

        elif action == 'testplan':
            system.print_test_plan()

        elif action == 'metrics':
            system.print_metrics()

        elif action == 'mindsets':
            system.print_mindsets()

        elif action == 'log':
            print("\n--- LOG NEW PROSPECT ---")
            prospect = {
                'prospect_name': input("Name: ").strip(),
                'platform': input("Platform (ig/tiktok/etc): ").strip(),
                'hook_tier': input("Hook tier (a/b): ").strip(),
                'hook_id': input("Hook ID (e.g., A1, B3): ").strip(),
                'date_sent': datetime.now().strftime("%Y-%m-%d"),
                'stage': input("Current stage: ").strip(),
                'last_action': datetime.now().strftime("%Y-%m-%d"),
                'replied': '',
                'reply_quality': '',
                'discovery_complete': '',
                'call_booked': '',
                'call_date': '',
                'showed_up': '',
                'closed': '',
                'quality_score': '',
                'notes': input("Notes: ").strip()
            }
            system.log_prospect(prospect)
            print("Prospect logged!")

        elif action == 'help':
            print("\nCommands:")
            print("  hook [a|b]         - Get a random hook")
            print("  hooks [a|b]        - List all hooks")
            print("  spin [category]    - Show SPIN questions")
            print("  audit              - Show mini-audit examples")
            print("  teach              - Show teach moment library")
            print("  upfront            - Show up-front contract templates")
            print("  flow               - Show conversation flow")
            print("  followups          - Show follow-up sequences")
            print("  objection <text>   - Get response for an objection")
            print("  objections         - Show all objection handlers")
            print("  offer              - Show the offer")
            print("  price              - Show price ladder")
            print("  fitcheck           - Show fit-check questions")
            print("  risk               - Show risk reversal levels")
            print("  scorecard          - Show quality scorecard")
            print("  score              - Score a conversation")
            print("  testplan           - Show test plan")
            print("  metrics            - Show success metrics")
            print("  mindsets           - Show stage mindsets")
            print("  log                - Log a new prospect")
            print("  quit               - Exit")

        else:
            print(f"Unknown command: {action}. Type 'help' for available commands.")


if __name__ == '__main__':
    interactive_mode()
