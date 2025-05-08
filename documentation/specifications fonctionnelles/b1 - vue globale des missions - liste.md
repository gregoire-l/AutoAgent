# **Fonctionnalité : B1 \- Vue Globale des Missions (Liste)**

Date de Dernière Modification : 2025-05-01

Statut : Approuvé

**\---**

**1\. User Story**

**En tant qu'** Utilisateur AutoAgent V1,

**Je veux** pouvoir visualiser une liste claire de toutes mes missions (passées et présentes) dans l'interface principale,

**Afin de** pouvoir rapidement voir l'état de mes missions en cours et accéder aux détails d'une mission spécifique.

**\---**

**2\. Critères d'Acceptation (Gherkin Scenarios)**

**Feature:** B1 \- Vue Globale des Missions (Liste)

**Contexte Général:** L'utilisateur accède à l'interface principale d'AutoAgent après s'être authentifié (si nécessaire).

**Scenario:** Affichage de la liste des missions existantes

**Given** plusieurs missions existent pour l'utilisateur avec différents statuts (ex: "Mission Alpha" \- RUNNING, "Mission Beta" \- COMPLETED, "Mission Gamma" \- DEFINING)

**When** l'utilisateur accède à la vue principale d'AutoAgent (MainUI\_V1)

**Then** une zone dédiée doit afficher la liste des missions (MissionListPanel).

**And** chaque mission dans la liste doit afficher au minimum son nom (MissionListItem:Name) et son statut actuel (MissionListItem:StatusIndicator).

**And** le statut de chaque mission doit être représenté par un indicateur visuel distinct (ex: badge coloré, icône spécifique à chaque statut : RUNNING, COMPLETED, DEFINING, FAILED...).

**And** les missions doivent être triées par date de création décroissante par défaut (la plus récente en premier).

**And** le chargement et l'affichage de la liste (pour \~20 missions) doivent prendre moins de 2 secondes (NFR Performance).

**Scenario:** Affichage lorsque aucune mission n'existe

**Given** aucune mission n'a encore été créée par l'utilisateur

**When** l'utilisateur accède à la vue principale d'AutoAgent (MainUI\_V1)

**Then** la zone dédiée à la liste des missions (MissionListPanel) doit afficher un message clair indiquant l'absence de missions (ex: "Aucune mission trouvée. Cliquez sur 'Nouvelle Mission' pour commencer.").

**And** aucune ligne de mission ne doit être affichée.

**Scenario:** Sélection d'une mission dans la liste

**Given** la liste des missions est affichée dans le MissionListPanel

**And** la mission "Mission Alpha" (statut RUNNING) est visible dans la liste

**When** l'utilisateur clique sur l'élément représentant "Mission Alpha" (MissionListItem)

**Then** l'interface doit naviguer vers la vue détaillée de "Mission Alpha" (affichant le Chat et le Canvas spécifiques à cette mission, contexte des fonctionnalités B2, B3, B5, C...).

**And** la transition vers la vue détaillée doit être perçue comme instantanée (\< 0.5 seconde) (NFR Réactivité).

**Scenario:** Mise à jour visuelle du statut d'une mission dans la liste

**Given** la mission "Mission Delta" est affichée dans la liste avec le statut "RUNNING"

**When** le statut de "Mission Delta" passe à "COMPLETED" (suite à une action dans sa vue détaillée ou via une mise à jour backend)

**And** l'utilisateur revient ou rafraîchit la vue principale (MainUI\_V1)

**Then** l'indicateur de statut pour "Mission Delta" dans la liste (MissionListItem:StatusIndicator) doit maintenant refléter visuellement l'état "COMPLETED".

**\---**

**3\. Références UI**

* **Wireframe(s) Associé(s):**  
  * Wireframe\_MainUI\_V1.png (Montrant la zone MissionListPanel et un exemple de MissionListItem).  
* **Éléments Clés Référencés (Logiques):**  
  * MainUI\_V1: La vue principale de l'application.  
  * MissionListPanel: La zone (ex: panneau latéral, section principale) où la liste des missions est affichée.  
  * MissionListItem: Un élément individuel dans la liste, représentant une mission. Doit être cliquable.  
  * MissionListItem:Name: Zone affichant le nom de la mission.  
  * MissionListItem:StatusIndicator: Élément visuel (badge, icône, couleur) indiquant le statut de la mission.

**\---**

**4\. Considérations Non Fonctionnelles (V1)**

* **Performance :** Chargement rapide de la liste initiale (\< 2s pour \~20 missions). Réactivité du clic (\< 0.5s). La mise à jour de la liste (si faite en temps réel via WebSockets par exemple \- hors scope V1) devrait être efficace.  
* **Lisibilité :** La liste doit être facile à parcourir. Les statuts doivent être immédiatement identifiables visuellement.  
* **Scalabilité (Affichage) :** Si la liste peut devenir très longue (post-V1), une pagination ou une virtualisation pourrait être nécessaire. Non requis pour V1.  
* **Filtrage/Recherche :** Non requis pour V1 (classé NTH/F).

**\---**

**5\. Termes du Glossaire Associés**

* Mission  
* Statut (Mission)  
* Chat  
* Canvas  
* Interface Principale  
* 