import { useState } from "react";

function App() {
    const [code, setCode] = useState(""); // User input code
    const [result, setResult] = useState(""); // Complexity result

    const analyzeCode = async () => {
        try {
            const response = await fetch("http://localhost:5000/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });

            const data = await response.json();
            setResult(data.complexity);
        } catch (error) {
            console.error("Error:", error);
            setResult("Error analyzing code.");
        }
    };

    return (
        <div>
            <h1>Time Complexity Analyzer</h1>
            <textarea 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
                placeholder="Write your JavaScript code here..."
                rows={8}
                cols={50}
            />
            <br />
            <button onClick={analyzeCode}>Analyze Complexity</button>
            <h2>Complexity: {result}</h2>
        </div>
    );
}

export default App;
