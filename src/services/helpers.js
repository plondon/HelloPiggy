import moment from 'moment'

export function format (n, float) {
  return n && (float ? parseFloat(n.toFixed(2)) : n.toFixed(2))
}

export function getLastPayDay () {
  let today = moment()
  let currentMonth = moment().month()
  let firstPayDayOfCurrentMonth = moment().date(15).date()
  let lastPayDayOfCurrentMonth = moment().endOf('month').date()
  let lastPayDayOfPreviousMonth = moment().month(currentMonth - 1).endOf('month').date()

  do {
    lastPayDayOfCurrentMonth--
  }
  while (moment().date(lastPayDayOfCurrentMonth).day() >= 6)

  do {
    firstPayDayOfCurrentMonth--
  }
  while (moment().date(firstPayDayOfCurrentMonth).day() >= 6)

  do {
    lastPayDayOfPreviousMonth--
  }
  while (moment().month(currentMonth - 1).date(lastPayDayOfPreviousMonth).day() >= 6)

  if (today._d > moment().date(lastPayDayOfCurrentMonth)._d) {
    return moment().date(lastPayDayOfCurrentMonth)
  } else if (today._d > moment().date(firstPayDayOfCurrentMonth)._d) {
    return moment().date(firstPayDayOfCurrentMonth)
  } else {
    return moment().month(currentMonth - 1).date(lastPayDayOfPreviousMonth)
  }
}
