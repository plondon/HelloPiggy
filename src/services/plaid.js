import axios from 'axios'
import moment from 'moment'

const getTxs = 'https://hellopiggy.fun/get_txs'

export function getTransactions (opts) {
  let today = moment()
  let endDate = moment()
  let startDate = today.date() > 15 ? today.date(15) : today.date(0)

  let { token, account } = opts.data

  return axios({
    method: 'post',
    url: getTxs,
    params: {
      access_token: token,
      start_date: startDate.format('YYYY-MM-DD'),
      end_date: endDate.format('YYYY-MM-DD'),
      options: { account_ids: [account] }
    }
  })
}
