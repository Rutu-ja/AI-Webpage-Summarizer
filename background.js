// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "summarizePage") {
    handlePageSummarization(message, sendResponse);
    return true;
  } else if (message.action === "downloadSummary") {
    downloadSummary(message.summary);
    sendResponse({ success: true });
    return true;
  }
});

async function getPageUrl() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab?.url) {
    throw new Error("No active tab URL found");
  }

  // Check if the URL is restricted
  if (
    tab.url.startsWith("chrome://") ||
    tab.url.startsWith("chrome-extension://") ||
    tab.url.startsWith("edge://")
  ) {
    throw new Error(
      "This page cannot be summarized due to browser restrictions"
    );
  }

  return tab;
}

async function getPageContent(tabId) {
  const [{ result: pageText }] = await chrome.scripting.executeScript({
    target: { tabId },
    function: () => {
      const article = document.querySelector("article");
      if (article) return article.innerText;

      const main = document.querySelector("main");
      if (main) return main.innerText;

      return document.body.innerText;
    },
  });

  if (!pageText || pageText.trim().length === 0) {
    throw new Error("No content found on this page");
  }

  return pageText.trim().slice(0, 5000); // Limit size
}

async function getSummaryFromAPI(text, apiKey) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "o3-mini", // or your specific model
      messages: [
        {
          role: "system",
          content: `You are a precise and insightful webpage summarizer. Given a webpage or article URL, extract its most valuable information while preserving the original intent. Your summary must be clear, well-structured, and concise, focusing on actionable insights. If the page is developer-focused, provide in-depth technical details, code snippets (if relevant), and key takeaways. If it's non-technical, keep it brief and insightful. Avoid fluff, redundant information, or unnecessary filler.

Consistent Output Format:
Title:
(Extracted or Generated Based on Content)

Summary:
(Brief 2-3 sentence overview capturing the core idea)

Key Points:
🔹 (Point 1) – (Brief explanation)
🔹 (Point 2) – (Brief explanation)
🔹 (Point 3) – (Brief explanation)
(More points if necessary)

Developer Insights (If Applicable):
💡 Key Technologies Used: (Mention frameworks, libraries, or tools)
💡 Best Practices & Takeaways: (Summarize important coding principles or architecture choices)
💡 Performance & Optimization Tips: (If applicable, highlight optimizations)
💡 Code Snippet (if available & relevant):

bash
Copy
Edit
# Useful code excerpt (if present in the article)
General Insights:
📌 (Insight 1) – (Deep takeaway or key learning)
📌 (Insight 2) – (Additional perspective or industry trend)
📌 (Insight 3) – (More insights if applicable)

Actionable Steps (If Applicable):
✔️ Step 1: (What the reader can implement right away)
✔️ Step 2: (Further recommendations or best practices)

🔍 Ensure:

Keep summaries concise yet highly informative.
If the webpage is technical, extract valuable developer insights instead of just surface-level points.
Omit unnecessary details while ensuring depth where needed.`,
        },
        {
          role: "user",
          content: `Summarize this webpage content:\n${text}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "OpenAI API request failed");
  }

  const data = await response.json();
  if (!data.choices?.[0]?.message?.content) {
    throw new Error("Invalid response from OpenAI API");
  }

  return data.choices[0].message.content;
}

async function downloadSummary(summary) {
  // Create a data URL for the text content
  const dataUrl =
    "data:text/plain;charset=utf-8," + encodeURIComponent(summary);

  await chrome.downloads.download({
    url: dataUrl,
    filename: `summary_${new Date().toISOString().slice(0, 10)}.txt`,
    saveAs: true,
  });
}

async function handlePageSummarization(message, sendResponse) {
  const apiKey = "YOUR-API-KEY"; // Replace with your actual API key

  try {
    const tab = await getPageUrl();
    const pageContent = await getPageContent(tab.id);
    const summary = await getSummaryFromAPI(pageContent, apiKey);
    sendResponse({ success: true, summary });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}
