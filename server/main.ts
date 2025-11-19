const port = 8000;

const routes: Record<string, () => string> = {
  "/": getCpuInfo,
  "/process-statuses": getProcessStatuses,
};

Deno.serve({ port }, (req) => {
  // console.log(req);
  // console.log(req.url);
  // console.log(getRequestTarget(req.url));

  const requestTarget = getRequestTarget(req.url);

  const getResponse = routes[requestTarget];

  const response = getResponse ? getResponse() : "Not found";

  // return new Response(JSON.stringify(foo()), {
  return new Response(response, {
    headers: {
      "content-type": "text/html",
      // "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "http://localhost:3000",
    },
  });
});

function getCpuInfo() {
  // const dir = Deno.readDirSync("/proc");
  // dir.forEach((d) => console.log(d));

  // const text = Deno.readTextFileSync("/proc/cpuinfo");
  const text = Deno.readTextFileSync("../test-data/cpuinfo");

  return text;

  // return JSON.stringify(text);
}

function getProcessStatuses() {
  const text = Deno.readTextFileSync("../test-data/process-statuses");

  const relevantFields = [
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

  const arr = text.split("\n").filter((line) =>
    relevantFields.some((relevantField) => line.startsWith(relevantField))
  );
  const trimmedText = arr.join("\n");

  // Separate statuses with a newline before returning
  return trimmedText.replaceAll("Name:", "\nName:").trim();

  // return JSON.stringify(text);
}

function getRequestTarget(url: string) {
  // console.log(url);
  // const path = url.replace(/^.+\//, "");
  const indexOfFirstSlash = url.indexOf(`${port}/`) +
    port.toString().length;
  const path = url.substring(indexOfFirstSlash);
  // console.log(path);

  return path;
}
