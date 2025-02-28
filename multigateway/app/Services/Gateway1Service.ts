import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios'

export default class Gateway1Service {
  private baseUrl: string
  private email: string
  private token: string
  private authToken: string | null = null

  constructor() {
    this.baseUrl = Env.get('GATEWAY1_URL')
    this.email = Env.get('GATEWAY1_EMAIL')
    this.token = Env.get('GATEWAY1_TOKEN')
  }

  public async authenticate() {
    try {
      const response = await axios.post(`${this.baseUrl}/login`, {
        email: this.email,
        token: this.token
      })

      this.authToken = response.data.token
      return true
    } catch (error) {
      console.error('Gateway1 authentication error:', error)
      return false
    }
  }

  public async getTransactions() {
    try {
      if (!this.authToken) {
        await this.authenticate()
      }

      const response = await axios.get(`${this.baseUrl}/transactions`, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      })

      return response.data
    } catch (error) {
      console.error('Gateway1 get transactions error:', error)
      throw error
    }
  }

  public async createTransaction(data: {
    amount: number,
    name: string,
    email: string,
    cardNumber: string,
    cvv: string
  }) {
    try {
      if (!this.authToken) {
        await this.authenticate()
      }

      const response = await axios.post(
        `${this.baseUrl}/transactions`,
        data,
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`
          }
        }
      )

      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Gateway1 create transaction error:', error)
      return {
        success: false,
        error: error.response?.data || error.message
      }
    }
  }

  public async refundTransaction(transactionId: string) {
    try {
      if (!this.authToken) {
        await this.authenticate()
      }

      const response = await axios.post(
        `${this.baseUrl}/transactions/${transactionId}/charge_back`,
        {},
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`
          }
        }
      )

      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Gateway1 refund transaction error:', error)
      return {
        success: false,
        error: error.response?.data || error.message
      }
    }
  }
}
