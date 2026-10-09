
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


def linear_search(numbers, target):
    steps = []

    for index, number in enumerate(numbers):
        steps.append({
            "index": index,
            "value": number,
            "found": number == target
        })

        if number == target:
            return {
                "found": True,
                "index": index,
                "position": index + 1,
                "steps": steps,
                "comparisons": len(steps)
            }

    return {
        "found": False,
        "index": -1,
        "position": -1,
        "steps": steps,
        "comparisons": len(steps)
    }


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/search", methods=["POST"])
def search():
    data = request.get_json(silent=True) or {}

    try:
        raw_numbers = data.get("numbers", "")
        raw_target = data.get("target", "")

        if not isinstance(raw_numbers, str):
            return jsonify({"error": "Enter numbers as text."}), 400

        if not isinstance(raw_target, str):
            return jsonify({"error": "Enter a numeric target."}), 400

        if not raw_numbers.strip() or not raw_target.strip():
            return jsonify({
                "error": "Please enter numbers and a target."
            }), 400

        numbers = [
            int(value.strip())
            for value in raw_numbers.split(",")
        ]
        target = int(raw_target.strip())

        if len(numbers) > 1000:
            return jsonify({
                "error": "Please enter no more than 1000 numbers."
            }), 400

        result = linear_search(numbers, target)
        result["numbers"] = numbers
        result["target"] = target

        return jsonify(result)

    except ValueError:
        return jsonify({
            "error": "Enter valid integers separated by commas."
        }), 400


if __name__ == "__main__":
    app.run(debug=True, port=5000)