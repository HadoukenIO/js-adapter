Reads the specified value from the registry.
# Example
```js
fin.System.readRegistryValue("HKEY_LOCAL_MACHINE", "HARDWARE\\DESCRIPTION\\System", "BootArchitecture").then(val => console.log(val)).catch(err => console.log(err));
```

See {@link https://msdn.microsoft.com/en-us/library/windows/desktop/ms681382(v=vs.85).aspx here} for Window's error code definitions.

### Example payloads of different registry types

See list of types {@link https://msdn.microsoft.com/en-us/library/windows/desktop/ms724884(v=vs.85).aspx here}.

```js
// REG_DWORD
{
    data: 1,
    rootKey: "HKEY_LOCAL_MACHINE",
    subkey: "Foo\Bar",
    type: "REG_DWORD",
    value: "Baz"
}

// REG_QWORD
{
    data: 13108146671334112,
    rootKey: "HKEY_LOCAL_MACHINE",
    subkey: "Foo\Bar",
    type: "REG_QWORD",
    value: "Baz"
}

// REG_SZ
{
    data: "FooBarBaz",
    rootKey: "HKEY_LOCAL_MACHINE",
    subkey: "Foo\Bar",
    type: "REG_SZ",
    value: "Baz"
}

// REG_EXPAND_SZ
{
    data: "C:\User\JohnDoe\AppData\Local",
    rootKey: "HKEY_CURRENT_USER",
    subkey: "Foo\Bar",
    type: "REG_EXPAND_SZ",
    value: "Baz"
}

// REG_MULTI_SZ
{
    data: [
        "Foo",
        "Bar",
        "Baz"
    ],
    rootKey: "HKEY_CURRENT_USER",
    subkey: "Foo\Bar",
    type: "REG_MULTI_SZ",
    value: "Baz"
}

// REG_BINARY
{
    data: {
        data: [
            255,
            255,
            0,
            43,
            55,
            0,
            0,
            255,
            255
        ],
        type: "Buffer"
    },
    rootKey: "HKEY_CURRENT_USER",
    subkey: "Foo\Bar",
    type: "REG_BINARY",
    value: "Baz"
}
```
