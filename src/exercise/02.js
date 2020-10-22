// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React from 'react'

function useLocalStorageState(key, initialValue) {
  const [value, setValue] = React.useState(
    () => JSON.parse(window.localStorage.getItem(key)) || initialValue,
  )

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
function Greeting({initialName = ''}) {
  const [user, setUser] = useLocalStorageState('user', {name: initialName})

  function handleChange(event) {
    setUser({name: event.target.value})
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={user.name} onChange={handleChange} id="name" />
      </form>
      {user.name ? <strong>Hello {user.name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
