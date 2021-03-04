import React, { Component } from 'react'
import { Button, View, StyleSheet, Platform } from 'react-native'
import { WebView as RNWebView } from 'react-native-webview'
import IFrameWebView from "../../../lib/IFrameWebView"

import FourPayClient from "../../../lib/FourPayClient"

let WebView = null;

if (Platform.OS === "web") {
	WebView = IFrameWebView;
} else {
	WebView = RNWebView;
}

class FourPayButton extends Component {
	constructor () {
		super()

		this.state = {
			webview: false,
			paymentUrl: ""
		};

		this.handlePress = this.handlePress.bind(this)
		this.paymentError = this.paymentError.bind(this)
	}

	componentDidMount () {
		console.log(this.props);
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
					amount: this.props.amount,
					description: this.props.description,
					txid: this.props.txid,
					money_storage: {
						add: true,
						customer: this.props.customer
					}
				});

				if (!payment.error) {
					this.props.onWidgetCreated(payment.url);

					const checkInterval = setInterval(async () => {
						let status = await client.checkPayment(payment.id);

						console.log(`PAYMENT STATUS - ${status}`);

						if (status !== "created") {
							if (status === "Charged") {
								this.props.onPaymentSuccess();
							} else {
								this.props.onPaymentError();
							}

							clearInterval(checkInterval)
						}
					}, 1000)
				} else {
					this.props.onError(payment.error)
				}
			} else {
				this.props.onError(result.error)
			}
		} catch (e) {
			console.log(e);

			this.props.onError(e.message)
		}
	}

	render() {
		const { color, text } = this.props

		if (this.state.paymentUrl) {
			console.log(this.state.paymentUrl);
		}

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
		display: 'flex',
	},
	webview: {
		marginTop: "30%"
	}
})

export default FourPayButton
