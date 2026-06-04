export default function Hero() {
  return (
    <div style={{ textAlign: "center", padding: "100px 20px", background: "black", color: "white" }}>
      <h1 style={{ fontSize: "60px", maxWidth: "800px", margin: "0 auto 20px" }}>
        AI Powered Resume Analyzer
      </h1>
      <p style={{ fontSize: "20px", color: "#aaa", maxWidth: "600px", margin: "0 auto 30px" }}>
        Generate ATS optimized resumes, analyze job descriptions, and predict your ideal career path using AI.
      </p>
      <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
        <button style={{ background: "white", color: "black", padding: "12px 30px", borderRadius: "10px", cursor: "pointer" }}>
          Get Started
        </button>
        <button style={{ border: "1px solid #555", padding: "12px 30px", borderRadius: "10px", background: "none", color: "white", cursor: "pointer" }}>
          Learn More
        </button>
      </div>
    </div>
  );
}