import list, { defaultParser } from '../list';

test('assert when no model provided', () => {
    try {
        list()
    } catch (e) {
        expect(e.name).toBe('AssertionError [ERR_ASSERTION]');
        expect(e.message).toBe('A valid model is required');
    }
})

test('defaultParser maps rows', async () => {
    const fakeModel = (data) => ({
        toJSON: () => data,
        get: (key) => data[key]
    })
    // Maps wo
    expect(defaultParser({
        count: 2, 
        rows: [
            fakeModel({
                name: 'John',
                age: 21
            }), 
            fakeModel({
                name: 'Sarah',
                age: 30
            })
        ]
    })).toEqual({
        total: 2,
        results: [{
            name: 'John',
            age: 21
        }, {
            name: 'Sarah',
            age: 30
        }]
    })
})

test('defaultParser passes on whitelist', async () => {
    const fakeModel = (data) => ({
        toJSON: () => data,
        get: (key) => data[key]
    })
    // Maps wo
    expect(defaultParser({
        count: 2, 
        rows: [
            fakeModel({
                name: 'John',
                age: 21
            }), 
            fakeModel({
                name: 'Sarah',
                age: 30
            })
        ]
    }, ['name'])).toEqual({
        total: 2,
        results: [{
            name: 'John',
        }, {
            name: 'Sarah',
        }]
    })
})