# PubKey Protocol Resolver

Resolver for the [PubKey Program Library](https://github.com/pubkeyapp/pubkey-program-library).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or higher)
- [PNPM](https://pnpm.io/) (v9 or higher)
- [Git](https://git-scm.com/)

> [!TIP]
> If you don't have PNPM installed, you can install it using `corepack`:
>
> ```sh
> corepack enable
> corepack prepare pnpm@latest --activate
> ```

### Installation

1. Clone the repository:

```sh
git clone https://github.com/pubkeyapp/pubkey-protocol-resolver pubkey-protocol-resolver
cd pubkey-protocol-resolver
pnpm install
```

### Development

Start the API app:

```shell
pnpm dev:api
```

### Build

Build the API app:

```sh
pnpm build:api
```

### Lint

```sh

pnpm lint
```

### Test

```sh
pnpm test
```

## License

MIT
