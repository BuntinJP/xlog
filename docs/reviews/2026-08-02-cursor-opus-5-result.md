# Cursor Opus 5 review result — 2026-08-02

The first trusted, read-only review reported F1-F11. Its high-severity finding reproduced a real legacy-feature regression: Fumadocs static image imports bypassed `ImageZoom`. Medium findings covered incomplete Oxlint plugin/rule coverage and untyped Next configuration. Low findings improved OG font failure isolation, frontmatter diagnostics, helper signatures, scaffold parameters, date failure behavior, and Wiki accuracy.

The remediation review verified those fixes and reported F12-F18: pin the Node runtime required by TypeScript Oxlint configuration, generate route types before type-aware lint on a clean checkout, timestamp the current validation evidence, correct the incremental-cache description, pin the side-effect-import rule, describe the permissive unused-Satteri placeholder exactly, and remove the scaffold branch-dependent source link.

All accepted findings are reflected in the working tree. Node 24 is pinned in CI with an engine floor of 22.18, lint regenerates route types, the safety rules are explicit, the Satteri preset remains prohibited while the placeholder patch exists, and the migration Wiki contains the final evidence boundary. Cursor could not run all commands in its read-only session; the implementation session independently reran the canonical CI and browser behavior checks after remediation.
