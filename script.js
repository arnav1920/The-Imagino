const key = "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";
const inputText = document.getElementById("input");
const image = document.getElementById("image");
const GenBtn = document.getElementById("btn");
const svg = document.getElementById("svg");
const load = document.getElementById("loading");
const ResetBtn = document.getElementById("reset");
const downloadBtn = document.getElementById("download");

async function query(prompt) {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
            {
                headers: { Authorization: `Bearer ${key}` },
                method: "POST",
                body: JSON.stringify({ "inputs": prompt }),
            }
        );

        if (!response.ok) {
            throw new Error("Image generation failed. Please try again.");
        }

        const result = await response.blob();
        return result;
    } catch (error) {
        alert(error.message);
        load.style.display = "none";
        svg.style.display = "block";
        return null;
    }
}

async function generate() {
    const prompt = inputText.value.trim();

    if (!prompt) {
        alert("Please enter a prompt before generating an image.");
        return;
    }

    load.style.display = "block";
    image.style.display = "none";
    svg.style.display = "none";

    const response = await query(prompt);

    if (response) {
        const objectUrl = URL.createObjectURL(response);
        image.src = objectUrl;
        image.style.display = "block";
        load.style.display = "none";

        downloadBtn.onclick = () => downloadImage(objectUrl);
    }
}

GenBtn.addEventListener("click", generate);
inputText.addEventListener("keydown", (e) => {
    if (e.key === "Enter") generate();
});

ResetBtn.addEventListener("click", () => {
    inputText.value = "";
    image.style.display = "none";
    svg.style.display = "block";
});

function downloadImage(objectUrl) {
    fetch(objectUrl)
        .then(res => res.blob())
        .then(file => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(file);
            a.download = `AI_Image_${Date.now()}.png`;
            a.click();
        })
        .catch(() => alert("Download failed"));
}
