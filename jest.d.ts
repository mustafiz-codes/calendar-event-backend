declare global {
  namespace jest {
    interface Matchers<R> {
      toEqual(): R;
      toBe(): R;
    }
  }
}

export {};
