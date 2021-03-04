
import Axios from "axios"

export default class FourPayClient {
    constructor ({ login, password }) {
        this.CORS_PROXY = 'https://thingproxy.freeboard.io/fetch'
        this.BASE_URL = 'https://4pay.online/api/v1'

        this.login = login
        this.password = password

        this.config = {
            mode: 'no-cors',
            headers: null
        }
    }

    async auth () {
        const reqData = {
            login: this.login,
            password: this.password
        }

        const result = await Axios.post(`${this.CORS_PROXY}/${this.BASE_URL}/session`, reqData)
        this.token = result.data.token
        Axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        Axios.defaults.headers.common['Content-Type'] = "application/json"

        return result.data
    }

    async createPayment ({ amount, description, txid, money_storage }) {
        let result = await Axios.post(`${this.CORS_PROXY}/${this.BASE_URL}/widget`,
            {
                payment: {
                    type: "widget",
                    amount: amount,
                    description: description,
                    txid: txid,
                    money_storage: money_storage
                }
            })

        return result.data.data;
    }

    async checkPayment (id) {
        let result = await Axios.get(`${this.CORS_PROXY}/${this.BASE_URL}/payments/${id}`)

        return result.data.data.status;
    }
}
