<script lang="ts">
  import {
    type Dictionnaire,
    type TexteAbstrait,
    actualiserTexteAbstrait,
    Mot,
    MotGenre,
    initDictionnaires,
    enInclusifPointMedian,
    enInclusifDoublon,
    type StrategieInclusif,
  } from "./lib/local_correcteur";
  import "./app.css";
  import logo from "./assets/logo.png";
  import copy from "./assets/copy.svg";
  import check from "./assets/check.svg";
  import MotGenreComposant from "./lib/MotGenre.svelte";

  let textarea = $state("");
  let texteAbstrait = $state([] as TexteAbstrait);

  async function onInput() {
    texteAbstrait = await actualiserTexteAbstrait(texteAbstrait, textarea);
    console.log(texteAbstrait);
  }

  let hasBeenCopied = $state(false);
  function copyToClipboard() {
    navigator.clipboard
      .writeText("")
      .then(() => {
        hasBeenCopied = true;
        setTimeout(() => {
          hasBeenCopied = false;
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  }
</script>

<div class="navbar bg-base-100 shadow-sm">
  <a href="/" class="btn btn-ghost text-xl">
    <img src={logo} alt="traduire en inclusif" class="h-full" />
  </a>
  <div class="navbar-start hidden md:block">
    <ul class="flex gap-8">
      <li><a href="#traducteur" class="btn btn-ghost">Traducteur</a></li>
      <li>
        <a href="#pourquoi" class="btn btn-ghost"
          >Pourquoi l'écriture inclusive ?</a
        >
      </li>
      <li>
        <a href="#comment" class="btn btn-ghost">Comment écrire en inclusif ?</a
        >
      </li>
    </ul>
  </div>
</div>

<main
  class="p-4 sm:p-8 md:px-16 lg:px-32 z-10 min-h-[100vh] noise cabin flex flex-col gap-8 justify-center w-full"
>
  <h1 id="traducteur" class="text-4xl cabin-sketch-regular z-10">
    Traducteur de texte en écriture inclusive !
  </h1>
  <div class="border-1 border-slate-300 rounded-lg bg-fuchsia-50 grow relative">
    <textarea
      oninput={onInput}
      bind:value={textarea}
      class="z-2 outline-none bg-white p-4 pb-16 w-full h-[50vh] text-lg rounded-tl-lg rounded-tr-lg border-b-3 border-purple-700"
      placeholder="Les étudiants intelligents sont allés à la plage"
    >
    </textarea>

    <img
      src={logo}
      alt="logo"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 z-100"
    />
    <div class="p-4 py-16 z-0 text-lg h-[50vh] overflow-scroll">
      <button
        class="absolute btn bottom-2 right-2 bg-white"
        onclick={copyToClipboard}
      >
        {#if hasBeenCopied}
          <img src={check} alt="" class="h-4" />
          Copié
        {:else}
          <img src={copy} alt="" class="h-4" />
          Copier
        {/if}
      </button>
      {#await initDictionnaires()}
        chargement....
      {:then _}
        {#if texteAbstrait.length > 0}
          {#each texteAbstrait as mot, indice}
            {#if mot instanceof MotGenre && mot.strategieInclusif != "AUCUNE"}
              <MotGenreComposant
                {mot}
                onswitchstragegy={(nouvelleStrat: StrategieInclusif) => {
                  texteAbstrait[indice] = new MotGenre(
                    texteAbstrait[indice].texteConcret,
                    nouvelleStrat,
                  );
                }}
              />
            {:else if mot.texteConcret == "\n"}
              <br />
            {:else}
              {mot.texteConcret}
            {/if}
          {/each}
        {:else}
          <p class="text-gray-400">
            Les étudiants et étudiantes intelligent⋅e⋅s sont allé⋅e⋅s à la plage
          </p>
        {/if}
      {/await}
    </div>
  </div>

  <div class="container mx-auto p-8">
    <h1
      id="pourquoi"
      class="text-4xl font-bold text-center mb-8 cabin-sketch-regular"
    >
      L'importance de l'écriture inclusive
    </h1>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4 cabin-sketch-regular">
        Pourquoi l'écriture inclusive est-elle importante ?
      </h2>
      <p class="mb-4">
        L'écriture inclusive vise à promouvoir l'égalité des genres dans la
        langue française. Elle permet de rendre visibles les femmes et les
        personnes non-binaires dans le langage, contribuant ainsi à une société
        plus équitable et respectueuse.
      </p>
      <p class="mb-4">
        Une étude intitulée <b>"Un ministre peut-il tomber enceinte ?"</b>
        a démontré que notre cerveau ne comprend pas bien la règle du "masculin l'emporte
        sur le féminin". Dans cette étude, les chercheurs ont demandé à des passants
        de citer du tac au tac des noms de candidats pour devenir Premier ministre.
        La majorité des réponses étaient des noms d'hommes. Ensuite, ils ont répété
        l'expérience en demandant cette fois "des noms de candidat ou candidate pour
        être Premier ou Première ministre". La deuxième fois, le nombre de femmes
        citées a triplé. Cette expérience montre clairement l'impact de l'écriture
        inclusive sur notre perception et notre manière de penser. En utilisant un
        langage plus inclusif, nous pouvons rendre visible la diversité des genres
        et contribuer à une représentation plus équitable dans tous les domaines
        de la société.
      </p>
    </section>

    <section class="mb-8">
      <h2 id="comment" class="text-2xl font-semibold mb-4 cabin-sketch-regular">
        Les différentes manières de pratiquer l'écriture inclusive
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold mb-2">Le doublon</h3>
          <p class="mb-4">
            Consiste à répéter les termes au masculin et au féminin. Exemple :
            "les étudiantes et les étudiants".
          </p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold mb-2">Le point médian</h3>
          <p class="mb-4">
            Utilise le point médian pour combiner les formes masculines et
            féminines. Exemple : "les étudiant·e·s".
          </p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold mb-2">Les synonymes non genrés</h3>
          <p class="mb-4">
            Remplace les termes genrés par des synonymes neutres. Exemple : "les
            élèves" au lieu de "les étudiants".
          </p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold mb-2">
            Inclure encore plus de monde
          </h3>
          <p class="mb-4">
            Certaines personnes ne se reconnaissent ni dans le genre féminin ni
            dans le genre masculin. Pour inclure ces personnes nons-binaires
            dans notre langue, il existe des formes encore plus inclusives.
            C'est là qu'apparait le pronom "iel", contraction de "il" et "elle",
            ainsi que des formes comme "l'étudiant·e·x", le 'x' designant les
            genres nons-binaires.
          </p>
        </div>
      </div>
    </section>
  </div>
</main>

<style>
  .cabin-sketch-regular {
    font-family: "Cabin Sketch", sans-serif;
    font-weight: 400;
    font-style: normal;
  }

  .cabin-sketch-bold {
    font-family: "Cabin Sketch", sans-serif;
    font-weight: 700;
    font-style: normal;
  }

  .cabin {
    font-family: "Cabin", sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
    font-variation-settings: "wdth" 100;
  }
</style>
