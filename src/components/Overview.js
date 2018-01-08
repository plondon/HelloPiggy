import React from 'react'
import R from 'ramda'
import moment from 'moment'
import TabBar from './TabBar'
import Quotient from './Quotient'
import { connect } from 'react-redux'
import { VictoryPie } from 'victory-native'
import { handleTransactions } from '../actions'
import { format, getLastPayDay } from '../services/helpers'
import { ActivityIndicator, ActionSheetIOS, StyleSheet, ScrollView, Text, View } from 'react-native'

const { showActionSheetWithOptions } = ActionSheetIOS

const payFrequencyMap = {
  'semiMonthly': { human: 'two weeks', conversion: 2 },
  'monthly': { human: 'month', conversion: 1 }
}

class Overview extends React.Component {
  constructor () {
    super()
    this.state = {
      timeframe: 'today'
    }
  }

  componentWillMount () {
    this.props.dispatch(handleTransactions({ token: this.props.user.plaid.token, accountIds: this.props.user.plaid.accounts }))
  }

  showActions () {
    showActionSheetWithOptions({
      options: ['See Tomorrow', 'Cancel'],
      cancelButtonIndex: 1
    }, (buttonIndex) => {
      if (buttonIndex === 0) this.setState({ timeframe: 'tomorrow' })
    })
  }

  render () {
    const { timeframe } = this.state
    const { isFetching, transactions } = this.props
    const { netIncome, payFrequency, savingsGoal, expenses } = this.props.user.stats

    if (!isFetching && transactions) {
      let today = moment()
      let lastPaid = (today - getLastPayDay()) / 8.64e7
      let conversion = payFrequencyMap[payFrequency].conversion
      if (timeframe === 'tomorrow') lastPaid++

      let payPeriodGoal = savingsGoal / conversion
      let payPeriodExpenses = expenses / conversion

      let totalTarget = netIncome - payPeriodGoal - payPeriodExpenses
      // TODO: Remove this -1000 and replace with "Add Payment" option.
      let totalTransactions = transactions.filter((tx) => tx.amount > -1000)
      let totalTransactionsToday = totalTransactions.filter((tx) => tx.date === today.format('YYYY-MM-DD'))
      let totalTransactionsMinusToday = totalTransactions.filter((tx) => tx.date !== today.format('YYYY-MM-DD'))

      let totalActual = R.sum(totalTransactions.map((tx) => tx.amount))
      let totalActualToday = R.sum(totalTransactionsToday.map((tx) => tx.amount))
      let totalActualMinusToday = R.sum(totalTransactionsMinusToday.map((tx) => tx.amount))

      let dailyTarget = totalTarget / 15
      let dailyActual = totalActual / lastPaid
      let totalTargetToday = lastPaid * dailyTarget

      let spent, remaining
      if (timeframe === 'today') {
        spent = totalActualToday
        remaining = totalTargetToday - totalActualMinusToday
      } else if (timeframe === 'tomorrow') {
        spent = 0
        remaining = totalTargetToday - totalActualMinusToday
      } else {
        spent = totalActual
        remaining = totalTarget
      }

      return (
        <View>
          <ScrollView style={styles.container}>
            <View style={styles.headerView}>
              <Text style={styles.headerText}>Totals</Text>
            </View>
            <View style={styles.optionSelectView}>
              <View style={timeframe === 'today' ? styles.optionSelectedView : {}}>
                <Text onPress={() => this.setState({timeframe: 'today'})}>Today</Text>
              </View>
              <View style={timeframe === 'overall' ? styles.optionSelectedView : {}}>
                <Text onPress={() => this.setState({timeframe: 'overall'})}>Overall</Text>
              </View>
            </View>
            <View style={styles.chartView}>
              <View style={styles.centerAbsolute}>
                <Quotient dividend={'$' + format(spent)} divisor={'$' + format(remaining)} />
              </View>
              <VictoryPie
                data={[
                  { x: 'Spent', y: format(spent, true) },
                  { x: 'Remaining', y: format(remaining - spent, true) } ]}
                innerRadius={60}
                labels={() => ''}
                width={160} height={160}
                padding={{ top: 0, bottom: 0 }}
                colorScale={['#BB2273', '#FFAEBD']} />
            </View>
            <View style={styles.headerView}>
              <Text style={styles.headerText}>Averages</Text>
            </View>
            <View style={styles.optionSelectView}>
              <View style={styles.optionSelectedView}>
                <Text>Target</Text>
              </View>
              <View style={styles.optionSelectedView}>
                <Text>Actual</Text>
              </View>
            </View>
            <View style={styles.optionValueView}>
              <Text style={styles.optionValueText}>${ format(dailyTarget) }</Text>
              <Text style={styles.optionValueText}>${ format(dailyActual) }</Text>
            </View>
            <View style={styles.headerView}>
              <Text style={styles.headerText}>Recent Transactions</Text>
            </View>
            <View>
              {
                R.take(5)(totalTransactions).map((tx, i) => {
                  return (
                    <View key={i} style={styles.transactionView}>
                      <Text style={styles.transactionName}>{tx.name}</Text>
                      <Text style={styles.transactionAmount}>${tx.amount}</Text>
                    </View>
                  )
                })
              }
            </View>
            <View style={styles.moreOptionsView}>
              <Text style={styles.moreOptionsText} onPress={() => this.showActions()}>More Options</Text>
            </View>
          </ScrollView>
          <TabBar />
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
    backgroundColor: '#F8F7F5'
  },
  'headerView': {
    width: '100%',
    paddingTop: 30,
    paddingBottom: 5,
    borderBottomWidth: 1,
    alignItems: 'center',
    borderBottomColor: '#FEDCD3'
  },
  'headerText': {
    fontSize: 16,
    fontWeight: 'bold'
  },
  'optionSelectView': {
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  'optionSelectedView': {
    borderBottomColor: '#BB2273',
    borderBottomWidth: 2,
    paddingBottom: 2,
    marginBottom: 3
  },
  'optionValueView': {
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  'optionValueText': {
    fontSize: 16,
    fontWeight: 'bold'
  },
  'chartView': {
    position: 'relative',
    alignItems: 'center',
    paddingTop: 10
  },
  'centerAbsolute': {
    position: 'absolute',
    marginTop: -10,
    top: '50%'
  },
  'transactionView': {
    marginTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  'transactionName': {
    fontSize: 12,
    fontWeight: 'bold'
  },
  'transactionAmount': {
    fontSize: 12
  },
  'moreOptionsView': {
    paddingTop: 50,
    alignItems: 'center'
  },
  'moreOptionsText': {
    color: '#FFAEBD',
    fontWeight: 'bold'
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
