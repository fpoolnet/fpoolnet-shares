
Fpool Shares is a UI application designed to track real-time hashrate, payouts, and pending shares on Fpool. With intuitive dashboards and live data, it streamlines mining monitoring and management.

## Overview

- Track pools stats and shares
- User-friendly dashboard
- Real-time mining performance monitoring
- Detailed mining analytics

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/fpoolnet/fpoolnet-shares.git
cd fpoolnet-shares
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Then open your browser at `http://localhost:3000`.

### Build for Production

To build the project for production:

```bash
npm run build
```

### Test Production Build Locally

After building, you can serve the static files using `serve`:

```bash
npm run serve
```

This will start a server at `http://localhost:3000` serving the `out` directory.

### Linting

Run ESLint to check for code issues:

```bash
npm run lint
```

## Contributing

Contributions are welcome. Please fork the repository and open a pull request with your changes.

## License

MIT License.
