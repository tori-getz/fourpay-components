import React, { Component } from 'react'
import { Button, View, StyleSheet } from 'react-native'

import FourPayClient from "../../../lib/FourPayClient"

class FourPayButton extends Component {
	constructor () {
		super()

		this.handlePress = this.handlePress.bind(this)
		this.paymentError = this.paymentError.bind(this)
	}

	paymentError () {

	}

	async handlePress () {
		const client = new FourPayClient({
			login: this.props.fourPayLogin,
			password: this.props.fourPayPassword
		})

		try {
			const result = await client.auth()

			if (!result.error) {
				const payment = await client.createPayment({
					amount: 999,
					description: "lololo",
					txid: "hzcho",
					money_storage: {
						add: true,
						customer: "YAA CHELOVEK"
					}
				});

				if (!payment.error) {
					this.props.onWidgetCreated(payment.url)
					let paymentCheckInterval = setInterval(async () => {
						let paymentStatus = await client.checkPayment(payment.id)

						console.log(`Payment status - ${paymentStatus}`)

						if (paymentStatus === "failed") {
							this.props.onPaymentError("Payment error")
							clearInterval(paymentCheckInterval)	
						}
					}, 1500)
				} else {
					this.props.onError(payment.error)
				}
			} else {
				this.props.onError(result.error)
			}
		} catch (e) {
			console.log(e)

			this.props.onError(e.message)
		}
	}

	render() {
		const { color, text } = this.props

		return (
			<View style={styles.wrapper}>
				<Button
					title={text}
					color={color}
					onPress={this.handlePress}
				/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	wrapper: {
		display: 'absolute',
		height: "100%"
	}
})

export default FourPayButton
