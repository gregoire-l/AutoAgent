# Guide des Outils de Qualité

Ce projet utilise une configuration moderne d'outils de qualité pour garantir la cohérence du code
et la fiabilité des tests.

## 🛠️ Outils Configurés

### ESLint

- **Configuration**: `eslint.config.js` (Flat Config)
- **Plugins**: TypeScript ESLint, React, React Hooks, React Refresh
- **Règles**: Recommandations TypeScript + React 19 + règles personnalisées

### Prettier

- **Configuration**: `prettier.config.ts`
- **Plugins**: Tailwind CSS (tri automatique des classes)
- **Style**: Single quotes, trailing commas ES5, 2 espaces

### Vitest

- **Configuration**: `vitest.config.ts`
- **Environnement**: jsdom pour les tests React
- **Outils**: Testing Library, Coverage V8, UI mode

## 📜 Scripts Disponibles

### Linting

```bash
npm run lint          # Vérifier les erreurs ESLint
npm run lint:fix       # Corriger automatiquement les erreurs ESLint
```

### Formatage

```bash
npm run format         # Formater le code avec Prettier
npm run format:check   # Vérifier le formatage sans modifier
```

### Tests

```bash
npm run test           # Lancer les tests en mode watch
npm run test:run       # Lancer les tests une fois
npm run test:ui        # Interface graphique des tests
npm run test:coverage  # Tests avec rapport de couverture
npm run test:watch     # Tests en mode watch explicite
```

### Vérifications

```bash
npm run type-check     # Vérification TypeScript
npm run quality        # Vérification complète (types + lint + format)
npm run quality:fix    # Correction automatique complète
```

## 🔧 Configuration Détaillée

### ESLint (eslint.config.js)

- Flat Config moderne (ESLint 9+)
- Support TypeScript avec type-checking
- Règles React 19 compatibles
- Désactivation des règles obsolètes (react-in-jsx-scope)

### Prettier (prettier.config.ts)

- Configuration TypeScript avec types
- Plugin Tailwind pour tri des classes
- Overrides pour Markdown et JSON
- Compatible avec ESLint

### Vitest (vitest.config.ts)

- Configuration dédiée séparée de Vite
- Support React avec @vitejs/plugin-react
- Environnement jsdom pour tests DOM
- Setup global avec mocks communs

## 📁 Structure des Tests

```
src/
├── test/
│   └── setup.ts           # Configuration globale des tests
└── components/
    └── ui/
        ├── button.tsx
        └── button.test.tsx # Tests unitaires
```

## 🎯 Bonnes Pratiques

### Tests

- Utiliser `describe` pour grouper les tests
- Noms descriptifs avec `it('should...')`
- Mocks avec `vi.fn()` (Vitest)
- Testing Library pour les tests React

### Code Style

- Single quotes pour les strings
- Trailing commas ES5
- 2 espaces d'indentation
- Classes Tailwind triées automatiquement

### TypeScript

- Types stricts activés
- Pas de `any` explicite (warning)
- Variables non utilisées détectées
- Non-null assertions découragées

## 🚀 Workflow Recommandé

1. **Développement**:

   ```bash
   npm run dev
   npm run test:watch  # Dans un autre terminal
   ```

2. **Avant commit**:

   ```bash
   npm run quality:fix
   npm run test:run
   ```

3. **CI/CD**:
   ```bash
   npm run quality
   npm run test:coverage
   npm run build
   ```

## 🔍 Dépannage

### Erreurs ESLint

- Vérifier que tous les plugins sont installés
- Utiliser `npm run lint:fix` pour les corrections automatiques
- Consulter la documentation TypeScript ESLint pour les règles spécifiques

### Erreurs Prettier

- Vérifier la configuration dans `prettier.config.ts`
- Utiliser `npm run format` pour corriger automatiquement
- Exclure les fichiers dans `.prettierignore`

### Erreurs Vitest

- Vérifier la configuration dans `vitest.config.ts`
- S'assurer que jsdom est installé pour les tests React
- Consulter `src/test/setup.ts` pour les mocks globaux

## 📚 Ressources

- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
- [Vitest Guide](https://vitest.dev/guide/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
