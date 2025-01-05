export async function checkIfVerbExists(verb: string): Promise<boolean> {
    try {
        const res = await fetch(`/api/verb-check/${verb}`);
        const data = await res.json();
        // If the response is 200 and exists is true, return true
        return data.exists === true;
    } catch (error) {
        console.error('Error checking verb existence:', error);
        return false;
    }
}

export async function fetchConjugation(verb: string): Promise<any> {
    const response = await fetch(`/api/conjugate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verb }),
    });
    const data = await response.json();
    return data;
}
