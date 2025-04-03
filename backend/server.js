// server.js (updated analyzePython function included)
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const esprima = require("esprima");
const { spawn } = require("child_process");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

function analyzeJavaScript(code) {
    try {
        const ast = esprima.parseScript(code, { tolerant: true });
        let loopDepth = 0;
        let currentDepth = 0;

        function traverse(node) {
            if (!node || typeof node !== "object") return;

            if (node.type === "ForStatement" || node.type === "WhileStatement") {
                currentDepth++;
                loopDepth = Math.max(loopDepth, currentDepth);
                traverse(node.body);
                currentDepth--;
                return;
            }

            for (const key in node) {
                traverse(node[key]);
            }
        }

        traverse(ast);

        let complexity = "O(1)";
        let reason = "No loops or recursion found.";

        if (loopDepth === 1) {
            complexity = "O(n)";
            reason = "1 loop level detected.";
        } else if (loopDepth === 2) {
            complexity = "O(n^2)";
            reason = "2 nested loops detected.";
        } else if (loopDepth === 3) {
            complexity = "O(n^3)";
            reason = "3 nested loops detected.";
        } else if (loopDepth > 3) {
            complexity = `O(n^${loopDepth})`;
            reason = `${loopDepth} nested loops detected.`;
        }

        return { complexity, reason };
    } catch (error) {
        console.error("Error analyzing JS code:", error);
        return { complexity: "Error", reason: "JS parsing failed." };
    }
}

function analyzePython(code) {
    return new Promise((resolve, reject) => {
        const process = spawn("python", ["analyze_python.py"], { cwd: __dirname });

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

        process.on("close", (exitCode) => {
            if (exitCode !== 0) {
                reject(`Python process exited with code ${exitCode}: ${errorOutput}`);
            } else {
                try {
                    console.log("📦 Raw Python output:", output.trim());

                    const parsedOutput = JSON.parse(output.trim());
                    resolve({
                        complexity: parsedOutput.complexity,
                        reason: parsedOutput.reason || "No reason provided by Python script."
                    });
                } catch (error) {
                    resolve({
                        complexity: "Error",
                        reason: "Invalid JSON returned by Python script."
                    });
                }
            }
        });
    });
}

app.post("/analyze", async (req, res) => {
    const { code, language } = req.body;

    if (!code || !language) {
        return res.status(400).json({ error: "Code and language are required" });
    }

    let analysisResult;

    if (language === "javascript") {
        analysisResult = analyzeJavaScript(code);
    } else if (language === "python") {
        try {
            analysisResult = await analyzePython(code);
        } catch (error) {
            return res.status(500).json({ error: error.toString() });
        }
    } else {
        return res.status(400).json({ error: "Unsupported language" });
    }

    res.json(analysisResult);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
