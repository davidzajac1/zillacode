import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { sql } from "@codemirror/lang-sql";
import { scala } from "@codemirror/legacy-modes/mode/clike";
import { StreamLanguage } from "@codemirror/language";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useParams, useNavigate } from "react-router-dom";
import { Grid } from "react-loader-spinner";
import { useState, useEffect } from "react";
import Split from "react-split";
import axios from "axios";
import {
  Button,
  ButtonGroup,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  OutlinedInput,
  MenuItem,
  FormControl,
  Select,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";

export function IDE() {
  const params = useParams();
  const navigate = useNavigate();
  const numProblems = 52;

  const [pageLoad, setPageLoad] = useState(true);
  const [terminal, setTerminal] = useState(true);
  const [problemNumber, setProblemNumber] = useState(
    params.problemNumber ?? "1",
  );
  const [language, setLanguage] = useState("pyspark");
  const [ProblemDescription, setProblemDescription] = useState("");
  const [code, setCode] = useState("");
  const [solution, setSolution] = useState("");
  const [explanation, setExplanation] = useState("");
  const [complexity, setComplexity] = useState("");
  const [optimization, setOptimization] = useState("");
  const [toRun, setToRun] = useState("");
  const [output, setOutput] = useState("Output:");
  const [loading, setLoading] = useState(false);
  const [valuePopout, setValuePopout] = useState(0);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const handlePopoutChange = (event, newValuePopout) => {
    setValuePopout(newValuePopout);
  };
  const handleChange = (event) => {
    setLanguage(event.target.value);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };
  const handleClickOpen2 = () => {
    setOpen2(true);
  };
  const handleClose2 = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen2(false);
    }
  };

  const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    return isMobile;
  };

  const isMobile = useIsMobile();

  function nextProblem() {
    if (parseInt(problemNumber) < numProblems) {
      setProblemNumber(String(parseInt(problemNumber) + 1));
      navigate("/ide/" + String(parseInt(problemNumber) + 1));
    }
  }

  function prevProblem() {
    if (parseInt(problemNumber) > 1) {
      setProblemNumber(String(parseInt(problemNumber) - 1));
      navigate("/ide/" + String(parseInt(problemNumber) - 1));
    }
  }

  async function runCode() {
    setTerminal(true);
    setOutput("");
    setLoading(true);

    axios
      .post(
        import.meta.env.VITE_PUBLIC_API_BASE + "/run_code",
        JSON.stringify({
          to_run: toRun,
          problem: problemNumber,
          language: language,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 120000,
        },
      )
      .then((response) => {
        if (typeof response.data["response"] === "string") {
          setLoading(false);
          setOutput(response.data["response"]);
        } else {
          setLoading(false);
          setOutput(response.data["response"]["errorMessage"]);
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.code == "ECONNABORTED") {
          setOutput("Server timeout, please try again...");
        } else {
          setOutput("Unknown error please try again.");
        }
      });
  }

  async function getProblem() {
    axios
      .post(
        import.meta.env.VITE_PUBLIC_API_BASE + "/get_problem",
        JSON.stringify({ problem: problemNumber }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      .then((response) => {
        setPageLoad(false);

        if (language === "snowflake") {
          let snowflakeProblemDescription = response.data["response"][
            "description"
          ]
            .replace(/\bDataFrame\b/g, "DBT model")
            .replace(/\bfunction\b/g, "DBT model");
          setProblemDescription(snowflakeProblemDescription);
        } else {
          setProblemDescription(response.data["response"]["description"]);
        }

        let savedSolution = window.localStorage.getItem(
          language + "-" + problemNumber,
        );

        if (savedSolution !== null) {
          setCode(savedSolution);
        } else {
          setCode(
            response.data["response"]["language"][language]["display_start"],
          );
        }

        setSolution(
          response.data["response"]["language"][language]["solution"],
        );
        setExplanation(
          response.data["response"]["language"][language]["explanation"],
        );
        setComplexity(
          response.data["response"]["language"][language]["complexity"],
        );
        setOptimization(
          response.data["response"]["language"][language]["optimization"],
        );
      });
  }

  async function resetEditor() {
    axios
      .post(
        import.meta.env.VITE_PUBLIC_API_BASE + "/get_problem",
        JSON.stringify({ problem: problemNumber }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      .then((response) => {
        setCode(
          response.data["response"]["language"][language]["display_start"],
        );
        setToRun(
          response.data["response"]["language"][language]["display_start"],
        );
        window.localStorage.removeItem(language + "-" + problemNumber);
      });
  }

  useEffect(() => {
    getProblem();
  }, [problemNumber, language]);

  const sharedContent = (
    <>
      {" "}
      <div
        className="text-slate-700 overflow-y-auto p-2 text-sm"
        dangerouslySetInnerHTML={{ __html: ProblemDescription }}
      ></div>
      <div className="overflow-y-hidden">
        <CodeMirror
          basicSetup={{
            highlightActiveLine: false,
            highlightActiveLineGutter: false,
            tabSize: 4,
          }}
          height={terminal ? "calc(100vh - 22rem)" : "calc(100vh - 7rem)"}
          value={code}
          extensions={[
            language == "scala"
              ? StreamLanguage.define(scala)
              : language == "snowflake"
                ? sql()
                : python(),
          ]}
          onChange={(value) => {
            setToRun(value);
            setCode(value);
            window.localStorage.setItem(language + "-" + problemNumber, value);
          }}
        />
        {terminal && (
          <div className="text-slate-700	border-slate-200 border-t p-8">
            <div className="border-slate-200 h-40 overflow-auto rounded-lg border p-1 text-xs">
              <pre>{output}</pre>
              <Grid
                height="80"
                width="80"
                color="#4dabf5"
                ariaLabel="grid-loading"
                radius="12.5"
                wrapperStyle={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "35px",
                }}
                wrapperClass=""
                visible={loading}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div>
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              ></IconButton>
            </Toolbar>
          </AppBar>
        </Box>
        {pageLoad && (
          <div className="text-center">
            <CircularProgress
              sx={{ mt: "calc(40vh)" }}
              size={90}
              thickness={2}
            />
          </div>
        )}
        {!pageLoad && (
          <div className={isMobile ? "flex h-full flex-col" : ""}>
            {isMobile ? (
              <div>{sharedContent}</div>
            ) : (
              <Split
                className="flex"
                style={{ height: "calc(100vh - 7rem)" }}
                snapOffset={0}
              >
                {sharedContent}
              </Split>
            )}
            <div
              className={
                isMobile
                  ? "border-slate-200 grid h-12 grid-cols-4 border-t pt-2 text-center"
                  : "border-slate-200 grid h-12 grid-cols-[10%_15%_20%_14%_22%_11%_9%] border-t pr-8 pt-2 text-right"
              }
            >
              {!isMobile && <div />}
              {!isMobile && (
                <div>
                  <ButtonGroup size="small" aria-label="small button group">
                    <Button onClick={prevProblem}> Prev </Button>
                    <Button
                      disableFocusRipple={true}
                      disableElevation={true}
                      disableRipple={true}
                    >{`${problemNumber}/${numProblems}`}</Button>
                    <Button onClick={nextProblem}> Next </Button>
                  </ButtonGroup>
                </div>
              )}
              <div>
                <Button
                  onClick={handleClickOpen}
                  variant="outlined"
                  size="small"
                >
                  {language}
                </Button>
                <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                  <DialogTitle>Select Language</DialogTitle>
                  <DialogContent>
                    <Box
                      component="form"
                      sx={{ display: "flex", flexWrap: "wrap" }}
                    >
                      <FormControl sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-dialog-select-label">
                          {language}
                        </InputLabel>
                        <Select
                          labelId="demo-dialog-select-label"
                          id="demo-dialog-select"
                          value={language}
                          onChange={handleChange}
                          input={<OutlinedInput label="Language" />}
                        >
                          <MenuItem value="pyspark">PySpark</MenuItem>
                          <MenuItem value="scala">Scala Spark</MenuItem>
                          <MenuItem value="pandas">Pandas</MenuItem>
                          <MenuItem value="snowflake">Snowflake/DBT</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Back</Button>
                    <Button onClick={handleClose}>Ok</Button>
                  </DialogActions>
                </Dialog>
              </div>
              {!isMobile && (
                <div>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setTerminal(!terminal)}
                    endIcon={<KeyboardArrowUpIcon />}
                  >
                    Console
                  </Button>
                </div>
              )}
              <div>
                <Button
                  onClick={handleClickOpen2}
                  variant="outlined"
                  size="small"
                >
                  Solution
                </Button>
                <Dialog open={open2} onClose={handleClose2} maxWidth="md">
                  {valuePopout === 0 ? (
                    <div>
                      <DialogTitle>Solution</DialogTitle>
                      <DialogContent>
                        <CodeMirror
                          basicSetup={{
                            highlightActiveLine: false,
                            highlightActiveLineGutter: false,
                          }}
                          editable={false}
                          readOnly={true}
                          value={solution}
                          extensions={[
                            language == "scala"
                              ? StreamLanguage.define(scala)
                              : language == "snowflake"
                                ? sql()
                                : python(),
                          ]}
                        />
                      </DialogContent>
                    </div>
                  ) : null}
                  {valuePopout === 1 ? (
                    <div>
                      <DialogTitle>Explanation</DialogTitle>
                      <DialogContent>
                        {" "}
                        <div
                          className="text-slate-700 overflow-y-auto p-2 text-sm"
                          dangerouslySetInnerHTML={{
                            __html: explanation,
                          }}
                        ></div>
                      </DialogContent>
                    </div>
                  ) : null}
                  {valuePopout === 2 ? (
                    <div>
                      <DialogTitle>Complexity</DialogTitle>
                      <DialogContent>
                        {" "}
                        <div
                          className="text-slate-700 overflow-y-auto p-2 text-sm"
                          dangerouslySetInnerHTML={{
                            __html: complexity,
                          }}
                        ></div>
                      </DialogContent>
                    </div>
                  ) : null}
                  {valuePopout === 3 ? (
                    <div>
                      <DialogTitle>Optimization</DialogTitle>
                      <DialogContent>
                        {" "}
                        <div
                          className="text-slate-700 overflow-y-auto p-2 text-sm"
                          dangerouslySetInnerHTML={{
                            __html: optimization,
                          }}
                        ></div>
                      </DialogContent>
                    </div>
                  ) : null}
                  <DialogActions>
                    <Tabs
                      value={valuePopout}
                      onChange={handlePopoutChange}
                      sx={{ px: 5 }}
                    >
                      <Tab label="Solution" />
                      <Tab label="Explanation" />
                      <Tab label="Complexity" />
                      <Tab label="Optimization" />
                    </Tabs>
                    <Button onClick={handleClose2}>Close</Button>
                  </DialogActions>
                </Dialog>
              </div>
              <div>
                <Button onClick={resetEditor} variant="outlined" size="small">
                  Reset Editor
                </Button>
              </div>
              <div>
                <Button onClick={runCode} variant="outlined" size="small">
                  Run Code
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IDE;
