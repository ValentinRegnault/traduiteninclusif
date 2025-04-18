import nomsDicoUrl from "/public/noms_flexions.csv?url";
import participesDicoUrl from "/public/participes.csv?url";
import adjectifsDicoUrl from "/public/adjectifs_flexions.csv?url"

// ---- TYPES ----

type Flexions = {
    masculinSingulier: string,
    masculinPluriel: string,
    femininSingulier: string,
    femininsPluriels: string
};

export type Dictionnaire = {
    masculinSingulierVersFlexion: { [key: string]: Flexions },
    masculinPlurielVersMasculinSingulier: { [key: string]: string },
    formePointMedianExeption: { [key: string]: string } | undefined
}

export class Mot {
    constructor(public texteConcret: string) { }
}
export abstract class MotReconnu extends Mot {
    constructor(
        public texteConcret: string,
        public strategieDetectee: StrategieInclusif | "PAS ENCORE DEFINIE",
        public strategieChoisieParUtilisateur: StrategieInclusif | null,
        public flexions: Flexions,
        public accords: "SINGULIER" | "PLURIEL",
        public exception: string | undefined
    ) {
        super(texteConcret);
    }
}

export class Adjectif extends MotReconnu {
    constructor(
        public texteConcret: string,
        public strategieDetectee: StrategieInclusif | "PAS ENCORE DEFINIE",
        public strategieChoisieParUtilisateur: StrategieInclusif | null,
        public flexions: Flexions,
        public accords: "SINGULIER" | "PLURIEL",
        public exception: string | undefined,
        public relatifAuNom: Nom | "PAS ENCORE DEFINI" | null
    ) {
        super(
            texteConcret,
            strategieDetectee,
            strategieChoisieParUtilisateur,
            flexions,
            accords,
            exception
        )
    }
}

export class AdjectifOuNom extends MotReconnu {
    constructor(
        public texteConcret: string,
        public strategieDetectee: StrategieInclusif | "PAS ENCORE DEFINIE",
        public strategieChoisieParUtilisateur: StrategieInclusif | null,
        public flexions: Flexions,
        public accords: "SINGULIER" | "PLURIEL",
        public exception: string | undefined,
    ) {
        super(
            texteConcret,
            strategieDetectee,
            strategieChoisieParUtilisateur,
            flexions,
            accords,
            exception
        )
    }
}

export class Participe extends MotReconnu {
    constructor(
        public texteConcret: string,
        public strategieDetectee: StrategieInclusif | "PAS ENCORE DEFINIE",
        public strategieChoisieParUtilisateur: StrategieInclusif | null,
        public flexions: Flexions,
        public accords: "SINGULIER" | "PLURIEL",
        public exception: string | undefined,
    ) {
        super(
            texteConcret,
            strategieDetectee,
            strategieChoisieParUtilisateur,
            flexions,
            accords,
            exception
        )
    }
}

export class Nom extends MotReconnu {
    constructor(
        public texteConcret: string,
        public strategieDetectee: StrategieInclusif | "PAS ENCORE DEFINIE",
        public strategieChoisieParUtilisateur: StrategieInclusif | null,
        public flexions: Flexions,
        public accords: "SINGULIER" | "PLURIEL",
        public exception: string | undefined,
    ) {
        super(
            texteConcret,
            strategieDetectee,
            strategieChoisieParUtilisateur,
            flexions,
            accords,
            exception
        )
    }
}

export class Determinant extends MotReconnu {
    constructor(
        public texteConcret: string,
        public strategieDetectee: StrategieInclusif | "PAS ENCORE DEFINIE",
        public strategieChoisieParUtilisateur: StrategieInclusif | null,
        public flexions: Flexions,
        public accords: "SINGULIER" | "PLURIEL",
        public exception: string | undefined,
        public relatifAuNom: Nom | "PAS ENCORE DEFINI" | null
    ) {
        super(
            texteConcret,
            strategieDetectee,
            strategieChoisieParUtilisateur,
            flexions,
            accords,
            exception
        )
    }
}



export type TexteAbstrait = Mot[];
export type ActionUtilisateur = "INSERER_TEXTE" | "ENLEVER_TEXTE"

export type PartieIdentique = Mot[]
export type PartieInseree = Mot[]
export type Correspondances = [PartieIdentique, PartieInseree, PartieIdentique]

export type StrategieInclusif = "DOUBLON" | "POINT MÉDIAN" | "DEMANDER" | "AUCUNE"
export class OptionsTexteAbstrait {
    constructor(
        public strategieNomMasculinSingulier: StrategieInclusif = "DEMANDER",
        public strategieNomMasculinPluriels: StrategieInclusif = "DOUBLON",
        public strategieParticipesMasculinSingulier: StrategieInclusif = "DEMANDER",
        public strategieParticipesMasculinPluriel: StrategieInclusif = "DEMANDER",
        public strategieAdjectifsMasculinSingulierEpithète: StrategieInclusif = "POINT MÉDIAN",
        public strategieAdjectifsMasculinPlurielsEpithète: StrategieInclusif = "POINT MÉDIAN",
        public strategieAdjectifsMasculinSingulierAutre: StrategieInclusif = "DEMANDER",
        public strategieAdjectifsMasculinPlurielsAutre: StrategieInclusif = "DEMANDER",
        public strategieDeterminantsMasculinSingulier: StrategieInclusif = "DEMANDER",
        public strategieDeterminantsMasculinPluriels: StrategieInclusif = "POINT MÉDIAN",
        public strategieIndetermineEntreAdjectifEtNom: StrategieInclusif = "DEMANDER"
    ) { }
}

// ---- VARIABLE GLOBALES ----
let noms: Dictionnaire;
let adjectifs: Dictionnaire;
let participes: Dictionnaire;
const determinants: Dictionnaire = {
    masculinSingulierVersFlexion: {
        "il": { masculinSingulier: "il", masculinPluriel: "ils", femininSingulier: "elle", femininsPluriels: "elles" },
        "un": { masculinSingulier: "un", masculinPluriel: "", femininSingulier: "une", femininsPluriels: "" },
        "le": { masculinSingulier: "le", masculinPluriel: "", femininSingulier: "la", femininsPluriels: "" }
    },
    masculinPlurielVersMasculinSingulier: {
        "ils": "il"
    },
    formePointMedianExeption: {
        "il": "iel",
        "ils": "iels",
        "le": "la⋅le"
    }
}

// ---- FONCTIONS PUBLIQUES ----

export async function initDictionnaires() {
    function parseDico(csv: string) {
        return csv
            .split("\n") // sépare le fichier en lignes
            .map((line) =>
                line.split(",")
                    .map(flexion => flexion.trim()) // trim les flexions
            ) // séparent chaque ligne en flexion
            // Créer un dictionaire, avec deux indexations : masculin singulier vers flexions, et masculin pluriel vers masculin singulier
            .reduce(
                (dict, line: string[]) => {
                    dict.masculinSingulierVersFlexion[line[0]] = {
                        masculinSingulier: line[0],
                        masculinPluriel: line[1],
                        femininSingulier: line[2],
                        femininsPluriels: line[3]
                    };

                    if (line[1])
                        dict.masculinPlurielVersMasculinSingulier[line[1]] = line[0];
                    return dict;
                },
                {
                    masculinSingulierVersFlexion: {},
                    masculinPlurielVersMasculinSingulier: {},
                } as Dictionnaire,
            )
    }

    noms = await fetch(nomsDicoUrl)
        .then((resp) => resp.text())
        .then(parseDico);

    participes = await fetch(participesDicoUrl)
        .then((resp) => resp.text())
        .then(parseDico)

    adjectifs = await fetch(adjectifsDicoUrl)
        .then((resp) => resp.text())
        .then(parseDico)
}

/**
 * Retourne la version mise à jour d'ancienTexteAbstrait avec les modifications faites dans nouveauTexte, en gardant les
 * choix de genrage inclusif faits dans ancienTexteAbstrait. Pour les nouveau mots, il donne les genrages par défault de
 * creerTexteAbstrait
 * 
 * @param chaineCourante 
 * @param representationPrecedente 
 */
export async function actualiserTexteAbstrait(
    ancienTexteAbstrait: TexteAbstrait,
    nouveauTexte: string,
    options: OptionsTexteAbstrait = new OptionsTexteAbstrait()
): Promise<TexteAbstrait> {
    const nouveauTexteAbstrait = await creerTexteAbstrait(nouveauTexte, options);
    const correspondance = faireCorrespondreTextesAbstraits(ancienTexteAbstrait, nouveauTexteAbstrait);

    let fusion = correspondance[0].concat(correspondance[1]).concat(correspondance[2]);


    return fusion
}

/**
* Creer une representation abstraite du texte, sous forme de liste de Mot et de MotGenre.
* Détermine des valeurs par défault sur s'il faudra genré inclusivement ou non, de la manière 
* suivante :
* 
* - Les masculins singuliers ont un genrage inclusif inconnu.
* - les masculins pluriels sont par défault rendu inclusifs 
* @param texte 
* @param options les stratégies par défault à adopter pour rendre les mots inclusifs
* @returns une tableau de tokens (sequence de tokens)
*/
export function creerTexteAbstrait(texte: string, options: OptionsTexteAbstrait): TexteAbstrait {
    let tab = texte
        .split(/( )|(\n)|(\.)|(\!)|(\!)|(')|(,)|(;)|(-)/)
        .filter(part => part !== undefined && part !== "")

    let premierPassage: TexteAbstrait = []

    // Premier passage : on essaye de faire collapser les AdjectifsOuNom à soit Adjectif soit Nom
    for (let i = 0; i < tab.length; i++) {
        let mot = tab[i];
        let motReconnu = reconnaitreMot(mot)

        if (motReconnu instanceof AdjectifOuNom) {
            let motSuivant = tab[i + 2] ? reconnaitreMot(tab[i + 2]) : null;
            let motPrecedent = i - 2 >= 0 ? reconnaitreMot(tab[i - 2]) : null;

            // On essaye de savoir si c'est un adjectif ou un nom
            // Si il est collé à un adjectif, alors c'est un nom, et reciproquement
            if (motSuivant instanceof Adjectif || motPrecedent instanceof Adjectif || motPrecedent instanceof Determinant) {
                // C'est un nom
                premierPassage[i] = new Nom(
                    motReconnu.texteConcret,
                    motReconnu.accords == "PLURIEL"
                        ? options.strategieNomMasculinPluriels
                        : options.strategieNomMasculinSingulier,
                    null,
                    motReconnu.flexions,
                    motReconnu.accords,
                    motReconnu.exception
                )
            }
            else if (motSuivant instanceof Nom) {
                // C'est un adjectif epithète du nom suivant
                premierPassage[i] = new Adjectif(
                    motReconnu.texteConcret,
                    aUnFeminin(motSuivant) ?
                        motReconnu.accords == "PLURIEL"
                            ? options.strategieAdjectifsMasculinPlurielsEpithète
                            : options.strategieAdjectifsMasculinSingulierEpithète
                        : 'AUCUNE',
                    null,
                    motReconnu.flexions,
                    motReconnu.accords,
                    motReconnu.exception,
                    motSuivant
                );
            }
            else if (motPrecedent instanceof Nom) {
                // C'est un adjectif epithète du nom précédent
                premierPassage[i] = new Adjectif(
                    motReconnu.texteConcret,
                    aUnFeminin(motPrecedent) ?
                        motReconnu.accords == "PLURIEL"
                            ? options.strategieAdjectifsMasculinPlurielsEpithète
                            : options.strategieAdjectifsMasculinSingulierEpithète
                        : 'AUCUNE',
                    null,
                    motReconnu.flexions,
                    motReconnu.accords,
                    motReconnu.exception,
                    motPrecedent
                );
            }
            else {
                // On sait pas si c'est un adjectif ou un nom
                premierPassage[i] = new AdjectifOuNom(
                    motReconnu.texteConcret,
                    options.strategieIndetermineEntreAdjectifEtNom,
                    null,
                    motReconnu.flexions,
                    motReconnu.accords,
                    motReconnu.exception
                );
            }
        }
        else {
            premierPassage[i] = motReconnu ?? new Mot(mot)
        }
    }

    let result: TexteAbstrait = []


    for (let i = 0; i < premierPassage.length; i++) {
        let mot = premierPassage[i];

        if (mot instanceof Determinant) {
            let motSuivant = premierPassage[i + 2];
            let epitheteDe = motSuivant instanceof Nom && aUnFeminin(motSuivant)
                ? motSuivant
                : null;

            result[i] = new Determinant(
                mot.texteConcret,
                epitheteDe != null ?
                    mot.accords == "PLURIEL"
                        ? options.strategieDeterminantsMasculinPluriels
                        : options.strategieDeterminantsMasculinSingulier
                    : "AUCUNE",
                null,
                mot.flexions,
                mot.accords,
                mot.exception,
                epitheteDe
            );
        }
        else if (mot instanceof Adjectif) {
            let motSuivant = premierPassage[i + 2];
            let motPrecedent = i - 2 >= 0 ? premierPassage[i - 2] : null;

            let epitheteDe = motPrecedent instanceof Nom
                ? motPrecedent
                : motSuivant instanceof Nom
                    ? motSuivant
                    : null;


            let strategie: StrategieInclusif;
            if (epitheteDe != null) {
                if (aUnFeminin(epitheteDe)) {
                    if (mot.accords == "PLURIEL") {
                        strategie = options.strategieAdjectifsMasculinPlurielsEpithète;
                    }
                    else {
                        strategie = options.strategieAdjectifsMasculinSingulierEpithète
                    }
                }
                else {
                    strategie = "AUCUNE"
                }
            }
            else {
                if (mot.accords == "PLURIEL") {
                    strategie = options.strategieAdjectifsMasculinPlurielsAutre;
                }
                else {
                    strategie = options.strategieAdjectifsMasculinSingulierAutre;
                }
            }


            result[i] = new Adjectif(
                mot.texteConcret,
                strategie,
                null,
                mot.flexions,
                mot.accords,
                mot.exception,
                epitheteDe
            );
        }
        else if (mot instanceof Nom) {
            result[i] = new Nom(
                mot.texteConcret,
                mot.accords == "PLURIEL"
                    ? options.strategieNomMasculinPluriels
                    : options.strategieNomMasculinSingulier,
                null,
                mot.flexions,
                mot.accords,
                mot.exception
            )
        }
        else if (mot instanceof Participe) {
            result[i] = new Participe(
                mot.texteConcret,
                mot.accords == "PLURIEL"
                    ? options.strategieParticipesMasculinPluriel
                    : options.strategieParticipesMasculinSingulier,
                null,
                mot.flexions,
                mot.accords,
                mot.exception
            );
        }
        else {
            result[i] = mot
        }
    }


    return result;
}

export function enInclusifDoublon(texteConcret: string): [string, string | null] {
    const mot = reconnaitreMot(texteConcret.toLowerCase());
    if (!mot) throw "enInclusifDoublon - Mot introuvable dans les dictionnaire";

    if (mot.accords === "PLURIEL") {
        if (mot.flexions.masculinSingulier == mot.flexions.femininSingulier || mot.flexions.masculinPluriel == mot.flexions.femininsPluriels)
            return [texteConcret, null]

        if (mot.flexions.femininSingulier == "" && mot.flexions.femininsPluriels == "")
            return [texteConcret, null]

        return [
            texteConcret,
            " et " + mot.flexions.femininsPluriels
        ]
    } else {
        if (texteConcret == mot.flexions.femininSingulier)
            return [texteConcret, null]

        if (mot.flexions.femininSingulier == "" && mot.flexions.femininsPluriels == "")
            return [texteConcret, null]

        return [
            texteConcret,
            " et " + mot.flexions.femininSingulier
        ]
    }
}

/**
* Identifie si le mot est un masculin singulier ou un masculin pluriel, et va chercher le féminin singulier et le féminin
* pluriel dans les dictionnaires nomsEtAdjectifsDico et participesDico. Utilise ces flexions pour retourner le mot et 
* la forme inclusive de ce mot, avec un point médian.
* 
* Examples :
* > enInclusifPointMedian("étudiant") -> ["étudiant", "⋅e"]
* > enInclusifPointMedian("étudiants") -> ["étudiants", "⋅e⋅s"]
* > enInclusifPointMedian("usager") -> ["usager", "⋅ère"]
* > enInclusifPointMedian("usager") -> ["usager", "⋅ère⋅s"]
* > enInclusifPointMedian("allé") -> ["allé", "⋅e"]
* > enInclusifPointMedian("allés") -> ["allé", "⋅e⋅s"]
* 
* @param texteConcret le mot à rendre inclusif
*/
export function enInclusifPointMedian(texteConcret: string): [string, string | null] {
    const mot = reconnaitreMot(texteConcret.toLowerCase());
    if (!mot) throw "enInclusifPointMedian - Mot introuvable dans les dictionnaire";

    if (mot.exception) return ["", mot.exception!]



    let formesInclusives = formesPointMedian(
        mot.flexions.masculinSingulier,
        mot.flexions.masculinPluriel,
        mot.flexions.femininSingulier,
        mot.flexions.femininsPluriels
    );

    return [
        mot.flexions.masculinSingulier,
        mot.accords == "SINGULIER" ?
            formesInclusives?.inclusifSingulier ?? null
            : formesInclusives?.inclusifPluriel ?? null
    ]
}

export function aUnFeminin(mot: Mot): boolean {
    if (!(mot instanceof MotReconnu)) return false;

    if (mot.exception) return true;


    return (
        (mot.flexions.femininSingulier != "" || mot.flexions.femininsPluriels != "")
        && mot.flexions.femininSingulier != mot.flexions.masculinSingulier
    )
}


export function texteAbstraitVersTexteConcret(texteAbstrait: TexteAbstrait): string {
    let texte = ""
    for (let i = 0; i < texteAbstrait.length; i++) {
        if (texteAbstrait[i] instanceof MotReconnu) {
            if ((texteAbstrait[i] as MotReconnu).strategieDetectee == "DOUBLON") {
                let doublon = enInclusifDoublon(texteAbstrait[i].texteConcret.toLowerCase())
                if (doublon[1] != null) {
                    texte += doublon[0] + doublon[1]
                    continue
                }
            }
            else if ((texteAbstrait[i] as MotReconnu).strategieDetectee == "POINT MÉDIAN") {
                let median = enInclusifPointMedian(texteAbstrait[i].texteConcret.toLowerCase())
                if (median[1] != null) {
                    texte += median[0] + median[1]
                    continue
                }
            }
        }

        texte += texteAbstrait[i].texteConcret
    }

    return texte
}

// ---- FONCTIONS PRIVÉES ----

function reconnaitreMot(mot: string): MotReconnu | undefined {
    let motLow = mot.toLowerCase()
    if (motLow in determinants.masculinPlurielVersMasculinSingulier) {
        const masculinSingulier = determinants.masculinPlurielVersMasculinSingulier[motLow]
        let flexions = determinants.masculinSingulierVersFlexion[masculinSingulier];

        if (masculinSingulier == "") return undefined

        return new Determinant(
            mot,
            "PAS ENCORE DEFINIE",
            null,
            flexions,
            "PLURIEL",
            (determinants.formePointMedianExeption ?? {})[masculinSingulier] ?? undefined,
            "PAS ENCORE DEFINI",
        );
    } else if (motLow in determinants.masculinSingulierVersFlexion) {
        let flexions = determinants.masculinSingulierVersFlexion[motLow];

        return new Determinant(
            mot,
            "PAS ENCORE DEFINIE",
            null,
            flexions,
            "SINGULIER",
            (determinants.formePointMedianExeption ?? {})[flexions.masculinSingulier] ?? undefined,
            "PAS ENCORE DEFINI",
        );
    }
    else if (motLow in noms.masculinPlurielVersMasculinSingulier) {
        const masculinSingulier = noms.masculinPlurielVersMasculinSingulier[motLow]
        let flexions = noms.masculinSingulierVersFlexion[masculinSingulier]

        if (masculinSingulier == "") return undefined

        if (motLow in adjectifs.masculinPlurielVersMasculinSingulier) return new AdjectifOuNom(
            mot,
            "PAS ENCORE DEFINIE",
            null,
            flexions,
            "PLURIEL",
            undefined,
        );

        return new Nom(
            mot,
            "PAS ENCORE DEFINIE",
            null,
            flexions,
            "PLURIEL",
            (noms.formePointMedianExeption ?? {})[flexions.masculinSingulier] ?? undefined,
        );
    }
    else if (motLow in noms.masculinSingulierVersFlexion) {
        let flexions = noms.masculinSingulierVersFlexion[motLow];

        if (motLow in adjectifs.masculinSingulierVersFlexion) return new AdjectifOuNom(
            mot,
            "PAS ENCORE DEFINIE",
            null,
            flexions,
            "SINGULIER",
            undefined,
        );

        return new Nom(
            mot,
            "PAS ENCORE DEFINIE",
            null,
            flexions,
            "SINGULIER",
            (noms.formePointMedianExeption ?? {})[flexions.masculinSingulier] ?? undefined,
        );
    } else if (motLow in adjectifs.masculinPlurielVersMasculinSingulier) {
        const masculinSingulier = adjectifs.masculinPlurielVersMasculinSingulier[motLow]

        if (masculinSingulier == "") return undefined

        let flexions = adjectifs.masculinSingulierVersFlexion[masculinSingulier];

        if (motLow in noms.masculinPlurielVersMasculinSingulier) return new AdjectifOuNom(
            mot,
            "PAS ENCORE DEFINIE",
            null,
            flexions,
            "PLURIEL",
            undefined,
        );

        return new Adjectif(
            mot,
            "PAS ENCORE DEFINIE",
            null,
            flexions,
            "PLURIEL",
            (adjectifs.formePointMedianExeption ?? {})[flexions.masculinSingulier] ?? undefined,
            "PAS ENCORE DEFINI"
        );
    } else if (motLow in adjectifs.masculinSingulierVersFlexion) {
        let flexions = adjectifs.masculinSingulierVersFlexion[motLow];

        if (motLow in adjectifs.masculinPlurielVersMasculinSingulier) return new AdjectifOuNom(
            mot,
            "PAS ENCORE DEFINIE",
            null,
            flexions,
            "SINGULIER",
            undefined,
        );


        return new Adjectif(
            mot,
            "PAS ENCORE DEFINIE",
            null,
            flexions,
            "SINGULIER",
            undefined,
            "PAS ENCORE DEFINI"
        );

    }
    else if (motLow in participes.masculinPlurielVersMasculinSingulier) {
        const masculinSingulier = participes.masculinPlurielVersMasculinSingulier[motLow]
        let flexions = participes.masculinSingulierVersFlexion[masculinSingulier];

        if (masculinSingulier == "") return undefined

        return new Participe(
            mot,
            "PAS ENCORE DEFINIE",
            null,
            flexions,
            "PLURIEL",
            undefined,
        );
    } else if (motLow in participes.masculinSingulierVersFlexion) {
        let flexions = participes.masculinSingulierVersFlexion[motLow];

        return new Participe(
            mot,
            "PAS ENCORE DEFINIE",
            null,
            flexions,
            "SINGULIER",
            undefined,
        );
    } else {
        return undefined
    }
}

/**
 * Retourne trois listes : 
 * - le début du texte_abstrait1, dont le texte concret correspond à celui du texte_abstrait2
 * - Si elle existe, la partie insérée dans le texte_abstrait2, sinon une liste vide
 * - la fin du texte_abstrait1, dont le texte concret correspond à celui du texte_abstrait2
 * 
 * IMPLÉMENTATION : 
 * - Parcours les deux textes abstraits en partant du début jusqu'a trouver des textes concret différents,
 * et les ajoutes dans la première liste du résultat
 * - Idem en partant de la fin, et en créant la 3eme liste
 * - identifie les mots restants, et les ajoute dans la 2eme liste
 * @param texteAbstrait1 
 * @param texteAbstrait2 
 */
function faireCorrespondreTextesAbstraits(texteAbstrait1: TexteAbstrait, texteAbstrait2: TexteAbstrait): Correspondances {
    let debut: PartieIdentique = [];
    let partieInseree: PartieInseree = [];
    let fin: PartieIdentique = [];

    // Trouver la partie identique au début
    let i = 0;
    while (i < texteAbstrait1.length && i < texteAbstrait2.length && texteAbstrait1[i].texteConcret === texteAbstrait2[i].texteConcret) {
        debut.push(fusionnerMot(texteAbstrait1[i], texteAbstrait2[i]));
        i++;
    }


    // Trouver la partie identique à la fin
    let j = texteAbstrait1.length - 1;
    let k = texteAbstrait2.length - 1;
    while (j >= i && k >= i && texteAbstrait1[j].texteConcret === texteAbstrait2[k].texteConcret) {
        let choix = fusionnerMot(texteAbstrait1[j], texteAbstrait2[k]);
        fin.unshift(choix);
        j--;
        k--;
    }

    // Identifier la partie insérée
    partieInseree = texteAbstrait2.slice(i, k + 1);



    return [debut, partieInseree, fin];
}


function fusionnerMot(mot1: Mot, mot2: Mot): Mot {
    if (!(mot1 instanceof MotReconnu) || !(mot2 instanceof MotReconnu)) return mot2;
    if (mot1.texteConcret != mot2.texteConcret) return mot2;
    else {
        mot2.strategieChoisieParUtilisateur = mot1.strategieChoisieParUtilisateur;
        return mot2;
    }
}


function formesPointMedian(
    mot: string,
    mascPlur: string,
    femininSing: string,
    femininPlur: string
): { inclusifSingulier: string, inclusifPluriel: string | null } | null {
    const partieCommune = debutCommun(mot.toLowerCase(), femininSing)
    const marqueFeminin = femininSing.slice(partieCommune.length)

    const inclusifSingulier = "⋅" + marqueFeminin
    const marquePluriel = femininPlur.slice(partieCommune.length + marqueFeminin.length)

    if (marqueFeminin == "")
        return null

    if (marquePluriel == "") {
        return { inclusifSingulier, inclusifPluriel: null }
    }

    const inclusifPluriel = "⋅" + marqueFeminin + "⋅" + marquePluriel

    return { inclusifSingulier, inclusifPluriel }
}

function debutCommun(string1: string, string2: string): string {
    const min = string1.length > string2.length ? string2 : string1
    const max = string1.length < string2.length ? string2 : string1

    let i = 0;
    while (i < min.length && min[i] == max[i])
        i++

    return min.slice(0, i)
}

function finCommune(string1: string, string2: string): string {
    const min = string1.length > string2.length ? string2 : string1
    const max = string1.length < string2.length ? string2 : string1

    let i = 0;
    while (i < min.length && min[min.length - i] == max[max.length - i])
        i++

    return min.slice(min.length - i)
}
