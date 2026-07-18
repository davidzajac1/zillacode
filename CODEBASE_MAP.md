# CODEBASE_MAP — How Zillacode questions work

*(Phase 0 deliverable. Everything below was verified by reading the code, not assumed.)*

## 1. Where questions live and how they flow

There is exactly **one question type** in the entire app: an executable "dataframe ETL" code
challenge, solvable in 4 languages (PySpark, Scala Spark, Pandas, Snowflake/DBT-SQL).
There are no MCQ, short-answer, or theory types anywhere.

**Storage:** `backend/constants.py` — a single Python dict literal `problems` (~7,200 lines).
Keys are problem IDs as **strings** `"1"`–`"52"` (declared out of order; order is irrelevant).
There is no parser/transform layer: `POST /get_problem` (`backend/app.py:21`) returns
`problems[id]` verbatim as JSON, and the frontend consumes it directly.

**Render path:** `frontend/src/pages/ide.jsx` →
- `description` is injected as raw HTML via `dangerouslySetInnerHTML` (ide.jsx:236)
- `language[<lang>].display_start` seeds the CodeMirror editor (cached per
  `<lang>-<problemNumber>` in `localStorage`)
- `solution` / `explanation` / `complexity` / `optimization` fill the 4 tabs of the
  "Solution" modal (`explanation`/`complexity`/`optimization` are also raw HTML;
  `solution` is plain code shown read-only in CodeMirror)
- When language = snowflake, the description is client-side rewritten:
  `DataFrame` → `DBT model`, `function` → `DBT model` (ide.jsx:167-173)

**Question list page:** `frontend/src/pages/questions.jsx` — a **hardcoded** `rows` array
(`createData(number, title, industry, topics[], difficulty)`). This is the only place
titles, topics, and difficulty exist; the backend knows nothing about them.

## 2. Exact schema of a question (the fill-in template)

```python
"53": {                       # string ID; next free ID is "53"
    "description": '<HTML string>',   # single-quoted, one line, \n-escaped HTML.
        # Convention: title in <p><strong style="font-size: 16px;">Title</strong></p>,
        # schema tables as ASCII art inside <pre style="...">, sections separated by
        # <p>&nbsp;</p>. Includes: input schema(s), task statement, result schema, example.
    "tests": [                # convention: exactly 2 tests per problem
        {
            "input": {
                # one key per input DataFrame; the key IS the etl() parameter name
                "some_df": [ {"col": value, ...}, ... ]   # list of row dicts
            },
            "expected_output": [ {"col": value, ...}, ... ],  # list of row dicts
        },
        { ...second test... },
    ],
    "language": {
        # ALL FOUR keys are REQUIRED — the UI language picker offers all 4 for
        # every problem and reads language[lang].display_start unguarded.
        "pyspark":   {"display_start": ..., "solution": ..., "explanation": ...,
                      "complexity": ..., "optimization": ...},
        "scala":     { same 5 fields },
        "pandas":    { same 5 fields },
        "snowflake": { same 5 fields },
        # explanation / complexity / optimization are HTML strings ("<div> <p>...").
    },
},
```

**`display_start` encoding rules (enforced at runtime):** `run_code` calls
`extract_function` (`backend/tools.py:295`) which rejects any submission whose
whitespace-stripped prefix does not exactly equal the language's global preamble
constant. Therefore:

- pandas `display_start` **must** be
  `pandas_problem_start + "def etl(<input names>):" + pandas_problem_end`
  (constants at `backend/constants.py:28-30`); same pattern for pyspark
  (`constants.py:20-22`). All user code must live inside `def etl(...)` —
  any top-level statement after it is rejected.
- snowflake `display_start` is `-- Write query here\n`; solutions are SQL with
  DBT-style Jinja refs: `{{ ref("some_df") }}` per input, no trailing `;`.
- scala follows `scala_problem_start`/`scala_problem_end` with `def etl(...): DataFrame = {`.

**Test-data encoding rules:**
- Dates are ISO strings `"2022-05-06"`; nulls are `None`; numbers are plain ints/floats.
- Datetime values `"YYYY-MM-DD HH:MM:SS"` strings.
- Row dicts in `expected_output` conventionally have keys in alphabetical order
  (the comparator re-sorts anyway — see §3).

## 3. Execution & grading path per language

`POST /run_code {to_run, problem, language}` → `backend/app.py:34`.

| Language | Where code runs | Mechanism |
|---|---|---|
| pyspark | `spark-lambda` container (10.5.0.6, Lambda RIE) | `extract_function` strips preamble → lambda builds `spark.createDataFrame(test_input)` per input, appends user function + `df_result = etl(...)`, runs it with **`exec()`** (`spark-lambda/lambda_function.py:55`) |
| pandas | `db-lambda` container (10.8.0.6) | same pattern; `pd.DataFrame(input)` + **`exec()`** (`db-lambda/lambda_function.py:48`) |
| scala | `scala-spark-lambda` container (10.4.0.6) | backend generates a full Scala script per test (`tools.py:_create_scala_code`), inputs injected as JSON via `spark.read.json`; one lambda invocation **per test** (+5s sleep each in local mode) |
| snowflake | **Flask backend itself** (`tools.py:_make_cte`) | user SQL is Jinja-rendered (`ref` → CTE name), wrapped in `WITH <input CTEs> ... SELECT * FROM __submission`, executed via SQLAlchemy against a **real external Snowflake account** — requires `.env` creds; without them the language errors out. No local SQL engine exists. |

**Comparison semantics (critical for authoring):** graders normalize with `sort_dict`:
rows → dicts with keys sorted; string values `"null"/"none"/"n/a"/"nan"` (any case) → `None`;
rows sorted by their JSON serialization; then `result == expected_output`.
Consequences:
- **Row order and column order are ignored.** A question can *ask* for ordering
  ("sorted by X desc") but the harness cannot grade it. Don't author questions whose
  point is ordering.
- db-lambda (pandas) compares floats **exactly** (no rounding) and does **not**
  lowercase column names; the snowflake/scala paths lowercase keys, round floats to
  5 decimals, and coerce whole floats to int (`tools.py:sort_dict`/`to_int`).
  Expected outputs must be reproducible bit-for-bit in pandas — avoid unstable float
  math, or make solutions round explicitly.
- pandas `NaN` stringifies to `"nan"` → normalized to `None`, so `None` in
  `expected_output` matches NaN cells.

**Feedback strings:** success = `"Problem Correct!"`; failure = `INCORRECT` + markdown
tables of input/output/expected; errors are remapped to user-visible line numbers
(`tools.py:format_pyspark_error`).

## 4. Isolation boundary (do not cross)

- Arbitrary user code (`exec()`) runs **only** inside `db-lambda` and `spark-lambda`
  (and compiled Scala in `scala-spark-lambda`) — separate containers on dedicated
  bridge networks, invoked over HTTP (local, `TESTING=1`) or `boto3 lambda.invoke` (AWS).
  README §"DB Lambda" states the design intent: the exec service "has no permissions
  and can't make outbound connections."
- The Flask backend never `exec()`s user input. The snowflake path does pass user SQL
  from the backend, but to an external SQL engine, not the Python runtime.
- **Rule for any new runner:** it must live in (or beside) `db-lambda`/`spark-lambda`,
  behind the same network wall — never in Flask. An in-process SQL engine (e.g. DuckDB)
  would go into `db-lambda`'s image + handler, keyed off a new payload field.

## 5. Add-a-question checklist

1. `backend/constants.py`: add `"<next-id>": {...}` to `problems` (next free ID: **53**).
   Follow the template in §2 exactly, all 4 language entries included.
2. `frontend/src/pages/questions.jsx`: append a `createData(<id>, title, industry,
   [{topic}...], difficulty)` row. Difficulty must be `"Easy" | "Medium" | "Hard"` —
   the badge color ternary (questions.jsx:483-491) knows only those three; anything
   else renders with no color.
3. `frontend/src/pages/ide.jsx:36`: bump `const numProblems = 52;` — gates the
   Next/Prev buttons and the "n/52" counter.
4. Verify via the dev stack: **`make up` (docker-compose.dev.yaml, builds from source)**.
   Plain `docker compose up` pulls prebuilt `davidzajac1/*` Docker Hub images and will
   **not** show local changes.
5. `make test-backend` runs the existing pytest smoke tests inside the backend container.

## 6. Things that would break with new topics/types (frontend & backend assumptions)

- `numProblems` hardcoded (ide.jsx:36); question IDs must be dense `1..N` integers —
  Next/Prev navigate by `±1`, so gaps 404 into an eternal spinner.
- The 4 languages are hardcoded in the ide.jsx menu (lines 370-373) and in
  `app.py`'s if/elif; **every problem must implement all 4** — there is no per-problem
  language filtering. A SQL-only or pandas-only question would crash the UI when the
  user switches to a missing language (and pyspark is the default on load).
- No question-type field exists anywhere. MCQ / short-answer / rubric grading would
  need: new fields in `problems`, a new endpoint or `get_problem` passthrough, a new
  frontend component (the IDE page assumes CodeMirror + Run Code), and routing logic.
  This is a real (if modest) schema + UI extension, not a content addition.
- Difficulty enum is Easy/Medium/Hard only (see §5.2). "Boss" would need a new badge
  branch in questions.jsx.
- `description`/`explanation`/`complexity`/`optimization` are raw-HTML injected —
  content must be trusted/authored, never user-supplied.
- Cypress e2e (`frontend/cypress/e2e/test-ide.cy.js`) and backend pytest exist but are
  thin; they hardcode problem 1's pyspark solution — safe as long as problem 1 is untouched.
- `mysql-connector-python` sits unused in `backend/Pipfile` — remnant of the old SAAS;
  there is **no MySQL execution path** in the code.
