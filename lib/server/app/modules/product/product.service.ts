import { QueryBuilder } from '../../builder/QueryBuilder';
import { IProduct } from './product.interface';
import { Product } from './product.model';

const createProduct = async (payload: IProduct): Promise<IProduct> => {
  const result = await Product.create(payload);
  return result;
};

const getAllProducts = async (query: Record<string, unknown>) => {
  const defaultSort = 'orderIndex';
  if (!query.sort) {
    query.sort = defaultSort;
  }
  const productQuery = new QueryBuilder(Product.find(), query)
    .search(['name', 'description'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleProduct = async (id: string): Promise<IProduct | null> => {
  const result = await Product.findById(id);
  return result;
};

const updateProduct = async (
  id: string,
  payload: Partial<IProduct>,
): Promise<IProduct | null> => {
  const result = await Product.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteProduct = async (id: string): Promise<IProduct | null> => {
  const result = await Product.findByIdAndDelete(id);
  return result;
};

const reorderProducts = async (payload: { id: string; orderIndex: number }[]) => {
  const bulkOps = payload.map(item => ({
    updateOne: {
      filter: { _id: item.id },
      update: { orderIndex: item.orderIndex },
    },
  }));

  const result = await Product.bulkWrite(bulkOps);
  return result;
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  reorderProducts,
};
