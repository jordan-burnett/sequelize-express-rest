import parseFieldsString from '../parseFieldsString';

test('parses a single field', () => {
    expect(
        parseFieldsString('id')
    ).toEqual(['id'])
});

test('parses comma seperated list', () => {
    expect(
        parseFieldsString('id,name, age, location')
    ).toEqual(['id', 'name', 'age', 'location'])
});

test('fitlers out unwhitelisted fields', () => {
    expect(
        parseFieldsString('id,name,age,location', ['name', 'age'])
    ).toEqual(['name', 'age'])
    expect(
        parseFieldsString('id,name,location', ['name', 'age'])
    ).toEqual(['name'])
});

test('accepts blank input', () => {
    expect(parseFieldsString('')).toEqual([]);
    expect(parseFieldsString()).toEqual([]);
});