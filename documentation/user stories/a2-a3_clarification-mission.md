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
   * Un titre généré automatiquement : "**Mission : Organisation Voyage Lyon-Paris**" (Inter Bold, blanc \#FFFFFF, taille légèrement supérieure au reste).  
   * Une liste verticale structurée (sections espacées, pas de cartes). Chaque item de la liste possède une **icône de statut discrète à gauche de son titre** et un texte de statut coloré :  
     * 🟡 Objectif \- Statut : À préciser... (jaune \#FACC15)  
     * 🟡 Contraintes \- Statut : Partiellement défini (Budget ?, Dates ✓, Horaires ?)... (jaune \#FACC15) \- *(L'agent a noté 100€ mais va questionner)*  
     * ❔ Livrable Clé \- Statut : À définir... (gris \#A1A1AA)  
     * ❔ Critère de Succès Principal \- Statut : À définir... (gris \#A1A1AA)  
     * ✔️ Validateur \- Statut : Confirmé (Vous) (vert \#10B981)  
     * ❔ Contexte/Motivation \- Statut : À définir... (gris \#A1A1AA)  
       L'utilisateur voit immédiatement, grâce aux icônes et couleurs, ce qui est compris, en attente, ou déjà validé. La progression globale est perçue par le nombre d'icônes ✔️.  
4. Dialogue Naturel & Groupé : L'Agent Orchestrateur intervient dans le Chat (ton informel, indicateur "tape..." pendant la réflexion) : "Ok, ça marche pour le trip Lyon-Paris \! Deux petites précisions pour être sûr : le budget de 100€, c'est par tête ou pour tout le groupe ? Et pour le retour dimanche soir, 'pas avant 18h', ça te va ?"  
   Sur le Canvas, la section Contraintes pourrait avoir un léger "halo" ou une animation subtile sur son icône 🟡 pour indiquer qu'elle est en discussion active.  
5. Réponse Utilisateur & Confirmation Intelligente : Utilisateur (Chat) : "Ah yes, 100€ par personne (donc 400€ total). Et oui, départ après 18h c'est parfait."  
   Agent (Chat) : "Super clair \! Budget max 400€ et départ \>18h dimanche, c'est noté et validé."  
   Sur le Canvas, la section Contraintes se met à jour : l'icône passe à ✔️ (vert), le statut devient Confirmé (vert \#10B981), et le texte interne s'actualise ("Budget: 400€ total, Horaire Retour: \>18h").  
6. **Interaction via Chat pour Modification :** L'utilisateur relit et veut ajuster. Il tape dans le Chat : "En fait, on peut monter le budget à 450€ total."  
   * **Réaction Agent & Canvas :** L'icône de la section Contraintes sur le Canvas redevient 🟡 (jaune) et le statut texte change en Modification en cours... (orange \#F97316) pendant que l'agent traite la demande.  
   * **Feedback & Boucle Agent :** Dans le Chat, l'Agent réagit aussitôt : "Bien noté \! Budget mis à jour à 450€ max total." (Pas de question de confirmation si la modification est simple et cohérente).  
     Sur le Canvas, le texte s'actualise ("Budget: 450€ total"). Après un court instant, l'icône de Contraintes repasse à ✔️ (vert) et le statut à Confirmé (vert).  
7. **Suggestion Proactive & Clarification (Livrable) :** L'Agent enchaîne (Chat) : "Maintenant, qu'est-ce que tu attends comme résultat concret de ma part ? Souvent, pour ce genre de demande, un tableau comparatif des options est le plus utile. Ou préfères-tu une simple liste des options ?" Simultanément, sur le **Canvas**, la section Livrable Clé (avec son icône ❔) s'anime : le statut passe à En discussion... (bleu clair \#60A5FA) et le texte pourrait indiquer "Suggestion: Tableau comparatif ou Simple liste".  
8. **Réponse via Chat :** L'utilisateur répond dans le Chat : "Un tableau comparatif, ce sera parfait."  
   * **Réaction Canvas :** L'icône de la section Livrable Clé passe à ✔️ (vert) et le statut à Confirmé (vert \#10B981). Le contenu du Canvas reflète "Tableau Comparatif".  
   * **Feedback Chat :** L'Agent confirme dans le **Chat** : "Parfait pour le tableau comparatif détaillé \!"  
9. Clarification Intelligente (Critère Succès) : Agent (Chat) : "Ok. Et pour choisir la meilleure option dans ce tableau, qu'est-ce qui primera vraiment pour toi, vu le budget qu'on a fixé ? Le Prix le plus bas (même si le trajet est un peu plus long), ou un Temps de trajet minimal (quitte à payer un peu plus) ?"  
   Sur le Canvas, la section Critère de Succès Principal (avec son icône ❔) passe au statut En discussion... (bleu clair \#60A5FA) et pourrait afficher textuellement les options "Prix le plus bas" et "Temps de trajet minimal" comme étant en cours de discussion.  
10. **Réponse via Chat (encore) :** L'utilisateur répond dans le Chat : "Priorité au prix le plus bas."  
    * **Réaction Canvas & Chat :** Sur le Canvas, la sélection "Prix le plus bas" est affichée. L'icône de la section passe à ✔️ (vert) et le statut à Confirmé. L'Agent confirme dans le Chat : "Noté, priorité absolue au prix le plus bas parmi les options valides \!"  
11. **Dernier Point & Fin de Clarification :** L'Agent aborde le dernier point (Contexte/Motivation) de manière conversationnelle dans le Chat. Une fois confirmé par l'utilisateur dans le Chat, l'icône et le statut correspondants sur le Canvas passent au vert. Toutes les icônes sont maintenant ✔️. L'Agent conclut (Chat) : "Super, on a fait le tour de tous les points importants \! Ça te semble bien complet comme ça ? Si tout est bon pour toi, je te prépare le récapitulatif final avant de lancer la recherche."

**Conclusion de l'Expérience Simplifiée :** L'utilisateur a bénéficié d'une expérience de clarification fluide et intuitive, centrée sur le dialogue avec l'agent. Le démarrage intégré, la proactivité de l'agent dans le regroupement des questions et les suggestions, ainsi que le ton naturel ont facilité la co-construction de la mission. Le Canvas a servi de support visuel dynamique, reflétant en temps réel les informations confirmées et les points en discussion, offrant un sentiment constant de contrôle et de progression. L'ensemble donne l'impression d'une collaboration intelligente et efficace avec le système, où le Chat est le principal canal d'interaction.
