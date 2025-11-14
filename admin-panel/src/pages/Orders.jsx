import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../store/slices/orderSlice';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import SearchInput from '../components/SearchInput';
import Loader from '../components/Loader';
import { Eye, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    let filtered = orders;

    if (statusFilter !== 'All') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [searchQuery, statusFilter, orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    const result = await dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
    if (result.type === 'orders/updateStatus/fulfilled') {
      toast.success('Order status updated successfully');
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const columns = [
    {
      header: 'Order ID',
      accessor: '_id',
      render: (row) => `#${row._id?.slice(-6).toUpperCase()}`,
    },
    {
      header: 'Customer',
      accessor: 'user',
      render: (row) => (
        <div>
          <p className="font-medium">{row.user?.name || 'Guest'}</p>
          <p className="text-xs text-gray-500">{row.user?.email}</p>
        </div>
      ),
    },
    {
      header: 'Items',
      accessor: 'items',
      render: (row) => row.items?.length || 0,
    },
    {
      header: 'Total',
      accessor: 'totalAmount',
      render: (row) => `$${row.totalAmount?.toFixed(2)}`,
    },
    {
      header: 'Payment',
      accessor: 'paymentStatus',
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            row.paymentStatus === 'Paid'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {row.paymentStatus || 'Pending'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row._id, e.target.value)}
          className={`px-3 py-1 rounded-lg text-xs font-medium border-0 focus:ring-2 focus:ring-lavender-500 ${
            row.status === 'delivered'
              ? 'bg-green-100 text-green-800'
              : row.status === 'shipped'
              ? 'bg-blue-100 text-blue-800'
              : row.status === 'processing'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      ),
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  if (loading && !orders.length) {
    return <Loader fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <p className="text-gray-600 mt-1">Manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by order ID, customer name or email..."
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'pending', 'processing', 'shipped', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                statusFilter === status
                  ? 'bg-gradient-to-r from-pink-light to-lavender-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <Table
        columns={columns}
        data={filteredOrders}
        actions={(row) => (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewDetails(row)}
            icon={<Eye size={16} />}
          >
            View
          </Button>
        )}
        emptyMessage="No orders found"
      />

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Order #${selectedOrder._id?.slice(-6).toUpperCase()}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-medium">{selectedOrder.user?.name || 'Guest'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{selectedOrder.user?.email || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {selectedOrder.shippingAddress && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
                <p className="text-sm text-gray-700">
                  {selectedOrder.shippingAddress.street}<br />
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}<br />
                  {selectedOrder.shippingAddress.country}
                </p>
              </div>
            )}

            {/* Order Items */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.items?.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={item.product?.image || '/placeholder.png'}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.product?.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ${item.price?.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${(item.quantity * item.price).toFixed(2)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${selectedOrder.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${selectedOrder.shippingCost?.toFixed(2) || '0.00'}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-${selectedOrder.discount?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>${selectedOrder.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Orders;

