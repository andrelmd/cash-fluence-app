import Database from 'tauri-plugin-sql-api'

export default async function <T>(
  databaseConnection: Database,
  callback: () => Promise<T>,
) {
  try {
    console.log('Starting transaction')
    await databaseConnection
      .execute('BEGIN TRANSACTION;')
      .then(() => console.log('Transaction started'))
    const result = await callback().then((result) => {
      console.log('Transaction callback executed')
      return result
    })
    await databaseConnection
      .execute('COMMIT;')
      .then(() => console.log('Transaction commited'))
    return result
  } catch (error) {
    console.error('Transaction could not be commited', error)
    await databaseConnection
      .execute('ROLLBACK;')
      .then(() => console.log('Transaction rolled back'))
  }
}
