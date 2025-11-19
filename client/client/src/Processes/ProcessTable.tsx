import { ChangeEvent, useState } from "react";
import { possibleStates, State, Status } from "./types.ts";

interface StatusTableProps {
  statuses: Status[];
}

export function ProcessTable({ statuses }: StatusTableProps) {
  const [search, setSearch] = useState("");
  const [visibleStates, setVisibleStates] = useState<State[]>([
    "R (running)",
    "I (idle)",
    "S (sleeping)",
    "D (disk sleep)",
  ]);

  const stateLabels: Record<State, string> = {
    "R (running)": "Running",
    "I (idle)": "Idle",
    "S (sleeping)": "Sleeping",
    "D (disk sleep)": "Disk sleep",
  };

  const visibleFields = [
    "Name",
    "State",
    "Tgid",
    "Pid",
    "PPid",
    "TracerPid",
    "FDSize",
    "Groups",
    "NStgid",
    "NSpid",
    "NSpgid",
    "NSsid",
    "Kthread",
    "Threads",
  ];

  const visibleStatuses = statuses.filter((s) =>
    visibleStates.includes(s.State as State)
  ).filter((s) =>
    search.length < 3 || Object.values(s).some((v) => v.includes(search))
  ).toSorted((a, b) =>
    possibleStates.indexOf(a.State as State) -
    possibleStates.indexOf(b.State as State)
  );

  function handleVisibleStateChange(
    e: ChangeEvent<HTMLInputElement>,
    s: State,
  ) {
    console.log(e.target.checked);
    const newVisibleStates = e.target.checked ? [...visibleStates, s] : [
      ...visibleStates.filter((vs) => s !== vs),
    ];
    setVisibleStates(newVisibleStates);
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          {possibleStates.map((s) => {
            return (
              <>
                <input
                  id={s}
                  type="checkbox"
                  onChange={(e) => handleVisibleStateChange(e, s)}
                  checked={visibleStates.includes(s)}
                />
                <label htmlFor={s}>
                  {stateLabels[s]}{" "}
                  ({statuses.filter((st) => st.State === s).length})
                </label>
                &nbsp; &nbsp;
              </>
            );
          })}
        </div>
        <div>
          Visible: {visibleStatuses.length}
        </div>
      </div>
      <br />
      Search:{" "}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {/* <button type="button" onClick={() => setSearch()}>Search</button> */}
      <br />
      <br />
      <table border={1} style={{ borderCollapse: "collapse" }}>
        <style>
          {` 
          th, td { padding: 6px; }
        `}
        </style>
        <thead>
          <tr>
            {visibleFields.map((fieldName) => (
              <th key={fieldName} style={{ verticalAlign: "top" }}>
                {fieldName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleStatuses.map((status, i) => {
            const foo = visibleFields.map((field) => {
              const value = status[field];
              return (
                <td key={`${i}-${field}`}>
                  {value}
                </td>
              );
            });
            return (
              <tr key={`${i}`}>
                {foo}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
