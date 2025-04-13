<script lang="ts">
    import Menu from "./Menu.svelte";

    import edit from "../assets/edit.svg";
    import {
        aUnFeminin,
        enInclusifDoublon,
        enInclusifPointMedian,
        MotGenre,
        type StrategieInclusif,
    } from "./local_correcteur";

    type MotGenreProps = {
        mot: MotGenre;
        onswitchstragegy: (nouvelleStrat: StrategieInclusif) => void;
    };

    const { mot, onswitchstragegy }: MotGenreProps = $props();

    const enInclusif = $derived.by(() => {
        if (mot.strategieInclusif == "DOUBLON")
            return enInclusifDoublon(mot.texteConcret);
        else if (mot.strategieInclusif == "POINT MÉDIAN")
            return enInclusifPointMedian(mot.texteConcret);
        else return null;
    });
</script>

{#if enInclusif != null && enInclusif[1] != null && (mot.strategieInclusif == "DOUBLON" || mot.strategieInclusif == "POINT MÉDIAN")}
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
        <Menu {mot} {onswitchstragegy} />
    </div>
{:else if mot.strategieInclusif == "DEMANDER" && aUnFeminin(mot.texteConcret)}
    <span class="dropdown relative">
        <span
            tabindex="0"
            role="button"
            aria-label="Modifier la correction inclusive"
            class="after:absolute after:bg-purple-600 z-0 after:w-full after:h-1 after:bottom-0 after:left-0"
        >
            {mot.texteConcret}
        </span>
        <Menu {mot} {onswitchstragegy} />
    </span>
{:else}
    {mot.texteConcret}
{/if}
