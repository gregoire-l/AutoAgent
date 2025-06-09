## **Récit Utilisateur a2-a3: Clarification de la mission 

**Contexte Initial :** L'utilisateur lance AutoAgent. L'interface s'ouvre sur un espace épuré au thème sombre. L'élément central est un **champ de saisie multiligne accueillant**, occupant une place prépondérante, invitant à l'action : "**Salut \! Prêt(e) à démarrer une mission ? Dis-moi tout...**" (Police Inter, taille confortable, couleur \#D4D4D8).

**(Phase A1 : Démarrage Intégré)**

1. **Saisie Initiale :** L'utilisateur tape sa demande directement :"Hello, j'aurais besoin d'organiser un A/R Lyon-Paris pour 4 potes. On a un budget de 100€ max. Faut qu'on soit à Paris le vendredi 4 avril avant 20h et qu'on reparte le dimanche soir."  
2. **Envoi et Transition Fluide :** L'utilisateur appuie sur Entrée. Une **animation rapide et élégante** se produit :  
   * Le champ de saisie **glisse vers la gauche et se redimensionne** pour devenir l'input standard du panneau **Chat** qui se matérialise (\~40% de l'écran).  
   * La demande initiale de l'utilisateur apparaît comme premier message dans ce Chat (bulle droite, bleue \#3B82F6).  
   * Simultanément, le panhy neau **Canvas** se dévoile sur la droite (\~60%), déjà enrichi par l'analyse instantanée de l'agent.

**(Phase A2 : Clarification Dynamique et Co-construction)**

3. **Canvas Pré-rempli & Indicateurs Visuels d'État :** Le **Canvas** affiche :  
   * Un titre généré automatiquement : "**Mission : Organisation Voyage Lyon-Paris**".
   * Une liste verticale de sections. Chaque section (ex: Objectif, Contraintes, Livrable Clé) est introduite par un titre et possède une **barre de marge colorée sur sa gauche** indiquant son statut global :
     * Objectif - Statut: `En discussion` (barre de marge jaune `#F59E0B`, couleur `--color-status-discussion`).
     * Contraintes - Statut: `En discussion` (barre de marge jaune `#F59E0B`). Les contraintes identifiées (Voyageurs, Budget, Période, Trajet) sont listées dessous, chacune avec son icône thématique (ex: `heroicon-users`, `heroicon-currency-euro`). Les points ambigus comme "Budget: 100€" sont mis en évidence, attendant clarification.
     * Livrable Clé - Statut: `À définir` (barre de marge grise `rgba(113, 113, 122, 0.2)`, couleur `--color-status-unaddressed`). Section identifiée par une icône `heroicon-document-text`.
     * Critères de Succès - Statut: `À définir` (barre de marge grise `rgba(113, 113, 122, 0.2)`).
     * Validateur - Statut: `Confirmé` (barre de marge verte `#10B981`, couleur `--color-status-confirmed`).
     * Contexte/Motivation - Statut: `À définir` (barre de marge grise `rgba(113, 113, 122, 0.2)`).
       L'utilisateur voit immédiatement l'état de chaque section grâce à la couleur de sa barre de marge. La progression globale est perçue par le passage des barres au vert.
4. Dialogue Naturel & Groupé : L'Agent Orchestrateur intervient dans le Chat (ton informel, indicateur "tape..." pendant la réflexion) : "Ok, ça marche pour le trip Lyon-Paris \! Deux petites précisions pour être sûr : le budget de 100€, c'est par tête ou pour tout le groupe ? Et pour le retour dimanche soir, 'pas avant 18h', ça te va ?"  
   Sur le Canvas, la barre de marge de la section Contraintes (actuellement jaune) pourrait légèrement pulser pour indiquer qu'elle est le sujet de la discussion active.
5. Réponse Utilisateur & Confirmation Intelligente : Utilisateur (Chat) : "Ah yes, 100€ par personne (donc 400€ total). Et oui, départ après 18h c'est parfait."  
   Agent (Chat) : "Super clair \! Budget max 400€ et départ \>18h dimanche, c'est noté et validé."  
   Sur le Canvas, la section Contraintes se met à jour : sa barre de marge passe au vert (`--color-status-confirmed`), et le texte interne s'actualise ("Budget: 400€ total", "Horaire Retour: >18h"). Les éléments spécifiques confirmés (Budget, Horaire Retour) peuvent recevoir une icône ✔️ (`heroicon-check`) à côté d'eux.
6. **Interaction via Chat pour Modification :** L'utilisateur relit et veut ajuster. Il tape dans le Chat : "En fait, on peut monter le budget à 450€ total."  
   * **Réaction Agent & Canvas :** La barre de marge de la section Contraintes sur le Canvas redevient jaune (`--color-status-discussion`) et le statut texte pourrait indiquer "Modification en cours..." pendant que l'agent traite la demande.  
   * **Feedback & Boucle Agent :** Dans le Chat, l'Agent réagit aussitôt : "Bien noté \! Budget mis à jour à 450€ max total."  
     Sur le Canvas, le texte s'actualise ("Budget: 450€ total"). Après un court instant, la barre de marge de la section Contraintes repasse au vert (`--color-status-confirmed`).
7. **Suggestion Proactive & Clarification (Livrable) :** L'Agent enchaîne (Chat) : "Maintenant, qu'est-ce que tu attends comme résultat concret de ma part ? Souvent, pour ce genre de demande, un tableau comparatif des options est le plus utile. Ou préfères-tu une simple liste des options ?" Simultanément, sur le **Canvas**, la section Livrable Clé (identifiée par `heroicon-document-text`) change : sa barre de marge devient bleue (`--color-status-suggestion`, #3B82F6). Une `suggestion-capsule` apparaît dans cette section, présentant les options "Tableau Comparatif Détaillé" et "Simple Liste des Options".
8. **Réponse via Chat :** L'utilisateur répond dans le Chat : "Un tableau comparatif, ce sera parfait."  
   * **Réaction Canvas :** La barre de marge de la section Livrable Clé passe au vert (`--color-status-confirmed`). Le contenu du Canvas reflète "Tableau Comparatif Détaillé" comme étant sélectionné ou confirmé.  
   * **Feedback Chat :** L'Agent confirme dans le **Chat** : "Parfait pour le tableau comparatif détaillé \!"  
9. Clarification Intelligente (Critère Succès) : Agent (Chat) : "Ok. Et pour choisir la meilleure option dans ce tableau, qu'est-ce qui primera vraiment pour toi, vu le budget qu'on a fixé ? Le Prix le plus bas (même si le trajet est un peu plus long), ou un Temps de trajet minimal (quitte à payer un peu plus) ?"  
   Sur le Canvas, la section Critères de Succès voit sa barre de marge passer au jaune (`--color-status-discussion`). Les critères suggérés par l'agent (ex: "Confort des transports", "Flexibilité") apparaissent dans la liste des critères, chacun préfixé par une icône d'ampoule (💡 `heroicon-light-bulb`) et avec leur badge de priorité (ex: 'A' pour Appréciable, 'O' pour Optionnel). Les options "Prix le plus bas" et "Temps de trajet minimal" sont également présentées comme des critères à évaluer.
10. **Réponse via Chat (encore) :** L'utilisateur répond dans le Chat : "Priorité au prix le plus bas. Et le confort c'est appréciable."  
    * **Réaction Canvas & Chat :** Sur le Canvas, le critère "Prix le plus bas" est marqué comme confirmé (ex: icône ✔️, texte en gras). Le critère "Confort des transports" (qui était une suggestion 💡) est également marqué comme confirmé. Si tous les critères sont adressés, la barre de marge de la section Critères de Succès passe au vert. L'Agent confirme dans le Chat : "Noté, priorité absolue au prix le plus bas et confort appréciable \!"  
11. **Dernier Point & Fin de Clarification :** L'Agent aborde le dernier point (Contexte/Motivation) de manière conversationnelle dans le Chat. Une fois confirmé par l'utilisateur dans le Chat, la barre de marge de la section correspondante sur le Canvas passe au vert. Toutes les barres de marge des sections sont maintenant vertes. L'Agent conclut (Chat) : "Super, on a fait le tour de tous les points importants \! Ça te semble bien complet comme ça ? Si tout est bon pour toi, je te prépare le récapitulatif final avant de lancer la recherche."

**Conclusion de l'Expérience Simplifiée :** L'utilisateur a bénéficié d'une expérience de clarification fluide et intuitive, centrée sur le dialogue avec l'agent. Le démarrage intégré, la proactivité de l'agent et les suggestions ont facilité la co-construction de la mission. Le Canvas a servi de support visuel dynamique, avec des **barres de marge colorées** et des **icônes spécifiques (comme `heroicon-light-bulb` pour les suggestions)** reflétant en temps réel les informations confirmées et les points en discussion. Ceci offre un sentiment constant de contrôle et de progression. L'ensemble donne l'impression d'une collaboration intelligente et efficace avec le système, où le Chat est le principal canal d'interaction.
