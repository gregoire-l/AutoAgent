# React 19 Compatibility Guide

Ce document décrit les problèmes de compatibilité rencontrés avec React 19 et les solutions
appliquées.

## Problèmes Identifiés

### 1. Erreur "Invalid hook call"

**Symptôme :**
`Invalid hook call. Hooks can only be called inside of the body of a function component.`

**Cause :** Certains composants Shadcn UI (notamment `ScrollArea`) ne sont pas encore entièrement
compatibles avec React 19.

**Solution :** Remplacement temporaire par des alternatives CSS natives.

### 2. ScrollArea Incompatible

**Symptôme :** Erreur dans le composant `<ScrollArea>` de Radix UI.

**Solution appliquée :**

- Remplacement de `ScrollArea` par `div` avec `overflow-y-auto`
- Ajout de styles de scrollbar personnalisés dans `src/index.css`
- Classe CSS `.custom-scrollbar` pour une meilleure UX

### 3. WebSocket Vite (Mineur)

**Symptôme :** `Firefox can't establish a connection to the server at ws://localhost:5173/`

**Impact :** Affecte uniquement le Hot Module Replacement (HMR), pas la fonctionnalité de l'app.

## Solutions Appliquées

### Remplacement ScrollArea

```tsx
// Avant (incompatible)
<ScrollArea className="flex-1">
  <div className="p-4 space-y-4">
    {/* contenu */}
  </div>
</ScrollArea>

// Après (compatible)
<div className="flex-1 overflow-y-auto custom-scrollbar">
  <div className="p-4 space-y-4">
    {/* contenu */}
  </div>
</div>
```

### Remplacement Avatar

```tsx
// Avant (incompatible)
<Avatar className="h-8 w-8">
  <AvatarFallback className="bg-primary text-primary-foreground">
    AI
  </AvatarFallback>
</Avatar>

// Après (compatible)
<div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
  AI
</div>
```

### Remplacement DropdownMenu

```tsx
// Avant (incompatible)
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={handleAction}>
      Action
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

// Après (compatible)
<Button
  variant="ghost"
  size="icon"
  onClick={handleAction}
  title="Action"
>
  <ActionIcon className="h-4 w-4" />
</Button>
```

### Styles de Scrollbar Personnalisés

Ajout dans `src/index.css` :

```css
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--border)) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: hsl(var(--border));
  border-radius: 3px;
}
```

## Composants Shadcn UI Testés

### ✅ Compatibles

- Button
- Card
- Input
- Textarea
- Badge
- Select
- Checkbox
- Radio Group
- Label
- Separator
- Resizable

### ❌ Incompatibles (remplacés par alternatives CSS)

- ScrollArea (remplacé par CSS natif)
- Avatar (remplacé par div avec styles CSS)
- DropdownMenu (remplacé par bouton simple)

## Recommandations

1. **Surveiller les mises à jour** de Radix UI pour la compatibilité React 19
2. **Tester régulièrement** les composants Shadcn UI avec les nouvelles versions
3. **Utiliser des alternatives CSS** pour les composants incompatibles
4. **Documenter les workarounds** pour faciliter les futures migrations

## Versions Utilisées

- React: ^19.1.0
- React DOM: ^19.1.0
- @types/react: ^19.1.2
- @types/react-dom: ^19.1.2
- Radix UI: versions diverses (voir package.json)

## Prochaines Étapes

1. Surveiller les releases de Radix UI pour React 19
2. Réintégrer ScrollArea quand compatible
3. Tester d'autres composants Radix UI complexes
4. Considérer des alternatives comme Ariakit ou React Aria si nécessaire
