import ast
import sys

def analyze_complexity(code):
    try:
        tree = ast.parse(code)
        loops = sum(isinstance(node, (ast.For, ast.While)) for node in ast.walk(tree))

        if loops == 0:
            return "O(1)"
        elif loops == 1:
            return "O(n)"
        elif loops >= 2:
            return "O(n^2)"
        else:
            return "Unknown Complexity"
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    input_data = sys.stdin.read()
    result = analyze_complexity(input_data)
    print(result)  # ✅ Only returning plain text
