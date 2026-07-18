# COVERAGE_MATRIX — Audit of existing questions vs. target topics

*(Phase 1 deliverable. Level mapping used: the repo's `Easy`→Beginner, `Medium`→Intermediate,
`Hard`→Advanced. **No existing question reaches Boss level** by the brief's definition —
scale, ambiguity, or multi-concept stretch.)*

## 1. What exists

52 questions, all one type: executable dataframe-ETL challenges, each implemented in all
4 languages (PySpark / Scala / Pandas / Snowflake-SQL). Topics and difficulty below come
from `frontend/src/pages/questions.jsx`; quality notes from reading descriptions and
reference solutions in `backend/constants.py`.

| # | Title | Topics | Level | Quality note |
|---|---|---|---|---|
| 1 | Streaming Platform | conditional, datetime | Beg | Real transform, technique named in prompt |
| 2 | CRM SAAS Company | joins, string | Int | Good multi-input merge + concat |
| 3 | Property Management | pivot, joins, agg | Adv | The only pivot question in the repo |
| 4 | Social Media PII | regex | Int | Solid extraction task |
| 5 | E-Commerce Platform | agg, joins | Beg | Routine join+groupby |
| 6 | Correcting Posts | regex | Beg | Simple find/replace |
| 7 | Manufacturing Plant | window, conditional | Adv | Honest window use, small scope |
| 8 | Call Center | agg, distinct | Beg | Trivial-adjacent count-distinct |
| 9 | AI Research | window | Int | row_number over partition — canonical |
| 10 | Food & Beverage Sales | agg, joins | Int | 3-input combine, decent |
| 11 | Movies | null handling | Beg | One-liner filter |
| 12 | Insurance Customers | union | Beg | Trivial union |
| 13 | Mountain Climbing | distinct, joins, window | Adv | Good multi-step |
| 14 | Private Equity Firms | joins, nulls | Beg | Left-join null semantics — teaches well |
| 15 | SEO Optimization | window, joins, agg | Adv | Top-N per group ×2 grains — good |
| 16 | Running Payroll | case-when | Beg | Routine |
| 17 | Geology Samples | regex | Beg | Routine |
| 18 | Factory Duplicates | joins | Int | Dedup — useful pattern |
| 19 | VC Firms | agg | Int | Asks for sort, but grader ignores order |
| 20 | Construction Company | agg, joins, datetime | Adv | Multi-concept, fair Adv |
| 21 | Retail Stores | window, case-when, string | Adv | Good combo |
| 22 | Video Stream Platform | window, datetime | Adv | Duration/window math, fair |
| 23 | ML Metrics | agg, joins | Int | Routine |
| 24 | Customer Churn | window, joins | Adv | Churn framing is realistic |
| 25 | Mining Corporation | agg | Beg | Routine |
| 26 | Discount Confusion | regex, nulls | Adv | Messy-data cleaning — closest to real mess |
| 27 | Mortgage Interest Rates | agg, joins | Int | Routine |
| 28 | Organizing Parts | window | Int | Canonical ranking |
| 29 | Government Budgeting | window, math | Adv | Cumulative/pct math, fair |
| 30 | Transactional Data | window, regex, datetime | Adv | Best multi-concept in repo |
| 31 | Ecommerce Datetimes | datetime, joins | Int | Solid datetime handling |
| 32 | Amusement Park Outlier | agg, conditional | Int | Simple outlier rule, named in prompt |
| 33 | Aerospace Equipment | case-when | Int | Routine |
| 34 | User Interactions | union | Beg | Trivial |
| 35 | Camping Supplies | agg | Beg | Trivial |
| 36 | Funded Startups | agg, conditional | Beg | HAVING-style filter, fine |
| 37 | Pharmaceutical Equipment | window | Adv | Fair |
| 38 | Customer Cross Join | joins | Beg | Names the technique in the title |
| 39 | User Interactions 2 | agg | Beg | Trivial |
| 40 | Background Checks | string | Int | Long solution, mostly mechanical parsing |
| 41 | Architectural POI | case-when | Beg | Routine |
| 42 | Zoology | agg | Beg | Routine |
| 43 | Herpetology | window | Adv | Fair |
| 44 | PE Portfolio Values | agg | Int | Routine |
| 45 | GDP Growth Rate | window, case-when, math | Adv | lag + pct-change — good |
| 46 | Thermodynamics | joins | Beg | Routine |
| 47 | Materials Engineering | joins | Beg | Routine |
| 48 | Floors R Us | string | Int | Routine |
| 49 | Busy Airline | joins | Int | Multi-hop join — decent |
| 50 | Archaeology Records | conditional | Beg | Routine |
| 51 | Mathematical Regex | regex, math | Adv | Regex validation — niche but fine |
| 52 | Space Observatory | joins | Beg | Routine |

**Overall quality read:** the set tests real execution, not trivia, but nearly every prompt
*names the technique* ("perform a cross join", topic badges on the list page), so judgment/
technique-selection is rarely tested. Difficulty labels are internally consistent, but the
repo's "Hard" tops out at upper-intermediate by 2026 interview standards. Grading is
order-insensitive (see CODEBASE_MAP §3), so several "sorted by…" prompts (e.g. #19) are
not actually enforced — an authoring constraint, not a bug to fix.

### Counts by existing tag × level

| Tag | Beg | Int | Adv | Boss | Total |
|---|---|---|---|---|---|
| Complex Joins | 7 | 7 | 4 | 0 | 18 |
| Aggregate Functions | 6 | 6 | 4 | 0 | 16 |
| Windows Functions | 0 | 3 | 10 | 0 | 13 |
| Regular Expressions | 2 | 1 | 3 | 0 | 6 |
| Datetime Operations | 1 | 2 | 2 | 0 | 5 |
| Case When | 2 | 1 | 2 | 0 | 5 |
| Conditional Logic | 3 | 1 | 1 | 0 | 5 |
| String Manipulation | 0 | 3 | 1 | 0 | 4 |
| Null Handling | 2 | 0 | 1 | 0 | 3 |
| Math Functions | 0 | 0 | 3 | 0 | 3 |
| Union / Distinct | 3 | 0 | 1 | 0 | 4 |
| Pivot / Reshape | 0 | 0 | 1 | 0 | 1 |
| **All questions** | **21** | **16** | **15** | **0** | **52** |

## 2. Verdicts per target topic

Calibration sources for "what's currently asked" (mid-senior DE interviews, last ~12 months):
[Datavidhya's 2026 SQL question list](https://datavidhya.com/blog/sql-data-engineering-interview-questions/)
(window functions, CTEs, gaps-and-islands, dedup, query optimization),
[their 2026 Spark list](https://datavidhya.com/blog/apache-spark-data-engineering-interview-questions/)
(broadcast joins, AQE, skew, OOM, shuffle), and
[DEV's 2026 DE prep overview](https://dev.to/hadil/data-engineering-interview-prep-2026-what-actually-matters-sql-pipelines-system-design-478j)
(idempotent pipelines, dimensional modeling, Snowflake/Databricks stacks).

### Family A — executable

| Topic | Verdict | Reasoning | Planned additions |
|---|---|---|---|
| **Advanced MySQL** | **MISSING** | No MySQL/SQL runner exists locally (SQL only via optional external Snowflake creds, and those 52 SQL solutions mirror the dataframe tasks). Zero coverage of recursive CTEs, gaps-and-islands, sessionization, EXPLAIN/indexing anywhere. | **10 executable SQL** (3 Int / 4 Adv / 3 Boss) — pending runner approval, see Decision 1. MySQL-specific EXPLAIN/indexing/optimization reasoning **cannot be honestly executed** on a non-MySQL engine → 6 theory questions under Family B instead. |
| **Python data wrangling (pandas)** | **PARTIAL** | Strong join/agg/window/regex/datetime coverage at Beg–Int; genuine gaps: reshaping (1 pivot, 0 melt), messy/malformed-data cleaning beyond #26, sessionization & gaps-and-islands, SCD-style merges, apply-vs-vectorization judgment, and any Boss level. | **8 pandas questions**: 3 Int (pivot_table/melt reshape; malformed mixed-type cleaning; datetime bucketing), 3 Adv (gaps-and-islands; SCD2 construction; multi-source reconciliation), 2 Boss (event sessionization + attribution; late/duplicate data dedup with conflicting records). Perf judgment (apply vs vectorization) goes in the stored `optimization` explanations — the harness can only assert correctness, not runtime. |

### Family B — theory (MCQ + rubric short-answer)

**All 11 topics: MISSING.** No theory question type exists in the app at all (CODEBASE_MAP §6).
Everything below is gated on Decision 2 (new question type).

Counts are driven by the brief's subtopic lists (~1 question per named subtopic, +1–2 where
interviews weight the topic heavily), not by a quota:

| Topic | Levels | Planned | Rationale |
|---|---|---|---|
| Data Modelling | Int–Adv | 8 (5 MCQ / 3 SA) | 6 named subtopics; SCD types & grain get extra depth — top interview ask |
| DE System Design | **Beg**–Adv | 10 (4 MCQ / 6 SA) | Widest subtopic list; brief requires Beginner tier + "it depends" ambiguous prompts (SA-heavy by nature) |
| Spark | Int–Adv | 10 (6 MCQ / 4 SA) | Highest-frequency interview topic; skew/OOM/AQE each deserve their own question |
| Snowflake | Int–Adv | 8 (5/3) | 7 named subtopics |
| DBT | Int–Adv | 8 (5/3) | 8 named subtopics, merge tests+sources into one |
| Data Warehousing | Int–Adv | 6 (4/2) | Overlaps Modelling (SCD) and Storage (columnar) — kept lean to avoid redundancy |
| Data Storage | Int–Adv | 8 (5/3) | Format tradeoffs + small-files + object-store semantics are distinct, current asks |
| Data Processing | Int–Adv | 7 (4/3) | Overlaps Streaming on delivery guarantees — dedup'd against that topic |
| AWS | Int–Adv | 8 (5/3) | 8 named services; grouped into when-to-use-which scenarios rather than per-service trivia |
| Batch & Live Streaming | Int–Adv | 8 (4/4) | Kafka/Kinesis semantics + stream-table duality + Flink/SSS |
| Advanced MySQL (theory slice) | Int–Adv | 6 (4/2) | EXPLAIN reasoning, index design, covering indexes, optimizer behavior — not executable on DuckDB |
| Data Testing | Int–Adv | 6 (4/2) | 7 named subtopics, several merge naturally |
| **Total theory** | | **≈93** | Trimmed during authoring by the self-review loop if any question is redundant |

**Grand total planned: 18 executable (× 4 language implementations where applicable) + ~93 theory.**
I will author in per-topic batches and cut anything that doesn't close a matrix gap.

## 3. Decisions I need from you before authoring

1. **SQL runner** *(blocks MySQL executable questions)* — recommend **DuckDB inside
   `db-lambda`** : add `duckdb` to `db-lambda/Dockerfile`, branch the handler on a new
   payload flag, register tests' input tables, run the submitted query, reuse the existing
   `sort_dict` comparison. Stays fully behind the exec() isolation wall, no networked DB,
   no external creds. Tradeoff: DuckDB is ANSI-flavored, not MySQL dialect — so executable
   questions target portable modern SQL (windows, CTEs incl. recursive, gaps-and-islands,
   sessionization), and MySQL-specific EXPLAIN/indexing becomes theory. Alternatives:
   a real MySQL container (faithful dialect, but a new networked service — you said flag
   before doing this) or reusing the Snowflake path (requires paid external creds; can't
   verify locally — worst option).
2. **New theory question type** *(blocks all of Family B)* — minimal extension, additive
   only: a separate `theory_problems` dict in `constants.py` (fields: `id, type
   [mcq|short_answer], topic, subtopic, difficulty, tags, question, options+key+
   per-distractor-explanations | rubric{1,3,5}+follow_up_probes, explanation`), one new
   GET-style endpoint mirroring `get_problem`, one new frontend page (list + answer view;
   MCQ graded against the key client-side, short-answer shows rubric for self-scoring —
   no LLM grading in this stack). Existing routes/IDE untouched.
3. **4-language requirement** — every new executable question must ship pyspark, scala,
   pandas, snowflake implementations (UI has no per-problem language filter). I'd author
   all four; pandas+pyspark+scala verified via the local containers, **snowflake solutions
   marked UNVERIFIED unless you provide `.env` creds**. Alternative is a frontend change
   to allow per-problem language subsets — more invasive, I don't recommend it.
   New SQL questions (Decision 1) would be a new language key with the same problem —
   I'd make them SQL-first problems where the 4 existing languages also get solutions,
   keeping the invariant intact.
4. **Boss difficulty label** — the UI badge enum is Easy/Medium/Hard only. Recommend
   adding a "Boss" branch to the badge styling in `questions.jsx` (3-line change) rather
   than mislabeling Boss questions as Hard. Metadata (`topic, subtopic, tags[]`) for all
   new questions will live in a new optional `metadata` field per problem in
   `constants.py` — the API passes it through, current UI ignores it, JD-matcher-ready.

**No existing question will be modified or deleted.** One flag for your review (not a change):
several existing prompts promise sorted output the grader can't enforce (#19 and similar) —
leaving as-is per your instructions.
