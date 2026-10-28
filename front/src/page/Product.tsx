import React, { useState, useEffect, useCallback } from "react";
import {
  productService,
  type Product,
  type SearchProductParams,
  type Pagination,
} from "../services/productApi";
import { ProductModal } from "../components/ProductModal";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import {
  Search,
  Plus,
  Trash2,
  Edit3,
  SlidersHorizontal,
  RefreshCw,
  Package,
  ChevronLeft,
  ChevronRight,
  Tag,
  ArrowUpDown,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 8,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Flash notification helper
  const showToast = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params: SearchProductParams = {
        query: searchQuery || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        tag: tagFilter || undefined,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: 8,
      };

      const response = await productService.search(params);
      setProducts(response.products || []);
      setPagination(response.pagination || { total: 0, page: 1, limit: 8, totalPages: 1 });
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, minPrice, maxPrice, tagFilter, sortBy, sortOrder, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle Search Input Debouncing / Enter
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    setTagFilter("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  // Create or Update Product
  const handleSaveProduct = async (data: {
    name: string;
    description: string;
    price: number;
    tags: string;
  }) => {
    if (modalMode === "create") {
      await productService.create(data);
      showToast("success", "Product created successfully!");
    } else if (selectedProduct) {
      await productService.update(selectedProduct.id, data);
      showToast("success", "Product updated successfully!");
    }
    fetchProducts();
  };

  // Delete Product
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setDeleteLoading(true);
      await productService.delete(productToDelete.id);
      showToast("success", `Product "${productToDelete.name}" deleted.`);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      // If last item on page and page > 1, go to previous page
      if (products.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchProducts();
      }
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Failed to delete product.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Toast Alert */}
        {notification && (
          <div
            className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition animate-in slide-in-from-top-3 ${
              notification.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800"
                : "bg-red-50 dark:bg-red-950/80 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 size={18} className="text-emerald-500" />
            ) : (
              <AlertCircle size={18} className="text-red-500" />
            )}
            {notification.message}
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              <Package className="text-indigo-600 dark:text-indigo-400" />
              Product Catalog
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Search, filter, create, update, and manage your products with real-time sync.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedProduct(null);
                setModalMode("create");
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-indigo-600/20 transition cursor-pointer"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </div>

        {/* Search & Filter Controls Bar */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by title, description or tags..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition cursor-pointer"
              >
                Search
              </button>

              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition cursor-pointer ${
                  showFilters
                    ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300"
                    : "border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                }`}
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>

              <button
                type="button"
                onClick={fetchProducts}
                title="Refresh"
                className="p-2.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </form>

          {/* Extended Filters Drawer */}
          {showFilters && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Min Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Max Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="999.00"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Filter by Tag
                </label>
                <input
                  type="text"
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  placeholder="e.g. tech"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Order
                </label>
                <button
                  type="button"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <span>{sortOrder === "asc" ? "Ascending (Low-High)" : "Descending (High-Low)"}</span>
                  <ArrowUpDown size={14} className="text-slate-400" />
                </button>
              </div>

              <div className="sm:col-span-2 lg:col-span-5 flex justify-end">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Reset all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Product Cards Grid / List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <RefreshCw className="animate-spin text-indigo-600 mb-3" size={32} />
            <p className="text-slate-500 text-sm">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center px-4">
            <Package size={48} className="text-slate-300 dark:text-slate-600 mb-3" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No products found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1">
              Try adjusting your search criteria or add a new product to get started.
            </p>
            <button
              onClick={() => {
                setSelectedProduct(null);
                setModalMode("create");
                setIsModalOpen(true);
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition"
            >
              Add First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition" title={prod.name}>
                      {prod.name}
                    </h3>
                    <span className="shrink-0 px-2.5 py-1 text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg">
                      ${Number(prod.price).toFixed(2)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 min-h-[48px]">
                    {prod.description}
                  </p>

                  {/* Tags */}
                  {prod.tags && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {prod.tags
                        .split(",")
                        .filter(Boolean)
                        .map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md"
                          >
                            <Tag size={10} className="text-slate-400" />
                            {tag.trim()}
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    ID #{prod.id}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedProduct(prod);
                        setModalMode("edit");
                        setIsModalOpen(true);
                      }}
                      title="Edit Product"
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition cursor-pointer"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setProductToDelete(prod);
                        setIsDeleteModalOpen(true);
                      }}
                      title="Delete Product"
                      className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              Showing page <span className="font-semibold text-slate-800 dark:text-white">{pagination.page}</span> of{" "}
              <span className="font-semibold text-slate-800 dark:text-white">{pagination.totalPages}</span> ({pagination.total} total items)
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1 || loading}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-sm font-medium"
              >
                <ChevronLeft size={16} />
                Prev
              </button>

              <button
                disabled={currentPage >= pagination.totalPages || loading}
                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-sm font-medium"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveProduct}
        product={selectedProduct}
        mode={modalMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        productName={productToDelete?.name || ""}
        loading={deleteLoading}
      />
    </div>
  );
};

export default ProductPage;
