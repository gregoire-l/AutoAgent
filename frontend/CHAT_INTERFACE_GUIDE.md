# Guide de l'Interface de Chat

Ce document décrit l'interface de chat développée pour l'application d'orchestration d'agents.

## Composants Créés

### 1. **ChatPanel** - Interface principale

- **Localisation** : `src/features/chat/components/ChatPanel.tsx`
- **Fonction** : Container principal qui organise header, messages et input
- **Layout** : Flexbox vertical avec header fixe, messages scrollables, input fixe

### 2. **ChatHeader** - En-tête du chat

- **Fonctionnalités** :
  - Avatar de l'agent avec initiales "AI"
  - Nom "Agent Orchestrateur"
  - Indicateur de connexion (point vert/rouge)
  - Compteur de messages
  - Menu d'actions (paramètres, effacer conversation)

### 3. **MessageList** - Liste des messages

- **Fonctionnalités** :
  - Affichage chronologique des messages
  - Auto-scroll vers le dernier message
  - État vide avec message d'accueil
  - Scrollbar personnalisée compatible React 19

### 4. **Message** - Composant message individuel

- **Fonctionnalités** :
  - Avatars différenciés (U pour user, A pour assistant)
  - Bulles de couleurs différentes (primaire pour user, muted pour assistant)
  - Horodatage formaté (HH:MM)
  - Indicateurs de statut (envoi, envoyé, erreur)
  - Alignement différencié (droite pour user, gauche pour assistant)

### 5. **MessageInput** - Zone de saisie

- **Fonctionnalités** :
  - Textarea auto-redimensionnable (40px à 120px)
  - Bouton d'envoi avec icône
  - Support Entrée pour envoyer, Shift+Entrée pour nouvelle ligne
  - Indicateur de chargement pendant l'envoi
  - Placeholder contextuel
  - Indicateur de connexion perdue

## Fonctionnalités Implémentées

### ✅ **Interface Utilisateur**

- Design cohérent avec le système de design
- Responsive et accessible
- Animations fluides
- Indicateurs visuels clairs

### ✅ **Interactions**

- Envoi de messages avec Enter
- Auto-scroll vers nouveaux messages
- Gestion des états de chargement
- Menu d'actions avec confirmation

### ✅ **Gestion d'État**

- Intégration complète avec Zustand store
- Synchronisation avec l'état de connexion
- Persistance des messages
- Gestion des erreurs

### ✅ **Simulation d'Agent**

- Réponses contextuelles basées sur le contenu
- Délais réalistes (1-3 secondes)
- Réponses spécialisées pour le voyage Lyon-Paris
- Gestion des erreurs avec messages d'erreur

## Données de Démonstration

### Messages Initiaux

1. **Message d'accueil** (Agent) - "Salut ! Prêt(e) à démarrer une mission ?"
2. **Demande utilisateur** (User) - "Je dois organiser un voyage Lyon-Paris pour 4 personnes"
3. **Réponse contextuelle** (Agent) - Confirmation et demande de précisions

### Réponses Contextuelles

L'agent reconnaît et répond spécifiquement à :

- Mentions de villes (Lyon, Paris)
- Contraintes budgétaires
- Préférences de transport
- Urgence/timing

## Intégration avec le Canvas

### Synchronisation Prévue

- Mise à jour des sections de mission basée sur la conversation
- Extraction d'entités (dates, lieux, préférences)
- Déclenchement de mises à jour du canvas
- Feedback bidirectionnel chat ↔ canvas

## Compatibilité React 19

### Problèmes Résolus

- Remplacement de ScrollArea par CSS natif
- Types MessageData vs composant Message
- Gestion des hooks avec React 19
- Composants Radix UI compatibles

### Composants UI Utilisés

- ✅ Avatar (Radix UI)
- ✅ Button (Shadcn UI)
- ✅ Textarea (Shadcn UI)
- ✅ DropdownMenu (Radix UI)
- ✅ Scrollbar personnalisée (CSS)

## Prochaines Améliorations

### 🔄 **Fonctionnalités Avancées**

- [ ] Indicateur de frappe en temps réel
- [ ] Support des fichiers/images
- [ ] Historique de conversation
- [ ] Recherche dans les messages

### 🔄 **Intégration Agent**

- [ ] Connexion API réelle
- [ ] Streaming des réponses
- [ ] Gestion des erreurs réseau
- [ ] Retry automatique

### 🔄 **UX/UI**

- [ ] Thème sombre/clair
- [ ] Raccourcis clavier
- [ ] Notifications
- [ ] Suggestions de réponses

## Utilisation

```tsx
import { ChatPanel } from '@/features/chat'

// Utilisation simple
<ChatPanel />

// Avec personnalisation
<ChatPanel className="custom-chat" />
```

L'interface est maintenant pleinement fonctionnelle et prête pour l'intégration avec un véritable
agent d'orchestration.
