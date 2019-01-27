import assert from 'assert';
import Sequelize from 'sequelize';
import parseRow from './parseRow';

const defaults = {
    fieldWhitelist: null,
    pkParam: 'id',
    resolve: defaultResolver,
    parse: parseRow
}

function defaultResolver(Model, pk, queryOpts) {
    return Model.findByPk(pk, queryOpts);
}

const get = (Model, options) => {

    assert(Model instanceof Sequelize.Model, 'A valid model is required');

    const config = Object.assign({}, defaults, options);
    
    return async (req, res, next) => {

        const query = req.query || {};
        const { fields } = query;

        const pk = req.params[config.pkParam];

        assert(pk, 'No private key found. Check pkParam is set correctly');

        const queryOpts = {
            attributes: parseFieldsString(fields, config.fieldWhitelist),
        }

        const resolveResponse = await config.resolve(Model, pk, queryOpts);

        const json = await config.parse(resolveResponse, config.fieldWhitelist);

        res.status(200).json(json);
        next();

    }
}

export default get;