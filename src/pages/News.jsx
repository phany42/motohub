

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const articlesPerPage = 6; 

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const apiKey = "e50ac19c5d924470bcd158ca544d0d54"; 
        const res = await axios.get(
          `https://newsapi.org/v2/everything?q=motorcycle&language=en&sortBy=publishedAt&pageSize=50&apiKey=${apiKey}`
        );
        if (res.data.articles && res.data.articles.length> 0) {
          setArticles(res.data.articles);
        } else {
          setError("No news available at the moment.");
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Could not load news. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

 
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      
      await axios.post("https://jsonplaceholder.typicode.com/posts", {
        feedback,
      });
      setFeedbackMsg("✅ Feedback submitted successfully!");
      setFeedback("");
      setTimeout(() => setFeedbackMsg(""), 3000);
    } catch (err) {
      console.error("Feedback error:", err);
      setFeedbackMsg("❌ Could not send feedback.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Motorcycle News</h1>

      {error && (
        <div className="bg-red-700 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* News Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentArticles.map((a, idx) => (
          <div key={idx} className="bg-gray-900 p-4 rounded-lg shadow">
            {a.urlToImage && (
              <img
                src={a.urlToImage}
                alt={a.title}
                className="w-full h-40 object-cover rounded mb-3"
              />
            )}
            <h2 className="font-semibold text-lg mb-2">{a.title}</h2>
            <p className="text-sm text-gray-400 mb-3">{a.description}</p>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:underline text-sm"
            >
              Read More →
            </a>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Feedback Form */}
      <div className="mt-10 bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Send Feedback</h2>
        <form onSubmit={handleFeedbackSubmit} className="space-y-3">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full p-3 rounded bg-gray-900 border border-gray-700 outline-none text-white"
            placeholder="Write your feedback..."
            rows="4"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-orange-600 rounded hover:bg-orange-500"
          >
            Submit
          </button>
        </form>
        {feedbackMsg && (
          <p className="mt-3 text-sm text-green-400">{feedbackMsg}</p>
        )}
      </div>
    </div>
  );
}
