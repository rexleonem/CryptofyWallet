# Cryptofy Wallet 🧠💼

Cryptofy is not just a crypto wallet. It is not just a portfolio tracker. It is a **financial decision system** powered by on-chain truth and AI interpretation.

### Core Philosophy
- **Layer 1:** A self-custodial crypto wallet (user owns keys, always).
- **Layer 2:** A live portfolio intelligence engine (on-chain + market data).
- **Layer 3:** An AI advisor that interprets data in plain language.
- **Rule:** The wallet layer must stay simple and secure. The AI layer can evolve infinitely.

---

## 🏗️ Technology Stack

| Layer | Technology |
|---|---|
| **Mobile App** | React Native CLI + TypeScript |
| **State Management** | Zustand + React Query |
| **Navigation** | React Navigation v6 |
| **Animations** | React Native Reanimated 3 |
| **Wallet Crypto** | ethers.js v6 |
| **Key Storage** | react-native-keychain (Secure Enclave / Keystore) |
| **Blockchain RPC** | Alchemy (primary) + Infura (fallback) |
| **dApp Connect** | WalletConnect v2 |
| **Market Data** | CoinMarketCap API |
| **Node Backend** | NestJS (TypeScript) |
| **AI Engine** | FastAPI (Python) + Google Gemini 1.5 Pro |
| **Database** | PostgreSQL + Redis |
| **Push Notifications** | Firebase Cloud Messaging |
| **Infrastructure** | Docker + GitHub Actions + AWS/GCP |

---

## 📂 Folder Structure

```text
CryptofyWallet/
├── src/                    ← Mobile App Root
│   ├── app/                ← App entry, navigation root, providers
│   ├── screens/            ← UI Screens (Onboarding, Dashboard, Wallet, AIAssistant)
│   ├── components/         ← Reusable UI components & charts
│   ├── wallet/             ← Core Wallet Crypto (bip39, keystore, signer)
│   ├── blockchain/         ← RPC calls, Alchemy adapter
│   ├── store/              ← Zustand stores (walletStore, portfolioStore)
│   ├── api/                ← Backend API calls (Axios client)
│   ├── types/              ← TypeScript interfaces
│   ├── utils/              ← Formatters, helpers
│   └── constants/          ← Chain config, token lists
├── backend/                ← NestJS Backend API
│   └── src/
│       ├── auth/           ← Device-based auth
│       ├── wallets/        ← Register public addresses
│       ├── portfolio/      ← Snapshot storage
│       └── ai/             ← Proxy to Python AI engine
├── python/                 ← FastAPI AI Engine
│   ├── engine/             ← Risk scoring & Gemini integration
│   ├── routers/            ← FastAPI endpoints
│   └── main.py             
├── docker-compose.yml      ← Full stack local orchestration
└── package.json            ← React Native App Configuration
```

---

## 🚀 Setup & Installation

### 1. Prerequisites
- **Node.js:** v20+
- **Mobile Environment:** Android Studio (JDK 17) or Xcode
- **External APIs:** Alchemy API Key, Gemini API Key, CoinMarketCap API Key

### 2. Run the Full Stack Locally
The project utilizes Docker to run the backend dependencies locally.

```bash
# Start PostgreSQL, Redis, NestJS backend, and FastAPI AI engine
docker-compose up -d
```

### 3. Run the Mobile App
Ensure dependencies are installed and an emulator is running.

```bash
# Install dependencies
npm install

# For iOS (macOS only)
cd ios && pod install && cd ..
npm run start
npm run ios

# For Android
npm run start
npm run android
```

---

## 🔐 Security Architecture (Non-Negotiable)
1. **Never send private keys to the server:** All signing happens exclusively on-device. The server only receives signed transactions.
2. **Hardware Encryption:** `react-native-keychain` is used to leverage iOS Secure Enclave / Android Keystore hardware encryption for the seed phrase.
3. **No Key in State:** Mnemonics are retrieved from the keychain, used momentarily for signing, and immediately discarded from memory. State management (Zustand) only stores public addresses.
4. **Pre-sign Simulation:** Every transaction runs an `eth_call` simulation prior to real execution.

---

## 🛠️ Environmental Variables
You will need a `.env` file at the root of the respective projects. NEVER commit these files.

**Mobile App (`.env`):**
```env
ALCHEMY_API_KEY=your_alchemy_key
WALLETCONNECT_PROJECT_ID=your_wc_id
API_BASE_URL=http://localhost:3000
```

**NestJS / Python Backends (`.env`):**
```env
GEMINI_API_KEY=your_gemini_key
CMC_API_KEY=your_cmc_key
DATABASE_URL=postgresql://postgres:password@localhost:5432/cryptofy
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
```

---

## 🗺️ Roadmap & Phases

- **Phase 1 (Wallet Core):** BIP-39 generation, Keystore hardware security, Address Derivation, and Alchemy balances. *(Status: Core Scaffolded)*
- **Phase 2 (Transactions):** ETH transfers, Gas estimation, History aggregation, and WalletConnect integration.
- **Phase 3 (Portfolio Tracking):** CoinMarketCap price integration, Postgres schema (Neon DB), Redis caching, and dynamic UI charts.
- **Phase 4 (AI Brain Core):** Python rule-based risk engine to detect concentration risk and volatility. 
- **Phase 5 (AI Advisor):** Google Gemini context injection to allow users to ask "Is my portfolio risky?" and get real-time on-chain analysis.

### Investor Demo Target
By the end of Phase 5, the application will provide a fully functional wallet mapped to a conversational AI that interprets real on-chain assets. 
