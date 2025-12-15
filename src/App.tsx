import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Workout from "./pages/Workout";
import Diet from "./pages/Diet";
import BMI from "./pages/BMI";
import BMR from "./pages/BMR";
import Contact from "./pages/Contact";
import Layout from "./layout/Layout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Pages WITHOUT navbar */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Pages WITH navbar */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/diet" element={<Diet />} />
          <Route path="/bmi" element={<BMI />} />
          <Route path="/bmr" element={<BMR />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
