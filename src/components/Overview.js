import React from 'react'
import axios from 'axios'
import R from 'ramda'
import moment from 'moment'
import { VictoryPie } from 'victory-native'
import { Text, View, StyleSheet } from 'react-native'

const payFrequencyMap = {
  'semiMonthly': { human: 'two weeks', conversion: 2 },
  'monthly': { human: 'month', conversion: 1 },
  'weekly': { human: 'week', conversion: 4 },
  'daily': { human: 'day', conversion: 30 }
}

const getTxs = 'http://localhost:8000/get_txs'

export default class Overview extends React.Component {
  constructor () {
    super()
    this.state = {}
  }

  componentDidMount () {
    const { netIncome, payFrequency, savingsGoal, expenses } = this.props.user.stats

    let today = moment()
    let endDate = moment()
    let lastPaid = today.date() % 15 || 1
    let startDate = today.date() > 15 ? today.date(15) : today.date(0)

    axios({
      method: 'post',
      url: getTxs,
      params: {
        access_token: this.props.user.plaid.token,
        start_date: startDate.format('YYYY-MM-DD'),
        end_date: endDate.format('YYYY-MM-DD'),
        options: { account_ids: [this.props.user.plaid.account.account_id] }
      }
    }).then((res) => {
      // Per Pay Period
      let conversion = payFrequencyMap[payFrequency].conversion
      let payPeriodGoal = savingsGoal / conversion
      let payPeriodExpenses = expenses / conversion

      let total = netIncome - payPeriodGoal - payPeriodExpenses
      let spending = R.sum(res.data.transactions.map((tx) => tx.amount))

      let daily = total / 15
      let target = lastPaid * daily
      let actual = spending / lastPaid
      let today = daily - (spending - target - daily)

      this.setState({ spending, total, daily, actual, today })
    })
  }

  render () {
    const { spending, total, daily, actual, today } = this.state
    const format = (n, float) => n && (float ? parseFloat(n.toFixed(2)) : n.toFixed(2))

    return (
      <View style={styles.container}>
        <Text>{ format(spending) } / { format(total) }</Text>
        <VictoryPie
          style={{ labels: { display: 'none' } }}
          width={225} height={225}
          innerRadius={40}
          data={
          [
            { x: 'Spent', y: format(spending, true) },
            { x: 'Remaining', y: format(total - spending, true) }
          ]} />
        <Text>You should be spending ${ format(daily) } each day.</Text>
        <Text>You are spending ${ format(actual) } on average.</Text>
        <Text>Today you can spend ${ format(today) }.</Text>
        <Text style={styles.subtext}>*All calculations per pay period.</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  'container': {
    height: '100%',
    paddingTop: 20,
    alignItems: 'center',
    backgroundColor: '#FEDCD3'
  },
  'subtext': {
    fontSize: 10
  }
})
