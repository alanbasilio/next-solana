# Modern Solana DEX

A cutting-edge decentralized exchange built on Solana with modern DeFi features.

## Features

- **Concentrated Liquidity** - Capital efficient AMM with customizable price ranges
- **Jupiter Integration** - Smart routing and aggregation across all Solana DEXs  
- **Advanced Trading** - Limit orders, DCA strategies, and professional trading tools
- **Modern UI/UX** - Beautiful, responsive interface built with Next.js and Tailwind CSS
- **Real-time Analytics** - Comprehensive data and insights powered by Supabase
- **Mobile Optimized** - Full functionality on all devices

## Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Framer Motion** - Smooth animations
- **TanStack Query** - Data fetching and caching

### Backend  
- **Anchor** - Solana program development framework
- **Rust** - Systems programming language for on-chain programs
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Jupiter API** - Liquidity aggregation and smart routing

### Blockchain
- **Solana** - High-performance blockchain
- **SPL Tokens** - Solana token standard
- **Wallet Integration** - Phantom, Solflare, and more

## Getting Started

### Prerequisites

- Node.js 18+ and Yarn
- Rust and Solana CLI
- Anchor CLI
- Supabase account (for database)

### Installation

#### Quick Start (Recommended)

```shell
# Clone and install
git clone <repository-url>
cd solana-dex-modern
npm install

# Interactive environment setup
npm run setup-env

# Complete development setup
npm run setup-dev

# Start development server
npm run dev
```

#### Manual Setup

##### 1. Install Dependencies

```shell
npm install
```

##### 2. Environment Configuration

Choose your setup method:

**Option A: Interactive Setup**
```shell
npm run setup-env
```

**Option B: Manual Configuration**

Copy `.env.local.example` to `.env.local` and configure:

```env
# Development (Mock Data)
NODE_ENV=development
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com

# Production (Real Services)
# NODE_ENV=production
# NEXT_PUBLIC_USE_MOCK_DATA=false
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
# NEXT_PUBLIC_RPC_ENDPOINT=https://your-mainnet-rpc.com
```

##### 3. Smart Contract Setup

```shell
# Setup Anchor and generate program
npm run setup

# Build the program
npm run anchor-build

# For production deployment
npm run setup-prod
```

### Environment Modes

The DEX supports multiple operation modes:

- **🔬 Development**: Mock data, no external dependencies
- **🧪 Staging**: Real services on devnet
- **🏭 Production**: Real services on mainnet

Configure via `NEXT_PUBLIC_USE_MOCK_DATA` environment variable.

## 📋 Available Commands

### Environment Setup
```shell
npm run setup-env        # Interactive environment configuration
npm run setup-dev        # Complete development setup
npm run setup-prod       # Production build and deployment
```

### Development
```shell
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run type-check       # TypeScript type checking
```

### Solana/Anchor
```shell
npm run anchor           # Run anchor commands
npm run anchor-build     # Build Anchor program
npm run anchor-test      # Test Anchor program
npm run anchor-deploy    # Deploy to configured network
npm run anchor-localnet  # Start local validator
```

### Code Quality
```shell
npm run lint             # ESLint check
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run ci               # Full CI pipeline
```

## Apps

### anchor

This is a Solana program written in Rust using the Anchor framework.

#### Commands

You can use any normal anchor commands. Either move to the `anchor` directory and run the `anchor` command or prefix the
command with `pnpm`, eg: `pnpm anchor`.

#### Sync the program id:

Running this command will create a new keypair in the `anchor/target/deploy` directory and save the address to the
Anchor config file and update the `declare_id!` macro in the `./src/lib.rs` file of the program. This will also update
the constant in `anchor/src/basic-exports.ts` file.

```shell
pnpm run setup
```

#### Build the program:

```shell
pnpm anchor-build
```

#### Start the test validator with the program deployed:

```shell
pnpm anchor-localnet
```

#### Run the tests

```shell
pnpm anchor-test
```

#### Deploy to Devnet

```shell
pnpm anchor deploy --provider.cluster devnet
```

### web

This is a React app that uses the Anchor generated client to interact with the Solana program.

#### Commands

Start the web app

```shell
pnpm dev
```

Build the web app

```shell
pnpm build
```
