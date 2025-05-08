# **Spécification Fonctionnelle V1 \- A4: Gestion des Pièces Jointes (Chat)**

Date de Dernière Modification : 2025-05-01

Statut : Approuvé-----

**1\. User Story**

En tant qu' **Utilisateur AutoAgent V1**,

Je veux pouvoir joindre des fichiers (documents, code, données...) directement dans l'interface de chat lors de la définition ou de l'exécution d'une mission,

Afin de fournir facilement le contexte, les données d'entrée ou les exemples nécessaires à l'agent Orchestrateur ou aux agents spécialisés pour accomplir leurs tâches.-----**2\. Critères d'Acceptation (Gherkin Scenarios)**

**Feature:** A4 \- Gestion des Pièces Jointes (Chat)

**Contexte Général:** L'utilisateur interagit avec un agent (principalement l'Orchestrateur) via le ChatPanel. Une mission est en cours de définition ou d'exécution.

Scenario: Upload réussi d'un fichier valide

**Given** l'utilisateur est dans une conversation active pour la mission "Mission Alpha"

**And** l'interface de chat affiche un bouton ou une zone "Joindre Fichier" (ChatPanel:AttachButton)

**When** l'utilisateur clique sur "Joindre Fichier"

**And** l'utilisateur sélectionne un fichier valide "specs.pdf" (type autorisé, taille \< limite V1 configurée, ex: 20MB) depuis son système

**Then** le processus d'upload doit démarrer, avec un indicateur visuel de progression si possible.

**And** une fois l'upload terminé avec succès, le fichier doit être persisté via l'outil backend StoreArtifact (associé à Mission Alpha ou à la tâche en cours).

**And** un message confirmant la réception du fichier doit apparaître dans le ChatPanel, envoyé par l'agent (ex: "J'ai bien reçu votre fichier 'specs.pdf'.").

**And** l'agent doit indiquer brièvement comment il compte utiliser le fichier (ex: "Je vais l'analyser pour affiner le contexte de la mission.").

**And** l'artefact correspondant doit être lié au nœud :Mission ou :Task approprié dans Neo4j via l'outil AddRelationship.

**And** l'opération complète (du clic à la confirmation agent) doit être perçue comme raisonnablement rapide (NFR Performance).

Scenario: Tentative d'upload d'un fichier avec un type non autorisé

**Given** l'utilisateur est dans une conversation active

**And** les types de fichiers autorisés en V1 sont : ".pdf", ".txt", ".md", ".py", ".go", ".js", ".ts", ".csv", ".json", ".yaml", ".png", ".jpg"

**When** l'utilisateur tente de joindre un fichier "archive.zip" (type non autorisé)

**Then** l'interface de chat doit immédiatement rejeter le fichier (idéalement au niveau du sélecteur de fichier ou juste après la sélection).

**And** un message d'erreur clair doit s'afficher dans l'UI (ex: "Type de fichier non autorisé. Types acceptés : .pdf, .txt, ...") (ChatPanel:AttachmentError).

**And** aucun upload vers le backend ne doit être tenté.

Scenario: Tentative d'upload d'un fichier dépassant la taille limite

**Given** l'utilisateur est dans une conversation active

**And** la taille maximale autorisée par fichier est de 20MB (configurable)

**When** l'utilisateur tente de joindre un fichier "big\_data.csv" de 50MB

**Then** l'interface de chat doit immédiatement rejeter le fichier (idéalement au niveau du sélecteur ou juste après).

**And** un message d'erreur clair doit s'afficher dans l'UI (ex: "Fichier trop volumineux. Taille maximale autorisée : 20MB.") (ChatPanel:AttachmentError).

**And** aucun upload vers le backend ne doit être tenté.

Scenario: Échec de l'upload en cours (ex: erreur réseau)

**Given** l'utilisateur a sélectionné un fichier valide "report.md" et l'upload est en cours

**When** une erreur réseau ou une erreur serveur se produit pendant le transfert

**Then** le processus d'upload doit s'interrompre.

**And** un message d'erreur clair doit s'afficher dans l'UI (ex: "Échec de l'upload pour 'report.md'. Veuillez vérifier votre connexion et réessayer.") (ChatPanel:AttachmentError).

**And** l'utilisateur doit avoir la possibilité de retenter l'upload.

Scenario: Upload de plusieurs fichiers valides (si l'UI le permet)

**Given** l'utilisateur est dans une conversation active

**And** l'interface permet la sélection multiple de fichiers

**When** l'utilisateur sélectionne deux fichiers valides "notes.txt" et "schema.png"

**Then** les deux fichiers doivent être uploadés (potentiellement en parallèle ou séquentiellement).

**And** pour chaque fichier uploadé avec succès, l'agent doit envoyer un message de confirmation distinct dans le chat (ex: "Fichier 'notes.txt' reçu.", "Fichier 'schema.png' reçu.").

**And** chaque artefact doit être persisté et lié correctement dans le backend.

Scenario: L'utilisateur joint un fichier sans que l'agent l'ait demandé

**Given** l'utilisateur est en conversation avec l'agent Orchestrateur sur les contraintes

**When** l'utilisateur utilise la fonction "Joindre Fichier" et upload un fichier valide "contexte\_projet.pdf"

**Then** l'upload doit réussir et être confirmé par l'agent dans le chat.

**And** l'agent doit accuser réception et indiquer qu'il prendra en compte ce fichier (ex: "Merci pour le fichier 'contexte\_projet.pdf'. Je l'ajoute au contexte de la mission.").

**And** l'artefact doit être persisté et lié correctement dans le backend.-----**3\. Références UI**

* **Wireframe(s) Associé(s):**  
  * Wireframe\_ChatPanel\_V1.png (Montrant l'emplacement et l'apparence du bouton/zone AttachButton, et la zone d'affichage des erreurs AttachmentError).  
  * Wireframe\_ChatPanel\_Uploading\_V1.png (Montrant un indicateur de progression d'upload).  
* **Éléments Clés Référencés (Logiques):**  
  * ChatPanel:AttachButton: Contrôle UI (bouton, icône, zone de dépôt) permettant à l'utilisateur d'initier l'upload.  
  * ChatPanel:AttachmentError: Zone où afficher les messages d'erreur liés aux pièces jointes (type, taille, échec upload).  
  * ChatPanel:UploadProgressIndicator (Optionnel): Indicateur visuel montrant la progression de l'upload.

\-----**4\. Considérations Non Fonctionnelles (V1)**

* **Sécurité :** Validation stricte des types de fichiers et de la taille côté client ET côté serveur (dans l'outil StoreArtifact). Nettoyage systématique des noms de fichiers.  
* **Performance :** L'upload ne doit pas bloquer l'interface utilisateur. Un indicateur de progression est souhaitable pour les fichiers volumineux.  
* **Fiabilité :** Gestion claire des erreurs d'upload (réseau, serveur).  
* **Limites V1 :** Définir une liste restrictive de types de fichiers autorisés et une taille maximale raisonnable (ex: 20MB) pour la V1.

\-----**5\. Termes du Glossaire Associés**

* Mission  
* Tâche  
* Agent Orchestrateur  
* Chat  
* Artefact  
* Pièce Jointe
