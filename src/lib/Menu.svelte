<script lang="ts">
    import erase from "../assets/erase.svg";
    import replace from "../assets/replace.svg";
    import {
        enInclusifDoublon,
        enInclusifPointMedian,
        MotReconnu,
        type StrategieInclusif,
    } from "./local_correcteur";

    type MenuProps = {
        mot: MotReconnu;
        onswitchstragegy: (nouvelleStrat: StrategieInclusif) => void;
        title: string;
    };

    const { mot, onswitchstragegy, title }: MenuProps = $props();

    const switchStrategyOptions: StrategieInclusif[] = $derived.by(() =>
        (["DOUBLON", "POINT MÉDIAN"] as StrategieInclusif[]).filter(
            (strat) => strat != mot.strategieDetectee,
        ),
    );

    function strategyPreview(strat: StrategieInclusif) {
        let previewParts;
        if (strat == "DOUBLON")
            previewParts = enInclusifDoublon(mot.texteConcret);
        else if (strat == "POINT MÉDIAN")
            previewParts = enInclusifPointMedian(mot.texteConcret);
        else throw "Pas de preview possible pour la stratégie " + previewParts;

        return previewParts[0] + previewParts[1];
    }
</script>

<div
    class="menu dropdown-content bg-base-100 rounded-br-sm rounded-bl-md min-w-64 z-1 p-2 shadow-sm flex flex-col gap-1"
>
    <li>
        {title}
    </li>
    <div class="divider m-0"></div>
    <li class="w-full">
        <button
            onclick={() => onswitchstragegy("AUCUNE")}
            class="flex w-full rounded-md font-bold hover:bg-red-500 hover:text-white bg-red-100 p-2"
        >
            <img src={erase} alt="" class="h-4" />
            Effacer
        </button>
    </li>
    <div class="flex flex-row gap-1">
        {#each switchStrategyOptions as strategy}
            <button
                class="rounded-md bg-[#3EA3AC] rounded-5 p-2 flex gap-2 items-center text-white hover:bg-[#7FDDE6] whitespace-nowrap cursor-pointer"
                onclick={() => onswitchstragegy(strategy)}
            >
                <img src={replace} alt="heon" class="h-4" />
                <span class="mr-4">{strategyPreview(strategy)}</span>
            </button>
        {/each}
    </div>
</div>
