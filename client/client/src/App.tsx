import { useEffect, useState } from "react";
import "./App.css";

type CpuInfo = Record<string, string>;

function App() {
  const [content, setContent] = useState<CpuInfo[]>([]);

  useEffect(() => {
    fetchData().then((data) => {
      const cpuInfos: CpuInfo[] = [];
      data.split("\n\n").map((str) => {
        const cpuInfo: CpuInfo = {};
        str.split("\n").forEach((row) => {
          const [key, ...value] = row.split(":");
          cpuInfo[key] = value.join("");
        });
        cpuInfos.push(cpuInfo);
      });
      setContent(cpuInfos);
    });
  }, []);

  return (
    <>
      {content.map((cpu, i) => {
        const foo = Object.entries(cpu).map(([key, value]) => {
          return <div key={`cpu${i}-${key}`}>{`${key}: ${value}`}</div>;
        });
        return (
          <div key={`cpu${i}`} style={{ marginBottom: "20px" }}>{foo}</div>
        );
      })}
    </>
  );
}

async function fetchData() {
  const url = "http://localhost:8000/";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.text();

    return result;
  } catch (error) {
    console.error(error);
  }

  return "";
}

export default App;
