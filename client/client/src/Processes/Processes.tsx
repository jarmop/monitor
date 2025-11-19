import { useEffect, useState } from "react";
import { fetchProcessStatuses } from "../api.ts";
import { Status } from "./types.ts";
import { ProcessTable } from "./ProcessTable.tsx";

export function Processes() {
  const [statuses, setStatuses] = useState<Status[]>([]);

  useEffect(() => {
    fetchProcessStatuses().then((data) => {
      //   console.log(data);
      setStatuses(parseProcessStatuses(data));
    });
  }, []);

  //   const states = new Set<string>();

  //   statuses.forEach((status) => {
  //     states.add(status.State);
  //   });

  //   console.log(states);

  if (statuses.length === 0) {
    return;
  }

  return (
    <>
      <h1>Processes</h1>
      <ProcessTable statuses={statuses} />
    </>
  );
}

function parseProcessStatuses(data: string) {
  const statuses: Status[] = [];
  data.trim().split("\n\n").map((str) => {
    const status: Status = {};
    str.split("\n").forEach((row) => {
      const [key, ...value] = row.split(":");
      status[key] = value.join("").trim();
    });
    statuses.push(status);
  });

  return statuses;
}
