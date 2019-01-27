
export default function parseOrderString(orderString = '', whitelist){
    const order = [];
    orderString.split(/, ?/).forEach(string => {
        const field = string.replace(/^-/, '');
        if(!field){
            return;
        }
        if(!whitelist || (whitelist && whitelist.includes(field))) {
            const dir = string.length === field.length ? 'ASC' : 'DESC';
            order.push([field, dir]);
        }
    })
    return order;
}