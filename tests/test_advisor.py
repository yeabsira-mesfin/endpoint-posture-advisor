import copy
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch

import advisor


NOW = datetime(2026, 9, 25, 23, 0, tzinfo=timezone.utc)


class AdvisorTests(unittest.TestCase):
    def setUp(self):
        self.data = advisor.read_json(advisor.DEMO)

    def test_customer_scoping_and_cross_tenant_rejection(self):
        report = advisor.snapshot(self.data, NOW)
        for customer in report["customers"]:
            self.assertTrue(all(case["customer_id"] == customer["id"] for case in customer["cases"]))
            self.assertTrue(all(f["endpoint_id"].startswith("NS-" if customer["id"] == "northstar" else "HB-") for f in customer["findings"]))
        bad = copy.deepcopy(self.data)
        bad["detections"][0]["customer_id"] = "harbor"
        with self.assertRaisesRegex(ValueError, "crosses customer"):
            advisor.snapshot(bad, NOW)

    def test_sla_and_priority(self):
        report = advisor.snapshot(self.data, NOW)
        northstar = next(c for c in report["customers"] if c["id"] == "northstar")
        credential = next(c for c in northstar["cases"] if c["id"] == "CASE-102")
        self.assertEqual(credential["sla_state"], "breached")
        self.assertEqual(credential["priority"], "critical")
        self.assertEqual(credential["technique"], "T1078")
        self.assertEqual(credential["due_at"], "2026-09-25T17:00:00Z")
        self.assertGreater(len(northstar["findings"]), 0)

    def test_case_update_audited_and_resolution_deadline(self):
        with tempfile.TemporaryDirectory() as directory:
            with patch.object(advisor, "CASES", Path(directory) / "cases.json"), patch.object(advisor, "AUDIT", Path(directory) / "audit.jsonl"):
                advisor.update_case("CASE-201", "resolved", "Customer validated; ticket closed.", self.data, NOW)
                saved = advisor.load_saved()
                case = next(c for c in advisor.build_cases(self.data, NOW, saved) if c["id"] == "CASE-201")
                self.assertEqual(case["sla_state"], "met")
                self.assertEqual(case["status"], "resolved")
                self.assertIn("CASE-201", advisor.AUDIT.read_text())
                with self.assertRaisesRegex(ValueError, "cannot be changed"):
                    advisor.update_case("CASE-201", "open", "Reopen", self.data, NOW)


if __name__ == "__main__":
    unittest.main()
