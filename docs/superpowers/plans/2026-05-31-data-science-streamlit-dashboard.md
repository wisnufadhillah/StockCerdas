# Data Science Streamlit Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Streamlit dashboard that satisfies Dicoding Data Science dashboard requirements and links the AI deliverables to the Data Science artifacts.

**Architecture:** Keep the existing FastAPI AI service in `AI/app.py`. Create a separate `data-science/streamlit_app.py` that reads `retail_cleaned.csv`, `retail_feature_engineered.csv`, and AI artifacts from `../AI`, then renders checklist evidence, EDA insights, restock analysis, model readiness, and downloadable filtered data.

**Tech Stack:** Streamlit, Pandas, NumPy, Matplotlib, Seaborn, TensorFlow/FastAPI artifact references.

---

### Task 1: Streamlit Dashboard

**Files:**
- Create: `data-science/streamlit_app.py`

- [ ] Load cleaned and feature-engineered CSVs with `st.cache_data`.
- [ ] Load AI evaluation JSON and feature column JSON.
- [ ] Render sidebar filters for product, customer category, and date range.
- [ ] Render tabs for Overview, EDA, Restock Forecasting, AI Checklist, and Data Dictionary.
- [ ] Add `st.download_button` for filtered data.

### Task 2: Deployment Requirements

**Files:**
- Create: `data-science/requirements.txt`
- Create: `data-science/README.md`

- [ ] Add Streamlit deployment dependencies.
- [ ] Document local run command and dashboard-to-AI connection.

### Task 3: Verification

**Files:**
- No new files.

- [ ] Run Python syntax check on `streamlit_app.py`.
- [ ] Run a lightweight import check for Streamlit availability if installed.
- [ ] Inspect git diff for unintended changes.
