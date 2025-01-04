export async function fetchLabels() {
    const res = await fetch('/api/labels');
    return res.json();
}