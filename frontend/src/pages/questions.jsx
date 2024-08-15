import { Typography } from "@material-tailwind/react";
import { Footer } from "@/widgets/layout";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function createData(number, title, industry, topics, difficulty) {
  return { number, title, industry, topics, difficulty };
}

const rows = [
  createData(
    1,
    "Streaming Platform",
    "Streaming Technology",
    [{ topic: "Conditional Logic" }, { topic: "Datetime Operations" }],
    "Easy",
  ),
  createData(
    2,
    "CRM SAAS Company",
    "Software",
    [{ topic: "Complex Joins" }, { topic: "String Manipulation" }],
    "Medium",
  ),
  createData(
    3,
    "Property Management Company",
    "Real Estate",
    [
      { topic: "Pivot Function" },
      { topic: "Complex Joins" },
      { topic: "Aggregate Functions" },
    ],
    "Hard",
  ),
  createData(
    4,
    "Social Media PII",
    "Social Media",
    [{ topic: "Regular Expressions" }],
    "Medium",
  ),
  createData(
    5,
    "E-Commerce Platform",
    "E-Commerce",
    [{ topic: "Aggregate Functions" }, { topic: "Complex Joins" }],
    "Easy",
  ),
  createData(
    6,
    "Correcting Social Media Posts",
    "Social Media",
    [{ topic: "Regular Expressions" }],
    "Easy",
  ),
  createData(
    7,
    "Manufacturing Plant",
    "Manufacturing",
    [{ topic: "Windows Functions" }, { topic: "Conditional Logic" }],
    "Hard",
  ),
  createData(
    8,
    "Call Center",
    "Information Technology",
    [{ topic: "Aggregate Functions" }, { topic: "Distinct Function" }],
    "Easy",
  ),
  createData(
    9,
    "AI Research",
    "Artificial Intelligence",
    [{ topic: "Windows Functions" }],
    "Medium",
  ),
  createData(
    10,
    "Food and Beverage Sales",
    "Sales and Marketing",
    [{ topic: "Aggregate Functions" }, { topic: "Complex Joins" }],
    "Medium",
  ),
  createData(
    11,
    "Movies",
    "Sales and Marketing",
    [{ topic: "Null Handling" }],
    "Easy",
  ),
  createData(
    12,
    "Insurance Customers",
    "Insurance",
    [{ topic: "Union Statements" }],
    "Easy",
  ),
  createData(
    13,
    "Mountain Climbing",
    "Science and Environment",
    [
      { topic: "Distinct Function" },
      { topic: "Complex Joins" },
      { topic: "Windows Functions" },
    ],
    "Hard",
  ),
  createData(
    14,
    "Private Equity Firms",
    "Finance",
    [{ topic: "Complex Joins" }, { topic: "Null Handling" }],
    "Easy",
  ),
  createData(
    15,
    "SEO Optimization",
    "E-Commerce",
    [
      { topic: "Windows Functions" },
      { topic: "Complex Joins" },
      { topic: "Aggregate Functions" },
    ],
    "Hard",
  ),
  createData(
    16,
    "Running Payroll",
    "Human Resources",
    [{ topic: "Case When Statements" }],
    "Easy",
  ),
  createData(
    17,
    "Geology Samples",
    "Science and Environment",
    [{ topic: "Regular Expressions" }],
    "Easy",
  ),
  createData(
    18,
    "Factory Duplicates",
    "Manufacturing",
    [{ topic: "Complex Joins" }],
    "Medium",
  ),
  createData(
    19,
    "VC Firms",
    "Finance",
    [{ topic: "Aggregate Functions" }],
    "Medium",
  ),
  createData(
    20,
    "Construction Company",
    "Construction",
    [
      { topic: "Aggregate Functions" },
      { topic: "Complex Joins" },
      { topic: "Datetime Operations" },
    ],
    "Hard",
  ),
  createData(
    21,
    "Retail Stores",
    "Retail",
    [
      { topic: "Windows Functions" },
      { topic: "Case When Statements" },
      { topic: "String Manipulation" },
    ],
    "Hard",
  ),
  createData(
    22,
    "Video Stream Platform",
    "Streaming Technology",
    [{ topic: "Windows Functions" }, { topic: "Datetime Operations" }],
    "Hard",
  ),
  createData(
    23,
    "Machine Learning Metrics",
    "Artificial Intelligence",
    [{ topic: "Aggregate Functions" }, { topic: "Complex Joins" }],
    "Medium",
  ),
  createData(
    24,
    "Customer Churn",
    "Sales and Marketing",
    [{ topic: "Windows Functions" }, { topic: "Complex Joins" }],
    "Hard",
  ),
  createData(
    25,
    "Mining Corporation",
    "Science and Environment",
    [{ topic: "Aggregate Functions" }],
    "Easy",
  ),
  createData(
    26,
    "Consumer Goods Discount Confusion",
    "Retail",
    [{ topic: "Regular Expressions" }, { topic: "Null Handling" }],
    "Hard",
  ),
  createData(
    27,
    "Mortgage Interest Rates",
    "Banking",
    [{ topic: "Aggregate Functions" }, { topic: "Complex Joins" }],
    "Medium",
  ),
  createData(
    28,
    "Organizing Manufacturing Parts",
    "Manufacturing",
    [{ topic: "Windows Functions" }],
    "Medium",
  ),
  createData(
    29,
    "Government Budgeting",
    "Finance",
    [{ topic: "Windows Functions" }, { topic: "Mathematical Functions" }],
    "Hard",
  ),
  createData(
    30,
    "Careful Handling Transactional Data",
    "Finance",
    [
      { topic: "Windows Functions" },
      { topic: "Regular Expressions" },
      { topic: "Datetime Operations" },
    ],
    "Hard",
  ),
  createData(
    31,
    "Ecommerce Datetimes",
    "E-Commerce",
    [{ topic: "Datetime Operations" }, { topic: "Complex Joins" }],
    "Medium",
  ),
  createData(
    32,
    "Amusement Park Outlier",
    "Sales and Marketing",
    [{ topic: "Aggregate Functions" }, { topic: "Conditional Logic" }],
    "Medium",
  ),
  createData(
    33,
    "Aerospace Equipment",
    "Science and Environment",
    [{ topic: "Case When Statements" }],
    "Medium",
  ),
  createData(
    34,
    "User Interactions",
    "Software",
    [{ topic: "Union Statements" }],
    "Easy",
  ),
  createData(
    35,
    "Camping Supplies",
    "Retail",
    [{ topic: "Aggregate Functions" }],
    "Easy",
  ),
  createData(
    36,
    "Funded Startups",
    "Banking",
    [{ topic: "Aggregate Functions" }, { topic: "Conditional Logic" }],
    "Easy",
  ),
  createData(
    37,
    "Pharmaceutical Equipment",
    "Healthcare",
    [{ topic: "Windows Functions" }],
    "Hard",
  ),
  createData(
    38,
    "Customer Cross Join",
    "Sales and Marketing",
    [{ topic: "Complex Joins" }],
    "Easy",
  ),
  createData(
    39,
    "User Interactions 2",
    "Software",
    [{ topic: "Aggregate Functions" }],
    "Easy",
  ),
  createData(
    40,
    "Background Checks",
    "Human Resources",
    [{ topic: "String Manipulation" }],
    "Medium",
  ),
  createData(
    41,
    "Architectural Points of Interest",
    "Science and Environment",
    [{ topic: "Case When Statements" }],
    "Easy",
  ),
  createData(
    42,
    "Zoology",
    "Science and Environment",
    [{ topic: "Aggregate Functions" }],
    "Easy",
  ),
  createData(
    43,
    "Herpetology",
    "Science and Environment",
    [{ topic: "Windows Functions" }],
    "Hard",
  ),
  createData(
    44,
    "PE Portfolio Values",
    "Banking",
    [{ topic: "Aggregate Functions" }],
    "Medium",
  ),
  createData(
    45,
    "GDP Growth Rate",
    "Banking",
    [
      { topic: "Windows Functions" },
      { topic: "Case When Statements" },
      { topic: "Mathematical Functions" },
    ],
    "Hard",
  ),
  createData(
    46,
    "Thermodynamics",
    "Science and Environment",
    [{ topic: "Complex Joins" }],
    "Easy",
  ),
  createData(
    47,
    "Materials Engineering",
    "Manufacturing",
    [{ topic: "Complex Joins" }],
    "Easy",
  ),
  createData(
    48,
    "Floors R Us",
    "Retail",
    [{ topic: "String Manipulation" }],
    "Medium",
  ),
  createData(
    49,
    "Busy Airline",
    "Travel",
    [{ topic: "Complex Joins" }],
    "Medium",
  ),
  createData(
    50,
    "Archaeology Record Keeping",
    "Science and Environment",
    [{ topic: "Conditional Logic" }],
    "Easy",
  ),
  createData(
    51,
    "Mathematical Regular Expressions",
    "Machine Learning",
    [{ topic: "Regular Expressions" }, { topic: "Mathematical Functions" }],
    "Hard",
  ),
  createData(
    52,
    "Space Observatory",
    "Science and Environment",
    [{ topic: "Complex Joins" }],
    "Easy",
  ),
];

export function Questions() {
  const navigate = useNavigate();

  return (
    <>
      <div className="relative flex h-[60vh] content-center items-center justify-center pb-32 pt-16">
        <div className="absolute top-0 h-full w-full bg-[url('/img/blue_laptop.jpg')] bg-cover bg-center" />
        <div className="absolute top-0 h-full w-full bg-black/75 bg-cover bg-center" />
        <div className="max-w-8xl container relative mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
              <Typography variant="h1" color="white">
                Coding Questions
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <section className="relative bg-blue-gray-50/50 px-4 py-16">
        <div className="container mx-auto">
          <div className="relative -mt-64 mb-6 flex w-full min-w-0 flex-col break-words rounded-3xl bg-white shadow-xl shadow-gray-500/5">
            <TableContainer component={Paper} sx={{ borderRadius: 5 }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead sx={{ bgcolor: "grey.400" }}>
                  <TableRow className="cursor-default">
                    <TableCell>Number</TableCell>
                    <TableCell align="left">Title</TableCell>
                    <TableCell align="right">Industry</TableCell>
                    <TableCell align="right">Topics</TableCell>
                    <TableCell align="right">Difficulty</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow
                      key={row.number}
                      className="cursor-pointer"
                      onClick={() => {
                        navigate(`/ide/${row.number}`);
                      }}
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
                      <TableCell>{row.number}</TableCell>
                      <TableCell align="left">{row.title}</TableCell>
                      <TableCell align="right">{row.industry}</TableCell>
                      <TableCell align="right">
                        <div className="flex items-center justify-end space-x-2">
                          {row.topics.map((topic, i) => (
                            <div
                              key={i}
                              className="inline-flex items-center rounded-full bg-gray-400 px-4 py-2"
                            >
                              {topic.topic}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        <div
                          className={`inline-flex items-center rounded-full px-4 py-2 ${
                            row.difficulty === "Easy"
                              ? "bg-green-400"
                              : row.difficulty === "Medium"
                                ? "bg-blue-400"
                                : row.difficulty === "Hard"
                                  ? "bg-red-400"
                                  : ""
                          }`}
                        >
                          {row.difficulty}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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

export default Questions;
