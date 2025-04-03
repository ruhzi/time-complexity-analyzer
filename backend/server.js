const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const esprima = require("esprima"); // AST Parser for JavaScript

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

/**
 * Function to estimate time complexity using AST
 */
function analyzeComplexity(code) {
    try {
        const ast = esprima.parseScript(code, { tolerant: true });
        let loops = 0;

        // Traverse AST and count loops
        function traverse(node) {
            if (!node || typeof node !== "object") return;
            if (node.type === "ForStatement" || node.type === "WhileStatement") loops++;
            for (const key in node) traverse(node[key]);
        }

        traverse(ast);

        // Estimate Complexity
        if (loops === 0) return "O(1)"; // No loops → Constant time
        if (loops === 1) return "O(n)"; // Single loop → Linear
        if (loops >= 2) return "O(n^2)"; // Nested loops → Quadratic

        return "Unknown Complexity";
    } catch (error) {
        console.error("Error analyzing code:", error);
        return "Error in Analysis";
    }
}

// Analyze Code Complexity Route
app.post("/analyze", (req, res) => {
    const { code } = req.body;

    if (!code) return res.status(400).json({ error: "No code provided" });

    const complexity = analyzeComplexity(code);
    res.json({ complexity });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
