import React from 'react'
import axios from 'axios'
import R from 'ramda'
import { connect } from 'react-redux'
import * as firebase from 'firebase'
import TableView from 'react-native-tableview'
import PlaidAuthenticator from 'react-native-plaid-link'
import { routeTo, getSnapshot } from '../actions'
import { Alert, View, Text, StyleSheet, ActivityIndicator } from 'react-native'

const { Item, Section } = TableView

var authorize = 'https://hellopiggy.fun/auth'
var getAccessToken = 'https://hellopiggy.fun/get_access_token'

class Plaid extends React.Component {
  constructor () {
    super()
    this.state = {
      data: {},
      activity: true
    }
  }

  componentDidMount () {
    let { user } = this.props

    if (user == null || (user && !user.plaid)) this.setState({ activity: false })
    else this.getAuthorization(user.plaid.token, user.plaid.accounts)
  }

  setPlaidToken (token) { return firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/plaid').update({ token: token }) }

  setBankAccounts (accounts) { return firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/plaid').update({ accounts: accounts }) }

  onMessage (data) { data.metadata && data.metadata.public_token ? this.getAccessToken(data.metadata.public_token) : this.setState({data}) }

  setBankAccount (accounts, account, add) {
    let selectedAccounts = add ? R.prepend(account, accounts) : R.without([account], accounts)
    this.setBankAccounts(selectedAccounts).then(() => this.setState({ accounts: selectedAccounts }))
  }

  getAuthorization (token, accounts) {
    let user = firebase.auth().currentUser
    axios({
      method: 'get',
      url: authorize,
      params: {
        access_token: token
      }
    }).then((res) => {
      if (res.data.error) {
        this.setPlaidToken(null)
        Alert.alert(res.data.error)
        this.props.dispatch(getSnapshot(user))
      } else {
        this.setState({ activity: false, data: res.data, accounts: accounts || [] })
      }
    })
  }

  getAccessToken (token) {
    this.setState({ activity: true })
    axios({
      method: 'post',
      url: getAccessToken,
      params: {
        public_token: token
      }
    }).then((res) => {
      let token = res.data.accessToken
      this.setPlaidToken(token).then(() => this.getAuthorization(token))
    })
  }

  render () {
    let { user } = this.props
    let { data } = this.state

    if (user && (user.plaid || data.accounts)) {
      return this.renderDetails()
    } else {
      return this.renderLogin()
    }
  }

  renderDetails () {
    const { activity, accounts, data } = this.state

    if (activity) {
      return (
        <ActivityIndicator style={styles.centering} size='large' />
      )
    } else {
      const accountsView = data.accounts.map((account) => {
        if (accounts.indexOf(account.account_id) > -1) {
          return (
            <Item selected key={account.account_id} onPress={() => this.setBankAccount(accounts, account.account_id, false)} detail={'$' + account.balances.current}>
              { account.name }
            </Item>
          )
        } else {
          return (
            <Item key={account.account_id} onPress={() => this.setBankAccount(accounts, account.account_id, true)} detail={'$' + account.balances.current}>
              { account.name }
            </Item>
          )
        }
      })

      return (
        <View style={styles.container}>
          <View style={styles.headerView}>
            <Text style={styles.header}>Bank Accounts</Text>
          </View>
          <TableView style={styles.tableView} fontSize={14} tableViewStyle={TableView.Consts.Style.Plain} tableViewCellStyle={TableView.Consts.CellStyle.Subtitle} accessoryType={TableView.Consts.AccessoryType.Checkmark}>
            <Section>
              {accountsView}
            </Section>
          </TableView>
          <TableView style={styles.tableView} fontSize={14}>
            <Section>
              <Item onPress={() => this.props.dispatch(routeTo('Settings'))}>Done</Item>
            </Section>
          </TableView>
        </View>
      )
    }
  }

  renderLogin () {
    const { activity } = this.state

    if (activity) {
      return (
        <ActivityIndicator style={styles.centering} size='large' />
      )
    } else {
      return (
        <PlaidAuthenticator
          onMessage={this.onMessage.bind(this)}
          publicKey='70899249dbfcd49ba8df6af8b2df65'
          env='development'
          product='transactions'
          clientName='HelloPiggy'
        />
      )
    }
  }
}

const mapStateToProps = state => ({
  user: state.dataReducer.user,
  activity: state.dataReducer.isFetching
})

export default connect(mapStateToProps)(Plaid)

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#EFEFF4'
  },
  headerView: {
    backgroundColor: '#FFF',
    borderBottomColor: '#8E8E93',
    borderBottomWidth: 0.5,
    alignItems: 'center',
    paddingBottom: 15,
    paddingTop: 30
  },
  header: {
    fontWeight: 'bold',
    fontSize: 16
  },
  tableView: {
    flex: 1,
    marginTop: 5
  },
  centering: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
