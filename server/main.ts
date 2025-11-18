// const dir = Deno.readDirSync("/proc");

// dir.forEach((d) => console.log(d));

const text = Deno.readTextFileSync("/proc/cpuinfo");

console.log(text);
