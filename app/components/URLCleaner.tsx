"use client";

import { useState, useEffect } from "react";

export default function URLCleaner() {
  const [url, setUrl] = useState("");
  const [contributorId, setContributorId] = useState("");
  const [cleanedUrl, setCleanedUrl] = useState("");
  const [copied, setCopied] = useState(false);

  // Load contributor ID from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("contributorId");
    if (saved) {
      setContributorId(saved);
    }
  }, []);

  // Save contributor ID to localStorage when it changes
  useEffect(() => {
    if (contributorId) {
      localStorage.setItem("contributorId", contributorId);
    }
  }, [contributorId]);

  const cleanUrl = () => {
    if (!url) return;

    try {
      const urlObj = new URL(url);
      // Remove tracking parameters
      const paramsToRemove = [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
        "fbclid",
        "gclid",
        "msclkid",
        "click_id",
        "gtm_source",
        "Campaign",
        "ref",
        "referrer",
        "source",
        "medium",
      ];

      paramsToRemove.forEach((param) => {
        urlObj.searchParams.delete(param);
      });

      let result = urlObj.toString();

      // Add contributor ID if provided
      if (contributorId) {
        const separator = result.includes("?") ? "&" : "?";
        result += `${separator}contributor=${encodeURIComponent(contributorId)}`;
      }

      setCleanedUrl(result);
    } catch (error) {
      console.error("Invalid URL");
    }
  };

  const copyToClipboard = async () => {
    if (!cleanedUrl) return;

    try {
      await navigator.clipboard.writeText(cleanedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            URL Parameter Cleaner
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Remove tracking parameters and add your contributor ID
          </p>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && cleanUrl()}
              placeholder="https://example.com?utm_source=..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Contributor ID Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contributor ID
            </label>
            <input
              type="text"
              value={contributorId}
              onChange={(e) => setContributorId(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && cleanUrl()}
              placeholder="Your contributor ID"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={cleanUrl}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
        >
          Generate Clean Link
        </button>

        {/* Output Section */}
        {cleanedUrl && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Cleaned URL Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Clean Link
              </label>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 break-all text-gray-900 dark:text-gray-200">
                {cleanedUrl}
              </div>
            </div>

            {/* Copy Button */}
            <button
              onClick={copyToClipboard}
              className={`w-full px-6 py-3 font-medium rounded-lg transition-all transform active:scale-95 ${
                copied
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
                  : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
              }`}
            >
              <span
                className={`inline-block transition-all duration-300 ${copied ? "scale-110" : "scale-100"}`}
              >
                {copied ? "✓ Copied!" : "Copy Link"}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
