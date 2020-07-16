import localforage from 'localforage';
import AsyncStorage from '@react-native-community/async-storage';
import { driverWithSerialization } from '../src/main';

beforeEach(async () => {
  global.testStorage = localforage.createInstance({
    name: `driverWithSerializationTestStorage_${Date.now() * 1000}`
  });

  global.testSerializer = {
    serialize: (value, callback) => {
      try {
        const serializedValue = JSON.stringify(value);
        if (typeof callback === 'function') {
          callback(serializedValue);
        }

        return serializedValue;
      }
      catch (e) {
        if (typeof callback === 'function') {
          callback(null, e);
        }

        throw e;
      }
    },
    deserialize: (serializedValue, callback) => {
      try {
        const value = JSON.parse(serializedValue);
        if (typeof callback === 'function') {
          callback(value);
        }

        return value;
      }
      catch (e) {
        if (typeof callback === 'function') {
          callback(null, e);
        }

        throw e;
      }
    }
  };

  const driver = driverWithSerialization(testSerializer);
  await testStorage.defineDriver(driver);
  await testStorage.setDriver(driver._driver);
  return AsyncStorage.clear();
});

afterEach(() => {
  delete global.testSerializer;
  delete global.testStorage;
});

describe('setItem()/getItem()', () => {

  it('sets and gets a simple item when setItem is called with user serializer', async () => {
    const testValue    = 'TEST_VALUE';
    const writtenValue = await testStorage.setItem('test', testValue);
    expect(writtenValue).toBe(testValue);

    const forageValue = await testStorage.getItem('test');
    expect(forageValue).toBe(testValue);

    const keyPrefix = testStorage.config().name;
    expect(keyPrefix).toBeDefined();

    const storageValue = await AsyncStorage.getItem(`${keyPrefix}/test`);
    expect(storageValue).toBe(testSerializer.serialize(testValue));
  });

  it('sets and gets a complex item when setItem is called with user serializer', async () => {
    const complexValue = { test: true };
    const serializedValue = testSerializer.serialize(complexValue);
    const writtenValue = await testStorage.setItem('test', complexValue);
    expect(writtenValue).toEqual(complexValue);
    expect(writtenValue.test).toBe(complexValue.test);

    const forageValue = await testStorage.getItem('test');
    expect(forageValue).toEqual(complexValue);
    expect(forageValue.test).toBe(complexValue.test);

    const keyPrefix = testStorage.config().name;
    expect(keyPrefix).toBeDefined();

    const storageValue = await AsyncStorage.getItem(`${keyPrefix}/test`);
    expect(storageValue).toBe(serializedValue);
    expect(storageValue.test).toBeUndefined();
  });
});
