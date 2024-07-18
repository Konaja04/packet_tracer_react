import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { BrowserRouter as Router } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <DndProvider backend={HTML5Backend}>
      <App />
    </DndProvider>
  </Router>
);
