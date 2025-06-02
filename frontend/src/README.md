# AutoAgent Frontend - Structure du Projet

Ce projet utilise une architecture **feature-based** pour une meilleure organisation et
maintenabilité.

## Structure des Dossiers

```
src/
├── components/           # Composants UI partagés
│   ├── ui/              # Composants Shadcn UI (gérés par CLI)
│   └── common/          # Composants partagés customisés
├── features/            # Modules fonctionnels
│   ├── chat/           # Fonctionnalité Chat
│   │   ├── components/ # Composants spécifiques au chat
│   │   ├── hooks/      # Hooks spécifiques au chat
│   │   ├── store/      # État Zustand pour le chat
│   │   ├── types/      # Types TypeScript pour le chat
│   │   └── index.ts    # API publique de la feature
│   └── canvas/         # Fonctionnalité Canvas
│       ├── components/ # Composants spécifiques au canvas
│       ├── hooks/      # Hooks spécifiques au canvas
│       ├── store/      # État Zustand pour le canvas
│       ├── types/      # Types TypeScript pour le canvas
│       └── index.ts    # API publique de la feature
├── hooks/              # Hooks partagés
├── lib/                # Utilitaires et configuration
│   ├── utils.ts        # Utilitaires Shadcn UI (cn function)
│   ├── helpers.ts      # Fonctions utilitaires générales
│   └── constants.ts    # Constantes de l'application
├── providers/          # Providers React Context
├── store/              # Store Zustand global (si nécessaire)
├── types/              # Types TypeScript globaux
└── README.md           # Ce fichier
```

## Principes d'Organisation

### 1. **Feature-Based Architecture**

- Chaque fonctionnalité majeure a son propre dossier sous `features/`
- Tout le code lié à une feature est colocalisé
- Chaque feature expose une API publique via `index.ts`

### 2. **Séparation des Préoccupations**

- **Components**: Logique de présentation
- **Hooks**: Logique métier et état local
- **Store**: État global partagé
- **Types**: Définitions TypeScript

### 3. **Imports et Exports**

- Utiliser les alias de chemin (`@/`) pour les imports
- Exporter via les fichiers `index.ts` pour une API claire
- Éviter les imports directs dans les sous-dossiers

## Exemples d'Usage

### Import d'une feature

```typescript
import { ChatWindow, useChatMessages } from '@/features/chat';
```

### Import de composants partagés

```typescript
import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/common';
```

### Import d'utilitaires

```typescript
import { cn, formatDate } from '@/lib/helpers';
import { LAYOUT } from '@/lib/constants';
```

## Conventions de Nommage

- **Composants**: PascalCase (`ChatWindow`, `MessageList`)
- **Hooks**: camelCase avec préfixe `use` (`useChatMessages`)
- **Types**: PascalCase (`Message`, `ChatState`)
- **Constantes**: UPPER_SNAKE_CASE (`LAYOUT`, `API_ENDPOINTS`)
- **Fichiers**: camelCase ou kebab-case selon le contexte
