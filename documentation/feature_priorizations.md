## **AutoAgent \- Priorisation des Fonctionnalités**

**Objectif :** Définir le périmètre fonctionnel de la V1 (MVP) d'AutoAgent, en se concentrant sur la valeur fondamentale et l'expérience utilisateur "Chat \+ Canvas", tout en maintenant des standards élevés de qualité et de robustesse. **Cette priorisation fonctionnelle présuppose la mise en place de la stack technique nécessaire (Go, Dgraph, Temporal, Docker, etc.) en V1 pour supporter ces fonctionnalités.**

**Légende des Priorités :**

* **Must-Have (MH) :** Essentiel pour la V1. Sans cette fonctionnalité, le produit ne remplit pas son objectif principal ou l'expérience utilisateur clé est compromise.  
* **Nice-to-Have (NTH) :** Souhaitable. Améliore significativement l'expérience ou l'efficacité, mais peut être ajouté dans une version ultérieure (V2) sans bloquer la valeur initiale.  
* **Future (F) :** Vision à long terme. Fonctionnalité intéressante mais non prioritaire pour les premières versions.

**Terminologie :** Pour la V1, "Mission" désigne l'unité de travail principale initiée, suivie et validée par l'utilisateur via l'interface.

### **A. Définition de Mission (Interface Chat \+ Canvas)**

| ID | Fonctionnalité | Priorité | Justification |
| :---- | :---- | :---- | :---- |
| A1 | Création de Mission via Chat | **MH** | Point d'entrée fondamental. L'utilisateur doit pouvoir initier une mission. |
| A2 | Clarification Guidée (Chat) | **MH** | Cœur de l'interaction initiale. Assure la bonne compréhension et définition de la mission par l'agent Orchestrateur, essentiel pour la qualité du résultat. |
| A3 | Canvas "Tableau Blanc" Dynamique | **MH** | Pierre angulaire de l'UI "Chat \+ Canvas". Doit afficher *a minima* les éléments clés (titre, description, objectifs, contraintes) mis à jour dynamiquement pendant A2. |
| A4 | Gestion des Pièces Jointes (Chat) | **MH** | Souvent indispensable pour fournir le contexte nécessaire (fichiers de conf, specs, etc.) à la mission. |
| A5 | Résumé et Validation Initiale | **MH** | Étape critique de validation avant de lancer l'exécution coûteuse en ressources. Inclut la "Carte Récapitulative" et le bouton "Confirmer" sur le Canvas. Génération du résumé (livrable Markdown). |
| A6 | Définition Limites Ressources | **MH** | Essentiel pour le contrôle. *Minimum V1 :* Définir via chat/canvas un temps max global ou un nombre max d'étapes/tokens pour éviter les dérives. Configuration avancée \= NTH. |

### **B. Suivi et Visualisation de Mission (Canvas Principalement)**

| ID | Fonctionnalité | Priorité | Justification |
| :---- | :---- | :---- | :---- |
| B1 | Vue Globale des Missions | **MH** | L'utilisateur doit pouvoir lister et accéder à ses différentes missions (actives, passées). |
| B2 | Visualisation de l'Arbre des Tâches | **MH** | Représentation visuelle fondamentale pour comprendre la structure et la progression. *Minimum V1 :* Graphe/Arbre interactif avec expand/collapse, zoom/pan basique, et affichage du statut par nœud. |
| B3 | Détails de la Tâche | **MH** | Indispensable pour le suivi. Cliquer sur une tâche (B2) doit afficher ses informations clés (description, statut, agent, dépendances, livrable attendu, artefacts liés) dans le Canvas. |
| B4 | Vue Agent (Dédiée) | **NTH** | L'information de l'agent assigné est visible dans B3. Une vue dédiée à la gestion/visualisation des agents peut attendre. |
| B5 | Journal d'Événements / Logs Simplifiés | **MH** | Nécessaire pour le diagnostic de base. Afficher les événements majeurs de la mission et les logs *récents/critiques* de la tâche sélectionnée dans le Canvas. Accès aux logs complets via lien artefact. |
| B6 | Indicateur de Progression Global | **NTH** | Apporte une vue rapide mais moins essentielle que l'arbre des tâches (B2) pour comprendre l'état réel. |

### **C. Interaction et Validation Utilisateur (Chat \+ Canvas)**

| ID | Fonctionnalité | Priorité | Justification |
| :---- | :---- | :---- | :---- |
| C1 | Demande de Validation Structurée | **MH** | Mécanisme central du "Human-in-the-loop". Notification claire et affichage dans le Canvas avec boutons "Valider"/"Invalider". |
| C2 | Justification d'Invalidation | **MH** | Feedback essentiel pour que l'agent puisse corriger ou adapter. Champ commentaire associé au bouton "Invalider". |
| C3 | Consultation des Livrables | **MH** | L'utilisateur doit pouvoir visualiser les résultats produits. *Minimum V1 :* Visionneuses intégrées au Canvas pour les formats courants (Markdown, texte, code simple, images). PDF/autres formats complexes \= NTH. |
| C4 | Annotation Interactive Livrables | **NTH** | Très puissant mais complexe à implémenter correctement (surtout image). V1 peut se contenter de la justification textuelle (C2) ou d'un champ commentaire global sur le livrable. Priorité haute pour V2. |
| C5 | Interaction en Cours (Chat) | **MH** | Capacité de base à dialoguer avec l'Orchestrateur pendant l'exécution pour questions/clarifications simples. |
| C6 | Contrôles de Mission (Pause/Rep/Ann) | **MH** | Contrôles essentiels pour la gestion des processus longs ou problématiques. Nécessite une confirmation pour "Annuler". |

### **D. Fonctionnalités Avancées / Gestion Système**

| ID | Fonctionnalité | Priorité | Justification |
| :---- | :---- | :---- | :---- |
| D1 | Gestion des Agents (Vue UI) | **NTH** | La gestion se fait via la logique interne pour la V1. Une UI dédiée n'est pas essentielle initialement. |
| D2 | Configuration Globale (Clés API...) | **MH** | Le système a besoin des clés API LLM pour fonctionner. *Minimum V1 :* Gestion via fichier de configuration ou section très simple dans l'UI (pas forcément dans l'interface principale). |
| D3 | Clonage de Mission | **F** | Fonction de confort et d'efficacité, mais pas indispensable pour la fonctionnalité de base. |
| D4 | Modèles de Mission / Gestion Prompts | **F** | Modèles statiques non prioritaires. Gestion dynamique/avancée des prompts est complexe et pour le futur. V1 utilise prompts fixes modifiables manuellement (via D2/fichiers). |
| D5 | Personnalisation UI (Thèmes/Widgets) | **NTH(Th.) F(Wid.)** | *Thème Clair/Sombre (NTH) :* Confort appréciable mais non bloquant pour V1. *Personnalisation Widgets/Layout (F) :* Complexe, pour le futur. |
| D6 | Recherche Intelligente | **F** | La liste des missions (B1) suffit pour la V1. La recherche avancée est une amélioration future. |
| D7 | Intégration Voix | **F** | Complexité technique importante. À envisager une fois l'interface texte/canvas parfaitement maîtrisée. |

**Synthèse de la V1 (Must-Have) :**

La V1 d'AutoAgent se concentre sur :

1. **Interaction Cœur :** Définition de mission via Chat \+ Canvas dynamique, pièces jointes, validation du lancement, définition des limites de ressources de base.  
2. **Exécution & Suivi :** Lancement (via Temporal), visualisation interactive de l'arbre des tâches (statut, expand/collapse, zoom/pan), accès aux détails des tâches et logs simplifiés via le Canvas.  
3. **Validation & Contrôle :** Notification et interface de validation/invalidation (avec justification), consultation des livrables courants (Markdown, code, image), interaction chat basique en cours, contrôles Pause/Reprendre/Annuler.  
4. **Fondations Essentielles :** Vue listant les missions, gestion de la configuration de base (clés API).  
5. **Stack Technique Complète :** **Tout cela repose sur la mise en place fonctionnelle de la stack Go, Dgraph, Temporal, Docker, outils LLM de base, etc.**
