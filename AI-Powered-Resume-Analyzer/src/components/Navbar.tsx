export default function Navbar() {
  return (
    <nav style={{ padding: "20px", background: "black", color: "white", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #333" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>AI Resume</h1>
      <div style={{ display: "flex", gap: "20px" }}>
        <button style={{ background: "none", color: "white" }}>Home</button>
        <button style={{ background: "none", color: "white" }}>Features</button>
        <button style={{ background: "none", color: "white" }}>Dashboard</button>
      </div>
    </nav>
  );
}