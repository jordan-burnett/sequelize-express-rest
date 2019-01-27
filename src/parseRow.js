export default function parseRow(row, fieldWhitelist) {
    if(fieldWhitelist) {
        const output = {};
        fieldWhitelist.forEach(field => output[field] = row.get(field));
        return output;
    } else {
        return row.toJSON()
    }
}