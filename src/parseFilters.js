import Sequelize from 'sequelize';

const filterRegex = /^([\w-]+)(\[([\w-]+)\])?$/
const listOps = ['between', 'notBetween', 'in', 'notIn', 'overlap', 'contains', 'contained', 'any', 'adjacent', 'strictLeft', 'strictRight', 'noExtendRight', 'noExtendLeft']; // Operations that accept an array as input

export default function parseFilters(filters, filterWhitelist, opWhitelist) {
    const output = {};
    for(const filterName in filters) {
        const match = filterName.match(filterRegex);
        if(!match) {
            continue;
        }
        const field = match[1];
        const op = match[3] || 'eq';
        if(!(op in Sequelize.Op)){
            continue;
        }
        if(opWhitelist && !opWhitelist.includes(op)) {
            continue;
        }
        if(filterWhitelist && !(filterWhitelist.includes(filterName) || filterWhitelist.includes(`${field}[*]`))) {
            continue;
        }
        let value = filters[filterName];
        if(listOps.includes(op)) {
            value = value.split(/, ?/g);
        }
        output[field] = {
            ...output[field],
            [Sequelize.Op[op]]: value
        }
    }
    return output;
}