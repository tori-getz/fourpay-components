import React, { Component } from 'react'
import { Button, View, StyleSheet, Platform } from 'react-native'
import RNWebView from 'react-native-webview'
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
					this.setState({
						webview: true,
						paymentUrl: payment.url
					})
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
				{!this.state.webview
				?
				<Button
					title={text}
					color={color}
					onPress={this.handlePress}
				/>
				:
				<WebView
					source={{ uri: this.state.paymentUrl }}
					style={styles.webview}
				/>}
				
			</View>
		)
	}
}

const styles = StyleSheet.create({
	wrapper: {
		display: 'absolute',
	},
	webview: {
		marginTop: "30%"
	}
})

export default FourPayButton
