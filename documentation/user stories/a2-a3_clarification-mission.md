## **Récit Utilisateur a2-a3: Clarification de la mission 

**Contexte Initial :** L'utilisateur lance AutoAgent. L'interface s'ouvre sur un espace épuré au thème sombre. L'élément central est un **champ de saisie multiligne accueillant**, occupant une place prépondérante, invitant à l'action : "**Salut \! Prêt(e) à démarrer une mission ? Dis-moi tout...**" (Police Inter, taille confortable, couleur \#D4D4D8).

**(Phase A1 : Démarrage Intégré)**

1. **Saisie Initiale :** L'utilisateur tape sa demande directement :"Hello, j'aurais besoin d'organiser un A/R Lyon-Paris pour 4 potes. On a un budget de 100€ max. Faut qu'on soit à Paris le vendredi 4 avril avant 20h et qu'on reparte le dimanche soir."  
2. **Envoi et Transition Fluide :** L'utilisateur appuie sur Entrée. Une **animation rapide et élégante** se produit :  
   * Le champ de saisie **glisse vers la gauche et se redimensionne** pour devenir l'input standard du panneau **Chat** qui se matérialise (\~40% de l'écran).  
   * La demande initiale de l'utilisateur apparaît comme premier message dans ce Chat (bulle droite, bleue \#3B82F6).  
   * Simultanément, le panneau **Canvas** se dévoile sur la droite (\~60%), déjà enrichi par l'analyse instantanée de l'agent.

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
6. **Interaction Directe sur le Canvas (Modification Ultra-Fluide) :** L'utilisateur relit et veut ajuster. Il **clique directement sur le texte '400€ total'** sur le Canvas.  
   * **Réaction UI :** Le texte devient un champ d'édition minimaliste in-situ. L'icône de la section Contraintes redevient 🟡 (jaune) et le statut texte change en Modification en cours... (orange \#F97316).  
   * **Action Utilisateur :** Il tape "450" et appuie sur Entrée.  
   * Feedback & Boucle Agent : Le champ redevient du texte normal ("Budget: 450€ total"). Le statut reste Modification en cours... (orange). Dans le Chat, l'Agent réagit aussitôt : "Bien noté \! Budget mis à jour à 450€ max total sur le Canvas." (Pas de question de confirmation si la modification est simple et cohérente. L'agent ne demandera que s'il y a une incohérence majeure avec d'autres points déjà validés.)  
     Sur le Canvas, après un court instant (simulant la prise en compte par l'agent), si la modification est acceptée sans question, l'icône de Contraintes repasse à ✔️ (vert) et le statut à Confirmé (vert).  
7. **Suggestion Proactive & Clarification Visuelle (Livrable) :** L'Agent enchaîne (Chat) : "Maintenant, qu'est-ce que tu attends comme résultat concret de ma part ? Souvent, pour ce genre de demande, un tableau comparatif des options est le plus utile." Simultanément, sur le **Canvas**, la section Livrable Clé (avec son icône ❔) s'anime : le statut passe à Suggestion en attente... (bleu clair \#60A5FA) et **deux boutons cliquables au design épuré apparaissent** sous le titre : \[ Tableau Comparatif \] \[ Simple Liste des Options \].  
8. **Réponse via Canvas :** L'utilisateur **clique sur le bouton \[ Tableau Comparatif \]** sur le Canvas.  
   * **Réaction UI :** Le bouton cliqué a un feedback visuel (ex: devient plein, les autres s'estompent ou disparaissent). L'icône de la section Livrable Clé passe à ✔️ (vert) et le statut à Confirmé (vert \#10B981).  
   * **Feedback Chat :** L'Agent confirme dans le **Chat** : "Parfait pour le tableau comparatif détaillé \!"  
9. Clarification Intelligente (Critère Succès) : Agent (Chat) : "Ok. Et pour choisir la meilleure option dans ce tableau, qu'est-ce qui primera vraiment pour toi, vu le budget qu'on a fixé ? Le Prix le plus bas (même si le trajet est un peu plus long), ou un Temps de trajet minimal (quitte à payer un peu plus) ?"  
   Sur le Canvas, la section Critère de Succès Principal (avec son icône ❔) affiche ces deux options comme des choix radio au design minimaliste cliquables : ( ) Prix le plus bas ( ) Temps de trajet minimal.  
10. **Réponse via Canvas (encore) :** L'utilisateur clique sur ( ) Prix le plus bas sur le Canvas.  
    * **Réaction UI & Chat :** La sélection est visible sur le Canvas (le radio coché). L'icône de la section passe à ✔️ (vert) et le statut à Confirmé. L'Agent confirme dans le Chat : "Noté, priorité absolue au prix le plus bas parmi les options valides \!"  
11. **Dernier Point & Fin de Clarification :** L'Agent aborde le dernier point (Contexte/Motivation) de manière conversationnelle. Une fois confirmé, l'icône et le statut correspondants sur le Canvas passent au vert. Toutes les icônes sont maintenant ✔️. L'Agent conclut (Chat) : "Super, on a fait le tour de tous les points importants \! Ça te semble bien complet comme ça ? Si tout est bon pour toi, je te prépare le récapitulatif final avant de lancer la recherche."

**Conclusion de l'Expérience Ambitieuse (V4.1) :** L'utilisateur a bénéficié d'une expérience de clarification exceptionnellement fluide et intuitive. Le démarrage intégré, la proactivité de l'agent dans le regroupement des questions et les suggestions, le ton naturel, et surtout la capacité à interagir directement avec le Canvas pour modifier des informations ou répondre à des choix ont minimisé la friction. Les indicateurs visuels clairs sur le Canvas ont fourni un sentiment constant de contrôle et de progression sans nécessiter un compteur textuel. L'ensemble donne l'impression d'une véritable collaboration intelligente avec le système.