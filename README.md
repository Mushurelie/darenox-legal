# Pages légales — à publier dans un dépôt public

Google Play exige **deux URL publiques**, accessibles sans installer
l'application et sans compte :

| Champ Play Console | Page |
| --- | --- |
| Politique de confidentialité | `privacy.html` |
| Suppression du compte (Data safety) | `delete-account.html` |

Le dépôt `Darenox` est privé, et GitHub Pages n'est pas disponible sur un dépôt
privé en plan gratuit. Ces pages vivent donc dans un **second dépôt, public,
qui ne contient qu'elles** — aucun code source, aucun schéma SQL, aucun
historique de développement.

## Les fichiers

| Fichier | Rôle |
| --- | --- |
| `index.html` | Sommaire des deux documents |
| `privacy.html` | Politique de confidentialité |
| `delete-account.html` | Demande de suppression de compte |
| `_style.css` | Toute la mise en forme |
| `_app.js` | Thème, sommaire actif, barre de progression |

Les couleurs, la police et les rayons viennent de `src/lib/theme.ts` : ces pages
sont un prolongement de l'application, pas une annexe administrative. Une
couleur ajoutée ici sans exister là-bas est une dérive à corriger.

`_app.js` n'est qu'une amélioration progressive. Sans JavaScript, la page reste
entièrement lisible, le sommaire fonctionne — ce sont des ancres — et le thème
suit celui du système. Un document légal doit rester consultable quand tout le
reste échoue.

### Prévisualiser avant de publier

Ouvrir `index.html` directement dans un navigateur suffit. Pour être au plus
près du rendu final :

```bash
cd legal && python -m http.server 8080
```

puis <http://localhost:8080>. Penser à vérifier les deux thèmes (le bouton en
haut à droite), le rendu sur une largeur de téléphone, et l'aperçu avant
impression — la feuille de style bascule en noir sur blanc pour le papier.

## Publier

Une seule fois, depuis la racine du projet :

```bash
gh repo create darenox-legal --public \
  --description "Pages légales de l'application Darenox"

cd legal
git init -b main
git add .
git commit -m "Politique de confidentialité et suppression de compte"
git remote add origin https://github.com/Mushurelie/darenox-legal.git
git push -u origin main
```

Puis, dans les réglages du nouveau dépôt : **Settings → Pages → Source :
Deploy from a branch → `main` / `(root)`**. La mise en ligne prend une à deux
minutes.

Les URL deviennent :

```
https://mushurelie.github.io/darenox-legal/privacy.html
https://mushurelie.github.io/darenox-legal/delete-account.html
```

## Mettre à jour

Les fichiers de référence restent ceux de ce dossier, versionnés avec le code
qu'ils décrivent — c'est ce qui évite qu'ils dérivent de la réalité de
l'application. Après modification :

```bash
cd legal && git add . && git commit -m "Mise à jour" && git push
```

> Le dossier `legal/` du dépôt principal et le dépôt public sont deux dépôts
> git distincts qui partagent les mêmes fichiers. Modifiez toujours ici, puis
> poussez ; l'inverse ferait diverger les deux copies sans que rien ne le
> signale.

## Si le contenu de l'application change

Ces pages décrivent des traitements réels. Une nouvelle donnée collectée, un
nouveau prestataire, une durée de conservation modifiée : chacun de ces
changements doit être répercuté ici **avant** la mise en ligne de la version
concernée. Une politique de confidentialité inexacte est une infraction, pas
une imprécision.
