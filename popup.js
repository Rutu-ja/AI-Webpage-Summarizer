let currentSummary = "";

document.addEventListener("DOMContentLoaded", () => {
  const summarizeBtn = document.getElementById("summarize");
  const downloadBtn = document.getElementById("download");
  const summaryDiv = document.getElementById("summary");
  const statusDiv = document.getElementById("status");

  summarizeBtn.addEventListener("click", async () => {
    statusDiv.textContent = "Generating summary...";
    summaryDiv.classList.add("hidden");
    downloadBtn.classList.add("hidden");

    try {
      const response = await chrome.runtime.sendMessage({
        action: "summarizePage",
      });
      if (response.success) {
        currentSummary = response.summary;
        summaryDiv.textContent = response.summary;
        summaryDiv.classList.remove("hidden");
        downloadBtn.classList.remove("hidden");
        statusDiv.textContent = "";
      } else {
        statusDiv.textContent = `Error: ${response.error}`;
      }
    } catch (error) {
      statusDiv.textContent = `Error: ${error.message}`;
    }
  });

  downloadBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({
      action: "downloadSummary",
      summary: currentSummary,
    });
  });
});
