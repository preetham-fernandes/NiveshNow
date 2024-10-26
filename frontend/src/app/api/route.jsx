// pages/api/getStock.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const response = await fetch('http://127.0.0.1:5000/api/route', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
