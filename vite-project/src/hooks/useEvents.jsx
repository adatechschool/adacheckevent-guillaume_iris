import { useState, useEffect } from 'react';

export default function useEvents({ query = "", filters = {}, offset = 0, limit = 10 } = {}) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // Construction des paramètres de recherche
        const params = new URLSearchParams();
        
        // Paramètres de base
        params.set("limit", String(limit));
        params.set("offset", String(offset));
        
        // Ajout de la recherche
        if (query) {
          params.set("where", `title like '%${query}%' or lead_text like '%${query}%'`);
        }

        // Ajout des filtres
        const whereConditions = [];
        if (filters.price_type) {
          whereConditions.push(`price_type='${filters.price_type}'`);
        }
        if (filters.acces_type) {
          whereConditions.push(`access_type='${filters.acces_type}'`);
        }

        // Combine la recherche et les filtres
        if (whereConditions.length > 0) {
          const existingWhere = params.get("where");
          const filterWhere = whereConditions.join(" and ");
          params.set("where", existingWhere 
            ? `(${existingWhere}) and (${filterWhere})`
            : filterWhere
          );
        }

        console.log("URL params:", params.toString());

        const url = `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?${params}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        if (!mounted) return;
        setItems(data.results || []);
        setTotal(data.total_count || 0);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        if (!mounted) return;
        setError(err.message || "Erreur de chargement");
        setItems([]);
        setTotal(0);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false };
  }, [query, JSON.stringify(filters), offset, limit]);

  return { items, total, loading, error };
}
