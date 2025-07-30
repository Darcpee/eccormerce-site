const order = require ("../model/order");

exports.createOrder = async (req, res) => {
  const { userId, products, amount } = req.body;

  if (!userId || !products || !Array.isArray(products) || !amount) {
    return res.status(400).json({
      message: "userId, products array, and amount are required",
    });
  }

  try {
    const newOrder = new order({
      userId,
      products,
      amount
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      message: "Failed to create order",
      error: error.message
    });
  }
};

















exports.getMonthlyIncome = async (req, res) => {
  try {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const prevMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: prevMonth } // filter from two months ago
        }
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          amount: 1
        }
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          totalIncome: { $sum: "$amount" }
        }
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1 }
      }
    ]);

    res.status(200).json({
      message: "Monthly income retrieved successfully",
      income
    });
  } catch (error) {
    console.error("Error calculating income:", error);
    res.status(500).json({
      message: "Failed to retrieve income",
      error: error.message
    });
  }
};