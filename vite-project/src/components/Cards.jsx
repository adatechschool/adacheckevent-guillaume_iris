import { useEffect } from 'react';
import useEvents from '../hooks/useEvents'

export default function Cards({ offset = 0, limit = 10, query = '', filters = {}, onCountChange }) {
  const { items, total, loading, error } = useEvents({ query, filters, offset, limit });

  // Utilisation de 'useEffect' pour remonter le total (très bien fait dans votre code original)
  useEffect(() => {
    if (typeof onCountChange === 'function') {
      onCountChange(total);
    }
  }, [total, onCountChange]);

  if (loading) return <p className="text-xl text-center p-8 text-blue-600">Chargement des événements...</p>;
  if (error) return <p className="text-xl text-center p-8 text-red-600">Erreur : {error}</p>;
  if (!items || items.length === 0) return <p className="text-xl text-center p-8 text-gray-500">Aucun évènement trouvé pour cette recherche/filtre.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {/* SIMPLIFICATION MAJEURE 2: L'objet 'e' est déjà propre grâce au hook useEvents */}
      {items.map((e, i) => (
        <article key={e.id ?? e.event_id ?? i} className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg hover:shadow-xl transition duration-300">
          {e.cover_url && (
            <img
              src={e.cover_url}
              alt={e.cover_alt ?? e.title}
              className="w-full h-40 object-cover mb-3 rounded-lg border border-gray-100"
              // Fallback en cas d'erreur de chargement d'image
              onError={(event) => {
                event.target.onerror = null; 
                event.target.src="https://placehold.co/400x160/D1D5DB/4B5563?text=Image+non+disponible";
              }}
            />
          )}
          <h3 className="font-bold text-xl text-gray-900 line-clamp-2">{e.title ?? e.title_event}</h3>
          <p className="text-sm text-blue-600 mt-1">
            {e.date_start ? new Date(e.date_start).toLocaleDateString('fr-FR') : "Date inconnue"}
          </p>
          <p className="mt-2 text-gray-700 text-base line-clamp-3">
            {e.lead_text ?? (e.description ? e.description.slice(0, 120) + "..." : "Description non disponible")}
          </p>
          <div className="mt-3 text-xs text-gray-500 flex justify-between items-center">
            <span className="bg-gray-200 px-2 py-0.5 rounded-full">{e.price_type ?? "N/A"}</span> 
            <span className="bg-gray-200 px-2 py-0.5 rounded-full">{e.access_type ?? "N/A"}</span>
          </div>
          {e.url && (
            <a href={e.url} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold text-sm mt-3 inline-block hover:text-blue-800">
              Voir l'évènement →
            </a>
          )}
        </article>
      ))}
    </div>
  );
}
