# Plan pour la modification du CSS et JavaScript du contrôle sur le manganèse

## Contexte
Le fichier HTML du contrôle sur le manganèse (`Controle_2nde_Chapitre2_Manganese_Moanda.html`) contient des références à des classes CSS et des fonctions JavaScript qui doivent être transférées dans le fichier CSS unique (`style.css`) pour une meilleure organisation du code.

## Objectifs
1. Examiner le CSS et le JavaScript utilisés dans le fichier HTML du contrôle sur le manganèse
2. Identifier les classes CSS spécifiques utilisées dans ce fichier
3. Vérifier si ces classes existent déjà dans le fichier CSS général
4. Préparer le plan pour l'ajout des nouvelles classes CSS dans le fichier style.css
5. Modifier le fichier HTML pour supprimer le CSS et le JavaScript internes
6. Ajouter les nouvelles classes CSS au fichier style.css
7. Vérifier que le fichier HTML modifié fonctionne correctement avec le CSS externe

## Détails des étapes

### 1. Examen du CSS et JavaScript dans le fichier HTML
Le fichier HTML actuel contient les références suivantes :
- CSS : `../../css/style.css` (fichier externe)
- CSS : Bootstrap via CDN
- JavaScript : `../../js/script.js` (fichier externe)
- JavaScript : Bootstrap via CDN

### 2. Classes CSS spécifiques utilisées dans le fichier
Les classes CSS spécifiques aux contrôles identifiées dans le fichier HTML sont :
- `controle-header`
- `controle-info`
- `controle-container`
- `controle-nav-tabs`
- `controle-tab-content`
- `controle-entete`
- `controle-details`
- `controle-section`
- `controle-sujet-texte`
- `controle-consigne`
- `controle-plan`
- `controle-grille-complete`
- `grille-evaluation`
- `total-grille`
- `controle-corrige`
- `corrige-redaction`
- `corrige-section`
- `corrige-conclusion`
- `controle-btn-retour`
- `controle-footer`
- `code-cd`
- `corrige-emphasis`
- `corrige-key-term`

### 3. Vérification des classes existantes dans le fichier CSS général
À faire : vérifier si ces classes existent déjà dans le fichier `style.css`

### 4. Plan pour l'ajout des nouvelles classes CSS
Si les classes n'existent pas déjà dans le fichier `style.css`, les ajouter avec les styles appropriés pour :
- La mise en forme de l'en-tête du contrôle
- La mise en forme des onglets de navigation
- La mise en forme du contenu du sujet
- La mise en forme de la grille d'évaluation
- La mise en forme du corrigé
- La mise en forme des éléments spécifiques comme les codes d'évaluation

### 5. Modification du fichier HTML
- Supprimer tout CSS interne (s'il y en a)
- Supprimer tout JavaScript interne (s'il y en a)
- Conserver uniquement les références aux fichiers externes

### 6. Ajout des nouvelles classes CSS au fichier style.css
- Ajouter les classes CSS identifiées avec leurs styles appropriés
- Organiser les classes de manière logique dans le fichier

### 7. Vérification du fonctionnement
- Ouvrir le fichier HTML modifié dans un navigateur
- Vérifier que tous les éléments s'affichent correctement
- Vérifier que les onglets fonctionnent correctement
- Vérifier que la grille d'évaluation s'affiche correctement
- Vérifier que le corrigé s'affiche correctement

## Fichiers à modifier
1. `SVT/Seconde/Controle_2nde_Chapitre2_Manganese_Moanda.html` - pour supprimer le CSS et JavaScript internes
2. `C:\Users\HP 360\Desktop\Educalim-main\css\style.css` - pour ajouter les nouvelles classes CSS

## Notes
- Le fichier HTML utilise déjà Bootstrap pour le style de base
- Le fichier HTML utilise déjà un fichier CSS externe (`../../css/style.css`)
- Le fichier HTML utilise déjà un fichier JavaScript externe (`../../js/script.js`)
- L'objectif est de s'assurer que toutes les classes CSS spécifiques aux contrôles sont bien définies dans le fichier CSS unique