import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "@/widgets/layout";
import { Home, IDE, Questions } from "@/pages";

function App() {
  return (
    <>
      <div className="container absolute left-2/4 z-10 mx-auto -translate-x-2/4 p-4">
        <Navbar />
      </div>
      <Routes>
        <Route exact path="/home" element={<Home />} />
        <Route path="/ide/:problemNumber" element={<IDE />} />
        <Route exact path="/questions" element={<Questions />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}

export default App;
