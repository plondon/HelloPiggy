import axios from 'axios'
import moment from 'moment'
import { getLastPayDay } from '../services/helpers'

const getTxs = 'https://hellopiggy.fun/get_txs'

export function getTransactions (opts) {
  let endDate = moment()
  let startDate = getLastPayDay()

  let { token, accounts } = opts.data

  return axios({
    method: 'post',
    url: getTxs,
    params: {
      access_token: token,
      start_date: startDate.format('YYYY-MM-DD'),
      end_date: endDate.format('YYYY-MM-DD'),
      options: { account_ids: accounts }
    }
  })
}
