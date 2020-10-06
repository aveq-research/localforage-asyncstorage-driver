declare module "@aveq-research/localforage-asyncstorage-driver" {
  export function driverWithoutSerialization(): LocalForageDriver;
  export function driverWithSerialization(serializer: LocalForageSerializer): LocalForageDriver;
  export function driverWithDefaultSerialization(): LocalForageDriver;
}
