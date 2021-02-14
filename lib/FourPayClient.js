
import Axios from "axios"

export default class FourPayClient {
    constructor ({ login, password }) {
        this.BASE_URL = 'https://4pay.online/api/v1'

        this.login = login
        this.password = password

        this.token = null
    }

    async auth () {
        const reqData = {
            login: this.login,
            password: this.password
        }

        const result = await Axios.post(`${this.BASE_URL}/session`, reqData)

        this.token = result.data.token

        return result.data
    }

    async createPayment ({ amount, description, txid, money_storage }) {
        const axiosConfig = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.token}`,
                "Access-Control-Allow-Origin": "*"
            }
        }

        const paymentRequest = {
            payment: {
                amount: amount,
                description: description,
                txid: txid,
                money_storage: {
                    add: money_storage.add,
                    customer: money_storage.customer
                }
            }
        }

        try {
            const paymentInfo = await Axios.post(`${this.BASE_URL}/widget`, paymentRequest, axiosConfig)

            return paymentInfo.data
        } catch (error) {
            return { error: error.message }
        }
    }
}
