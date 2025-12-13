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
import { Toaster, toast } from "sonner";
import AuthPage from "./Page/auth/AuthPage";
import Setting from "./Page/Setting";

const App = () => {
  return (
    <div>
      <Toaster position="bottom-left" />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/:pathname" element={<AuthPage />} />
        <Route path="/account/settings" element={<Setting />} />
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
