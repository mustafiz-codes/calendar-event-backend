declare global {
  namespace jest {
    interface MatchersExtended<R> {
      toEqual(expected: any): R;
      toBe(expected: any): R;
      // Add other matchers you need here
    }
  }
}
