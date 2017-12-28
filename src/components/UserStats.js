import React from 'react'
import * as firebase from 'firebase'
import { format } from '../services/helpers'
import TableView from 'react-native-tableview'
import { Dimensions, ScrollView, StyleSheet, Slider, Text, View } from 'react-native'

const { Item, Section } = TableView

const DEFAULT = 2500
const fullHeight = Dimensions.get('window').height

let payFrequencies = {
  'semiMonthly': 'Semi-Monthly (Twice a Month)',
  'monthly': 'Monthly'
}

export default class UserStats extends React.Component {
  constructor () {
    super()
    this.state = {}
  }

  componentDidMount () {
    const { stats } = this.props.user

    this.setState({
      netIncome: stats.netIncome || DEFAULT,
      payFrequency: stats.payFrequency || 'semiMonthly',
      savingsGoal: stats.savingsGoal || DEFAULT,
      expenses: stats.expenses || DEFAULT
    })
  }

  updateUser () {
    let user = firebase.auth().currentUser
    let { netIncome, payFrequency, savingsGoal, expenses } = this.state

    firebase.database().ref('users/' + user.uid).update({
      username: user.displayName,
      email: user.email,
      picture: user.photoURL,
      stats: {
        netIncome: netIncome,
        payFrequency: payFrequency,
        savingsGoal: savingsGoal,
        expenses: expenses
      }
    })
  }

  updateStat (stat, val) {
    this.setState({ [stat]: val }, this.updateUser)
  }

  render () {
    let { displayName, email } = firebase.auth().currentUser
    const { netIncome, payFrequency, savingsGoal, expenses } = this.state

    return (
      <View style={{flex: 1}}>
        <View style={styles.headerView}>
          <Text style={styles.header}>Settings</Text>
        </View>
        <ScrollView style={styles.scrollView}>
          <View style={styles.headerScroll} />
          <View style={styles.infoView}>
            <Text style={styles.infoLarge}>{displayName}</Text>
            <Text style={styles.info}>{email}</Text>
          </View>
          <View style={styles.settingContainer}>

            <View style={styles.settingView}>
              <View style={styles.setting}>
                <View style={styles.labelView}>
                  <Text style={styles.label}>Take Home Pay: ${ format(netIncome) }</Text>
                </View>
                <Slider style={styles.slider} step={10} minimumValue={500} maximumValue={4000} value={netIncome} onValueChange={this.updateStat.bind(this, 'netIncome')} />
                <Text style={styles.helper}>Your take home pay is the amount you receive each paycheck after taxes and deductions.</Text>
              </View>
            </View>

            <View style={styles.settingView}>
              <View style={styles.setting}>
                <View style={styles.labelView}>
                  <Text style={styles.label}>Savings Goal: ${ format(savingsGoal) }</Text>
                </View>
                <Slider style={styles.slider} step={10} minimumValue={0} maximumValue={3000} value={savingsGoal} onValueChange={this.updateStat.bind(this, 'savingsGoal')} />
                <Text style={styles.helper}>Your savings goal is simple. How much do you want to save each month?</Text>
              </View>
            </View>

            <View style={styles.settingView}>
              <View style={styles.setting}>
                <View style={styles.labelView}>
                  <Text style={styles.label}>Monthly Expenses: ${ format(expenses) }</Text>
                </View>
                <Slider style={styles.slider} step={10} minimumValue={500} maximumValue={3000} value={expenses} onValueChange={this.updateStat.bind(this, 'expenses')} />
                <Text style={styles.helper}>Your monthly expenses include things like your rent, electricity, or skincare product addiction.</Text>
              </View>
            </View>

            <View>
              <Text style={styles.tableLabel}>Pay Frequency</Text>
            </View>
            <TableView style={styles.tableView} fontSize={14} tableViewStyle={TableView.Consts.Style.Plain}>
              <Section>
                { Object.keys(payFrequencies).map((pf, i) => {
                  if (pf === payFrequency) return <Item key={i} onPress={this.updateStat.bind(this, 'payFrequency', pf)} selected>{payFrequencies[pf]}</Item>
                  else return <Item key={i} onPress={this.updateStat.bind(this, 'payFrequency', pf)}>{payFrequencies[pf]}</Item>
                }) }
              </Section>
            </TableView>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  'headerScroll': {
    left: 0,
    right: 0,
    top: -fullHeight,
    height: fullHeight,
    position: 'absolute',
    backgroundColor: '#BB2273'
  },
  'headerView': {
    paddingTop: 30,
    alignItems: 'center',
    backgroundColor: '#BB2273'
  },
  'header': {
    fontSize: 16,
    marginBottom: 20,
    color: '#FFFFFF'
  },
  'infoView': {
    paddingBottom: 30,
    alignItems: 'center',
    backgroundColor: '#BB2273'
  },
  'infoLarge': {
    fontSize: 14,
    marginBottom: 5,
    color: '#FFFFFF'
  },
  'info': {
    fontSize: 12,
    color: '#FFFFFF'
  },
  'scrollView': {
    flex: 1,
    backgroundColor: '#EFEFF4'
  },
  'settingContainer': {
    height: '100%',
    paddingTop: 30,
    borderTopWidth: 0.5,
    borderTopColor: '#CECED2',
    backgroundColor: '#EFEFF4'
  },
  'settingView': {
    'width': '100%'
  },
  'setting': {
    width: '100%',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    marginBottom: 15,
    marginTop: 5,
    borderTopColor: '#CECED2',
    borderBottomColor: '#CECED2',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5
  },
  'labelView': {
    width: '100%',
    marginBottom: 5,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#CECED2'
  },
  'label': {
    fontSize: 14
  },
  'helper': {
    fontSize: 12,
    color: '#8E8E93'
  },
  'text': {
    fontSize: 12,
    marginBottom: 20
  },
  'slider': {
    width: '100%'
  },
  'tableLabel': {
    color: '#8E8E93',
    paddingLeft: 15,
    marginBottom: 5,
    fontSize: 14
  },
  'tableView': {
    height: 100
  },
  'tableItem': {
    fontSize: 14
  }
})
