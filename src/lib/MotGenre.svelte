<script lang="ts">
    import Menu from "./Menu.svelte";

    import edit from "../assets/edit.svg";
    import {
        aUnFeminin,
        enInclusifDoublon,
        enInclusifPointMedian,
        MotReconnu,
        type StrategieInclusif,
    } from "./local_correcteur";

    type MotGenreProps = {
        mot: MotReconnu;
        onswitchstragegy: (nouvelleStrat: StrategieInclusif) => void;
    };

    const { mot, onswitchstragegy }: MotGenreProps = $props();

    const strategie = $derived(
        mot.strategieChoisieParUtilisateur ?? mot.strategieDetectee,
    );

    const enInclusif = $derived.by(() => {
        if (strategie == "DOUBLON") return enInclusifDoublon(mot.texteConcret);
        else if (strategie == "POINT MÉDIAN")
            return enInclusifPointMedian(mot.texteConcret);
        else return null;
    });

    $inspect(enInclusif);
</script>

{#if enInclusif != null && enInclusif[1] != null && (strategie == "DOUBLON" || strategie == "POINT MÉDIAN")}
    {enInclusif[0]}
    <div class="dropdown">
        <span
            tabindex="0"
            role="button"
            aria-label="Modifier la correction inclusive"
            class="bg-purple-600 text-white px-1 z-0 inline-flex gap-2 cursor-pointer transition-all hover:bg-purple-400 flex items-center"
        >
            {enInclusif[1]}
            <img src={edit} alt="edit" class="h-4 select-none" />
        </span>
        <Menu
            {mot}
            {onswitchstragegy}
            title="Ce mot à automatiquement été rendu inclusif. Si c'est une erreur, vous pouvez effacer. Vous pouvez aussi choisir une autre stratégie."
        />
    </div>
{:else if strategie == "DEMANDER PROBABLE" && aUnFeminin(mot)}
    <span class="dropdown relative">
        <span
            tabindex="0"
            role="button"
            aria-label="Modifier la correction inclusive"
            class="bg-purple-200 cursor-pointer hover:bg-purple-100 transition-all p-1 z-0 after:w-full after:h-1 after:bottom-0 after:left-0"
        >
            {mot.texteConcret} <span class="text-purple-600 px-1">?</span>
        </span>
        <Menu
            {mot}
            {onswitchstragegy}
            title="Impossible de déterminer avec assurance que ce mot doit être rendu inclusif."
        />
    </span>
{:else if strategie == "DEMANDER IMPROBABLE" && aUnFeminin(mot)}
    <span class="dropdown relative">
        <span
            tabindex="0"
            role="button"
            aria-label="Modifier la correction inclusive"
            class="italic text-slate-700 cursor-pointer hover:bg-purple-100 font-bold transition-all p-1 z-0"
        >
            {mot.texteConcret}
        </span>
        <Menu
            {mot}
            {onswitchstragegy}
            title="Ce mot peut-être rendu inclusif mais nous n'avons pas détecter que ce soit necessaire."
        />
    </span>
{:else}
    {mot.texteConcret}
{/if}
