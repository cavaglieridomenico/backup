
export default async function fetchRequest({
  uri,
}) {

  const response = await fetch(`${uri}`, {
    method: 'GET',
  })

  return await response.json()

}
