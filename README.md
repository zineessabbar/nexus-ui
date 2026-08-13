# 🏦 Moteur de Conformité BCP - Interface Utilisateur

Une interface conversationnelle moderne, fluide et réactive conçue pour interagir avec l'Agent d'Architecture et de Conformité IT (RAG).
## 📸 Aperçu de l'Interface

<img width="1920" height="900" alt="image" src="https://github.com/user-attachments/assets/203a3183-4ced-4cf0-9499-6961833d58c8" />

## 🛠️ Stack Technique

Ce projet est construit avec les outils modernes de l'écosystème React :

*   **Framework :** React 18 + Vite (TypeScript)
*   **Styling :** Tailwind CSS + tailwindcss-animate
*   **Composants UI :** Radix UI (Dialog, Select, Tooltip) + Lucide React
*   **Animations :** Framer Motion
*   **Gestion d'état :** Zustand
*   **Rendu Markdown :** react-markdown + rehype/remark
*   **Package Manager :** pnpm

## 🚀 Installation & Démarrage local

### 1. Prérequis
Assurez-vous d'avoir [Node.js](https://nodejs.org/) et `pnpm` installés sur votre machine.

### 2. Cloner le projet
\`\`\`bash
git clone https://github.com/votre-nom/Rag-Ui.git
cd Rag-Ui
\`\`\`

### 3. Installer les dépendances
\`\`\`bash
pnpm install
\`\`\`

### 4. Lancer le serveur de développement
\`\`\`bash
pnpm run dev
\`\`\`
L'application sera accessible sur `http://localhost:5173`.

## 🔗 Configuration de l'API (Backend)
Par défaut, le frontend communique avec le backend FastAPI. Assurez-vous que le serveur backend tourne (généralement sur `http://localhost:8000`). Vous pouvez configurer l'URL de l'API dans vos variables d'environnement si nécessaire (ex: `.env.local`).

## 🧪 Validation et Build
Pour exécuter le linter (ESLint v9) et compiler le projet TypeScript :
\`\`\`bash
pnpm run validate
\`\`\`
