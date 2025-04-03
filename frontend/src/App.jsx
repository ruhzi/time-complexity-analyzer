import { useState } from "react";

function App() {
    const [code, setCode] = useState(""); // User input code
    const [language, setLanguage] = useState("javascript"); // Default language
    const [result, setResult] = useState(""); // Complexity result

    const analyzeCode = async () => {
        try {
            console.log("Sending request...");
            const response = await fetch("http://localhost:5000/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, language }), // Use selected language
            });
    
            console.log("Response received:", response);
            const data = await response.json();
            console.log("Parsed data:", data);
    
            setResult(data.complexity); // ✅ Extract just the complexity value
        } catch (error) {
            console.error("Error:", error);
            setResult("Error analyzing code.");
        }
    };
    

    // Reset the UI when the language is changed
    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
        setCode("");  // Clears the code input
        setResult("");  // Clears the result
    };

    return (
        <div>
            <h1>Time Complexity Analyzer</h1>

            {/* Language Selection */}
            <label>Select Language:</label>
            <select value={language} onChange={handleLanguageChange}>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
            </select>

            <br />

            {/* Code Input */}
            <textarea 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
                placeholder={`Write your ${language} code here...`}
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
