import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ProductsPublicPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('asc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ejemplo de consumo a tu API backend con Axios
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error al cargar productos públicos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    if (sort === 'asc') return a.price - b.price;
    return b.price - a.price;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Catálogo de Productos</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <input 
          type="text" 
          placeholder="Buscar componentes, PCs..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 rounded-lg border bg-transparent w-full md:w-1/3"
        />
        <select 
          value={sort} 
          onChange={(e) => setSort(e.target.value)}
          className="p-3 rounded-lg border bg-transparent"
        >
          <option value="asc">Precio: Menor a Mayor</option>
          <option value="desc">Precio: Mayor a Menor</option>
        </select>
      </div>

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id || product._id} className="border p-4 rounded-xl shadow-md flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-gray-400 mt-2">{product.description}</p>
                <p className="text-lg font-bold mt-4">${product.price}</p>
              </div>
              <Link 
                to={`/productos/${product.id || product._id}`} 
                className="mt-4 block text-center bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
              >
                Ver Detalle
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}