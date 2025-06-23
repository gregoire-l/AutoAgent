### **Feuille de Route Globale

Cette feuille de route est structurée pour construire le système de manière incrémentale, en s'assurant à chaque étape que nous avons un "squelette" fonctionnel de bout en bout.

---

### **Phase 0 : Le Squelette Fonctionnel (The Walking Skeleton)**
*(Objectif : Avoir UNE SEULE boucle de tâche qui s'exécute de bout en bout avec succès)*

*   **Philosophie :** Tout est "mocké" ou implémenté de la manière la plus simple et la plus "stupide" possible. Le but n'est pas la performance ou l'intelligence, mais de **valider l'intégration et le flux de données** entre tous les composants.
*   **Actions Clés par Composant (Version "v0") :**
    1.  **Fondations :** Le `Chantier 0` est un prérequis. `Docker Compose`, `Neo4j` avec son schéma, `Temporal`, etc., sont en place.
    2.  **`Générateur d'Options` :** Pas d'IA complexe. C'est une fonction qui, pour un prompt donné, retourne une liste **codée en dur** de 2-3 `PotentialTask` (ex: "Écrire un script 'hello_world.py'").
    3.  **`Proxy Scorer` (B0) :** Pas encore d'appel à un LLM. C'est une fonction qui retourne des **scores aléatoires ou fixes** pour chaque `PotentialTask`. Son but est juste de fournir une donnée pour que le composant suivant fonctionne.
    4.  **`Moteur de Décision` :** Prend les scores et choisit simplement celui avec la valeur la plus haute (`argmax`). Pas de stratégie complexe.
    5.  **`Agents Exécuteurs` & `ToolService` :** On implémente **un seul outil** : un simple exécuteur de script Python (`python_script_execution`) qui n'est **pas** dans un bac à sable sécurisé.
    6.  **`Couche de Contexte (Context Engine)` :** C'est un **mock complet**. Il est appelé, mais il retourne systématiquement un contexte vide. Il ne touche pas au graphe.
    7.  **`Couche de Validation` :** Pas d'orchestrateur intelligent. C'est une fonction simple : si le script s'exécute sans erreur (code de sortie 0), le `Finding` est "SUCCESS". Sinon, c'est "FAILURE".
    8.  **`Knowledge Graph` :** Le système doit réussir à écrire les nœuds `:Task`, `:Artefact`, et `:Finding` correspondant à l'exécution de la tâche "hello_world.py".
*   **Livrable de Phase :** La capacité de lancer une mission et de voir, dans Neo4j, le graphe factuel d'une tâche simple et réussie. **Nous avons prouvé que la plomberie fonctionne.**

---

### **Phase 1 : L'Amorçage de l'Intelligence (Bootstrap)**
*(Objectif : Générer le premier dataset viable et entraîner le B1)*

*   **Philosophie :** Remplacer les composants "stupides" par des versions "naïves" basées sur l'IA. Activer le mode d'apprentissage.
*   **Actions Clés (Mise à jour des composants en "v0.5") :**
    1.  **`Générateur d'Options` :** Remplacer la liste codée en dur par des appels à un **LLM externe**, comme nous l'avions discuté.
    2.  **`Proxy Scorer` (B0) :** Remplacer le générateur de scores aléatoires par des appels au même **LLM externe** pour évaluer les branches.
    3.  **Mode d'Entraînement :** Activer le "Mode d'Exploration Dirigée" pour commencer à collecter des données comparatives.
    4.  **Développement du B1 :** En parallèle, l'équipe MLOps utilise les toutes premières données générées pour construire le pipeline d'entraînement du **Blueprint 1+**.
*   **Livrable de Phase :**
    *   Le système peut générer des données de manière autonome.
    *   Un premier dataset de **~5 000 à 10 000 points**.
    *   Une première version du **modèle B1 entraînée** et prête à être déployée, avec ses métriques de performance dans `MLflow`.

---

### **Phase 2 : L'Industrialisation et l'Efficacité**
*(Objectif : Avoir un agent autonome rapide, économique, et utile)*

*   **Philosophie :** Remplacer les composants lents et chers par nos propres modèles spécialisés et robustifier l'architecture.
*   **Actions Clés (Mise à jour des composants en "v1") :**
    1.  **Déploiement du B1 :** Le `Proxy Scorer` bascule des appels à l'API du LLM vers des appels locaux au **modèle B1**.
    2.  **Activation de l'Apprentissage Continu :** Le `Moteur de Décision` implémente la **stratégie Epsilon-Greedy** pour que B1 continue de s'améliorer.
    3.  **`Couche de Contexte` v1 :** Le mock est remplacé par une première version de **GraphRAG** qui recherche des tâches similaires dans le `Factual KG` pour enrichir le prompt du `Planificateur`.
    4.  **`ToolService` v1 :** L'exécuteur de script simple est remplacé par un système **sécurisé via sandboxing (E2B)**.
    5.  **`Knowledge Graph` v1 :** Implémentation de la **logique de mise à jour de la confiance simple** pour les `:KnowledgeChunk`.
*   **Livrable :** Un agent V1 complet, rapide, sécurisé, et dont l'intelligence (B1) et la base de connaissances s'améliorent à chaque mission. Un dataset de **> 50 000 points**.

---

### **Phase 3 : La Sophistication et l'Expertise**
*(Objectif : Atteindre la performance maximale et les capacités de raisonnement avancées)*

*   **Philosophie :** Déployer nos composants les plus avancés pour résoudre les problèmes les plus complexes.
*   **Actions Clés (Mise à jour des composants en "v2") :**
    1.  **Développement et Déploiement du B2 :** Entraîner le **Blueprint 2 (MTL+EWC)** sur le grand dataset. Mettre en place l'architecture de **scoring hiérarchique B1/B2**.
    2.  **`Knowledge Graph` v2 :** Implémentation de la **logique de mise à jour bayésienne sophistiquée**.
    3.  **HAAI :** Développement de l'interface utilisateur pour l'interaction homme-agent.
*   **Livrable :** L'architecture cible complète, telle que nous l'avons conçue.
