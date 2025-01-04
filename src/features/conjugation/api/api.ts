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