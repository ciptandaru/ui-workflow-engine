# Workflow Automation Visual Editor

Aplikasi workflow automation visual editor dengan React, TypeScript, dan Tailwind CSS yang memiliki fitur drag & drop seperti n8n.

## 🚀 Features

- ✨ **Visual Drag & Drop Editor** - Canvas interaktif dengan ReactFlow
- 🎨 **Dark Mode** - Toggle antara light dan dark theme
- 📦 **Node Types** - Trigger, Action, Logic, AI, Data, dan Core nodes
- 💾 **Auto-save** - Otomatis menyimpan workflow ke localStorage
- ⌨️ **Keyboard Shortcuts** - Tab untuk add node, Delete/Backspace untuk hapus node
- 📱 **Responsive Design** - Mobile-first approach dengan Tailwind
- 🗺️ **Dynamic Minimap** - Muncul saat canvas bergerak (pan/zoom)
- 🔗 **Smooth Connections** - Animated bezier connections antar nodes
- 🎯 **Floating Action Buttons** - Add node dan search di pojok kanan atas canvas
- 📋 **Multi-workflow Management** - Kelola banyak workflow dengan sidebar

## 🛠️ Tech Stack

- **React 18+** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **@xyflow/react** - Drag & drop canvas
- **Zustand** - State management
- **lucide-react** - Icon library

## 📦 Installation

1. **Clone repository**

```bash
git clone <repository-url>
cd workflow-automation
```

2. **Install dependencies**

```bash
npm install
```

3. **Run development server**

```bash
npm run dev
```

4. **Build for production**

```bash
npm run build
```

5. **Preview production build**

```bash
npm run preview
```

## 🎨 Tailwind Configuration

Project ini menggunakan custom Tailwind theme dengan:

### Custom Colors

- `primary` - #3b82f6 (Blue)
- `primary-dark` - #2563eb
- `background-light` - #f8fafc
- `background-dark` - #111827
- `surface-light` - #ffffff
- `surface-dark` - #1f2937
- `border-light` - #e2e8f0
- `border-dark` - #374151

### Custom Shadows

- `shadow-node` - Node default shadow
- `shadow-node-hover` - Node hover shadow

### Dark Mode

Dark mode menggunakan class strategy:

```javascript
darkMode: "class";
```

Toggle dark mode dengan menambah/menghapus class `dark` pada `<html>` element.

## 📁 Project Structure

```
workflow-automation/
├── src/
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── WorkflowCanvas.tsx    # Main canvas dengan ReactFlow
│   │   │   ├── WorkflowNode.tsx      # Custom node component
│   │   │   └── WorkflowEdge.tsx      # Custom edge dengan actions
│   │   ├── panels/
│   │   │   ├── AddNodePanel.tsx      # Panel "What happens next?"
│   │   │   └── RightPanel.tsx        # Node editor panel
│   │   ├── sidebar/
│   │   │   └── LeftSidebar.tsx       # Workflow list sidebar
│   │   └── toolbar/
│   │       └── Toolbar.tsx           # Top toolbar
│   ├── lib/
│   │   ├── icons.tsx                 # Icon helper
│   │   └── utils.ts                  # Utility functions (cn)
│   ├── stores/
│   │   └── workflowStore.ts          # Zustand store
│   ├── types/
│   │   └── index.ts                  # TypeScript types
│   ├── utils/
│   │   └── nodeConfig.ts             # Node definitions & categories
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## 🎯 Node Categories

### AI (Purple)

- **AI Agent** - Analyze intent dengan AI
- **OpenAI** - GPT integration
- **AI Transform** - Transform data dengan AI

### Actions (Green)

- **Google Sheets** - Append row, Get rows
- **Telegram Send** - Send reply message
- **HTTP Request** - Make HTTP requests

### Data (Cyan)

- **Edit Fields** - Manipulate field data

### Flow (Orange)

- **If/Else** - Conditional logic branching
- **Filter** - Filter data
- **Switch** - Switch case logic
- **No Operation** - Pass through

### Core (Gray)

- **Code JS** - Custom JavaScript code
- **Webhook** - HTTP trigger

### Triggers (Blue)

- **Telegram Trigger** - On message received
- **Webhook** - HTTP trigger
- **Schedule Trigger** - Time-based trigger

### Human Review (Rose)

- **Human Review** - Approval via Slack/Telegram

## ⌨️ Keyboard Shortcuts

| Key                    | Action                 |
| ---------------------- | ---------------------- |
| `Tab`                  | Toggle Add Node Panel  |
| `Escape`               | Close panels           |
| `Delete` / `Backspace` | Delete selected node   |
| `Double-click` on node | Open node editor panel |

## 💾 Data Persistence

Workflow otomatis disimpan ke `localStorage` dengan key:

```
workflow-automation-data
```

Data yang disimpan:

- Nodes
- Edges
- Workflow name
- Workflow status
- Dark mode preference
- Last saved timestamp

## 🎨 Styling Guidelines

### Tailwind Classes

Semua styling menggunakan Tailwind utility classes. NO CSS modules atau styled-components.

### Color Classes by Node Type

```typescript
// Trigger (Blue)
border-blue-400 dark:border-blue-600
bg-blue-100 dark:bg-blue-900/40
text-blue-500

// AI (Purple)
border-purple-400 dark:border-purple-600
bg-purple-100 dark:bg-purple-900/40
text-purple-500

// Action (Green)
border-green-400 dark:border-green-600
bg-green-100 dark:bg-green-900/40
text-green-500

// Flow (Orange)
border-orange-400 dark:border-orange-600
bg-orange-100 dark:bg-orange-900/40
text-orange-500

// Data (Cyan)
border-cyan-400 dark:border-cyan-600
bg-cyan-100 dark:bg-cyan-900/40
text-cyan-500

// Core (Gray)
border-gray-400 dark:border-gray-600
bg-gray-100 dark:bg-gray-900/40
text-gray-500
```

### Responsive Breakpoints

```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

## 🔧 Development

### Add New Node Type

1. Update `src/utils/nodeConfig.ts`:

```typescript
{
  id: 'new-node',
  type: 'action',
  category: 'actions',
  label: 'New Node',
  subtitle: 'Node description',
  icon: 'IconName',
  description: 'Detailed description',
  color: {
    border: 'border-color',
    bg: 'bg-color',
    text: 'text-color',
    iconBg: 'bg-icon-color',
  },
  hasInput: true,
  hasOutput: true,
  parameters: [
    {
      id: 'param1',
      label: 'Parameter 1',
      type: 'text',
      value: '',
      placeholder: 'Enter value',
    },
  ],
}
```

2. Import icon dari `lucide-react` di `src/lib/icons.tsx`

### Customize Theme

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      // Add custom colors
    }
  }
}
```

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
