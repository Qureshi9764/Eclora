import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../store/slices/productSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import Table from '../components/Table';
import Button from '../components/Button';
import SearchInput from '../components/SearchInput';
import Loader from '../components/Loader';
import ProductForm from './ProductForm';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await dispatch(deleteProduct(id));
      if (result.type === 'products/delete/fulfilled') {
        toast.success('Product deleted successfully');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const columns = [
    {
      header: 'Image',
      accessor: 'image',
      render: (row) => (
        <img
          src={row.image || '/placeholder.png'}
          alt={row.name}
          className="w-12 h-12 object-cover rounded-lg"
        />
      ),
    },
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => row.category?.name || 'N/A',
    },
    {
      header: 'Price',
      accessor: 'price',
      render: (row) => `$${row.price?.toFixed(2)}`,
    },
    {
      header: 'Stock',
      accessor: 'stock',
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            row.stock > 10
              ? 'bg-green-100 text-green-800'
              : row.stock > 0
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.stock}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'isActive',
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            row.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  if (loading && !products.length) {
    return <Loader fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product inventory</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          icon={<Plus size={20} />}
        >
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="w-full sm:w-96">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search products..."
        />
      </div>

      {/* Products Table */}
      <Table
        columns={columns}
        data={filteredProducts}
        actions={(row) => (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEdit(row)}
              icon={<Edit2 size={16} />}
            >
              Edit
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDelete(row._id)}
              icon={<Trash2 size={16} />}
            >
              Delete
            </Button>
          </>
        )}
        emptyMessage="No products found"
      />

      {/* Product Form Modal */}
      {isModalOpen && (
        <ProductForm
          product={editingProduct}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Products;

