describe('Example Test Suite', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should test string equality', () => {
    const message = 'Hello, World!';
    expect(message).toBe('Hello, World!');
  });

  it('should test array contains', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(arr).toContain(3);
  });
});
