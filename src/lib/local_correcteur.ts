import nomsDicoUrl from "/public/noms_flexions.csv.gz?url";
import participesDicoUrl from "/public/participes.csv.gz?url";
import adjectifsDicoUrl from "/public/adjectifs_flexions.csv.gz?url"

// ---- TYPES ----

export type Dictionnaire = {
    masculinSingulierVersFlexion: { [key: string]: string[] },
    masculinPlurielVersMasculinSingulier: { [key: string]: string },
    formePointMedianExeption: { [key: string]: string } | undefined
}

export class Mot {
    constructor(public texteConcret: string) { }
}
export class MotGenre extends Mot {
    constructor(public texteConcret: string, public strategieInclusif: StrategieInclusif) {
        super(texteConcret);
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
        public strategieParticipesMasculinSingulier: StrategieInclusif = "POINT MÉDIAN",
        public strategieParticipesMasculinPluriel: StrategieInclusif = "POINT MÉDIAN",
        public strategieAdjectifsMasculinSingulier: StrategieInclusif = "DEMANDER",
        public strategieAdjectifsMasculinPluriels: StrategieInclusif = "POINT MÉDIAN",
        public strategieDeterminantsMasculinSingulier: StrategieInclusif = "DEMANDER",
        public strategieDeterminantsMasculinPluriels: StrategieInclusif = "POINT MÉDIAN"
    ) { }
}

// ---- VARIABLE GLOBALES ----
let noms: Dictionnaire;
let adjectifs: Dictionnaire;
let participes: Dictionnaire;
const determinants: Dictionnaire = {
    masculinSingulierVersFlexion: {
        "il": ["ils", "elle", "elles"],
        "un": ["", "une", ""],
        "le": ["", "la", ""]
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
                line.split(";")
                    .map(flexion => flexion.trim()) // trim les flexions
            ) // séparent chaque ligne en flexion
            // Créer un dictionaire, avec deux indexations : masculin singulier vers flexions, et masculin pluriel vers masculin singulier
            .reduce(
                (dict, line: string[]) => {
                    dict.masculinSingulierVersFlexion[line[0]] = line.slice(1);
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
export async function actualiserTexteAbstrait(ancienTexteAbstrait: TexteAbstrait, nouveauTexte: string, options: OptionsTexteAbstrait = new OptionsTexteAbstrait()): Promise<TexteAbstrait> {
    const nouveauTexteAbstrait = await creerTexteAbstrait(nouveauTexte, options);
    const correspondance = faireCorrespondreTextesAbstraits(ancienTexteAbstrait, nouveauTexteAbstrait);

    return correspondance[0].concat(correspondance[1]).concat(correspondance[2])
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
export async function creerTexteAbstrait(texte: string, options: OptionsTexteAbstrait): Promise<TexteAbstrait> {
    return texte.split(/( )|(\n)|(\.)|(\!)|(\!)/) // split les espaces (sans les garder) et isole les "\n" 
        .filter(part => part !== undefined && part !== "")
        .map(mot => {
            let motLow = mot.toLowerCase()
            if (motLow in determinants.masculinPlurielVersMasculinSingulier) {
                return new MotGenre(mot, options.strategieDeterminantsMasculinPluriels);
            }
            else if (motLow in determinants.masculinSingulierVersFlexion) {
                return new MotGenre(mot, options.strategieDeterminantsMasculinSingulier);
            }
            else if (motLow in adjectifs.masculinPlurielVersMasculinSingulier) {
                return new MotGenre(mot, options.strategieAdjectifsMasculinPluriels);
            }
            else if (motLow in adjectifs.masculinSingulierVersFlexion) {
                return new MotGenre(mot, options.strategieAdjectifsMasculinSingulier);
            }
            else if (motLow in noms.masculinPlurielVersMasculinSingulier) {
                return new MotGenre(mot, options.strategieNomMasculinPluriels);
            }
            else if (motLow in noms.masculinSingulierVersFlexion) {
                return new MotGenre(mot, options.strategieNomMasculinSingulier);
            }
            else if (motLow in participes.masculinPlurielVersMasculinSingulier) {
                return new MotGenre(mot, options.strategieParticipesMasculinPluriel);
            }
            else if (motLow in participes.masculinSingulierVersFlexion) {
                return new MotGenre(mot, options.strategieParticipesMasculinSingulier);
            }
            else {
                return new Mot(mot);
            }
        })
}

export function enInclusifDoublon(mot: string): [string, string | null] {
    const motData = recupererFlexions(mot);

    let { flexions, accordMot, masculinSingulier } = motData;

    if (accordMot === "PLURIEL") {
        if (masculinSingulier == flexions[1] || flexions[0] == flexions[2])
            return [mot, null]

        if (flexions[1] == "" && flexions[2] == "")
            return [mot, null]

        return [
            mot,
            " et " + flexions[2]
        ]
    } else {
        if (mot == flexions[1])
            return [mot, null]

        if (flexions[1] == "" && flexions[2] == "")
            return [mot, null]

        return [
            mot,
            " et " + flexions[1]
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
* @param mot le mot à rendre inclusif
*/
export function enInclusifPointMedian(mot: string): [string, string | null] {
    const motData = recupererFlexions(mot);

    if (motData.exception) return ["", motData.exception!]

    let { flexions, masculinSingulier } = motData;

    let formesInclusives = formesPointMedian(
        masculinSingulier,
        flexions[0],
        flexions[1],
        flexions[2]
    );

    return [
        masculinSingulier,
        motData.accordMot == "SINGULIER" ?
            formesInclusives?.inclusifSingulier ?? null
            : formesInclusives?.inclusifPluriel ?? null
    ]
}

export function aUnFeminin(mot: string): boolean {
    const motData = recupererFlexions(mot);

    if (motData.exception) return true;

    let { flexions, masculinSingulier } = motData;

    console.log(masculinSingulier, flexions);


    return (flexions[1] != "" || flexions[2] != "")
}


// ---- FONCTIONS PRIVÉES ----

function recupererFlexions(mot: string): {
    flexions: string[],
    natureMot: "PARTICIPE" | "ADJECTIF" | "NOM" | "DETERMINANT",
    accordMot: "PLURIEL" | "SINGULIER"
    masculinSingulier: string,
    exception: string | undefined
} {
    let motLow = mot.toLowerCase()
    if (motLow in determinants.masculinPlurielVersMasculinSingulier) {
        const masculinSingulier = determinants.masculinPlurielVersMasculinSingulier[motLow]
        let flexions = determinants.masculinSingulierVersFlexion[masculinSingulier];

        return {
            flexions,
            natureMot: "DETERMINANT",
            accordMot: "PLURIEL",
            masculinSingulier,
            exception: (determinants.formePointMedianExeption ?? {})[masculinSingulier] ?? undefined
        };
    } else if (motLow in determinants.masculinSingulierVersFlexion) {
        let flexions = determinants.masculinSingulierVersFlexion[motLow];

        return {
            flexions,
            natureMot: "DETERMINANT",
            accordMot: "SINGULIER",
            masculinSingulier: mot,
            exception: (determinants.formePointMedianExeption ?? {})[motLow] ?? undefined
        };
    }
    else if (motLow in noms.masculinPlurielVersMasculinSingulier) {
        const masculinSingulier = noms.masculinPlurielVersMasculinSingulier[motLow]
        let flexions = noms.masculinSingulierVersFlexion[masculinSingulier]

        return {
            flexions,
            natureMot: "NOM",
            accordMot: "PLURIEL",
            masculinSingulier,
            exception: (noms.formePointMedianExeption ?? {})[masculinSingulier] ?? undefined
        }
    }
    else if (motLow in noms.masculinSingulierVersFlexion) {
        let flexions = noms.masculinSingulierVersFlexion[motLow];

        return {
            flexions,
            natureMot: "NOM",
            accordMot: "SINGULIER",
            masculinSingulier: mot,
            exception: (noms.formePointMedianExeption ?? {})[motLow] ?? undefined
        };
    } else if (motLow in adjectifs.masculinPlurielVersMasculinSingulier) {
        const masculinSingulier = adjectifs.masculinPlurielVersMasculinSingulier[motLow]


        let flexions = adjectifs.masculinSingulierVersFlexion[masculinSingulier];
        return {
            flexions,
            natureMot: "ADJECTIF",
            accordMot: "PLURIEL",
            masculinSingulier,
            exception: (adjectifs.formePointMedianExeption ?? {})[masculinSingulier] ?? undefined
        };
    } else if (motLow in adjectifs.masculinSingulierVersFlexion) {
        let flexions = adjectifs.masculinSingulierVersFlexion[motLow];

        return {
            flexions,
            natureMot: "ADJECTIF",
            accordMot: "SINGULIER",
            masculinSingulier: mot,
            exception: (adjectifs.formePointMedianExeption ?? {})[motLow] ?? undefined
        };
    }

    else if (motLow in participes.masculinPlurielVersMasculinSingulier) {
        const masculinSingulier = participes.masculinPlurielVersMasculinSingulier[motLow]
        let flexions = participes.masculinSingulierVersFlexion[masculinSingulier];

        return {
            flexions,
            natureMot: "PARTICIPE",
            accordMot: "PLURIEL",
            masculinSingulier,
            exception: (participes.formePointMedianExeption ?? {})[masculinSingulier] ?? undefined
        };
    } else if (motLow in participes.masculinSingulierVersFlexion) {
        let flexions = participes.masculinSingulierVersFlexion[motLow];

        return {
            flexions,
            natureMot: "PARTICIPE",
            accordMot: "SINGULIER",
            masculinSingulier: mot,
            exception: (participes.formePointMedianExeption ?? {})[motLow] ?? undefined
        };
    } else {
        throw new Error("recupererFlexions - Mot introuvable dans les dictionnaires");
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
        debut.push(texteAbstrait1[i]);
        i++;
    }

    // Trouver la partie identique à la fin
    let j = texteAbstrait1.length - 1;
    let k = texteAbstrait2.length - 1;
    while (j >= i && k >= i && texteAbstrait1[j].texteConcret === texteAbstrait2[k].texteConcret) {
        fin.unshift(texteAbstrait1[j]);
        j--;
        k--;
    }

    // Identifier la partie insérée
    partieInseree = texteAbstrait2.slice(i, k + 1);

    return [debut, partieInseree, fin];
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

    console.log(mot, marqueFeminin, marquePluriel);


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
