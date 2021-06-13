import React from 'react';
import {Button, Popover} from 'antd'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  justify-content: center;
  align-items: center;
`

const App = () => {
  const content = (
    <div>
      <p>hello</p>
    </div>
  )
  return (
  <Container>
    <Popover placement="rightBottom" title={'text'} content={content} trigger="click">
        <Button>Please Help</Button>
    </Popover>
  </Container>
  )
}

export default App;
