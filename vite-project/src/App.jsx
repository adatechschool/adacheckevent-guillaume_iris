import { useState } from "react";
import Cards from "./components/Cards";
import SearchBar from "./components/searchBar";
import Filter from "./components/Filter";
import Button from "./components/Button";


export default function App() {
  const limit = 6; // Changé à 6 pour un affichage plus esthétique
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ price_type: '', acces_type: '' });
  const [totalResults, setTotalResults] = useState(0);

  // **SIMPLIFICATION MAJEURE 3 : Dérivation de l'offset**
  // On n'a plus besoin d'un état pour 'offset', il est calculé.
  const offset = (page - 1) * limit;

  // Fonctions de navigation simplifiées
  const goNextPage = () => setPage((p) => p + 1);
  // S'assure de ne pas descendre en dessous de la page 1
  const goPrevPage = () => setPage((p) => Math.max(1, p - 1));

  // Gestion centralisée du changement (recherche/filtre) pour réinitialiser la page
  const handleSearchOrFilterChange = (setter, value) => {
    setter(value);
    setPage(1); // On revient toujours à la page 1 lors d'une nouvelle recherche ou filtre
  };
  
  // Calcule le nombre max de pages
  const maxPages = Math.ceil(totalResults / limit);
  const isLastPage = page >= maxPages;


  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto font-sans bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-4 border-blue-600 pb-2">
        Que Faire à Paris ?
      </h1>
      
      {/* 🔍 Barre de recherche */}
      <SearchBar onSearch={(q) => handleSearchOrFilterChange(setQuery, q)} />
        

      {/* ⚙️ Filtres */}
      <Filter
        filters={filters}
        onChange={(newFilters) => handleSearchOrFilterChange(setFilters, newFilters)}
      />

      {/* 💬 Affichage du nombre de résultats */}
      {totalResults > 0 && (
        <p className="text-lg text-gray-700 mb-4 font-medium">
          <span className="font-bold text-blue-600">{totalResults}</span> événement{totalResults > 1 ? 's' : ''} trouvé{totalResults > 1 ? 's' : ''}. (Page {page} sur {maxPages})
        </p>
      )}

      {/* 🖼️ Cartes d'événements */}
      <Cards
        offset={offset}
        limit={limit}
        query={query}
        filters={filters}
        onCountChange={setTotalResults}
      />

      {/* 🔽 Pagination */}
      <div className="flex justify-center items-center space-x-8 mt-10 p-4 bg-white rounded-xl shadow-inner border border-gray-200">
        <Button onClick={goPrevPage} disabled={page === 1}>
          ← Précédent
        </Button>
        <p className="text-xl font-bold text-gray-800">Page {page}</p>
        <Button
          onClick={goNextPage}
          disabled={isLastPage || totalResults === 0}
        >
          Suivant →
        </Button>
      </div>
    </div>
  );
}
