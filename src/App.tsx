import React from "react";
import logo from "./logo.svg";
import GraphView from "./components/GraphView";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
//import Button from "./components/Button";

import Dropdown from "./components/Dropdown";
import "./App.css";
import TableView from "./components/TableView";

function App() {
  const [activeView, setActiveView] = React.useState<String>("graph");
  return (
    <div className="App">
      <header className="App-header">
        <h1>Miles kostra</h1>
        <Dropdown />
        <FormControlLabel
          control={
            <Switch
              checked={activeView === "graph"}
              onChange={() =>
                setActiveView(activeView === "graph" ? "table" : "graph")
              }
              name="checkedA"
            />
          }
          label="Graph"
        />
        {activeView === "graph" ? <GraphView /> : <TableView />}
      </header>
    </div>
  );
}

export default App;
