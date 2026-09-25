const $ = (id) => document.getElementById(id);
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));
const nameOf = (data, id) => data.customers.find((c) => c.id === id)?.name ?? id;
const pill = (value) => `<span class="pill ${escapeHtml(value)}">${escapeHtml(value.replaceAll("_", " "))}</span>`;
let snapshot;

function metrics(data) {
  const items = [
    ["MANAGED CUSTOMERS", data.summary.customers, "Active demo environments", "▦", "blue"],
    ["ENDPOINT COVERAGE", data.summary.endpoints, "Windows · Linux · macOS", "◎", "violet"],
    ["OPEN CASES", data.summary.open_cases, "Detection events under review", "◈", "orange"],
    ["SLA BREACHES", data.summary.breached_cases, "Require advisor follow-up", "⌁", "red"],
  ];
  $("metrics").innerHTML = items.map(([label, value, note, icon, tone]) => `<article class="metric"><div class="metric-top"><span>${label}</span><b class="metric-icon ${tone}">${icon}</b></div><strong>${value}</strong><small>${note}</small></article>`).join("");
}

function customers(data) {
  $("customer-list").innerHTML = data.customers.map((c) => `<article class="customer"><div class="customer-logo">${escapeHtml(c.name.split(" ").map((w) => w[0]).join(""))}</div><div class="customer-body"><div class="customer-name">${escapeHtml(c.name)} <span>${c.endpoint_count} endpoints</span></div><div class="track"><div style="width:${c.score}%" class="${c.score < 70 ? "warn" : ""}"></div></div><div class="customer-meta"><span>${c.passing_checks} / ${c.total_checks} checks passing</span><span>${c.findings.length} findings</span></div></div><div class="score">${c.score}<small>%</small></div></article>`).join("");
}

function cases(data) {
  const all = data.customers.flatMap((c) => c.cases).filter((c) => c.status !== "resolved");
  all.sort((a,b) => Number(b.sla_state === "breached") - Number(a.sla_state === "breached") || Date.parse(a.due_at) - Date.parse(b.due_at));
  $("case-count").textContent = `${all.length} OPEN`;
  $("case-list").innerHTML = all.map((c) => `<article class="case"><div class="case-row"><span class="case-id">${escapeHtml(c.id)} <span class="case-separator">/</span> ${escapeHtml(nameOf(data,c.customer_id))}</span>${pill(c.sla_state)}</div><h3>${escapeHtml(c.kind.replaceAll("_", " "))}</h3><p>${escapeHtml(c.evidence)}</p><div class="case-foot"><span>${escapeHtml(c.endpoint_id)} · MITRE ${escapeHtml(c.technique)}</span>${pill(c.priority)}</div><details><summary>Advisor next step</summary><p>${escapeHtml(c.recommendation)}</p><small>Due ${new Date(c.due_at).toLocaleString()}</small></details></article>`).join("") || '<p class="empty">No open cases.</p>';
}

function findings(data, selected) {
  const all = data.customers.filter((c) => selected === "all" || selected === c.id).flatMap((c) => c.findings.map((f) => ({...f, customer: c.name})));
  const rank = {critical:4,high:3,medium:2,low:1};
  all.sort((a,b) => rank[b.severity] - rank[a.severity] || a.endpoint_id.localeCompare(b.endpoint_id));
  $("findings-list").innerHTML = all.map((f) => `<tr><td><strong>${escapeHtml(f.endpoint_id)}</strong><small>${escapeHtml(f.customer)}</small></td><td>${escapeHtml(f.title)}</td><td>${pill(f.severity)}</td><td class="guidance">${escapeHtml(f.recommendation)}</td><td class="framework">${escapeHtml(f.framework)}</td></tr>`).join("") || '<tr><td colspan="5">No findings for this customer.</td></tr>';
}

fetch("/snapshot.json", {cache:"no-store"}).then((r) => {if (!r.ok) throw Error(`HTTP ${r.status}`); return r.json();}).then((data) => {
  snapshot = data;
  $("asof").textContent = `ASSESSED ${new Date(data.as_of).toLocaleString()}`;
  metrics(data); customers(data); cases(data); findings(data,"all");
  $("customer-filter").insertAdjacentHTML("beforeend", data.customers.map((c) => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)}</option>`).join(""));
  $("customer-filter").addEventListener("change", (e) => findings(snapshot,e.target.value));
}).catch((error) => {$("asof").textContent = "Could not load assessment"; $("metrics").textContent = error.message;});
