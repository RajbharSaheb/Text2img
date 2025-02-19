const HF_API_TOKEN = "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"; // Replace with your Hugging Face API Token
const MODEL_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2";

async function generateImages() {
    let prompt = document.getElementById("textInput").value;
    let numImages = parseInt(document.getElementById("numImages").value);
    let allowNSFW = document.getElementById("nsfwToggle").checked;
    let loadingText = document.getElementById("loading");
    let imageContainer = document.getElementById("imageContainer");

    if (!prompt) {
        alert("Please enter a prompt!");
        return;
    }

    loadingText.style.display = "block";
    imageContainer.innerHTML = ""; // Clear previous images

    try {
        let requests = [];
        for (let i = 0; i < numImages; i++) {
            requests.push(
                fetch(MODEL_URL, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${HF_API_TOKEN}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ 
                        inputs: prompt,
                        parameters: { 
                            do_not_filter_nsfw: allowNSFW // Enables/Disables NSFW filtering
                        }
                    })
                })
            );
        }

        let responses = await Promise.all(requests);
        let blobs = await Promise.all(responses.map(res => res.blob()));

        blobs.forEach(blob => {
            let imageUrl = URL.createObjectURL(blob);
            let imgElement = document.createElement("img");
            imgElement.src = imageUrl;
            imageContainer.appendChild(imgElement);
        });

    } catch (error) {
        alert("Error: " + error.message);
    } finally {
        loadingText.style.display = "none";
    }
}
