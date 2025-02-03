import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schema/product.schema';
import { faker } from '@faker-js/faker'; 
import { QueryParamsDto } from './dto/query-params.dto';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(@InjectModel('product') private productModel: Model<Product>){}
  
  async onModuleInit() {
    const count = await this.productModel.countDocuments()
    if(count === 0){
      const productList = []
      for(let i = 0; i < 100_000; i++){
        const product = {
          name: faker.commerce.productName(),
          desc: faker.commerce.productDescription(),
          price: faker.number.int({min: 10, max: 3000}),
          imageUrl: faker.image.url({width: 500, height: 500}),
          quantity: faker.number.int({min: 0, max: 20})
        }
        productList.push(product)
      }

      await this.productModel.insertMany(productList)
      console.log('intersed')
    }

    
    // console.log('on mount', product)
  }

  deleteAll(){
    return this.productModel.deleteMany()
  }

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  findAll({page, take}: QueryParamsDto) {
    const limit = Math.min(take, 30)
    return this.productModel.find().skip((page - 1) * limit).limit(limit)
  }

  async getProduct(){
    return await this.productModel.find({price: {$gte: 1000}})
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
