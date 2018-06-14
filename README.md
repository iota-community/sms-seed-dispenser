# SMS Seed Dispenser

Simple service to dispense prefilled seeds. Uses Twilio to send verification SMSs to reduce the chance of sybil.

Best used in presentations or environments with high demand/low supply so chance of gaming (creating zombie numbers etc) is quite low.

## Technology

The project uses the following technologies:

- Twilio - SMS dispenser (Account setup & Number Required)
- Next.js - SSR React application & simple server.

## Get Started

Before you get started make sure to clone the `seeds_example.json` and `.env.example` file and create `seeds.json` and `.env` with the relvant information.

Development mode:

```bash
// Install packages
yarn

// Start the app in dev mode
yarn dev
```

Production mode:

```bash
// Install packages
yarn

yarn build

yarn start
```

Deploy on Now.sh:

```bash
now --dotenv
now alias <url>
now scale <url> 1
```
