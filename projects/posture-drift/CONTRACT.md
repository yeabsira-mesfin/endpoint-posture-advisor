# Capture and comparison contract

From the repository root:
```
python advisor.py drift capture --input data/demo.json --customer northstar --output before.json
python advisor.py drift compare --before before.json --after after.json --format json
python advisor.py drift compare --before before.json --after after.json --format text
```

Capture validates the dataset, requires a known customer, and writes UTF-8 JSON containing exactly version (integer 1), customer_id, captured_at (the input generated_at instant, normalized to UTC), endpoints (sorted unique endpoint IDs), and findings. Each finding contains exactly endpoint_id, rule, and severity. Use the five field names from CHECKS as stable rule keys and telemetry_stale for the existing freshness rule. Match assess() severity and applicability. Sort findings by endpoint_id and rule. Every finding refers to an inventoried endpoint. Keep raw evidence, names, notes, and unrelated customers out of the capture. A known customer with no endpoints is valid.

Compare only captures with matching customer and supported version. Require an offset-aware timestamp, chronological order (equal instants allowed), correctly typed fields, unique endpoint IDs and finding keys, valid severity and rules, and endpoint membership. Reject malformed input with nonzero exit and a concise stderr diagnostic. A failed capture must preserve any pre-existing output. On success write compare results to stdout.

JSON compare output is an object with customer_id and changes. Each change contains exactly endpoint_id, rule, state, before, after. Severity values are strings or null when absent. An after-only finding is new. A before-only finding is cleared if its endpoint remains inventoried, otherwise retired. A finding on both sides is persistent if severity is unchanged and changed otherwise. Include persistent findings. Exclude healthy controls that stayed healthy. Order changes by endpoint_id then rule. A moved endpoint is retired in the old customer's report and assessed independently in the new customer's report. Never infer a cross-customer match.

Text output names the customer, gives counts for all five states (including zero), and identifies each affected endpoint, rule and severity transition. Identical inputs produce byte-identical output for a given format. Preserve existing assess, report, export and case behavior. No network services or additional dependencies.
