# Introduction

[Commitspark](https://commitspark.com) is a set of tools to manage structured data with Git through a GraphQL API.

This repository holds code for a GitAdapter that implements in-memory caching of data returned by a wrapped child
GitAdapter for calls to `getEntries()` and `getSchema()`.

Calls to `getLatestCommitHash()` are not cached by default but can provide your own implementation with a custom caching
strategy to also cache retrieval of latest commit hashes for a ref.

Calls to `createCommit()` are never cached and always forwarded to the child adapter.

# Usage

Create an adapter with `createAdapter()` and the following options:

| Option name           | Required | Default value | Description                   |
|-----------------------|----------|---------------|-------------------------------|
| `childAdapter`        | True     |               | `GitAdapter` instance to wrap |
| `getLatestCommitHash` | False    | `undefined`   | Custom caching function       |

# Example

Use the following code to provide caching for a GitHub adapter:

```ts
import { createAdapter } from '@commitspark/git-adapter-cache-memory'
import { createAdapter as createGitHubAdapter } from '@commitspark/github-adapter'

const gitHubAdapter = createGitHubAdapter({
    // ...
})
const cachedAdapter = createMemoryCacheAdapter({
    childAdapter: gitHubAdapter,
    // optional custom resolver if you also want to cache getLatestCommitHash calls
    // getLatestCommitHash: async (ref) => myCache.get(ref) ?? someGitAdapter.getLatestCommitHash(ref)
})

// now use the adapter like any other GitAdapter
```

# License

The code in this repository is licensed under the permissive ISC license (see [LICENSE](LICENSE)).
