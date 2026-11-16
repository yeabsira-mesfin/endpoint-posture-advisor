# Task description

I'm working on SignalDesk, an offline Python endpoint-posture lab. Today I can see which checks fail for one synthetic customer, but I can't tell whether a finding is new, still present, cleared, or missing because its endpoint left inventory. Add a customer-scoped capture and comparison workflow that answers those questions, including severity changes. Use the existing assessment rules, expose both commands through advisor.py, and give analysts a readable report alongside deterministic JSON. The exact command and file formats are in CONTRACT.md.

## How to judge completion

Run the existing unittest suite and the project acceptance runner from the repo root. Capture two versions of data/demo.json in a temporary directory, changing one posture field in the second copy. Compare in JSON and text and reconcile both with assess(). Test exactly 24 hours and just over 24 hours with an installed sensor, and repeat without an installed sensor. Remove a failing endpoint and confirm its finding is retired. Confirm invalid input returns an error and leaves a pre-existing output intact. Check empty inventories, shuffled arrays, changed UTC offsets, duplicate keys, mismatched customers, invalid severity, unsupported versions, reversed times and deterministic reruns. Inspect advisor.py, any new drift module, tests/, and the user documentation. Commands in CONTRACT.md and the original demo workflow must work offline.

## Other notes for reviewers

All examples are synthetic. Use temporary directories. The prior case identity repair is a separate task. Verify capture and compare together as well as independently. Keep an exact record of commands, observed outputs and any unverified behavior. The example matrix mainly checks compare; supplement it with capture, reporting and error-path tests.
