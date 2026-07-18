"use client";

import { useState } from "react";
import Link from "next/link";
import Modal from "../../components/Modal";

export default function BlogListClient({ blogs }) {
  const [activeBlog, setActiveBlog] = useState(null);

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem" }}>
        {blogs.length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "1.6rem", gridColumn: "1/-1" }}>No blogs published yet.</p>
        ) : (
          blogs.map(blog => (
            <div key={blog.id} style={{ background: "white", borderRadius: "10px", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
              <img src={blog.image} alt={blog.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
              <div style={{ padding: "2rem", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "1.3rem", color: "hsl(var(--primary))", marginBottom: "1rem", display: "flex", justifyContent: "space-between" }}>
                  <span><i className="far fa-user"></i> {blog.author}</span>
                  <span><i className="far fa-calendar-alt"></i> {new Date(blog.published_date).toLocaleDateString()}</span>
                </div>
                <h3 style={{ fontSize: "2rem", marginBottom: "1rem", color: "hsl(var(--primary-dark))" }}>{blog.title}</h3>
                <p style={{ fontSize: "1.4rem", color: "hsl(var(--text-muted))", marginBottom: "2rem", flexGrow: 1 }}>{blog.summary}</p>
                <button onClick={() => setActiveBlog(blog)} className="btn-primary" style={{ padding: "0.8rem 1.5rem", fontSize: "1.3rem", alignSelf: "flex-start" }}>Read More</button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={!!activeBlog} onClose={() => setActiveBlog(null)} title={activeBlog?.title || "Blog"}>
        {activeBlog && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <img src={activeBlog.image} alt={activeBlog.title} style={{ width: "100%", borderRadius: "10px", maxHeight: "400px", objectFit: "cover" }} />
            <div style={{ fontSize: "1.4rem", color: "hsl(var(--primary))", display: "flex", justifyContent: "space-between" }}>
              <span><strong>Author:</strong> {activeBlog.author}</span>
              <span><strong>Published:</strong> {new Date(activeBlog.published_date).toLocaleDateString()}</span>
            </div>
            <div style={{ fontSize: "1.6rem", lineHeight: "1.8", color: "hsl(var(--text-main))" }}>
              {activeBlog.content}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
