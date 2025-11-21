import React, { useState } from "react";

function PuppeteerCDPMonitor() {
  const [logs, setLogs] = useState(null);

  const runCDP = async () => {
    try {
      const response = await fetch("http://localhost:4000/run-cdp");
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error("Failed to run CDP", error);
      setLogs({ error: error.message || "Unknown error" });
    }
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
