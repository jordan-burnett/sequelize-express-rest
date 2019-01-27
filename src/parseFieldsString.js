export default function parseFieldsString(fieldsString = '', fieldWhitelist) {
    let fields = fieldsString.split(/, ?/g);
    if(fieldWhitelist) {
        fields = fields.filter(f => f && fieldWhitelist.includes(f));
    } else {
        fields = fields.filter(f => f)
    }
    return fields;
}