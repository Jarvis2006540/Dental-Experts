import db from "../../lib/db";
import pageStyles from "../page.module.css";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Blog() {
  let blogs = [];
  try {
    const result = await db.execute("SELECT * FROM blogs ORDER BY published_date DESC");
    blogs = result.rows;
  } catch (err) {
    console.error("Failed to fetch blogs:", err);
  }

  return (
    <div className={pageStyles.main} style={{ paddingTop: "8rem" }}>
      <section className={pageStyles.section}>
        <div className="container">
          <h1 className="heading" style={{ fontSize: "3.5rem", marginBottom: "4rem" }}>Dental Experts Blog</h1>
          
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
                    <Link href="#" className="btn-primary" style={{ padding: "0.8rem 1.5rem", fontSize: "1.3rem", alignSelf: "flex-start" }}>Read More</Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
