export async function fetchCpuInfo() {
  const url = "http://localhost:8000/";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.text();

    // console.log(result);

    return result;
  } catch (error) {
    console.error(error);
  }

  return "";
}

export async function fetchProcessStatuses() {
  const url = "http://localhost:8000/process-statuses";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.text();

    // console.log(result);

    return result;
  } catch (error) {
    console.error(error);
  }

  return "";
}
