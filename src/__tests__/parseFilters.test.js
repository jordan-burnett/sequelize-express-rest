import { Op } from 'sequelize';
import parseFilters from '../parseFilters';

test('defaults to equality check', () => {
    expect(parseFilters({
        'name': 'john',
        'age': 21
    })).toEqual({
        'name': {
            [Op.eq]: 'john'
        },
        'age': {
            [Op.eq]: 21
        }
    });
});

test('accepts multiple filters for same attribute', () => {
    expect(parseFilters({
        'age[gte]': 20,
        'age[lte]': 30
    })).toEqual({
        'age': {
            [Op.gte]: 20,
            [Op.lte]: 30,
        }
    });
});

test('splits values for comma delimited fields', () => {
    expect(parseFilters({
        'id[in]': '1,2,3, 4, 5, 6'
    })).toEqual({
        'id': {
            [Op.in]: ['1', '2', '3', '4', '5', '6']

        }
    });
});

test('filters out none whitelisted operators', () => {
    // Respect whitelisted operators
    expect(parseFilters({
        'id[regexp]': 'foobar',
        'name': 'John'
    }, null, ['eq'])).toEqual({
        'name': {
            [Op.eq]: 'John'
        }
    });
});

test('ignores invalid operators', () => {
    expect(parseFilters({
        'id[foobar]': 'foobar',
        'name': 'John'
    }, null, null)).toEqual({
        'name': {
            [Op.eq]: 'John'
        }
    });
});

test('filters out non-whitelisted filters', () => {
    expect(parseFilters({
        'name': 'John',
        'age[gte]': 20,
        'age[lte]': 30
    }, ['name', 'age[lte]'])).toEqual({
        'name': {
            [Op.eq]: 'John'
        },
        'age': {
            [Op.lte]: 30
        }
    });
});

test('allows wildcard operators', () => {
    expect(
        parseFilters({
            'name': 'John',
            'age[gte]': 20,
            'age[lte]': 30
        }, ['age[*]'])
    ).toEqual({
        'age': {
            [Op.gte]: 20,
            [Op.lte]: 30,
        }
    });
});