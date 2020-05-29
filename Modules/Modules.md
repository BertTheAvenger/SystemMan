##Physical Modules
 ###TestModule
 A test module. Communicates with the "ModuleEmulator" file under /test.
 
 Definition:
 
 |Field| Value| Required?
 |---|---| --- |
 | type | "test_module" | &check; |
 | uid | [string] | &check; |
 | physicalUid | [number OR string] | &check; |
 | module_connections | [targetTuple => ModuleConnection] | &check; |
 
 I/O:
 
|Input/Output| ID| Type(s) |
|---|---| --- |
|Input| module_connections | ModuleConnection|
|Output| data_out | number|