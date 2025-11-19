import { useState } from "react";
import { Status } from "./types.ts";

interface ProcessTreeProps {
  processes: Status[];
}

export function ProcessTree({ processes }: ProcessTreeProps) {
  const [grandParents, setGrandParents] = useState<string[]>([]);

  const cByP: Record<string, string[]> = {};
  const nameByPid: Record<string, string> = {};

  processes.forEach((s) => {
    if (!cByP[s.PPid]) {
      cByP[s.PPid] = [];
    }
    cByP[s.PPid].push(s.Pid);

    nameByPid[s.Pid] = s.Name;
  });

  //   const parents = processes.filter((s) => cByP[s.Pid]).toSorted((a, b) =>
  //     cByP[b.Pid].length - cByP[a.Pid].length
  //   );

  const orphans = processes.filter((s) => s.PPid === "0");

  function handleProcessSelection(pid: string, level: number) {
    const idx = grandParents.indexOf(pid);
    let newGrandParents = grandParents.slice(0, level);

    if (idx === -1) {
      newGrandParents = [...newGrandParents, pid];
    }

    setGrandParents(newGrandParents);
  }

  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      <style>
        {`
            table { margin-left: 10px; } 
        `}
      </style>
      <GenerationTable
        parents={orphans}
        nameByPid={nameByPid}
        cByP={cByP}
        selectProcess={handleProcessSelection}
        level={0}
        selectedPid={grandParents[0]}
      />
      {grandParents.map((gPid, i) => {
        const parents = processes.filter((proc) => proc.PPid === gPid);

        return (
          <GenerationTable
            key={gPid}
            parents={parents}
            nameByPid={nameByPid}
            cByP={cByP}
            selectProcess={handleProcessSelection}
            level={i + 1}
            selectedPid={grandParents[i + 1]}
          />
        );
      })}

      {
        /* <table border={2} style={{ borderCollapse: "collapse" }}>
        <style>
          {`
          th, td { padding: 6px; }
        `}
        </style>
        <thead>
          <tr>
            <th>Name</th>
            <th>Pid</th>
            <th>Children</th>
          </tr>
        </thead>
        <tbody>
          {parents.map((p) => {
            return (
              <tr>
                <td>{nameByPid[p.Pid]}</td>
                <td>{p.Pid}</td>
                <td>{cByP[p.Pid].length}</td>
              </tr>
            );
          })}
        </tbody>
      </table> */
      }
    </div>
  );

  //   return (
  //     <div>
  //       {parents.map((p) => {
  //         return (
  //           <div>
  //             {nameByPid[p.Pid]} - | - {p.Pid} - | - {cByP[p.Pid].length}
  //           </div>
  //         );
  //       })}
  //     </div>
  //   );

  //   return (
  //     <svg width={900} height={900} style={{ border: "1px solid black" }}>
  //       <g transform="translate(200,200)">
  //         <rect
  //           x={0}
  //           y={0}
  //           width={100}
  //           height={30}
  //           fill="transparent"
  //           stroke="black"
  //         />
  //         <text x={10} y={19}>rtsjhy</text>
  //       </g>
  //     </svg>
  //   );
}

interface GenerationTableProps {
  parents: Status[];
  nameByPid: Record<string, string>;
  cByP: Record<string, string[]>;
  selectProcess: (pid: string, level: number) => void;
  level: number;
  selectedPid: string | undefined;
}

function GenerationTable(
  { parents, nameByPid, cByP, selectProcess, level, selectedPid }:
    GenerationTableProps,
) {
  const sortedParents = parents.toSorted((a, b) =>
    (cByP[b.Pid] || []).length - (cByP[a.Pid] || []).length
  );

  return (
    <table border={2} style={{ borderCollapse: "collapse" }}>
      <style>
        {` 
          th, td { padding: 6px; }
        `}
      </style>
      <thead>
        <tr>
          <th>Name</th>
          <th>Pid</th>
          <th>Children</th>
        </tr>
      </thead>
      <tbody>
        <style>
          {`
            tbody tr.selectable:hover { background: lightgrey; cursor: pointer; }
            tbody tr.selected { background: lightblue; }
          `}
        </style>
        {sortedParents.map((p) => {
          const childrenCount = cByP[p.Pid]?.length || 0;
          const classes = [
            childrenCount > 0 ? "selectable" : "",
            selectedPid === p.Pid ? "selected" : "",
          ];
          return (
            <tr
              key={p.Pid}
              onClick={() => childrenCount > 0 && selectProcess(p.Pid, level)}
              className={classes.join(" ")}
            >
              <td>{nameByPid[p.Pid]}</td>
              <td>{p.Pid}</td>
              <td>{childrenCount}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
