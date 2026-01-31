'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState([20, 150]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const categories = [
    { name: 'Camisetas', slug: 'camisetas' },
    { name: 'Pantalones', slug: 'pantalones' },
    { name: 'Vestidos', slug: 'vestidos' },
    { name: 'Chaquetas', slug: 'chaquetas' },
    { name: 'Accesorios', slug: 'accesorios' },
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const colors = [
    { name: 'Negro', hex: '#000000' },
    { name: 'Blanco', hex: '#FFFFFF' },
    { name: 'Azul', hex: '#3B82F6' },
    { name: 'Púrpura', hex: '#7C3AED' },
    { name: 'Verde', hex: '#10B981' },
    { name: 'Rojo', hex: '#EF4444' },
  ];

  // Cargar productos
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProducts(data as Product[]);
        setFilteredProducts(data as Product[]);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...products];

    // Filtro de búsqueda
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro de categoría
    if (selectedCategory) {
      filtered = filtered.filter(p => {
        // Aquí asumimos que el nombre de la categoría está en el campo name del producto
        // o puedes hacer un join con la tabla categories
        return p.name.toLowerCase().includes(selectedCategory.toLowerCase());
      });
    }

    // Filtro de precio
    filtered = filtered.filter(p =>
      p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Filtro de tallas
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p =>
        selectedSizes.some(size => p.sizes.includes(size))
      );
    }

    // Filtro de colores
    if (selectedColors.length > 0) {
      filtered = filtered.filter(p =>
        selectedColors.some(color =>
          p.colors.some(c => c.toLowerCase().includes(color.toLowerCase()))
        )
      );
    }

    // Ordenamiento
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset a la primera página
  }, [searchQuery, selectedCategory, priceRange, selectedSizes, selectedColors, sortBy, products]);

  // Paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setPriceRange([20, 150]);
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c3aed]"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#171121]">
      {/* Breadcrumbs */}
      <nav className="max-w-[1440px] mx-auto px-6 py-6 flex items-center gap-2 text-sm">
        <a href="/" className="text-gray-500 hover:text-[#7c3aed] transition-colors">Inicio</a>
        <span className="text-gray-300">/</span>
        <span className="font-medium text-[#130e1b] dark:text-white">Productos</span>
      </nav>

      <div className="max-w-[1440px] mx-auto px-6 pb-20">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sidebar Filters */}
          <aside className="w-full lg:w-[300px] flex-shrink-0">
            <div className="sticky top-24 space-y-8 animate-fadeIn">

              <div>
                <h3 className="text-xl font-bold text-[#130e1b] dark:text-white mb-4">Filtros</h3>

                {/* Categorías */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-[#130e1b] dark:text-white mb-3">Categorías</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category.slug} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedCategory === category.slug}
                          onChange={() => setSelectedCategory(
                            selectedCategory === category.slug ? null : category.slug
                          )}
                          className="w-5 h-5 rounded border-2 border-gray-300 text-[#7c3aed] focus:ring-[#7c3aed] focus:ring-offset-0 transition-colors"
                        />
                        <span className="text-sm text-[#130e1b] dark:text-gray-300 group-hover:text-[#7c3aed] transition-colors">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Precio */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-[#130e1b] dark:text-white mb-3">Precio</h4>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#7c3aed]"
                    />
                    <div className="flex items-center justify-between mt-3 text-sm">
                      <span className="text-gray-600">${priceRange[0]}</span>
                      <span className="font-semibold text-[#7c3aed]">${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Tallas */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-[#130e1b] dark:text-white mb-3">Tallas</h4>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedSizes.includes(size)
                            ? 'bg-[#7c3aed] text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colores */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-[#130e1b] dark:text-white mb-3">Colores</h4>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => toggleColor(color.name)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColors.includes(color.name)
                            ? 'border-[#7c3aed] scale-110'
                            : 'border-gray-300 hover:scale-105'
                          }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Botón limpiar filtros */}
                <button
                  onClick={clearFilters}
                  className="w-full py-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl font-bold transition-all transform hover:scale-105"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fadeIn">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent bg-white dark:bg-gray-800 text-[#130e1b] dark:text-white"
                />
              </div>

              {/* Sort and Count */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  Mostrando {filteredProducts.length} productos
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#7c3aed] bg-white dark:bg-gray-800 text-[#130e1b] dark:text-white"
                >
                  <option value="relevance">Relevancia</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="name">Nombre</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {currentProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-500">No se encontraron productos</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-[#7c3aed] hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProducts.map((product, index) => (
                  <div key={product.id} className={`animate-scaleIn stagger-${Math.min(index + 1, 6)}`}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === pageNumber
                            ? 'bg-[#7c3aed] text-white'
                            : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return <span key={pageNumber} className="px-2">...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
