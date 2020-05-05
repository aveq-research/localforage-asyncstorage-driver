import localforage from 'localforage';
import AsyncStorage from '@react-native-community/async-storage';
import { driverWithoutSerialization } from '../src/main';

describe('driverWithoutSerializationTest', () => {

  beforeEach(async () => {
    const driver = driverWithoutSerialization();
    await localforage.defineDriver(driver);
    await localforage.setDriver(driver._driver);
    return AsyncStorage.clear();
  });

  it('sets an item when setItem is called', async () => {
    const writtenValue = await localforage.setItem('test', true);
    expect(writtenValue).toBeTruthy();

    const forageValue = await localforage.getItem('test');
    expect(forageValue).toBeTruthy();

    const keyPrefix = localforage.config().name;
    expect(keyPrefix).toBeDefined();

    const storageValue = await AsyncStorage.getItem(`${keyPrefix}/test`);
    expect(storageValue).toBeTruthy();
  });

});
