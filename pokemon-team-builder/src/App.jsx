import { useEffect, useState } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import PokemonGrid from "./components/PokemonGrid";
import Pagination from "./components/Pagination";
import PokemonDetails from "./components/PokemonDetails";
import Team from "./components/Team";
import Loading from "./components/Loading";
import ErrorMessage from "./components/ErrorMessage";
import {
  getPokemon,
  getPokemonPage,
  getPokemonByType,
  PAGE_SIZE,
} from "./services/pokemonApi";
import "./App.css";
import "./styles/components.css";

const STORAGE_KEY = "pokemon-builder-team-v1";
function readSavedTeam() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) return [];
    const valid = saved.filter(
      (member) =>
        member &&
        Number.isInteger(member.id) &&
        member.id > 0 &&
        typeof member.name === "string" &&
        Array.isArray(member.types) &&
        member.types.length > 0 &&
        member.types.every((item) => typeof item?.type?.name === "string"),
    );
    return valid
      .filter(
        (member, index) =>
          valid.findIndex((item) => item.id === member.id) === index,
      )
      .slice(0, 6);
  } catch {
    return [];
  }
}

export default function App() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [pokemon, setPokemon] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [team, setTeam] = useState(readSavedTeam);
  const [notice, setNotice] = useState("");
  const [storageWarning, setStorageWarning] = useState("");
  const [addingId, setAddingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [detailsRetry, setDetailsRetry] = useState(0);

  // A controlled input stays responsive; only the API query waits for typing to stop.
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(input.trim().toLowerCase());
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [input]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    async function loadPokemon() {
      setLoading(true);
      setError("");
      try {
        const result = query
          ? { pokemon: [await getPokemon(query, controller.signal)], count: 1 }
          : type
            ? await getPokemonByType(type, page, controller.signal)
            : await getPokemonPage(page, controller.signal);
        if (active) {
          setPokemon(result.pokemon);
          setCount(result.count);
        }
      } catch (error) {
        if (active && error.name !== "AbortError") {
          setError(error.message);
          setPokemon([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadPokemon();
    // Cleanup prevents older responses from replacing the current search or page.
    return () => {
      active = false;
      controller.abort();
    };
  }, [query, type, page, retry]);

  useEffect(() => {
    if (selectedId === null) return;
    const controller = new AbortController();
    let active = true;
    async function loadDetails() {
      setDetailsLoading(true);
      setDetailsError("");
      setDetails(null);
      try {
        const result = await getPokemon(selectedId, controller.signal);
        if (active) setDetails(result);
      } catch (error) {
        if (active && error.name !== "AbortError")
          setDetailsError(error.message);
      } finally {
        if (active) setDetailsLoading(false);
      }
    }
    loadDetails();
    return () => {
      active = false;
      controller.abort();
    };
  }, [selectedId, detailsRetry]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(team));
    } catch {
      // This effect synchronizes with localStorage and reports a storage failure.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStorageWarning(
        "Your team works in this session, but could not be saved on this device.",
      );
    }
  }, [team]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(timer);
  }, [notice]);

  async function addToTeam(member) {
    if (addingId !== null) return;
    if (team.some((item) => item.id === member.id)) {
      setNotice(`${member.name} is already in your team.`);
      return;
    }
    if (team.length >= 6) {
      setNotice("Your team is full!");
      return;
    }
    setAddingId(member.id);
    try {
      // Fetch details only for Pokémon the user actually adds; types power the summary.
      const full = member.types ? member : await getPokemon(member.id);
      const savedMember = { id: full.id, name: full.name, types: full.types };
      setTeam((current) =>
        current.some((item) => item.id === savedMember.id) ||
        current.length >= 6
          ? current
          : [...current, savedMember],
      );
      setNotice(`${member.name} joined your team!`);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setAddingId(null);
    }
  }

  function clearSearch() {
    setInput("");
    setQuery("");
    setPage(1);
  }
  function submitSearch(event) {
    event.preventDefault();
    setQuery(input.trim().toLowerCase());
    setPage(1);
  }
  function removeMember(id) {
    setTeam((current) => current.filter((member) => member.id !== id));
    setNotice("Pokémon removed from your team.");
  }

  return (
    <>
      <Header count={team.length} />
      <main className="page-shell">
        <section className="hero">
          <div>
            <div className="hero-tag">
              <span /> THE WORLD OF POKÉMON, AT YOUR FINGERTIPS
            </div>
            <h1>
              Find your favourites.
              <br />
              <span>Build your dream team.</span>
            </h1>
            <p>
              Explore the Pokédex, discover new companions, and assemble
              <br className="desktop-break" /> a team that's uniquely yours.
              Your next adventure starts here.
            </p>
            <div className="hero-footnote">
              <span className="tiny-ball" aria-hidden="true">
                ◉
              </span>{" "}
              Discover. Collect. Make a little history.
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <span className="spark spark-one">✦</span>
            <span className="spark spark-two">✧</span>
            <div className="big-pokeball">
              <span />
            </div>
            <span className="art-label">GOTTA BUILD ’EM ALL</span>
          </div>
        </section>
        <div className="workspace">
          <section className="browse" aria-labelledby="browse-title">
            <div className="section-heading">
              <div>
                <span className="eyebrow">MEET YOUR NEXT TEAMMATE</span>
                <h2 id="browse-title">
                  Explore the Pokédex <span className="yellow-dot" />
                </h2>
              </div>
              <span className="browse-caption">
                One great team. So many possibilities.
              </span>
            </div>
            <SearchBar
              value={input}
              onChange={setInput}
              type={type}
              onTypeChange={(value) => {
                setType(value);
                setPage(1);
              }}
              onSubmit={submitSearch}
              onClear={clearSearch}
            />
            <div className="results-meta">
              <span>
                {query
                  ? `Search results for “${query}”`
                  : type
                    ? `${type} Pokémon`
                    : "All Pokémon"}
              </span>
              <span>
                {loading
                  ? "Exploring..."
                  : error
                    ? "No results"
                    : `${count.toLocaleString()} Pokémon`}
              </span>
            </div>
            {loading ? (
              <Loading />
            ) : error ? (
              <ErrorMessage
                message={error}
                onRetry={() => setRetry((value) => value + 1)}
              />
            ) : pokemon.length ? (
              <PokemonGrid
                pokemon={pokemon}
                team={team}
                onDetails={(member) => setSelectedId(member.id)}
                onAdd={addToTeam}
                addingId={addingId}
              />
            ) : (
              <div className="state-box">No Pokémon to display.</div>
            )}
            {!query && (
              <Pagination
                page={page}
                totalPages={Math.max(1, Math.ceil(count / PAGE_SIZE))}
                loading={loading}
                onChange={setPage}
              />
            )}
          </section>
          <Team team={team} onRemove={removeMember} />
        </div>
        {storageWarning && <p role="status">{storageWarning}</p>}
        <footer>
          <span className="brand footer-brand">
            <span className="pokeball" aria-hidden="true" /> PokéBuilder
          </span>
          <p>
            Made for trainers, by a Pokémon fan. Data from{" "}
            <a href="https://pokeapi.co/">PokéAPI</a>.
          </p>
          <span>Your team. Your adventure.</span>
        </footer>
      </main>
      {notice && (
        <div className="toast" role="status">
          {notice}
          <button aria-label="Dismiss message" onClick={() => setNotice("")}>
            ×
          </button>
        </div>
      )}
      {selectedId !== null && (
        <PokemonDetails
          pokemon={details}
          loading={detailsLoading || (!details && !detailsError)}
          error={detailsError}
          onClose={() => setSelectedId(null)}
          onRetry={() => setDetailsRetry((value) => value + 1)}
          onAdd={addToTeam}
          adding={addingId !== null}
          notice={notice}
        />
      )}
    </>
  );
}
