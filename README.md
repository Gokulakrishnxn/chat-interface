# Kivo — Chat UI Interface

An open-source, dark, minimal AI chat interface built with **Next.js 16** and **Tailwind CSS v4**.
Use it as a starting point for your own AI assistant, or borrow any piece of it for your designs. It's MIT licensed, so you're free to use, change and ship it.

## Features

- **Collapsible sidebar**: a slim icon rail that expands into New chat, Library, Recents, Credits and Account. On phones it becomes a slide-in drawer.
- **Liquid-glass MENU pill**: centred in the top bar. Its two "eyes" follow the cursor and blink, and its label rolls between `MENU` and `CLOSE`.
- **Usage peek**: the pill loops between the 5-hour usage (with a progress ring) and `MENU` every 10 seconds.
- **Menu with usage limits**: 5-hour and weekly limits with progress bars, plus New chat (⌘K), Rename, Share, Export, Settings and Delete.
- **Composer**: a textarea that grows as you type, an attach button, a model picker (`Glance`) and a send button, with an animated colour glow behind it.
- **Kivo bloom logo**: an original SVG mark that spins while the assistant is replying.
- **Responsive**: works on phones, tablets and desktops, with safe-area padding on mobile.
- **No UI library**: plain React components and Tailwind. Icons are inline SVG.

## Getting started

```bash
git clone https://github.com/Gokulakrishnxn/Chat-Ui-interface.git
cd Chat-Ui-interface
npm install
npm run dev
```

Open <http://localhost:3000>.

## Project structure

```
src/
├─ app/
│  ├─ globals.css      # colour tokens, liquid-glass styles, animations
│  ├─ icon.svg         # favicon (Kivo bloom)
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ chat-app.tsx     # page layout, chat state, top bar, messages
│  ├─ sidebar.tsx      # collapsible sidebar / mobile drawer
│  ├─ menu-button.tsx  # liquid-glass MENU pill, usage peek, dropdown
│  ├─ composer.tsx     # message input
│  ├─ kivo-logo.tsx    # Kivo bloom mark + wordmark
│  └─ icons.tsx        # inline SVG icons
└─ lib/
   └─ cn.ts            # className helper
```

## Customising

| What | Where |
| --- | --- |
| Colours (background, panels, text) | the CSS variables at the top of `src/app/globals.css` |
| Logo shape or colour | `src/components/kivo-logo.tsx` |
| Usage limits shown in the menu | the `limits` array in `src/components/menu-button.tsx` |
| Usage/MENU loop timing | `PEEK_MS` in `src/components/menu-button.tsx` |
| Menu items | the `items` array in `src/components/menu-button.tsx` |
| Assistant replies | `replies` and `send()` in `src/components/chat-app.tsx` |

## Connecting a real model

Replies are mocked so the UI runs with no API keys. To connect a model, swap the
`setTimeout` in `send()` (`src/components/chat-app.tsx`) for a call to your API route
and stream the response into the message list.

## License

[MIT](./LICENSE) © Gokulakrishnan
