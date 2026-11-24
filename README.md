<div align="center">

# Kivo · Chat UI Interface

**A free, open-source AI chat interface you can drop into your own project.**

Dark, minimal and responsive. Built with Next.js 16, React 19 and Tailwind CSS v4.

[Quick start](#quick-start) · [Features](#features) · [Customise](#customise) · [Connect a model](#connect-a-real-ai-model) · [License](#license)

</div>

---

## What is this?

Kivo is a ready-made **front end for an AI chat app**: the sidebar, the menu, the message list and the message box.
It runs straight away with placeholder replies, so you can explore the design, change it, and then connect it to any AI model you like.

It's **MIT licensed**, so you can use it in personal or commercial projects, change anything, and ship it. You don't need to ask.

## Features

| | |
| --- | --- |
| 🧭 **Collapsible sidebar** | A slim icon rail that expands into New chat, Library, Recents, Credits and Account. On phones it slides in as a drawer. |
| 👀 **Liquid-glass MENU button** | A frosted pill centred at the top. Its two "eyes" follow your cursor and blink, and the label rolls between `MENU` and `CLOSE`. |
| 📊 **Usage at a glance** | The button alternates every 10 seconds between the 5-hour usage (with a progress ring) and `MENU`. |
| 📋 **Menu with limits** | 5-hour and weekly usage bars, plus New chat (⌘K / Ctrl K), Rename, Share, Export, Settings and Delete. |
| ✍️ **Message box** | Grows as you type. Enter sends, Shift+Enter adds a new line. Includes an attach button, a model picker and a soft colour glow. |
| ✳️ **Kivo logo** | An original coral "bloom" mark. It spins while the assistant is replying, and it's also the browser-tab icon. |
| 📱 **Responsive** | Works on phones, tablets and desktops. |
| 🪶 **Lightweight** | No UI library: plain React components, Tailwind classes and inline SVG icons. |

## Quick start

You need **Node.js 20.9 or newer**.

```bash
git clone https://github.com/Gokulakrishnxn/Chat-Ui-interface.git
cd Chat-Ui-interface
npm install
npm run dev
```

Then open **http://localhost:3000**.

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm start` | Run the production build |
| `npm run lint` | Check the code with ESLint |

## Customise

Everything you're likely to change is in one place:

| I want to change… | Edit |
| --- | --- |
| Colours (background, panels, text) | the CSS variables at the top of [`src/app/globals.css`](src/app/globals.css) |
| The logo (shape or colour) | [`src/components/kivo-logo.tsx`](src/components/kivo-logo.tsx) |
| The app name | `metadata` in [`src/app/layout.tsx`](src/app/layout.tsx) and the wordmark in `kivo-logo.tsx` |
| Usage limits in the menu | the `limits` list in [`src/components/menu-button.tsx`](src/components/menu-button.tsx) |
| How long usage / MENU each show | `PEEK_MS` in `menu-button.tsx` (default 10 seconds) |
| Menu items | the `items` list in `menu-button.tsx` |
| The user's name and plan | the Account button in [`src/components/sidebar.tsx`](src/components/sidebar.tsx) |
| The placeholder replies | `replies` and `send()` in [`src/components/chat-app.tsx`](src/components/chat-app.tsx) |

## Connect a real AI model

Replies are fake by default, so the app runs without any API keys.
To use a real model:

1. Create an API route (for example `src/app/api/chat/route.ts`) that calls your AI provider.
2. In `send()` inside [`src/components/chat-app.tsx`](src/components/chat-app.tsx), replace the `setTimeout` with a `fetch` to that route.
3. Add the reply, or stream it in piece by piece, to the message list.

Keep your API keys on the server (in the route), never in the components.

## Project structure

```
src/
├─ app/
│  ├─ globals.css      colours, liquid-glass style, animations
│  ├─ icon.svg         browser-tab icon
│  ├─ layout.tsx       page shell, font, title
│  └─ page.tsx         home page
├─ components/
│  ├─ chat-app.tsx     layout, chat state, top bar, messages
│  ├─ sidebar.tsx      collapsible sidebar / phone drawer
│  ├─ menu-button.tsx  MENU pill, usage display, dropdown
│  ├─ composer.tsx     message box
│  ├─ kivo-logo.tsx    logo mark and wordmark
│  └─ icons.tsx        SVG icons
└─ lib/
   └─ cn.ts            joins class names
```

## Contributing

Issues and pull requests are welcome. If you build something with Kivo, feel free to share it.

## License

[MIT](./LICENSE) © Gokulakrishnan. Free to use, change and share.
