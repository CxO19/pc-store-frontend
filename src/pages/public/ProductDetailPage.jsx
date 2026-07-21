import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error al obtener detalle:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p className="p-8">Cargando detalle del producto...</p>;
  if (!product) return <p className="p-8">Producto no encontrado.</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link to="/productos" className="text-emerald-500 hover:underline mb-4 inline-block">&larr; Volver al catálogo</Link>
      <div className="border p-6 rounded-2xl shadow-lg mt-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-xl text-emerald-400 font-semibold mt-2">${product.price}</p>
        <div className="mt-6">
          <h3 className="text-lg font-medium">Descripción técnica:</h3>
          <p className="text-gray-300 mt-2">{product.description}</p>
        </div>
        <div className="mt-6">
          <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">Stock disponible: {product.stock || 'Consultar'}</span>
        </div>
      </div>
    </div>
  );
}