import { Op, Sequelize } from 'sequelize';
import Product from '../sequelize/models/products';
import  OrderItem  from '../sequelize/models/orderItems';

interface OrderItemWithProduct extends OrderItem {
    product: Product;
  }

export class StatisticsService {
  static async calculateMonthlyStats(sellerId: string, startOfMonth: Date, endOfMonth: Date) {
   
    const totalProducts = await Product.count({ where: { userId: sellerId } });

    const itemsOrdered= (await OrderItem.findAll({ 
      include: [{
        model: Product,
        as: 'product',
        where: { userId: sellerId },
        required: true
      }],
      where: { 
        createdAt: { [Op.gte]: startOfMonth, [Op.lte]: endOfMonth } 
      } 
    })) as OrderItemWithProduct[];

    const monthlySales = itemsOrdered.reduce((sum, item) => sum + item.quantity, 0);

    const monthlyRevenue = itemsOrdered.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
   

    const expiredProducts = await Product.findAll({ 
        where: { 
          userId: sellerId, 
          expiryDate: { [Op.gte]: startOfMonth, [Op.lte]: endOfMonth } 
        } 
      });

  
      const losses = expiredProducts.reduce((sum, product) => sum + product.price, 0);
    const monthName = startOfMonth.toLocaleString('default', { month: 'long' });
    return {
      month: monthName,
      totalProducts,
      monthlySales,
      monthlyRevenue,
      expiredProducts,
      losses,
    };
  }
}