import { secBetweenTwoTime } from './../../../src/utils/commons'

test('difference of seconds between two timestamps', () => {
    const first = 1586100126 
    const seconds = 1586100121

    const output = 0.5

    expect(secBetweenTwoTime(first, seconds)).toEqual(output)
})
