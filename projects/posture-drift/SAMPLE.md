# A worked comparison

On Monday endpoint demo-01 has logging disabled, with high severity. On Tuesday logging is enabled, but prevention mode has been disabled on the same endpoint. The expected ordered rows are:

| Endpoint | Rule | State | Before | After |
| --- | --- | --- | --- | --- |
| demo-01 | logging_enabled | cleared | high | null |
| demo-01 | prevention_mode | new | null | high |

If Tuesday's inventory contains no demo-01, Monday's logging finding is retired. A missing device supplies no evidence that logging was restored. A severity change on a retained rule produces one changed row even when the finding title stays the same.
