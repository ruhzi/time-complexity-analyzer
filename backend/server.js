const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const esprima = require("esprima");
const { spawn } = require("child_process"); // Use spawn for better control

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

/**
 * Function to estimate time complexity for JavaScript using AST
 */
function analyzeJavaScript(code) {
    try {
        const ast = esprima.parseScript(code, { tolerant: true });
        let loops = 0;

        function traverse(node) {
            if (!node || typeof node !== "object") return;
            if (node.type === "ForStatement" || node.type === "WhileStatement") loops++;
            for (const key in node) traverse(node[key]);
        }

        traverse(ast);

        if (loops === 0) return "O(1)";
        if (loops === 1) return "O(n)";
        if (loops >= 2) return "O(n^2)";

        return "Unknown Complexity";
    } catch (error) {
        console.error("Error analyzing JS code:", error);
        return "Error in Analysis";
    }
}

/**
 * Function to analyze Python code (without Docker)
 */
function analyzePython(code) {
    return new Promise((resolve, reject) => {
        const process = spawn("python", ["analyze_python.py"], { cwd: __dirname });

        // Send code to Python script via stdin
        process.stdin.write(code);
        process.stdin.end();

        let output = "";
        let errorOutput = "";

        process.stdout.on("data", (data) => {
            output += data.toString();
        });

        process.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });

        process.on("close", (code) => {
            if (code !== 0) {
                reject(`Python process exited with code ${code}: ${errorOutput}`);
            } else {
                try {
                    const parsedOutput = JSON.parse(output.trim());
                    resolve(parsedOutput.complexity || "Error analyzing code.");
                } catch (error) {
                    resolve("Error parsing Python output.");
                }
                
            }
        });
    });
}

// Analyze Code Complexity Route
app.post("/analyze", async (req, res) => {
    const { code, language } = req.body;

    if (!code || !language) {
        return res.status(400).json({ error: "Code and language are required" });
    }

    let complexity = "Unknown";

    if (language === "javascript") {
        complexity = analyzeJavaScript(code);
    } else if (language === "python") {
        try {
            complexity = await analyzePython(code);
        } catch (error) {
            return res.status(500).json({ error });
        }
    } else {
        return res.status(400).json({ error: "Unsupported language" });
    }

    res.json({ complexity });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
