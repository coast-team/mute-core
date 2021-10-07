# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="10.0.0-experiment-3.9"></a>
# [10.0.0-experiment-3.9](https://github.com/coast-team/mute-core/compare/v10.0.0-experiment-3.8...v10.0.0-experiment-3.9) (2021-10-07)



<a name="10.0.0-experiment-3.8"></a>
# [10.0.0-experiment-3.8](https://github.com/coast-team/mute-core/compare/v10.0.0-experiment-3.7...v10.0.0-experiment-3.8) (2020-07-10)



<a name="10.0.0-experiment-3.7"></a>
# [10.0.0-experiment-3.7](https://github.com/coast-team/mute-core/compare/v10.0.0-experiment-3.6...v10.0.0-experiment-3.7) (2020-07-10)



<a name="10.0.0-experiment-3.6"></a>
# [10.0.0-experiment-3.6](https://github.com/coast-team/mute-core/compare/v10.0.0-experiment-3.5...v10.0.0-experiment-3.6) (2020-07-09)



<a name="10.0.0-experiment-3.5"></a>
# [10.0.0-experiment-3.5](https://github.com/coast-team/mute-core/compare/v10.0.0-experiment-3.4...v10.0.0-experiment-3.5) (2020-06-17)


### Bug Fixes

* **experiment-logs:** log properly rename local ops ([8afb3ee](https://github.com/coast-team/mute-core/commit/8afb3ee))



<a name="10.0.0-experiment-3.4"></a>
# [10.0.0-experiment-3.4](https://github.com/coast-team/mute-core/compare/v10.0.0-experiment-3.3...v10.0.0-experiment-3.4) (2019-12-19)


### Bug Fixes

* **sync:** prevent generation of multiple operations with same clock ([70aa697](https://github.com/coast-team/mute-core/commit/70aa697))



<a name="10.0.0-experiment-3.3"></a>
# [10.0.0-experiment-3.3](https://github.com/coast-team/mute-core/compare/v10.0.0-experiment-3.2...v10.0.0-experiment-3.3) (2019-12-19)


### Bug Fixes

* **rename:** share rename operations to other nodes ([ac0d64f](https://github.com/coast-team/mute-core/commit/ac0d64f))
* **rls-richoperation:** check that dependencies is a map int -> int ([cb436ef](https://github.com/coast-team/mute-core/commit/cb436ef))


### Features

* **crdt-impl:** add RLSDocument ([0c2510c](https://github.com/coast-team/mute-core/commit/0c2510c))
* **renamablelogootsplit:** add RLSRichOperation ([92fcbe8](https://github.com/coast-team/mute-core/commit/92fcbe8))
* **renamablelogootsplit:** add RLSState ([70a4a1e](https://github.com/coast-team/mute-core/commit/70a4a1e))
* **renamablelogootsplit:** add support ([2e7abf4](https://github.com/coast-team/mute-core/commit/2e7abf4))



<a name="10.0.0-experiment-3.2"></a>
# [10.0.0-experiment-3.2](https://github.com/coast-team/mute-core/compare/v10.0.0-2.2...v10.0.0-experiment-3.2) (2019-09-25)


### Bug Fixes

* **dlsdocument:** change getStats in order to return an object ([f94ec9e](https://github.com/coast-team/mute-core/commit/f94ec9e))
* **dlsdocument:** implement abstract inherited method getStats ([0448d79](https://github.com/coast-team/mute-core/commit/0448d79))
* **experimentlogs:** remove stats in logs ([2c20d47](https://github.com/coast-team/mute-core/commit/2c20d47))
* **handlelocaloperation:** change result type to Op[] ([76452ae](https://github.com/coast-team/mute-core/commit/76452ae))
* **iexperimentallogs:** remove unused import ([8b47f46](https://github.com/coast-team/mute-core/commit/8b47f46))
* **syncmessage:** emit deserialization times of all ops ([b0a0bea](https://github.com/coast-team/mute-core/commit/b0a0bea))
* **test:** fix test for release ([fdb1f76](https://github.com/coast-team/mute-core/commit/fdb1f76))


### Features

* **fifodlsdocument:** adapt handleLocalOperation for experiment ([771d385](https://github.com/coast-team/mute-core/commit/771d385))
* **fifodottedlogootsplit:** add a new crdt fifo dotted logootsplit ([e965cb3](https://github.com/coast-team/mute-core/commit/e965cb3))
* **logs:** add loclaOperation in the experiment logs ([4cbb750](https://github.com/coast-team/mute-core/commit/4cbb750))
* **logs:** add stream to get exepriment logs ([8157951](https://github.com/coast-team/mute-core/commit/8157951))
* **logs:** finalize stream in order to collect all information ([9c46bc3](https://github.com/coast-team/mute-core/commit/9c46bc3))
* **struct:** add struct field in logs ([3657aaa](https://github.com/coast-team/mute-core/commit/3657aaa))



<a name="10.0.0-2.2"></a>

# [10.0.0-2.2](https://github.com/coast-team/mute-core/compare/v10.0.0-2.1...v10.0.0-2.2) (2019-09-16)

<a name="10.0.0-2.1"></a>

# [10.0.0-2.1](https://github.com/coast-team/mute-core/compare/v10.0.0-2.0...v10.0.0-2.1) (2019-09-13)

### Bug Fixes

- **pulsar:** fixed an error ([c0f07d5](https://github.com/coast-team/mute-core/commit/c0f07d5))
- **pulsar:** removed vector from pulsar crdt ([338dd2a](https://github.com/coast-team/mute-core/commit/338dd2a))
- **pulsar:** wrong data sent ([effd460](https://github.com/coast-team/mute-core/commit/effd460))

### Features

- **pulsar:** adding Metadata type for pulsar ([4534e46](https://github.com/coast-team/mute-core/commit/4534e46))

<a name="10.0.0-2.0"></a>

# [10.0.0-2.0](https://github.com/coast-team/mute-core/compare/v10.0.0-1...v10.0.0-2.0) (2019-07-05)

### Bug Fixes

- **test:** fix LSSyncMessage test with the new streamid ([120d9ee](https://github.com/coast-team/mute-core/commit/120d9ee))

### Features

- **export:** export StreamID and StreamsSubtype ([7bdcbb4](https://github.com/coast-team/mute-core/commit/7bdcbb4))
- **streamid:** add subtype in streamid ([ea77f53](https://github.com/coast-team/mute-core/commit/ea77f53))
- **streams:** add CURSOR and CRYPTO in Streams and StreamsSubtype ([f4fa80c](https://github.com/coast-team/mute-core/commit/f4fa80c))

<a name="10.0.0-1"></a>

# [10.0.0-1](https://github.com/coast-team/mute-core/compare/v9.1.6...v10.0.0-1) (2019-03-29)

### Bug Fixes

- **dependencies:** fix bug in richoperation fromPlain ([08a4903](https://github.com/coast-team/mute-core/commit/08a4903))
- **id:** fix problem with int32 id in dotted, and repair digest ([31102a1](https://github.com/coast-team/mute-core/commit/31102a1))

### Features

- **dotted:** add all class for dottedLogootsplit ([554084b](https://github.com/coast-team/mute-core/commit/554084b))

<a name="10.0.0-0"></a>

# [10.0.0-0](https://github.com/coast-team/mute-core/compare/v9.1.6...v10.0.0-0) (2019-03-29)

### Bug Fixes

- **dependencies:** fix bug in richoperation fromPlain ([08a4903](https://github.com/coast-team/mute-core/commit/08a4903))
- **id:** fix problem with int32 id in dotted, and repair digest ([31102a1](https://github.com/coast-team/mute-core/commit/31102a1))

### Features

- **dotted:** add all class for dottedLogootsplit ([554084b](https://github.com/coast-team/mute-core/commit/554084b))

<a name="9.1.6"></a>

## [9.1.6](https://github.com/coast-team/mute-core/compare/v9.1.5...v9.1.6) (2019-01-22)

<a name="9.1.5"></a>

## [9.1.5](https://github.com/coast-team/mute-core/compare/v9.1.4...v9.1.5) (2019-01-22)

<a name="9.1.4"></a>

## [9.1.4](https://github.com/coast-team/mute-core/compare/v9.1.3...v9.1.4) (2019-01-21)

<a name="9.1.3"></a>

## [9.1.3](https://github.com/coast-team/mute-core/compare/v9.1.2...v9.1.3) (2019-01-21)
