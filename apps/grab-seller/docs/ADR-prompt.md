You are a senior software architect. I need to write an Architectural Decision Record (ADR) for my project.

# ADR #: [Title]

**Status:** [Proposed | Accepted | Deprecated | Superseded]  
**Date:** [YYYY-MM-DD]

---

## 1. The Problem

**What's not working?**  
[Describe the current gap, pain point, or risk in 1-2 sentences.]

**What's at stake?**  
[Why does this decision matter right now? What happens if we don't address it?]

---

## 2. What We Decided

**The core approach:**  
[A single, clear sentence summarizing the overall decision.]

**Key changes:**
- [Change 1]
- [Change 2]
- [Change 3]

**What stays the same:**  
[Briefly note any major systems or processes that remain unaffected by this decision.]

---

## 2.1. Visual Overview

> *Diagrams to understand the architecture at a glance.*

### High-Level Flow / Components
```
[Insert Mermaid flowchart, sequence, or component diagram here]
```

---

## 3. Why This Approach

**Primary reasons:**
1. [Reason 1]
2. [Reason 2]
3. [Reason 3]

---

## 4. Trade-offs

| Pros | Cons |
|-------|-------|
| [Benefit 1] | [Drawback 1] |
| [Benefit 2] | [Drawback 2] |
| [Benefit 3] | [Drawback 3] |

---

## 5. What Needs to Change

**New components/modules to build:**
- [List new code, services, or infrastructure needed.]

**Changes to existing systems:**
- [List updates, deprecations, or migrations required for current systems.]

**Team impact:**
- [How does this affect the developers, workflows, or API consumers?]

---

## 6. Migration Plan

- **Phase 1:** [Immediate first steps]
- **Phase 2:** [Next steps]
- **Phase 3:** [Final rollout steps]

**Rollback strategy:**  
[How do we revert this safely if something goes wrong?]

---

## 7. Related Documents

- [Link to PRD / BRD]
- [Link to related ADR]
- [Link to technical specifications]