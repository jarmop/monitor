import { useEffect, useState } from "react";
import "./App.css";
import { fetchCpuInfo } from "./api.ts";

type CpuInfo = Record<string, string>;

function App() {
  const [content, setContent] = useState<CpuInfo[]>([]);

  useEffect(() => {
    fetchCpuInfo().then((data) => {
      setContent(parseCpuInfo(data));
    });
  }, []);

  return (
    <>
      <h1>CPU Info</h1>
      <CpuTable cpuInfos={content} />
      {/* <CpuList cpuInfos={content} /> */}
    </>
  );
}

function parseCpuInfo(data: string) {
  const cpuInfos: CpuInfo[] = [];
  data.trim().split("\n\n").map((str) => {
    const cpuInfo: CpuInfo = {};
    str.split("\n").forEach((row) => {
      const [key, ...value] = row.split(":");
      cpuInfo[key.replaceAll("\t", "")] = value.join("");
    });
    cpuInfos.push(cpuInfo);
  });

  return cpuInfos;
}

interface CpuTableProps {
  cpuInfos: CpuInfo[];
}

function CpuTable({ cpuInfos }: CpuTableProps) {
  if (cpuInfos.length < 1) {
    return;
  }

  const fields = Object.keys(cpuInfos[0]);
  const uniqueFields = fields.filter((field) => {
    const firstCpuValue = cpuInfos[0][field];
    return cpuInfos.some((cpu) => cpu[field] != firstCpuValue);
  });

  const identicalFields = fields.filter((field) =>
    !uniqueFields.includes(field)
  );

  return (
    <>
      <h2>Unique fields</h2>
      <table border={1} style={{ borderCollapse: "collapse" }}>
        <style>
          {` 
          th, td { padding: 6px; }
        `}
        </style>
        <thead>
          <tr>
            {uniqueFields.map((fieldName) => (
              <th key={fieldName} style={{ verticalAlign: "top" }}>
                {fieldName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cpuInfos.map((cpuInfo, i) => {
            const foo = uniqueFields.map((field) => {
              const value = cpuInfo[field];
              return (
                <td key={`cpu${i}-${field}`}>
                  {value}
                </td>
              );
            });
            return (
              <tr key={`cpu${i}`}>
                {foo}
              </tr>
            );
          })}
        </tbody>
      </table>
      <h2>Identical fields</h2>
      <table>
        <tbody>
          {identicalFields.map((field) => (
            <tr key={field}>
              <td>{field}</td>
              <td>{cpuInfos[0][field]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

interface CpuListProps {
  cpuInfos: CpuInfo[];
}

function CpuList({ cpuInfos }: CpuListProps) {
  return cpuInfos.map((cpu, i) => {
    const foo = Object.entries(cpu).map(([key, value]) => {
      return <div key={`cpu${i}-${key}`}>{`${key}: ${value}`}</div>;
    });
    return <div key={`cpu${i}`} style={{ marginBottom: "20px" }}>{foo}</div>;
  });
}

export default App;
