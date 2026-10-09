
async function startSearch() {
    const numbersInput = document.getElementById("numbers").value.trim();
    const targetInput = document.getElementById("target").value.trim();

    const button = document.getElementById("searchButton");
    const message = document.getElementById("message");
    const result = document.getElementById("result");
    const display = document.getElementById("arrayDisplay");
    const stepsList = document.getElementById("steps");

    if (!numbersInput || !targetInput) {
        message.textContent = "Please enter the list and target.";
        return;
    }

    button.disabled = true;
    button.textContent = "Searching...";
    message.textContent = "";
    result.className = "result";
    result.textContent = "Processing your search...";
    display.replaceChildren();
    stepsList.replaceChildren();

    document.getElementById("comparisons").textContent = "0";
    document.getElementById("index").textContent = "—";

    try {
        const response = await fetch("/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                numbers: numbersInput,
                target: targetInput
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Search failed.");
        }

        // Display each array element.
        data.numbers.forEach((number, index) => {
            const item = document.createElement("div");
            item.className = "array-item";
            item.id = `item-${index}`;
            item.append(document.createTextNode(number));

            const position = document.createElement("span");
            position.className = "position";
            position.textContent = `Index ${index}`;

            item.appendChild(position);
            display.appendChild(item);
        });

        // Display the comparison steps.
        data.steps.forEach((step) => {
            const listItem = document.createElement("li");

            if (step.found) {
                listItem.textContent =
                    `Index ${step.index}: ${step.value} == ${data.target}. Target found!`;
                document.getElementById(`item-${step.index}`)
                    .classList.add("found");
            } else {
                listItem.textContent =
                    `Index ${step.index}: ${step.value} != ${data.target}. Continue searching.`;
                document.getElementById(`item-${step.index}`)
                    .classList.add("checked");
            }

            stepsList.appendChild(listItem);
        });

        document.getElementById("comparisons").textContent =
            data.comparisons;

        document.getElementById("index").textContent =
            data.found ? data.index : "Not found";

        if (data.found) {
            result.className = "result success";
            result.textContent =
                `Target ${data.target} found at index ${data.index}, ` +
                `position ${data.position}, after ${data.comparisons} comparison(s).`;
        } else {
            result.className = "result error";
            result.textContent =
                `Target ${data.target} was not found after ` +
                `${data.comparisons} comparison(s).`;
        }

    } catch (error) {
        result.className = "result error";
        result.textContent = error.message;
    } finally {
        button.disabled = false;
        button.textContent = "Search Now";
    }
}