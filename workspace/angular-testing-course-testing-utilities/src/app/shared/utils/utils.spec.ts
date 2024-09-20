import { pluck, range } from "./utils";

describe('Utils', () => {
  it('Range', () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4]);
  });

  describe('pluck', () => {
    it('returns correct result', () => {
      const data = [
        { id: '1', name: 'foo' },
        { id: '2', name: 'foo' },
        { id: '3', name: 'foo' },
      ]
      expect(pluck(data, "id")).toEqual(['1', '2', '3']);
    });
  })
})