import { deepMerge } from './../../../src/utils/commons'

test('merge of two objects', () => {
    const x = {
        foo: { bar: 1 },
        array: [{
            does: 'work',
            too: [ 1, 1, 1 ]
        }]
    }
     
    const y = {
        foo: { baz: 1 },
        quux: 1,
        array: [{
            does: 'work',
            too: [ 2, 2, 2 ]
        }, {
            really: 'yes'
        }]
    }
     
    const output = {
        foo: {
            bar: 1,
            baz: 1
        },
        array: [{
            does: 'work',
            too: [ 1, 1, 1 ]
        }, {
            does: 'work',
            too: [ 2, 2, 2 ]
        }, {
            really: 'yes'
        }],
        quux: 1
    }

    expect(deepMerge(x,  y)).toEqual(output)
})

test('merge of two empty objects', () => {
    expect(deepMerge({}, {})).toEqual({})
})

test('merge of two objects one of them is empty', () => {
    const x = {
        foo: { bar: 1 },
        array: [{
            does: 'work',
            too: [ 1, 1, 1 ]
        }]
    }

    expect(deepMerge(x, {})).toEqual(x)
})

test('merge of object with null || undefined', () => {
    expect(deepMerge({}, null)).toBeUndefined()
    expect(deepMerge({}, undefined)).toBeUndefined()
})

test('merge equals objects', () => {
    const x = {
        foo: { bar: 1 },
        array: [{
            does: 'work',
            too: [ 1, 1, 1 ]
        }]
    }
    const y = {
        foo: { bar: 1 },
        array: [{
            does: 'work',
            too: [ 1, 1, 1 ]
        }]
    }

    expect(deepMerge(x, y)).toEqual(y)
})

test('merge object with string || two strings', () => {
    const x = {
        foo: { bar: 1 },
        array: [{
            does: 'work',
            too: [ 1, 1, 1 ]
        }]
    }
    const y = `{
        foo: { bar: 1 },
        array: [{
            does: 'work',
            too: [ 1, 1, 1 ]
        }]
    }`

    expect(deepMerge(y, x)).toBeUndefined()
})
