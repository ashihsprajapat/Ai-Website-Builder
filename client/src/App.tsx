import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Page/HomePage";
import MyProject from "./Page/MyProject";
import Community from "./Page/Community";
import Pricing from "./Page/Pricing";
import Priview from "./Page/Priview";
import View from "./Page/View";
import Projects from "./Page/Projects";
import Navbar from "./Componenets/Navbar";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<MyProject />} />
        <Route path="/projects/:projectId" element={<Projects />} />
        <Route path="/projects/:projectId/:versionId" element={<Projects />} />
        <Route path="/community" element={<Community />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/project/:projectId" element={<Priview />} />
        <Route path="/view/:projectId" element={<View />} />
      </Routes>
    </div>
  );
};

export default App;
