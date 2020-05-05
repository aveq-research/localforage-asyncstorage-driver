# localforage-asyncstorage-driver

This project is maintained by the wonderful AVEQ team.

This Library contains a driver which enables to use [localforage](https://github.com/localForage/localForage) for React-Native's [AsyncStorage](https://facebook.github.io/react-native/docs/asyncstorage).

## Usage

It delivers three different methods to create an appropriate driver:

- `driverWithoutSerialization()`: Create a common AsyncStorage driver which does not serialize any data automatically; you need to integrate your own serialization!
- `driverWithSerialization(serializer)`: Creates an AsyncStorage driver with the given serializer; A valid serializer needs to contain a `serialize` and `deserialize` method
- `driverWithDefaultSerialization()`: Will use the default serialization from localforage

Working Code Example:

```javascript
const driver = driverWithoutSerialization();
await localforage.defineDriver(driver);
await localforage.setDriver(driver._driver);
```

After that you may use localforage as you know it already. For further questions concerning the localforage API, lookup https://github.com/localForage/localForage
