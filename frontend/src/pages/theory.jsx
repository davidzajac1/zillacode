import { Typography } from "@material-tailwind/react";
import { Footer } from "@/widgets/layout";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

const difficultyColor = (difficulty) =>
  difficulty === "Beginner"
    ? "bg-green-400"
    : difficulty === "Intermediate"
      ? "bg-blue-400"
      : difficulty === "Advanced"
        ? "bg-red-400"
        : difficulty === "Boss"
          ? "bg-purple-400"
          : "";

export function Theory() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topicFilter, setTopicFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [chosenOption, setChosenOption] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showRubric, setShowRubric] = useState(false);
  const [draftAnswer, setDraftAnswer] = useState("");

  useEffect(() => {
    axios
      .post(
        import.meta.env.VITE_PUBLIC_API_BASE + "/get_theory_problems",
        JSON.stringify({}),
        { headers: { "Content-Type": "application/json" } },
      )
      .then((response) => {
        setProblems(response.data["response"]);
        setLoading(false);
      });
  }, []);

  const topics = ["All", ...new Set(problems.map((p) => p.topic))];
  const visible =
    topicFilter === "All"
      ? problems
      : problems.filter((p) => p.topic === topicFilter);

  function openProblem(id) {
    axios
      .post(
        import.meta.env.VITE_PUBLIC_API_BASE + "/get_theory_problem",
        JSON.stringify({ problem: id }),
        { headers: { "Content-Type": "application/json" } },
      )
      .then((response) => {
        setSelected({ id, ...response.data["response"] });
        setChosenOption("");
        setSubmitted(false);
        setShowRubric(false);
        setDraftAnswer("");
      });
  }

  const detailView = selected && (
    <div className="p-8">
      <Button variant="outlined" size="small" onClick={() => setSelected(null)}>
        Back to list
      </Button>
      <div className="mt-4 flex items-center space-x-3">
        <Typography variant="h4">{selected.title}</Typography>
        <div
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm ${difficultyColor(
            selected.difficulty,
          )}`}
        >
          {selected.difficulty}
        </div>
        <div className="inline-flex items-center rounded-full bg-gray-300 px-3 py-1 text-sm">
          {selected.topic}
        </div>
      </div>
      <div
        className="text-slate-700 mt-4 text-sm"
        dangerouslySetInnerHTML={{ __html: selected.question }}
      ></div>

      {selected.type === "mcq" && (
        <div className="mt-6">
          <FormControl>
            <RadioGroup
              value={chosenOption}
              onChange={(e) => setChosenOption(e.target.value)}
            >
              {selected.options.map((option) => (
                <FormControlLabel
                  key={option.key}
                  value={option.key}
                  control={<Radio />}
                  disabled={submitted}
                  label={`${option.key}. ${option.text}`}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <div className="mt-4">
            <Button
              variant="contained"
              size="small"
              disabled={!chosenOption || submitted}
              onClick={() => setSubmitted(true)}
            >
              Submit
            </Button>
          </div>
          {submitted && (
            <div className="mt-6">
              <Typography
                variant="h6"
                className={
                  chosenOption === selected.correct_key
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {chosenOption === selected.correct_key
                  ? "Correct!"
                  : `Incorrect — the answer is ${selected.correct_key}.`}
              </Typography>
              <div className="mt-4 space-y-3">
                {selected.options.map((option) => (
                  <div
                    key={option.key}
                    className={`rounded-lg border p-3 text-sm ${
                      option.key === selected.correct_key
                        ? "border-green-400 bg-green-50"
                        : "border-slate-200"
                    }`}
                  >
                    <strong>{option.key}.</strong>{" "}
                    {selected.option_explanations[option.key]}
                  </div>
                ))}
              </div>
              <div
                className="text-slate-700 mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm"
                dangerouslySetInnerHTML={{ __html: selected.explanation }}
              ></div>
            </div>
          )}
        </div>
      )}

      {selected.type === "short_answer" && (
        <div className="mt-6">
          <textarea
            className="border-slate-300 h-48 w-full rounded-lg border p-3 text-sm"
            placeholder="Draft your answer here before revealing the rubric..."
            value={draftAnswer}
            onChange={(e) => setDraftAnswer(e.target.value)}
          />
          <div className="mt-4">
            <Button
              variant="contained"
              size="small"
              onClick={() => setShowRubric(true)}
            >
              Show Rubric &amp; Model Answer
            </Button>
          </div>
          {showRubric && (
            <div className="mt-6">
              <Typography variant="h6">Grade yourself</Typography>
              <div className="mt-3 space-y-3">
                {["1", "3", "5"].map((score) => (
                  <div
                    key={score}
                    className="border-slate-200 rounded-lg border p-3 text-sm"
                  >
                    <strong>{score}/5:</strong> {selected.rubric[score]}
                  </div>
                ))}
              </div>
              <Typography variant="h6" className="mt-6">
                Likely follow-up probes
              </Typography>
              <ul className="mt-2 list-disc pl-6 text-sm">
                {selected.follow_up_probes.map((probe, i) => (
                  <li key={i}>{probe}</li>
                ))}
              </ul>
              <div
                className="text-slate-700 mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm"
                dangerouslySetInnerHTML={{ __html: selected.explanation }}
              ></div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const listView = (
    <>
      <div className="p-4">
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel id="topic-filter-label">Topic</InputLabel>
          <Select
            labelId="topic-filter-label"
            value={topicFilter}
            label="Topic"
            onChange={(e) => setTopicFilter(e.target.value)}
          >
            {topics.map((topic) => (
              <MenuItem key={topic} value={topic}>
                {topic}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <Table sx={{ minWidth: 650 }} aria-label="theory questions">
        <TableHead sx={{ bgcolor: "grey.400" }}>
          <TableRow className="cursor-default">
            <TableCell>Title</TableCell>
            <TableCell align="right">Topic</TableCell>
            <TableCell align="right">Subtopic</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Difficulty</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visible.map((row) => (
            <TableRow
              key={row.id}
              className="cursor-pointer"
              onClick={() => openProblem(row.id)}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "&:nth-of-type(odd)": {
                  bgcolor: "grey.100",
                  "&:hover": { bgcolor: "grey.300" },
                },
                "&:nth-of-type(even)": {
                  bgcolor: "grey.200",
                  "&:hover": { bgcolor: "grey.300" },
                },
              }}
            >
              <TableCell>{row.title}</TableCell>
              <TableCell align="right">{row.topic}</TableCell>
              <TableCell align="right">{row.subtopic}</TableCell>
              <TableCell align="right">
                {row.type === "mcq" ? "Multiple Choice" : "Short Answer"}
              </TableCell>
              <TableCell align="right">
                <div
                  className={`inline-flex items-center rounded-full px-4 py-2 ${difficultyColor(
                    row.difficulty,
                  )}`}
                >
                  {row.difficulty}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );

  return (
    <>
      <div className="relative flex h-[60vh] content-center items-center justify-center pb-32 pt-16">
        <div className="absolute top-0 h-full w-full bg-[url('/img/blue_laptop.jpg')] bg-cover bg-center" />
        <div className="absolute top-0 h-full w-full bg-black/75 bg-cover bg-center" />
        <div className="max-w-8xl container relative mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
              <Typography variant="h1" color="white">
                Theory Questions
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <section className="relative bg-blue-gray-50/50 px-4 py-16">
        <div className="container mx-auto">
          <div className="relative -mt-64 mb-6 flex w-full min-w-0 flex-col break-words rounded-3xl bg-white shadow-xl shadow-gray-500/5">
            <TableContainer component={Paper} sx={{ borderRadius: 5 }}>
              {loading ? (
                <div className="p-16 text-center">
                  <CircularProgress size={60} thickness={3} />
                </div>
              ) : selected ? (
                detailView
              ) : (
                listView
              )}
            </TableContainer>
          </div>
        </div>
      </section>
      <div className="bg-blue-gray-50/50">
        <Footer />
      </div>
    </>
  );
}

export default Theory;
