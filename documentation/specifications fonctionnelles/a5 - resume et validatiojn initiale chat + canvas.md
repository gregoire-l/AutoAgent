# **Fonctionnalité : A5 \- Résumé et Validation Initiale (Chat \+ Canvas)**

Date de Dernière Modification : 2025-05-01  
Statut : Approuvé

## **\---**

**1\. User Story**

En tant qu' Utilisateur AutoAgent V1,  
Je veux que l'agent Orchestrateur me présente un résumé complet de la mission telle qu'elle a été clarifiée, à la fois dans le chat et sur le Canvas, et me demande une validation finale explicite,  
Afin de pouvoir vérifier une dernière fois que ma demande a été correctement comprise avant de lancer la planification détaillée ou l'exécution de la mission.

## **\---**

**2\. Préconditions**

* La phase de Clarification Guidée (A2) doit être terminée.  
* L'agent Orchestrateur doit avoir validé en interne que toutes les informations de la Checklist Noyau Dur V1 (Info\_Objective\_Principal, Info\_Livrable\_Cle, Info\_Critere\_Acceptation\_Fondamental, Info\_Contrainte\_Critique, Info\_Validateur\_Principal) ont été confirmées par l'utilisateur.

Bien sûr, voici le texte corrigé avec le formatage amélioré pour les scénarios Gherkin, en mettant en gras les mots-clés **Given**, **When**, **Then**, et **And**:

**\---**

**3\. Critères d'Acceptation (Gherkin Scenarios)**

**Feature:** A5 \- Résumé et Validation Initiale (Chat \+ Canvas)

**Contexte Général:** Ces scénarios commencent immédiatement après la fin réussie de la fonctionnalité A2.

Scenario: Présentation réussie du résumé et des options de validation

**Given** la phase de clarification A2 est terminée et toutes les informations du Noyau Dur V1 sont confirmées

**When** l'agent Orchestrateur initie la phase de synthèse finale

**Then** l'agent Orchestrateur doit utiliser un outil backend (ex: GetMissionDetailsTool) pour récupérer les informations confirmées de la mission.

**And** l'agent Orchestrateur doit afficher un message de synthèse structuré dans le ChatPanel, résumant au minimum l'Objectif Principal, le Livrable Clé, les Contraintes Critiques et le Validateur Principal.

**And** le CanvasPanel doit afficher une "Carte Récapitulative de Mission" (SummaryCard) présentant ces mêmes informations clés de manière claire.

**And** l'agent Orchestrateur doit poser une question de validation finale dans le ChatPanel (ex: "Voici le résumé final. Tout est correct pour lancer la suite ?").

**And** deux boutons doivent être clairement visibles et actifs sur la SummaryCard du CanvasPanel : "Confirmer la Mission" (ConfirmButton) et "Modifier" (ModifyButton).

Scenario: L'utilisateur confirme la mission

**Given** le résumé de la mission est affiché dans le ChatPanel et sur la SummaryCard du CanvasPanel

**And** les boutons "Confirmer la Mission" et "Modifier" sont actifs sur la SummaryCard

**When** l'utilisateur clique sur le bouton "Confirmer la Mission" (ConfirmButton) sur le CanvasPanel (ou confirme via une commande chat équivalente)

**Then** l'agent Orchestrateur doit accuser réception de la confirmation dans le ChatPanel (ex: "Parfait \! Mission confirmée. Lancement de la planification...").

**And** l'agent Orchestrateur doit utiliser un outil backend pour mettre à jour le statut de la :Mission dans Neo4j à un état approprié (ex: "PLANNING" ou "QUEUED\_EXECUTION", à définir selon le workflow post-validation).

**And** l'interface utilisateur doit potentiellement passer à une vue de suivi de mission (défini dans les fonctionnalités Bx).

**And** les boutons "Confirmer la Mission" et "Modifier" doivent disparaître ou devenir inactifs.

Scenario: L'utilisateur demande à modifier la mission

**Given** le résumé de la mission est affiché dans le ChatPanel et sur la SummaryCard du CanvasPanel

**And** les boutons "Confirmer la Mission" et "Modifier" sont actifs sur la SummaryCard

**When** l'utilisateur clique sur le bouton "Modifier" (ModifyButton) sur le CanvasPanel (ou indique vouloir modifier via le chat)

**Then** l'agent Orchestrateur doit accuser réception de la demande de modification dans le ChatPanel (ex: "D'accord, quels points souhaitez-vous modifier ?").

**And** l'interface doit retourner à l'état de clarification (Fonctionnalité A2), permettant à l'utilisateur de reprendre le dialogue pour ajuster les informations.

**And** les boutons "Confirmer la Mission" et "Modifier" de la synthèse doivent disparaître.

**And** le statut de la :Mission dans Neo4j doit rester "DEFINING" (ou un état équivalent indiquant la clarification en cours).

Scenario: Gestion d'une erreur backend lors de la confirmation

**Given** le résumé de la mission est affiché et prêt pour validation

**When** l'utilisateur clique sur "Confirmer la Mission" (ConfirmButton)

**And** une erreur se produit lors de l'appel à l'outil backend pour mettre à jour le statut de la mission (ex: ERR\_NEO4J\_QUERY\_ERROR)

**Then** l'agent Orchestrateur doit informer l'utilisateur de l'échec de la confirmation dans le ChatPanel (ex: "Désolé, une erreur est survenue lors de la confirmation de la mission : \[Code Erreur\]. Veuillez réessayer.").

**And** le statut de la mission ne doit pas changer dans Neo4j.

**And** les boutons "Confirmer la Mission" et "Modifier" doivent rester actifs pour permettre une nouvelle tentative.

**And** l'application doit rester stable (NFR Stabilité).

## **\---**

**4\. Références UI**

* **Wireframe(s) Associé(s):**  
  * Wireframe\_ChatCanvas\_Summary\_V1.png (Montrant la SummaryCard avec les informations clés et les boutons ConfirmButton, ModifyButton).  
* **Éléments Clés Référencés (Logiques):**  
  * ChatPanel: Zone de chat affichant le résumé textuel et la demande de validation.  
  * CanvasPanel: Canvas affichant la SummaryCard.  
  * SummaryCard: Carte/Zone affichant le résumé visuel des informations clés confirmées.  
  * ConfirmButton: Bouton permettant à l'utilisateur de valider la mission.  
  * ModifyButton: Bouton permettant à l'utilisateur de retourner à la phase de clarification A2.

## **\---**

**5\. Considérations Non Fonctionnelles (V1)**

* **Clarté du Résumé :** Le résumé généré (chat et canvas) doit être clair, concis et refléter fidèlement les informations confirmées lors de A2.  
* **Réactivité :** La transition après clic sur "Confirmer" ou "Modifier" doit être rapide (\< 1s).  
* **Fiabilité :** La mise à jour de l'état de la mission dans le backend lors de la confirmation doit être fiable. La gestion d'erreur doit être claire.

## **\---**

**6\. Termes du Glossaire Associés**

* Mission  
* Agent Orchestrateur  
* Chat  
* Canvas  
* Checklist d'Informations Clés V1  
* Statut (Mission)  
* Planification  
* Exécution