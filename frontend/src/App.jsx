import { useState, useEffect } from "react";
import ComplexityGraph from "./ComplexityGraph";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";

function App() {
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [analysis, setAnalysis] = useState({ complexity: "", reason: "" });
    const [loading, setLoading] = useState(false);

    const analyzeCode = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, language }),
            });
    
            const data = await response.json();
            console.log("🔍 Server Response:", data); // <--- ADD THIS
    
            setAnalysis({
                complexity: data.complexity || "Unknown",
                reason: data.reason || "No explanation available.",
            });
        } catch (error) {
            console.error("Error:", error);
            setAnalysis({
                complexity: "Error",
                reason: "An error occurred while analyzing code.",
            });
        } finally {
            setLoading(false);
        }
    };
    

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
        setCode("");
        setAnalysis({ complexity: "", reason: "" });
    };

    useEffect(() => {
        if (analysis.complexity) {
            const resultElement = document.getElementById("result-section");
            resultElement?.scrollIntoView({ behavior: "smooth" });
        }
    }, [analysis]);

    return (
        <div>
            <h1>Time Complexity Analyzer</h1>

            <label>Select Language:</label>
            <select value={language} onChange={handleLanguageChange}>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
            </select>

            <br />

            <CodeMirror
                value={code}
                height="200px"
                extensions={[language === "javascript" ? javascript() : python()]}
                theme="dark"
                onChange={(value) => setCode(value)}
                placeholder={`Write your ${language} code here...`}
            />

            <br />
            <button onClick={analyzeCode} disabled={loading}>
                {loading ? "Analyzing..." : "Analyze Complexity"}
            </button>

            <div id="result-section">
                {analysis.complexity && (
                    <>
                        <h2>Complexity: {analysis.complexity}</h2>
                        <p><i>Reason: {analysis.reason}</i></p>
                        <ComplexityGraph complexity={analysis.complexity} />
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
