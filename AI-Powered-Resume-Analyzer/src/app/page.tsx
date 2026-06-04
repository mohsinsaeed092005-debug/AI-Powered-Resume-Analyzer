export default function Home() {
  return (
    <div style={{ background: "black", color: "white", minHeight: "100vh" }}>
      
      {/* Navbar */}
      <div style={{ padding: "20px", borderBottom: "1px solid #333", display: "flex", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>AI Resume</h1>
        <div style={{ display: "flex", gap: "20px" }}>
          <span>Home</span>
          <span>Features</span>
          <span>Dashboard</span>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <h1 style={{ fontSize: "60px", maxWidth: "800px", margin: "0 auto 20px" }}>
          AI Powered Resume Analyzer
        </h1>
        <p style={{ fontSize: "20px", color: "#aaa", maxWidth: "600px", margin: "0 auto 30px" }}>
          Generate ATS optimized resumes, analyze job descriptions, and predict your ideal career path using AI.
        </p>
        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <button style={{ background: "white", color: "black", padding: "12px 30px", borderRadius: "10px", border: "none", cursor: "pointer" }}>
            Get Started
          </button>
          <button style={{ border: "1px solid #555", padding: "12px 30px", borderRadius: "10px", background: "none", color: "white", cursor: "pointer" }}>
            Learn More
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: "80px 20px", borderTop: "1px solid #333" }}>
        <h2 style={{ fontSize: "48px", textAlign: "center", marginBottom: "15px" }}>Powerful Features</h2>
        <p style={{ textAlign: "center", color: "#aaa", marginBottom: "50px" }}>
          Everything you need to create the perfect resume
        </p>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "25px", maxWidth: "1200px", margin: "0 auto" }}>
          
          <div style={{ background: "#1e1e1e", padding: "30px", borderRadius: "15px" }}>
            <div style={{ fontSize: "50px", marginBottom: "15px" }}>📊</div>
            <h3>AI Resume Analysis</h3>
            <p style={{ color: "#aaa" }}>ATS scoring and suggestions</p>
          </div>

          <div style={{ background: "#1e1e1e", padding: "30px", borderRadius: "15px" }}>
            <div style={{ fontSize: "50px", marginBottom: "15px" }}>🔍</div>
            <h3>Job Scanner</h3>
            <p style={{ color: "#aaa" }}>Extract key requirements</p>
          </div>

          <div style={{ background: "#1e1e1e", padding: "30px", borderRadius: "15px" }}>
            <div style={{ fontSize: "50px", marginBottom: "15px" }}>✍️</div>
            <h3>Smart Generation</h3>
            <p style={{ color: "#aaa" }}>ATS-optimized content</p>
          </div>

          <div style={{ background: "#1e1e1e", padding: "30px", borderRadius: "15px" }}>
            <div style={{ fontSize: "50px", marginBottom: "15px" }}>🎯</div>
            <h3>Job Prediction</h3>
            <p style={{ color: "#aaa" }}>Best matching roles</p>
          </div>

          <div style={{ background: "#1e1e1e", padding: "30px", borderRadius: "15px" }}>
            <div style={{ fontSize: "50px", marginBottom: "15px" }}>📈</div>
            <h3>Skill Gap Analysis</h3>
            <p style={{ color: "#aaa" }}>Identify missing skills</p>
          </div>

          <div style={{ background: "#1e1e1e", padding: "30px", borderRadius: "15px" }}>
            <div style={{ fontSize: "50px", marginBottom: "15px" }}>📄</div>
            <h3>PDF Export</h3>
            <p style={{ color: "#aaa" }}>Download resume</p>
          </div>
        </div>
      </div>
    </div>
  );
}