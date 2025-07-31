# Solana Trading Platform

A modern, feature-rich trading platform built on the Solana blockchain with Next.js 15, TypeScript, and Tailwind CSS.

## ✨ Features

- **🔐 Wallet Integration**: Connect with Phantom wallet
- **💱 Token Swapping**: Trade popular Solana tokens (SOL, USDC, USDT, RAY, BONK, JUP)
- **📊 Portfolio Management**: View your token balances and portfolio value
- **🎯 Real-time Pricing**: Live price updates and market data
- **🌍 Multi-language Support**: Available in English and Portuguese
- **🌙 Dark/Light Mode**: Toggle between themes
- **📱 Responsive Design**: Works on desktop and mobile devices
- **⚡ High Performance**: Built with Next.js 15 and optimized for speed

## 🚀 Getting Started

### Prerequisites

- Node.js 18.19.0 or later
- Yarn package manager
- Phantom wallet extension (for testing)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd next-solana
```

2. Install dependencies:

```bash
yarn install
```

3. Start the development server:

```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧪 Mock Implementation

**Important**: The current implementation uses a mock Solana interface (`lib/solana-mock.ts`) to avoid build issues with `@solana/web3.js` and `rpc-websockets` dependencies in Next.js environments.

### What's Mocked:

- **Connection**: Simulates network connections
- **PublicKey**: Mock public key implementation
- **getBalance**: Returns random balance for demonstration
- **Wallet Operations**: Phantom wallet integration is partially mocked

### For Production Use:

To use with real Solana blockchain:

1. Replace imports in `lib/solana.ts` and `hooks/use-wallet.ts` to use actual `@solana/web3.js`
2. Install proper Solana dependencies
3. Configure proper RPC endpoints
4. Implement real transaction signing

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Solana (Mock Implementation)
- **Wallet**: Phantom Wallet integration
- **UI Components**: Radix UI primitives
- **Charts**: Recharts
- **Internationalization**: i18next
- **Theme**: next-themes

## 🎮 How to Use

1. **Connect Your Wallet**: Click the "Connect Wallet" button and approve the connection in your Phantom wallet
2. **View Portfolio**: See your current token balances and portfolio value
3. **Trade Tokens**: Use the swap interface to trade between different tokens
4. **Monitor Markets**: Check live prices and market data in the sidebar
5. **Switch Languages**: Toggle between English and Portuguese
6. **Change Theme**: Switch between light and dark modes

## 🔧 Configuration

The platform supports various configuration options:

- **Slippage Tolerance**: Adjust in the swap settings (0.1%, 0.5%, 1.0%)
- **Network**: Currently configured for Solana Mainnet (Mock)
- **Supported Tokens**: See `lib/tokens.ts` for the complete list

## 📦 Project Structure

```
next-solana/
├── app/                    # Next.js app router pages
├── components/             # React components
│   ├── ui/                # UI primitives
│   ├── wallet-connect.tsx # Wallet connection component
│   ├── trading-interface.tsx # Main trading interface
│   ├── portfolio-display.tsx # Portfolio view
│   └── token-selector.tsx # Token selection modal
├── hooks/                 # Custom React hooks
│   └── use-wallet.ts     # Wallet state management
├── lib/                   # Utilities and configurations
│   ├── tokens.ts         # Token definitions
│   ├── solana.ts         # Solana network config
│   ├── solana-mock.ts    # Mock Solana implementation
│   └── i18n/             # Internationalization
├── public/                # Static assets
│   ├── images/           # Token logos and images
│   └── locales/          # Translation files
└── styles/               # Global styles
```

## 🔐 Security

- **Wallet Security**: Uses Phantom wallet for secure transaction signing
- **No Private Keys**: Private keys never leave your wallet
- **Secure Connections**: All RPC connections use HTTPS
- **Slippage Protection**: Configurable slippage tolerance

## 🌐 Internationalization

The platform supports multiple languages:

- English (en)
- Portuguese (pt)

Add new languages by creating translation files in `public/locales/[lang]/common.json`.

## 🎨 Customization

### Adding New Tokens

1. Edit `lib/tokens.ts`
2. Add token information including mint address, decimals, and logo URI
3. The token will automatically appear in the selector

### Styling

The platform uses Tailwind CSS with custom gradients and modern UI patterns. Customize the theme by modifying:

- `tailwind.config.ts` - Theme configuration
- `app/globals.css` - Global styles
- Component-specific styles in each file

## 🚧 Development Features

- **Hot Reload**: Instant updates during development
- **TypeScript**: Full type safety
- **Linting**: ESLint configuration
- **Formatting**: Prettier integration
- **Commit Hooks**: Automated quality checks

## 📊 Performance

- **Lazy Loading**: Components load on demand
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Use `yarn analyze` to check bundle size
- **Fast Refresh**: Hot module replacement

## 🔄 Future Enhancements

- Integration with Jupiter aggregator for best swap rates
- Real Solana web3.js implementation
- Advanced charting with TradingView
- Limit orders and advanced order types
- Liquidity pool management
- Yield farming interfaces
- NFT marketplace integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please:

- Check the documentation
- Open an issue on GitHub
- Contact the development team

## 🙏 Acknowledgments

- Solana Labs for the blockchain infrastructure
- Phantom team for wallet integration
- Next.js team for the amazing framework
- The open-source community for all the tools used

---

**⚠️ Disclaimer**: This is a demonstration project with mock Solana implementation. For production use, integrate with real Solana web3.js libraries and always verify transactions when dealing with real funds on mainnet.

# test
