import localforage from 'localforage';
import AsyncStorage from '@react-native-community/async-storage';
import { driverWithoutSerialization } from '../src/main';

beforeEach(async () => {
  global.testStorage = localforage.createInstance({
    name: `driverWithoutSerializationTestStorage_${Date.now() * 1000}`
  });

  const driver = driverWithoutSerialization();
  await testStorage.defineDriver(driver);
  await testStorage.setDriver(driver._driver);
  return AsyncStorage.clear();
});

afterEach(() => {
  delete global.testStorage;
});

describe('setItem()/getItem()', () => {
  it('sets and gets a simple item when setItem is called without a serializer', async () => {
    const testValue = 'TEST_VALUE';
    const writtenValue = await testStorage.setItem('test', testValue);
    expect(writtenValue).toBe(testValue);

    const forageValue = await testStorage.getItem('test');
    expect(forageValue).toBe(testValue);

    const keyPrefix = testStorage.config().name;
    expect(keyPrefix).toBeDefined();

    const storageValue = await AsyncStorage.getItem(`${keyPrefix}/test`);
    expect(storageValue).toBe(testValue);
  });

  it('sets and gets a complex item when setItem is called without a serializer', async () => {
    const complexValue = {test: true};
    const stringifiedValue = JSON.stringify(complexValue);
    const writtenValue = await testStorage.setItem('test', stringifiedValue);
    expect(writtenValue).toEqual(stringifiedValue);

    const parseWrittenValue = JSON.parse(writtenValue);
    expect(parseWrittenValue).toEqual(complexValue);
    expect(parseWrittenValue.test).toBe(complexValue.test);

    const forageValue = await testStorage.getItem('test');
    expect(forageValue).toEqual(stringifiedValue);

    const parsedForageValue = JSON.parse(forageValue);
    expect(parsedForageValue).toEqual(complexValue);
    expect(parsedForageValue.test).toBe(complexValue.test);

    const keyPrefix = testStorage.config().name;
    expect(keyPrefix).toBeDefined();

    const storageValue = await AsyncStorage.getItem(`${keyPrefix}/test`);
    expect(storageValue).toBe(stringifiedValue);

    const parsedStorageValue = JSON.parse(storageValue);
    expect(parsedStorageValue).toEqual(complexValue);
    expect(parsedStorageValue.test).toBe(complexValue.test);
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
