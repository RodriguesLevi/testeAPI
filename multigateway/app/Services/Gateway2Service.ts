import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios'

export default class Gateway2Service {
  private baseUrl: string
  private authToken: string
  private authSecret: string

  constructor() {
    this.baseUrl = Env.get('GATEWAY2_URL')
    this.authToken = Env.get('GATEWAY2_AUTH_TOKEN')
    this.authSecret = Env.get('GATEWAY2_AUTH_SECRET')
  }

  private getHeaders() {
    return {
      'Gateway-Auth-Token': this.authToken,
      'Gateway-Auth-Secret': this.authSecret
    }
  }

  public async getTransactions() {
    try {
      const response = await axios.get(`${this.baseUrl}/transacoes`, {
        headers: this.getHeaders()
      })

      return response.data
    } catch (error) {
      console.error('Gateway2 get transactions error:', error)
      throw error
    }
  }

  public async createTransaction(data: {
    valor: number,
    nome: string,
    email: string,
    numeroCartao: string,
    cvv: string
  }) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/transacoes`,
        data,
        {
          headers: this.getHeaders()
        }
      )

      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Gateway2 create transaction error:', error)
      return {
        success: false,
        error: error.response?.data || error.message
      }
    }
  }

  public async refundTransaction(transactionId: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/transacoes/reembolso`,
        {
          id: transactionId
        },
        {
          headers: this.getHeaders()
        }
      )

      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Gateway2 refund transaction error:', error)
      return {
        success: false,
        error: error.response?.data || error.message
      }
    }
  }
}
