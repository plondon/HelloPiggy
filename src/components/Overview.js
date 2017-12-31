import React from 'react'
import R from 'ramda'
import moment from 'moment'
import Quotient from './Quotient'
import { connect } from 'react-redux'
import { VictoryPie } from 'victory-native'
import { handleTransactions } from '../actions'
import { format, getLastPayDay } from '../services/helpers'
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native'

const payFrequencyMap = {
  'semiMonthly': { human: 'two weeks', conversion: 2 },
  'monthly': { human: 'month', conversion: 1 }
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

    if (!isFetching && transactions) {
      let today = moment()
      let lastPaid = (today - getLastPayDay()) / 8.64e7
      let conversion = payFrequencyMap[payFrequency].conversion

      let payPeriodGoal = savingsGoal / conversion
      let payPeriodExpenses = expenses / conversion

      let totalTarget = netIncome - payPeriodGoal - payPeriodExpenses
      // TODO: Remove this -1000 and replace with "Add Payment" option.
      let totalActual = R.sum(transactions.filter((tx) => tx.amount > -1000).map((tx) => tx.amount))

      let dailyTarget = totalTarget / 15
      let dailyActual = totalActual / lastPaid
      let totalTargetToday = lastPaid * dailyTarget
      let totalRemainingToday = totalTargetToday - totalActual

      return (
        <View style={styles.container}>
          <Quotient dividend={'$' + format(totalActual)} divisor={'$' + format(totalTarget)} />
          <VictoryPie
            data={
            [
              { x: 'Spent', y: format(totalActual, true) },
              { x: 'Remaining', y: format(totalTarget - totalActual, true) }
            ]}
            innerRadius={40}
            labels={() => ''}
            width={175} height={175}
            padding={{ top: 20, bottom: 20 }}
            colorScale={['#BB2273', '#FFAEBD']} />
          <Text style={styles.text}>You should be spending ${ format(dailyTarget) } each day.</Text>
          <Text style={styles.text}>You are actually spending ${ format(dailyActual) } on average.</Text>
          <Text style={styles.text}>Today you can spend ${ format(totalRemainingToday) }.</Text>
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
