import localforage from 'localforage';
import AsyncStorage from '@react-native-community/async-storage';
import { driverWithDefaultSerialization } from '../src/main';

beforeEach(async () => {
  global.testStorage = localforage.createInstance({
    name: `driverWithDefaultSerializationTest_${Date.now() * 1000}`
  });

  const driver = driverWithDefaultSerialization();
  await testStorage.defineDriver(driver);
  await testStorage.setDriver(driver._driver);
  return AsyncStorage.clear();
});

afterEach(() => {
  delete global.testStorage;
});

describe('setItem()/getItem()', () => {
  it('sets and gets a simple item when setItem is called with default serializer', async () => {
    const testValue    = 'TEST_VALUE';
    const writtenValue = await testStorage.setItem('test', testValue);
    expect(writtenValue).toBe(testValue);

    const forageValue = await testStorage.getItem('test');
    expect(forageValue).toBe(testValue);

    const keyPrefix = testStorage.config().name;
    expect(keyPrefix).toBeDefined();

    const storageValue = await AsyncStorage.getItem(`${keyPrefix}/test`);
    expect(storageValue).toBe(JSON.stringify(testValue));
  });

  it('sets and gets a complex item when setItem is called with default serializer', async () => {
    const complexValue = { test: true };
    const writtenValue = await testStorage.setItem('test', { test: true });
    expect(writtenValue.test).toBe(complexValue.test);

    const forageValue = await testStorage.getItem('test');
    expect(forageValue.test).toBe(complexValue.test);

    const keyPrefix = testStorage.config().name;
    expect(keyPrefix).toBeDefined();

    const storageValue = await AsyncStorage.getItem(`${keyPrefix}/test`);
    expect(storageValue).toBe(JSON.stringify(complexValue));
  });
});

describe('keys()', () => {
  it('returns an empty string, if nothing is in the store', async () => {
    const keys = await testStorage.keys();
    expect(keys).toBeDefined();
    expect(Array.isArray(keys)).toBe(true);
    expect(keys.length).toBe(0);
  });

  it('returns all stored keys without keyPrefix', async () => {
    await testStorage.setItem('test1', 'valueOfTest1');
    await testStorage.setItem('test2', 'valueOfTest2');
    const keys = await testStorage.keys();
    expect(keys).toStrictEqual([ 'test1', 'test2' ]);
  });
});

describe('removeItem()', () => {
  it('removes an already existing item from storage', async () => {
    await testStorage.setItem('existingKey', 'existingValue');
    await testStorage.removeItem('existingKey');
    expect(await testStorage.getItem('existingKey')).toBeNull();
    expect(await AsyncStorage.getItem('existingKey')).toBeNull();
  });

  it('does nothing when removing a non-existing key', async () => {
    await testStorage.removeItem('nonExistingKey');
    expect(await testStorage.getItem('nonExistingKey')).toBeNull();
  });
});
