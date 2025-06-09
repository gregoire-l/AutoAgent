# Récapitulatif des Décisions de Design UI/UX pour le Canvas

Ce document résume les choix de design UI/UX pour l'interface du Canvas, visant une expérience utilisateur claire, élégante, intégrée et sobre. Il servira de référence pour le développement (notamment en React) et pour assurer la cohérence lors de l'extension des fonctionnalités.

## 1. Philosophie et Styles Globaux

*   **Police de Caractères :**
    *   **Manrope** sera utilisée pour l'ensemble de l'interface.
    *   **Graisses principales :**
        *   `700` (Bold) pour les titres très importants (ex: Titre principal de la mission).
        *   `600` (SemiBold) pour les titres de section et les titres de jalons confirmés.
        *   `500` (Medium) pour les labels importants, les titres de jalons non confirmés, et le texte des critères/contraintes confirmés.
        *   `400` (Regular) pour le corps du texte principal, les valeurs des contraintes.
        *   `300` (Light) pour les textes secondaires, les descriptions d'objectifs, et les items suggérés/non validés.
        *   `200` (ExtraLight) pour les détails des jalons confirmés (texte "Quand" et "Aspects à vérifier").
*   **Palette de Couleurs (Thème Sombre) :**
    *   Fond Principal (`body`) : `#171717` (Gris très foncé)
    *   Fond du Panel Canvas : `#262626` (Gris foncé)
    *   Texte Principal (confirmé, important) : `#F5F5F5` (Blanc presque pur), `#E5E5E5` (Blanc cassé)
    *   Texte Secondaire / Objectif : `#C0C0C0`, `#B0B0B0` (Gris clairs)
    *   Texte Discret / Suggéré / Non Actif : `#A3A3A3`, `#8A8A8A`, `#737373` (Gris moyens à foncés)
    *   **Couleurs d'Accentuation pour États :**
        *   Confirmé / Succès : `#2DD4BF` (Teal vibrant) - Utilisé pour les coches, indicateurs.
        *   En Discussion / Suggestion Agent : `#F59E0B` (Ambre/Jaune) - Utilisé pour les icônes ampoule, indicateurs.
        *   Neutre / Bordure Nœud Timeline : `#737373` (Gris moyen)
*   **Ombres Portées :** Utilisées avec parcimonie pour créer une hiérarchie subtile (ex: pour le panel principal). Très douces et diffuses.
*   **Arrondis (`border-radius`) :** Généreux pour un aspect moderne et doux (ex: `16px` pour le panel, `8px` à `12px` pour les éléments internes).
*   **Aération :** Espacements (`padding`, `margin`) significatifs pour éviter la surcharge et améliorer la lisibilité.

## 2. Structure Générale du Canvas

*   **Panel Principal :** Fond `#262626`, `border-radius: 16px`, `padding: 36px`. Ombre portée discrète.
*   **Titre Principal de la Mission :**
    *   Pas de préfixe "Mission:".
    *   Texte direct (ex: "Organisation Voyage Lyon-Paris").
    *   `font-size: 28px`, `font-weight: 700`, `color: #F5F5F5`.
    *   Marge inférieure importante (`16px`) avant le texte d'objectif.
*   **Texte d'Objectif :**
    *   Directement sous le titre principal, sans libellé "Objectif".
    *   `font-size: 17px`, `font-weight: 400` (ou `300` pour plus de légèreté), `color: #C0C0C0`.
    *   `line-height: 1.7`.
    *   Marge inférieure très importante (`40px`) avant la première section.

## 3. Structure des Sections (Contraintes, Critères, etc.)

*   **Titre de Section :**
    *   Ex: "CONTRAINTES", "CRITÈRES DE SUCCÈS".
    *   `font-size: 16px`, `font-weight: 600`, `color: #D4D4D4`, `text-transform: uppercase`, `letter-spacing: 0.02em`.
    *   Marge inférieure de `18px` à `24px`.
*   **Barre de Marge Latérale Principale (`.main-margin-bar-line`) :**
    *   Positionnée à gauche du titre de section (`left: -36px`).
    *   Fine (`width: 2.5px`), courte (`height: 18px`), `border-radius: 2.5px`.
    *   Couleur indiquant l'état global de la section (Confirmé: Teal, En Discussion: Ambre, Suggestion: Bleu, Non Abordé: Gris transparent).

## 4. Section "Contraintes"

*   **Format :** Liste verticale enrichie (`.constraints-list`).
*   **Chaque Item (`.constraint-item`) :**
    *   Structure : `[Icône] [Label (fixe 90px)] [Valeur (+ Tag si ambigu)] [Coche si confirmé]`
    *   `padding: 16px 0`, `border-bottom` très discrète.
    *   **Icône (`.constraint-icon-wrapper svg`) :** Heroicon outline, `20px`, `color: #737373` par défaut.
        *   Budget : Icône Euro.
        *   Trajet : Icône Flèches.
    *   **Label (`.constraint-label`) :** `font-size: 15px`, `font-weight: 500`, `color: #B0B0B0`, `width: 90px`.
    *   **Valeur (`.constraint-value`) :** `font-size: 15px`, `font-weight: 400`, `color: #E5E5E5`.
    *   **Tag Ambigu (`.constraint-tag`) :** Pour le budget. Fond `rgba(234, 179, 8, 0.15)`, texte `#F59E0B`.
    *   **Détails Secondaires (`.constraint-secondary-details`) :** Pour les horaires sous "Période". Indentés, `font-size: 13px`, `font-weight: 400`, `color: #737373`.
    *   **État "En Discussion" (`.is-in-discussion`) :** Fond de l'item très légèrement ambre (`rgba(234, 179, 8, 0.02)`), icône passe en couleur ambre.
    *   **État "Confirmé" (`.is-confirmed`) :** Coche Heroicon (simple check) apparaît à droite, `color: #10B981`.

## 5. Section "Critères de Succès"

*   **Format :** Liste verticale (`.criteria-list`), triée par priorité (P0 > P1 > P2 > P3).
*   **Chaque Item (`.criteria-item`) :**
    *   Structure : `[Badge Priorité] [Icône Suggestion (si applicable)] [Texte du Critère] [Coche si confirmé]`
    *   `padding: 12px 0`, `border-bottom` très discrète.
    *   **Badge de Priorité (`.priority-badge-letter`) :**
        *   Circulaire (`width/height: 22px`), fond coloré, lettre blanche `font-weight: 700`, `font-size: 11px`.
        *   `I` (Impératif / P0) : Fond `#C53030` (Rouge foncé).
        *   `E` (Essentiel / P1) : Fond `#DD6B20` (Orange foncé).
        *   `A` (Appréciable / P2) : Fond `#2B6CB0` (Bleu foncé).
        *   `O` (Optionnel / P3) : Fond `#4A5568` (Gris foncé).
    *   **Icône Suggestion (`.suggestion-indicator-icon`) :** Heroicon "light-bulb-outline", `20px`, `color: #F59E0B`. Apparaît avant le badge de priorité si le critère est une suggestion.
    *   **Texte du Critère (`.criteria-item-text`) :**
        *   Suggéré (`.is-suggested`) : `font-weight: 300`, `color: #A3A3A3`. Le badge de priorité est à `opacity: 0.7`.
        *   Confirmé (`.is-confirmed`) : `font-weight: 500`, `color: #E5E5E5`. Si priorité `I`, `font-weight: 600`. L'icône suggestion disparaît, le badge de priorité est à `opacity: 1`.
    *   **Coche de Confirmation (`.criteria-item-status-icon`) :** Heroicon "check-outline" (simple coche), `16px`, `color: #2DD4BF` (Teal), `opacity: 0.7`. Apparaît à droite pour les items confirmés.

## 6. Section "Livrable Clé"

*   **Format :** "Capsule" unique (`.suggestion-capsule-in-list`) pour présenter les options.
*   **Header de Capsule :** Icône Heroicon "document-text" + Titre "Format du Résultat".
*   **Texte d'Invite :** "Quel format préférez-vous ?"
*   **Boutons d'Option (`.suggestion-option-capsule`) :**
    *   Style par défaut : Fond très léger, texte gris, pas de bordure.
    *   Hover : Fond bleu léger, texte bleu clair, bordure bleue légère.
    *   Selected : Fond bleu principal, texte blanc, `font-weight: 600`.

## 7. Section "Jalons de Revue"

*   **Format :** Timeline Horizontale (`.review-timeline-horizontal`).
*   **Track de Timeline (`.timeline-track-container`) :**
    *   Labels "Début" et "Fin" (`color: #737373`).
    *   Ligne horizontale (`background-color: rgba(255,255,255,0.1)`).
*   **Nœuds de Timeline (`.timeline-node`) :**
    *   Circulaires (`width/height: 28px`), positionnés sur la ligne en pourcentage.
    *   Style : Fond couleur panel (`#262626`), bordure `1.5px solid #737373`, chiffre intérieur `color: #737373`.
    *   `box-shadow: 0 0 0 3px #262626` pour effet de découpe.
*   **Légende (`.milestone-legend`) :**
    *   Chaque item (`.milestone-legend-item`) est un accordéon.
    *   **Header d'Item (`.milestone-header`) :** Cliquable pour l'accordéon.
        *   Numéro de rappel (`.milestone-legend-number`) : `color: #737373`.
        *   Icône d'État (`.milestone-state-icon-wrapper`) : À gauche du titre. Heroicon "light-bulb-outline" (Ambre) pour `.is-suggested`, Heroicon "check-outline" (Teal) pour `.is-confirmed`.
        *   Titre du Jalon (`.milestone-title`) : Style typographique changeant avec état (`is-suggested`: light/gris; `is-confirmed`: normal/blanc).
        *   Icône Chevron (`.accordion-icon`) à droite.
    *   **Information "Quand" (`.milestone-when-info-visible`) :**
        *   Visible sous le header, avant l'accordéon.
        *   Icône Heroicon "calendar-days-outline" discrète.
        *   Texte `font-size: 12px`, `font-style: italic`, `color: #8A8A8A`.
    *   **Contenu de l'Accordéon (`.accordion-content`) :**
        *   Liste des "Aspects à vérifier" (`.milestone-checkpoints`) avec puces `•`.
    *   **Style des Détails pour Jalons Confirmés (`.is-confirmed`) :**
        *   Texte du "Quand" et des "Aspects à vérifier" : `color: #E0E0E0`, `font-weight: 300` (Manrope Light).

## 8. Principes d'Interaction Généraux

*   **Accordéon :**
    *   Transition fluide pour `max-height` et `opacity`.
    *   Icône chevron qui tourne.
    *   Zone cliquable claire (tout l'en-tête du jalon/item).
*   **États Visuels (Suggéré/Confirmé/En Discussion) :**
    *   Utilisation cohérente de la typographie (graisse, couleur) et d'icônes discrètes.
    *   Couleurs d'accentuation (Ambre, Teal) utilisées avec parcimonie pour ne pas surcharger.

Ce document devrait fournir une base solide pour le développement et les futures évolutions.