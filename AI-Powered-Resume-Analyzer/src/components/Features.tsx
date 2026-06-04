export default function Features() {
  const features = [
    { title: "AI Resume Analysis", desc: "ATS scoring and improvement suggestions", icon: "📊" },
    { title: "Job Description Scanner", desc: "AI extracts key requirements and skills", icon: "🔍" },
    { title: "Smart Resume Generation", desc: "ATS-optimized resume content", icon: "✍️" },
    { title: "Job Prediction", desc: "Best matching job roles", icon: "🎯" },
    { title: "Skill Gap Analysis", desc: "Identify missing skills", icon: "📈" },
    { title: "PDF Export", desc: "Download professional resume", icon: "📄" },
  ];

  return (
    <div style={{ padding: "80px 20px", background: "black", color: "white", borderTop: "1px solid #333" }}>
      <h2 style={{ fontSize: "48px", textAlign: "center", marginBottom: "15px" }}>Powerful Features</h2>
      <p style={{ textAlign: "center", color: "#aaa", marginBottom: "50px" }}>
        Everything you need to create the perfect resume
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px", maxWidth: "1200px", margin: "0 auto" }}>
        {features.map((f, i) => (
          <div key={i} style={{ background: "#1e1e1e", padding: "30px", borderRadius: "15px" }}>
            <div style={{ fontSize: "50px", marginBottom: "15px" }}>{f.icon}</div>
            <h3 style={{ fontSize: "22px", marginBottom: "10px" }}>{f.title}</h3>
            <p style={{ color: "#aaa" }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}