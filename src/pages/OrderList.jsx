import { useState, useEffect } from 'react'
import { getOrders } from '../services/api'

const OrderList = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getOrders()
        setOrders(ordersData)
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (isLoading) {
    return <div className="text-center py-10">Loading orders...</div>
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-bold mb-4">No Orders Found</h2>
        <p>You haven't placed any orders yet.</p>
      </div>
    )
  }

  // Group orders by userId
  const ordersByUser = orders.reduce((groups, order) => {
    if (!groups[order.userId]) {
      groups[order.userId] = []
    }
    groups[order.userId].push(order)
    return groups
  }, {})

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      
      {Object.entries(ordersByUser).map(([userId, userOrders]) => (
        <div key={userId} className="mb-8">
          <h2 className="text-lg font-semibold mb-3">User ID: {userId}</h2>
          
          {Object.entries(
            userOrders.reduce((groups, order) => {
              const date = new Date(order.orderDate).toLocaleDateString()
              if (!groups[date]) {
                groups[date] = []
              }
              groups[date].push(order)
              return groups
            }, {})
          ).map(([date, dateOrders]) => (
            <div key={date} className="mb-6">
              <h3 className="text-md font-semibold mb-2">Orders placed on {date}</h3>
              <div className="bg-white rounded-lg shadow-lg divide-y">
                {dateOrders.map(order => (
                  <div key={order.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{order.product.name}</h3>
                        <p className="text-sm text-gray-600">
                          Quantity: {order.quantity} × ${order.product.price.toFixed(2)}
                        </p>
                      </div>
                      
                      <div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {order.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600">Order #{order.id}</p>
                      <p className="font-medium">Total: ${order.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default OrderList
