import parseRow from '../parseRow';

test('returns flattened data', async () => {
    const fakeModel = (data) => ({
        toJSON: () => data,
        get: (key) => data[key]
    })
    // Return flat data
    expect(parseRow(fakeModel({
        name: 'John',
        age: 21
    }))).toEqual({
        name: 'John',
        age: 21
    })
});

test('omnits non-whitelisted fields', async () => {
    const fakeModel = (data) => ({
        toJSON: () => data,
        get: (key) => data[key]
    })
    // Return flat data
    expect(parseRow(fakeModel({
        name: 'John',
        age: 21,
        password: 'foobar'
    }), ['name', 'age'])).toEqual({
        name: 'John',
        age: 21
    })
});