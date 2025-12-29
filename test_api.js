const https = require('https');
require('dotenv').config({ path: '.env.local' });

const token = process.env.HF_TOKEN;
const models = [
    "HuggingFaceH4/zephyr-7b-beta",
    "Qwen/Qwen2.5-Coder-32B-Instruct",
    "Qwen/Qwen2.5-72B-Instruct",
    "meta-llama/Llama-3.2-3B-Instruct",
    "google/gemma-2-9b-it"
];

function testUrl(model) {
    return new Promise((resolve) => {
        const options = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        const req = https.request("https://router.huggingface.co/v1/chat/completions", options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                resolve({ model, status: res.statusCode, data: data.substring(0, 100) });
            });
        });

        req.on('error', (e) => resolve({ model, error: e.message }));
        req.write(JSON.stringify({
            model: model,
            messages: [{ role: "user", content: "Hello" }],
            max_tokens: 10
        }));
        req.end();
    });
}

async function run() {
    console.log("Testing Models on Router...");
    for (const m of models) {
        const res = await testUrl(m);
        console.log(`${m}: ${res.status} ${res.data}`);
    }
}

run();
