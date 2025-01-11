let labels: Array<string> | null = null;

export default async function getLabels() {
    if(labels === null) {
        labels = ["science", "international", "France", "climat", "culture", "politique"];
    }
    return labels;
}