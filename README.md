# Introduction

**[Commitspark](https://commitspark.com) is a Content Management System based on Git and GraphQL.**

This repository holds code for a GitAdapter that implements in-memory caching of data returned by a wrapped child
GitAdapter for calls to `getContentEntries()` and `getSchema()`. Calls to `getLatestCommitHash()` are not cached by
default but users can provide their own implementation to also cache responses to this call according to their own
caching strategy. Calls to `createCommit()` are never cached and always forwarded to the child adapter.

# Usage

Instantiate the adapter with `createAdapter()` and then call `setRepositoryOptions()` with `MemoryCacheAdapterOptions`
on the instance. These options are as follows:

| Option name           | Required | Default value | Description                   |
|-----------------------|----------|---------------|-------------------------------|
| `childAdapter`        | True     |               | `GitAdapter` instance to wrap |
| `getLatestCommitHash` | False    | `undefined`   | Custom caching function       |

# License

The code in this repository is licensed under the permissive ISC license (see [LICENSE](LICENSE)).
