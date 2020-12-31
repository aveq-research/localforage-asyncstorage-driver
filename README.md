# localforage-asyncstorage-driver

[![npm version](https://badge.fury.io/js/%40aveq-research%2Flocalforage-asyncstorage-driver.svg)](https://badge.fury.io/js/%40aveq-research%2Flocalforage-asyncstorage-driver)

This Library contains a driver which enables to use [localforage](https://github.com/localForage/localForage) for React-Native's [AsyncStorage](https://github.com/react-native-community/async-storage).

## Peer Dependencies

Please note! With the switch to v3.0.0 `@react-native-async-storage/async-storage` became a peer dependency!!

## Setup

Simply install the driver via NPM:

`npm i --save @aveq-research/localforage-asyncstorage-driver`

If not done yet, make sure to have the appropriate peer dependencies (`react` resp. `react-native`) to be installed.

## Usage

It delivers three different methods to create an appropriate driver:

- `driverWithoutSerialization()`: Create a common AsyncStorage driver which does not serialize any data automatically; you need to integrate your own serialization!
- `driverWithSerialization(serializer)`: Creates an AsyncStorage driver with the given serializer; A valid serializer needs to contain a `serialize` and `deserialize` method
- `driverWithDefaultSerialization()`: Will use the default serialization from localforage

Working Code Example:

```js
import { driverWithoutSerialization } from '@aveq-research/localforage-asyncstorage-driver';

const driver = driverWithoutSerialization();
await localforage.defineDriver(driver);
await localforage.setDriver(driver._driver); // i.e. "rnAsyncStorageWrapper"
```

Alternatively with instance usage:

```js
import { driverWithoutSerialization } from '@aveq-research/localforage-asyncstorage-driver';

const driver = driverWithoutSerialization();
const instance = localforage.createInstance({ driver });
```

After that you may use localforage as you know it already. For further questions concerning the localforage API, lookup https://github.com/localForage/localForage

## License

This driver is distributed under
MIT License (see [LICENSE](https://github.com/aveq-research/localforage-asyncstorage-driver/blob/master/LICENSE)) and maintained by the wonderful [AVEQ](https://aveq.info) team.
