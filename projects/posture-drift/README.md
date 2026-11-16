# Customer posture drift

SignalDesk can assess one dataset. An analyst reviewing this week's results also needs to know which findings appeared, persisted, or cleared since the previous assessment. Build an offline capture and comparison workflow on top of the existing assessment rules.

## Start the session

Run `python -m unittest discover -s tests -v` from the repository root. Read `advisor.py`, particularly CHECKS, assess(), validate(), and the command dispatcher. Read [the contract](CONTRACT.md), then run `python projects/posture-drift/check.py --inventory`. The starter supplies acceptance examples. Implement the commands yourself in the work session.

## Work budget

| Work | Minutes | Evidence to keep |
| --- | ---: | --- |
| Trace assessment and export, establish baseline, choose identifiers | 45 | Baseline output and design note |
| Implement scoped, versioned capture and validation | 75 | Round-trip, invalid input and output-preservation tests |
| Implement comparison and inventory semantics | 90 | Table tests for rule transitions, retirement and ordering |
| Wire CLI and human-readable reporting | 55 | Before/after CLI transcript and one report |
| Check integration, failure paths and tenant isolation | 65 | Full suite and acceptance results |
| Document compatibility and assemble reviewer evidence | 30 | Reproduction steps and measured work log |

Estimated total: six hours of hands-on work. Record actual active time. Start with the baseline and capture contract, then implement compare, then exercise the entire workflow.
