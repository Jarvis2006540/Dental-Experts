import db from "../../lib/db";
import pageStyles from "../page.module.css";
import BlogListClient from "./BlogListClient";

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
          
          <BlogListClient blogs={blogs} />
        </div>
      </section>
    </div>
  );
}
