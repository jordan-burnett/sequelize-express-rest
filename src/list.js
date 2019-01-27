import assert from 'assert';
import Sequelize from 'sequelize';
import parseRow from './parseRow';
import parseFieldsString from './parseFieldsString';
import parseOrderString from './parseOrderString';
import parseFilters from './parseFilters';

const defaults = {
    defaultOrderBy: null,
    defaultLimit: 100,
    maxLimit: 100,
    filterWhitelist: null,
    fieldWhitelist: null,
    orderWhitelist: null,
    opWhitelist: null,
    resolve: defaultResolver,
    parse: defaultParser
}

function defaultResolver(Model, queryOpts) {
    return Model.findAndCountAll(queryOpts);
}

export function defaultParser(resolveResponse, fieldWhitelist) {
    return {
        total: resolveResponse.count,
        results: resolveResponse.rows.map(row => parseRow(row, fieldWhitelist))
    }
}

const list = (Model, options) => {

    assert(Model instanceof Sequelize.Model, 'A valid model is required');

    const config = Object.assign({}, defaults, options);
    
    return async (req, res, next) => {

        const query = req.query || {};

        const { limit, offset, orderBy, fields, ...filters } = query;

        const queryOpts = {
            order: parseOrderString(query.orderBy || options.defaultOrderBy, config.orderWhitelist),
            limit: Math.min(limit || config.defaultLimit, config.maxLimit),
            offset: offset || 0,
            attributes: parseFieldsString(fields, config.fieldWhitelist),
            where: parseFilters(filters, config.filterWhitelist, config.opWhitelist)
        }

        const resolveResponse = await config.resolve(Model, queryOpts);

        const json = await config.parse(resolveResponse, config.fieldWhitelist);

        res.status(200).json(json);
        next();

    }
}

export default list;