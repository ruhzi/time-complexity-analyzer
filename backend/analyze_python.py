import ast
import sys
import json

class ComplexityAnalyzer(ast.NodeVisitor):
    def __init__(self):
        self.max_loop_depth = 0
        self.current_depth = 0
        self.recursive = False
        self.function_name = None

    def visit_FunctionDef(self, node):
        self.function_name = node.name
        self.generic_visit(node)

    def visit_For(self, node):
        self.current_depth += 1
        self.max_loop_depth = max(self.max_loop_depth, self.current_depth)
        self.generic_visit(node)
        self.current_depth -= 1

    def visit_While(self, node):
        self.current_depth += 1
        self.max_loop_depth = max(self.max_loop_depth, self.current_depth)
        self.generic_visit(node)
        self.current_depth -= 1

    def visit_Call(self, node):
        if isinstance(node.func, ast.Name) and node.func.id == self.function_name:
            self.recursive = True
        self.generic_visit(node)

def analyze_complexity(code):
    try:
        tree = ast.parse(code)
        analyzer = ComplexityAnalyzer()
        analyzer.visit(tree)

        if analyzer.recursive:
            complexity = "O(2^n) or higher (recursion detected)"
            reason = "Recursive function calls detected."
        elif analyzer.max_loop_depth == 0:
            complexity = "O(1)"
            reason = "No loops or recursion."
        elif analyzer.max_loop_depth == 1:
            complexity = "O(n)"
            reason = "1 loop level detected."
        elif analyzer.max_loop_depth == 2:
            complexity = "O(n^2)"
            reason = "2 nested loops detected."
        elif analyzer.max_loop_depth == 3:
            complexity = "O(n^3)"
            reason = "3 nested loops detected."
        else:
            complexity = f"O(n^{analyzer.max_loop_depth})"
            reason = f"{analyzer.max_loop_depth} nested loops detected."

        return {
            "complexity": complexity,
            "reason": reason
        }

    except Exception as e:
        return {
            "complexity": "Error",
            "reason": str(e)
        }

if __name__ == "__main__":
    input_code = sys.stdin.read()
    result = analyze_complexity(input_code)
    print(json.dumps(result))
