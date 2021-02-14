import React, { Component } from 'react'
import { Button, View, StyleSheet } from 'react-native'
import WebView from "react-native-webview"

import FourPayClient from "../../../lib/FourPayClient"

class FourPayButton extends Component {
	constructor () {
		super()

		this.handlePress = this.handlePress.bind(this)
	}

	async handlePress () {
		const client = new FourPayClient({
			login: this.props.fourPayLogin,
			password: this.props.fourPayPassword
		})

		try {
			const result = await client.auth()

			alert(result.token)

			if (!result.error) {
				const payment = await client.createPayment({
					amount: 1,
					description: "lololo",
					txid: "hzcho",
					money_storage: {
						add: true,
						customer: "YAA CHELOVEK"
					}
				});

				if (!payment.error) {
					this.props.onWidgetCreated('https://kernel.org')
				} else {
					this.props.onError(payment.error)
				}
			} else {
				this.props.onError(result.error)
			}
		} catch (e) {
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
	},
	webview: {
		position: 'absolute',
		height: 200
	}
})

export default FourPayButton
