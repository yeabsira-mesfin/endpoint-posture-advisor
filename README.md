# SignalDesk: Endpoint Posture Advisor Lab

An independent, local portfolio project by **Yeabsira Mesfin** for security advisor, MDR/XDR, and customer security operations roles. It turns **synthetic** multi-customer endpoint configuration and detection events into posture assessments, prioritized response cases, SLA tracking, audit events, customer reports, and a read-only dashboard.

> This is a learning simulation. It does not connect to CrowdStrike Falcon, Falcon Complete, GovCloud, or real customer environments. Its lab checks are illustrative, not official vendor standards or a compliance assessment.

## Demo

Python 3.10+ is the only requirement. No package installation, account, API key, or external service is needed for the core workflow.

```bash
python advisor.py assess
python advisor.py report northstar
python advisor.py serve
```

Open **http://127.0.0.1:8765/**. The dashboard shows customer health, Windows/Linux/macOS endpoint coverage, an incident queue, SLA state, and remediation findings. `serve` listens only on loopback and serves synthetic data. Stop with Ctrl+C.

To write a customer-scoped report or dashboard snapshot:

```bash
python advisor.py report harbor --output out/harbor-report.txt
python advisor.py export
```

To document an investigation and keep an audit trail:

```bash
python advisor.py case CASE-101 investigating --note "Reviewing process ancestry and validating with customer."
python advisor.py case CASE-101 waiting_on_customer --note "Requested confirmation of intended script execution."
python advisor.py serve
```

Case state is stored locally in `data/cases.json`; updates append to `data/audit.jsonl`. Both are ignored by Git. Delete those two files to reset the demo. The dashboard refreshes the snapshot when the server starts.

## What the project demonstrates

| Role responsibility | Implemented workflow |
| --- | --- |
| Assess customer environment | Five endpoint checks plus telemetry freshness; score and per-endpoint findings |
| Recommend remediation | Actionable advice for missing/offline sensors, prevention, tamper protection, and logs |
| Triage detections | Evidence, severity and asset criticality, MITRE ATT&CK technique, and analyst next step |
| Track issues and SLAs | Open/investigating/waiting/resolved states, customer deadlines, breach indicators, audit entries |
| Communicate with customers | Scoped, plain-language service reports and a local advisor draft option |
| Work across multiple customers | Explicit customer/endpoint matching validation and isolated report views |

### AI-assisted advisory drafting (optional)

If you already have [Ollama](https://ollama.com/) and a local model running, use:

```bash
python advisor.py ai-draft CASE-101 --model llama3.2
```

This sends a **synthetic, scoped evidence subset** to a local model on `127.0.0.1` and requests a customer update. It does not make decisions, change case state, or contact anyone. The analyst must check the output against evidence before using it. The model and Ollama are optional; this project does not claim any measured AI efficiency gain.

## Decision rules and limitations

- A failing endpoint check creates a finding. A sensor installed but unseen for over 24 hours also creates a stale telemetry finding.
- Posture score is the percentage of passing checks, including telemetry freshness for installed sensors. These are **project-defined lab criteria**.
- Case priority combines detection severity with asset criticality; no automated containment occurs.
- A customer's SLA clock is derived from the fixed sample event time and that customer's sample SLA. An open case past due is marked `breached`. A closed case compares its resolution time to the original deadline. This is a simplified lab SLA, not a contractual service level.
- Input validation rejects detections whose endpoint belongs to a different customer. The UI escapes dataset text before rendering. The web server is local and read-only; it has no user authentication and should not be exposed to a network or used with sensitive data.
- Framework tags are **broad learning references**, not exact control mappings or certification claims. The two MITRE ATT&CK labels are mapped to demonstration detection types, not proof of an actual attack.

## Verify

```bash
python -m unittest discover -s tests -v
python advisor.py assess
```

## Reference material

- [NIST Cybersecurity Framework 2.0](https://www.nist.gov/cyberframework)
- [CIS Critical Security Controls v8.1](https://www.cisecurity.org/controls/v8-1)
- [MITRE ATT&CK: T1059, Command and Scripting Interpreter](https://attack.mitre.org/techniques/T1059/)
- [MITRE ATT&CK: T1078, Valid Accounts](https://attack.mitre.org/techniques/T1078/)

## Project layout

```text
advisor.py            Assessment, case workflow, report, local server, AI draft
data/demo.json         Synthetic customers, endpoints, and detections
web/                   Read-only responsive dashboard
tests/                 Tenant isolation, SLA, priority, and audit tests
```

MIT License. No affiliation with CrowdStrike.
