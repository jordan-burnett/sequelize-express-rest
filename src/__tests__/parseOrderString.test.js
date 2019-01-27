import parseOrderString from '../parseOrderString';

test('default to ascending', () => {
    expect(parseOrderString('createdAt')).toEqual([
        ['createdAt', 'ASC']
    ]);
});

test('parses descending values', () => {
    expect(parseOrderString('-createdAt')).toEqual([
        ['createdAt', 'DESC']
    ]);
});

test('accept sempty input', () => {
    expect(parseOrderString()).toEqual([]);
    expect(parseOrderString('')).toEqual([]);
});

test('splits comma delimited strings', () => {
    expect(parseOrderString('createdAt,-updatedAt, age, -name')).toEqual([
        ['createdAt', 'ASC'],
        ['updatedAt', 'DESC'],
        ['age', 'ASC'],
        ['name', 'DESC']
    ]);
});

test('filters out unwhitelisted fields', () => {
    expect(parseOrderString('createdAt', [])).toEqual([]);
    expect(parseOrderString('createdAt', ['createdAt'])).toEqual([
        ['createdAt', 'ASC']
    ]);
    expect(parseOrderString('-createdAt', ['createdAt'])).toEqual([
        ['createdAt', 'DESC']
    ]);
    expect(parseOrderString('createdAt, -updatedAt', ['createdAt'])).toEqual([
        ['createdAt', 'ASC']
    ]);
    expect(parseOrderString('createdAt, -updatedAt', ['updatedAt'])).toEqual([
        ['updatedAt', 'DESC']
    ]);
    expect(parseOrderString('createdAt,-updatedAt, -name', ['createdAt', 'name'])).toEqual([
        ['createdAt', 'ASC'],
        ['name', 'DESC']
    ]);
});