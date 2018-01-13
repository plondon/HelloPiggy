import React from 'react'
import * as firebase from 'firebase'
import { connect } from 'react-redux'
import { format } from '../services/helpers'
import TableView from 'react-native-tableview'
import { updateUser, routeTo } from '../actions'
import { Dimensions, ScrollView, StyleSheet, Slider, Text, View } from 'react-native'

const { Item, Section } = TableView

const DEFAULT = 2500
const fullHeight = Dimensions.get('window').height

let payFrequencyMap = {
  'semiMonthly': 'Semi-Monthly (Twice a Month)',
  'monthly': 'Monthly'
}

let settingsMap = {
  'netIncome': {
    min: 500,
    max: 4500,
    label: (val) => 'Take Home Pay: $' + format(val),
    helper: 'Your take home pay is the amount you receive each paycheck after taxes and deductions.'
  },
  'savingsGoal': {
    min: 0,
    max: 3000,
    label: (val) => 'Savings Goal: $' + format(val),
    helper: 'Your savings goal is simple. How much do you want to save each month?'
  },
  'expenses': {
    min: 500,
    max: 4500,
    label: (val) => 'Monthly Expenses: $' + format(val),
    helper: 'Your monthly expenses include things like your rent, electricity, or skincare product addiction.'
  }
}

class Settings extends React.Component {
  constructor () {
    super()
    this.state = {}
  }

  componentDidMount () {
    const { settings } = this.props.user

    this.setState({
      netIncome: (settings && settings.netIncome) || DEFAULT,
      payFrequency: (settings && settings.payFrequency) || 'semiMonthly',
      savingsGoal: (settings && settings.savingsGoal) || DEFAULT,
      expenses: (settings && settings.expenses) || DEFAULT
    })
  }

  updateUser () {
    let user = firebase.auth().currentUser
    let { netIncome, payFrequency, savingsGoal, expenses } = this.state

    this.props.dispatch(updateUser(user, { netIncome, payFrequency, savingsGoal, expenses }))
  }

  updateStat (stat, val) {
    this.setState({ [stat]: val }, this.updateUser)
  }

  render () {
    let { displayName, email } = firebase.auth().currentUser

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
            {
              Object.keys(settingsMap).map((setting, i) => {
                return (
                  <View key={i} style={styles.settingView}>
                    <View style={styles.setting}>
                      <View style={styles.labelView}>
                        <Text style={styles.label}>{settingsMap[setting].label(this.state[setting])}</Text>
                      </View>
                      <Slider style={styles.slider} step={10} minimumValue={settingsMap[setting].min} maximumValue={settingsMap[setting].max} value={this.state[setting]} onValueChange={this.updateStat.bind(this, setting)} />
                      <Text style={styles.helper}>{settingsMap[setting].helper}</Text>
                    </View>
                  </View>
                )
              })
            }

            <View>
              <Text style={styles.tableLabel}>Pay Frequency</Text>
            </View>
            <TableView style={styles.payFrequencyTableView} fontSize={14} tableViewStyle={TableView.Consts.Style.Plain}>
              <Section>
                { Object.keys(payFrequencyMap).map((pf, i) => {
                  if (pf === this.state.payFrequency) return <Item key={i} onPress={this.updateStat.bind(this, 'payFrequency', pf)} selected>{payFrequencyMap[pf]}</Item>
                  else return <Item key={i} onPress={this.updateStat.bind(this, 'payFrequency', pf)}>{payFrequencyMap[pf]}</Item>
                }) }
              </Section>
            </TableView>

            <TableView style={styles.bankAccountTableView} fontSize={14} tableViewStyle={TableView.Consts.Style.Plain}>
              <Section>
                <Item onPress={() => this.props.dispatch(routeTo('Plaid'))}>Change Bank Account</Item>
              </Section>
            </TableView>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.dataReducer.user
  }
}

export default connect(mapStateToProps)(Settings)

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
    color: '#F8F7F5'
  },
  'infoView': {
    paddingBottom: 30,
    alignItems: 'center',
    backgroundColor: '#BB2273'
  },
  'infoLarge': {
    fontSize: 14,
    marginBottom: 5,
    color: '#F8F7F5'
  },
  'info': {
    fontSize: 12,
    color: '#F8F7F5'
  },
  'scrollView': {
    flex: 1,
    backgroundColor: '#EFEFF4'
  },
  'settingContainer': {
    height: '100%',
    paddingTop: 20,
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
  'payFrequencyTableView': {
    height: 90
  },
  'bankAccountTableView': {
    height: 90
  }
})
