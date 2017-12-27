import React from 'react'
import R from 'ramda'
import moment from 'moment'
import Quotient from './Quotient'
import { connect } from 'react-redux'
import { VictoryPie } from 'victory-native'
import { handleTransactions } from '../actions'
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native'

const payFrequencyMap = {
  'semiMonthly': { human: 'two weeks', conversion: 2 },
  'monthly': { human: 'month', conversion: 1 },
  'weekly': { human: 'week', conversion: 4 },
  'daily': { human: 'day', conversion: 30 }
}

class Overview extends React.Component {
  constructor () {
    super()
    this.state = {}
  }

  componentWillMount () {
    this.props.dispatch(handleTransactions({ token: this.props.user.plaid.token, account: this.props.user.plaid.account.account_id }))
  }

  render () {
    const { isFetching, transactions } = this.props
    const { netIncome, payFrequency, savingsGoal, expenses } = this.props.user.stats
    const format = (n, float) => n && (float ? parseFloat(n.toFixed(2)) : n.toFixed(2))

    if (!isFetching && transactions) {
      let lastPaid = moment().date() % 15 || 1
      let conversion = payFrequencyMap[payFrequency].conversion

      let payPeriodGoal = savingsGoal / conversion
      let payPeriodExpenses = expenses / conversion

      let total = netIncome - payPeriodGoal - payPeriodExpenses
      // TODO: Remove this -1000 and replace with "Add Payment" option.
      let spending = R.sum(transactions.filter((tx) => tx.amount > -1000).map((tx) => tx.amount))

      let daily = total / 15
      let target = lastPaid * daily
      let actual = spending / lastPaid
      let today = daily - (spending - target - daily)

      return (
        <View style={styles.container}>
          <Quotient dividend={format(spending)} divisor={format(total)} />
          <VictoryPie
            data={
            [
              { x: 'Spent', y: format(spending, true) },
              { x: 'Remaining', y: format(total - spending, true) }
            ]}
            innerRadius={40}
            labels={() => ''}
            width={175} height={175}
            padding={{ top: 20, bottom: 20 }}
            colorScale={['#BB2273', '#FFAEBD']} />
          <Text style={styles.text}>You should be spending ${ format(daily) } each day.</Text>
          <Text style={styles.text}>You are spending ${ format(actual) } on average.</Text>
          <Text style={styles.text}>Today you can spend ${ format(today) }.</Text>
          <Text style={styles.subtext}>*All calculations per pay period.</Text>
        </View>
      )
    } else {
      return (
        <ActivityIndicator style={styles.centering} size='large' />
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    user: state.dataReducer.user,
    isFetching: state.dataReducer.isFetching,
    transactions: state.dataReducer.transactions
  }
}

export default connect(mapStateToProps)(Overview)

const styles = StyleSheet.create({
  'container': {
    height: '100%',
    paddingTop: 30,
    alignItems: 'center',
    backgroundColor: '#FEDCD3'
  },
  'text': {
    fontSize: 16
  },
  'subtext': {
    fontSize: 10
  },
  'centering': {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
