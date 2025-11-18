const port = 8000;

Deno.serve({ port }, (req) => {
  console.log(req);

  // return new Response(JSON.stringify(foo()), {
  return new Response(getCpuInfo(), {
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

// function getUrlPath(url: string) {
//   console.log(url);
//   // const path = url.replace(/^.+\//, "");
//   const indexOfFirstSlash = url.indexOf(`${port}/`) +
//     port.toString().length;
//   const path = url.substring(indexOfFirstSlash);
//   console.log(path);
// }
