import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  
  const generateData = (complexity) => {
    const nValues = Array.from({ length: 20 }, (_, i) => i + 1);
  
    return nValues.map((n) => {
      let y = null;
      const c = complexity.toLowerCase();
  
      if (c.includes("o(1)")) {
        y = 1;
      } else if (c.includes("o(n log n)")) {
        y = n * Math.log2(n);
      } else if (c.includes("o(log n)")) {
        y = Math.log2(n);
      } else if (c.includes("o(n^3)")) {
        y = Math.pow(n, 3);
      } else if (c.includes("o(n^2)")) {
        y = Math.pow(n, 2);
      } else if (c.includes("o(n)")) {
        y = n;
      } else if (c.includes("o(2^n)")) {
        y = Math.pow(2, n);
      } else if (/o\(n\^(\d+)\)/.test(c)) {
        const exponent = parseInt(c.match(/o\(n\^(\d+)\)/)[1]);
        y = Math.pow(n, exponent);
      }
  
      return { n, time: y !== null ? parseFloat(y.toFixed(2)) : null };
    });
  };
  
  
  function ComplexityGraph({ complexity }) {
    if (!complexity || complexity.startsWith("Error")) return null;
  
    const data = generateData(complexity).filter(d => d.time !== null);
    if (data.length === 0) return null;
    
  
    return (
      <div style={{ width: "100%", marginTop: "30px" }}>
        <h2>Time Complexity Growth</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="n" label={{ value: "Input Size (n)", position: "insideBottomRight", offset: -5 }} />
            <YAxis label={{ value: "Time", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Line type="monotone" dataKey="time" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  export default ComplexityGraph;
  