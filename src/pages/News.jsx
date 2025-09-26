
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function News() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await axios.get("https://jsonplaceholder.typicode.com/posts?_limit=9");
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // POST request: submit feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://jsonplaceholder.typicode.com/posts", {
        feedback: feedback,
        user: "DemoUser",
      });
      console.log("Response from API:", res.data);
      setSubmitted(true);
      setFeedback("");
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Error posting feedback:", err);
    }
  };

  if (loading) {
    return <p className="text-white text-center mt-10">Loading News...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white">
      {/* 🔹 Section 1 — News Grid */}
      <h1 className="text-3xl font-bold mb-6">Latest News</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-900 p-4 rounded-lg shadow">
            <h2 className="font-semibold text-lg mb-2">{post.title}</h2>
            <p className="text-sm text-gray-400 mb-3">{post.body}</p>
            <a
              href={`https://jsonplaceholder.typicode.com/posts/${post.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:underline text-sm"
            >
              Read More →
            </a>
          </div>
        ))}
      </div>

      {/* 🔹 Section 2 — Feedback Form (place it here, below news grid) */}
      <div id="feedback" className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Submit Your Feedback</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white"
            rows="3"
            placeholder="Write your feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-md"
          >
            Submit
          </button>
        </form>
        {submitted && <p className="text-green-400 mt-3">✅ Feedback submitted successfully!</p>}
      </div>
    </div>
  );
}
