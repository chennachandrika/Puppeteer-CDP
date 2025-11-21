import React, { useState } from "react";

function PuppeteerCDPMonitor() {
  const [logs, setLogs] = useState(null);

  const runCDP = async () => {
    const response = await fetch("https://pyrkr8-4000.csb.app/run-cdp");
    const data = await response.json();
    setLogs(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>CDP React + Node PoC</h1>

      <button
        onClick={runCDP}
        style={{
          padding: "10px 20px",
          background: "black",
          color: "white",
          borderRadius: "8px",
          fontSize: "18px",
        }}
      >
        Run CDP Script
      </button>

      {logs && (
        <div style={{ marginTop: "20px" }}>
          <h3>Response:</h3>
          <pre>{JSON.stringify(logs, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default PuppeteerCDPMonitor;
