import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import ProductValidator from 'App/Validators/ProductValidator'

export default class ProductController {
  public async index({ response }: HttpContextContract) {
    const products = await Product.all()
    return response.ok(products)
  }

  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(ProductValidator)

    const product = await Product.create(data)

    return response.created(product)
  }

  public async show({ params, response }: HttpContextContract) {
    const product = await Product.find(params.id)

    if (!product) {
      return response.notFound({ message: 'Product not found' })
    }

    return response.ok(product)
  }

  public async update({ params, request, response }: HttpContextContract) {
    const product = await Product.find(params.id)

    if (!product) {
      return response.notFound({ message: 'Product not found' })
    }

    const data = await request.validate(ProductValidator)

    product.merge(data)
    await product.save()

    return response.ok(product)
  }

  public async destroy({ params, response }: HttpContextContract) {
    const product = await Product.find(params.id)

    if (!product) {
      return response.notFound({ message: 'Product not found' })
    }

    await product.delete()

    return response.ok({ message: 'Product deleted successfully' })
  }
}
