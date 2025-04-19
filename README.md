# Traducteur Automatique en Écriture Inclusive 🌈✨

Bienvenue dans le projet **Traducteur Automatique en Écriture Inclusive** ! 🎉 Ce projet vise à promouvoir une communication plus équitable et représentative en automatisant la conversion de textes en écriture inclusive. Grâce à des dictionnaires de mots et leurs flexions (masculin/féminin, singulier/pluriel), notre outil facilite l'adoption de cette pratique linguistique essentielle.

## Pourquoi l'Écriture Inclusive ? 🤔

Lorsque nous parlons, nous discriminons sans nous en rendre compte. Dans une étude intitulée "Un ministre peut-il tomber enceinte ?", Markus Brauer fait l'expérience suivante : demander à des passants de citer des candidats potentiel pour être premier ministre. Puis, il recommence en demandant cette fois des noms de "candidats ou candidates" pour être "premier ou première ministre". Et là, 3 fois plus de femmes sont citées. Ce qui prouve que le langage a un impact sur la façon dont nous percevons les choses, dont nous nous représentons interieurement les situations décrites par le langage.

L'écriture inclusive vise à supprimer ce biai en rendant visible la présence des femmes et des personnes non-binaires dans le langage.
Elle se base sur :
- La féminisation des mots qui doivent l'être (ex : "la ministre" au lieu de "le ministre")
- L'utilisation du doublon (ex : "les étudiants et étudiantes" au lieu de "les étudiants")
- L'utilisation du point médian (ex : "les étudiant·e·s" au lieu de "les étudiants")

## Fonctionnalités 🛠️

- **Dictionnaires Intégrés** : Utilisation de dictionnaires pour gérer les flexions de genre et de nombre. 📚
- **Automatisation** : Conversion automatique d'une partie du texte en écriture inclusive. 🤖
- **Aide à la correction** : Pour certains mots, signale la possibilité de les rendre inclusifs et suggère la modification à l'utilisateur. ⚙️

## Comment ça Marche ? ⚙️

1. **Reconnaitre les mots** : On recherche chaque mot dans un dictionnaire, pour voir s'il existe et s'il à un feminin. 🔍
2. **Liens entre les mots** : Essayé de faire le lien entre un adjectif epithète et le nom commun associé. 📜
3. **Génération du Texte Inclusif** : Un texte en écriture inclusive est généré, et des modifications supplémentaires sont proposées à l'utilisateur. 📝

## Installation 💻

Pour utiliser le Traducteur Automatique en Écriture Inclusive, suivez ces étapes simples :

1. **Clonez le Dépôt** :
   ```bash
   git clone https://github.com/ValentinRegnault/traduiteninclusif.git
   ```

2. **Installez les Dépendances** :
   ```bash
   cd traduiteninclusif
   npm install
   ```

3. **Lancez l'Outil** :
   ```bash
   npm run dev # ouvrez votre navigateur à l'adresse http://localhost:5173 !
   ```

4. **Deployer** :
   ```bash
   npm run build
   npm run deploy
   ```

## Contribution 🤝

Les contributions pour améliorer et enrichir ce projet sont bienvenues ! Si vous souhaitez contribuer, voici comment procéder :

1. **Fork** le dépôt.
2. Créez une branche pour votre feature (`git checkout -b feature/nouvelle-feature`).
3. **Commit** vos modifications (`git commit -am 'Ajout d'une nouvelle feature'`).
4. **Push** vers la branche (`git push origin feature/nouvelle-feature`).
5. Ouvrez une **Pull Request**.

## Licence 📜

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Contact 📧

Pour toute question ou suggestion, n'hésitez pas à me contacter à [valentinregnault22@gmail.com](mailto:valentinregnault22@gmail.com).

---

Rejoignez-moi dans cette initiative pour rendre notre langage plus inclusif et représentatif ! 🌈✨