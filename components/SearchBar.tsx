"use client";
import { scrapeAndStoreProduct } from "@/lib/actions";
import { FormEvent, useState } from "react";

const SearchBar = () => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidAmazonProductURL = (url: string) => {
    try {
      const parsedURL = new URL(url);
      const hostname = parsedURL.hostname;
      console.log(hostname);

      if (
        hostname.includes("amazon.com") ||
        hostname.includes("amazon.") ||
        hostname.endsWith("amazon")
      ) {
        return true;
      }
    } catch (err) {
      return false;
    }

    return false;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmazonProductURL(searchPrompt);

    if (!isValidLink) {
      return alert("Please provide a valid amazon link");
    }
    try {
      setIsLoading(true);
      const product = await scrapeAndStoreProduct(searchPrompt);
      window.location.href = `${window.location.origin}/products/${product?.productId}`;
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mt-12">
      <input
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter amazon product link"
        className="searchbar-input"
      />
      <button
        className="searchbar-btn"
        type="submit"
        disabled={searchPrompt === ""}
      >
        {isLoading ? "Searching.." : "Search"}
      </button>
    </form>
  );
};

export default SearchBar;
