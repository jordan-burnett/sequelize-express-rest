import assert from 'assert';
import Sequelize from 'sequelize';
import parseRow from './parseRow';

const defaults = {
    fieldWhitelist: null,
    resolve: defaultResolver,
    parse: parseRow
}

function defaultResolver(Model, data) {
    return Model.create(data, queryOpts);
}

const create = (Model, options) => {

    assert(Model instanceof Sequelize.Model, 'A valid model is required');

    const config = Object.assign({}, defaults, options);
    
    return async (req, res, next) => {

        const data = req.body;

        const resolveResponse = await config.resolve(Model, data);

        const json = await config.parse(resolveResponse, config.fieldWhitelist);

        res.status(201).json(json);
        next();

    }
}

export default create;