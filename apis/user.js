const userTable = uniCloud.database().collection('user')

export const list = (query) => {
  return userTable
    .where(query)
    .get()
}

export const add = (query) => {
  return userTable
    .add(query)
}