# Preparing the starting source

Use an export of the project commit. Include the app, synthetic demo input, web assets, existing tests, LICENSE, and the project contract, acceptance runner and example cases. Keep the reviewer form, work log, prior transcripts and platform instructions outside the uploaded source. Exclude .git, workflow metadata, caches, local audit and case history, generated snapshots, environment files and credentials. Inspect the ZIP member list and extracted text before upload. Preserve the MIT copyright notice. The public source identifies its author; check any platform anonymity requirement before submitting.

Run the baseline suite in the extracted directory and run the project runner with --inventory. The new drift command is the assignment, so comparison acceptance is expected to fail on the starter. After implementation run both suites and retain actual results.
