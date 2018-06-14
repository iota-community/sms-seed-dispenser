require("isomorphic-fetch")
import React from "react"
import styled from "styled-components"
import Logo from "../components/logo"
import env from "../lib/env"

const Main = styled.div`
  width: 100vw;
  height: 100vh;
  background: whitesmoke;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  @media screen and (min-width: 650px) {
    align-items: center;
  }
`
const Form = styled.form`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: white;
  text-align: center;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  min-height: 90vh;
  max-width: 90vw;
  margin: 1rem;
  box-sizing: border-box;
  @media screen and (min-width: 650px) {
    min-height: auto;
    max-width: 25rem;
  }
`
const Input = styled.input`
  flex: 1;
  outline: none;
  border: none;
  border-bottom: 2px solid whitesmoke;
  font-size: 16px;
  letter-spacing: 1.5px;
  padding: 0.3rem 0.5rem;
  width: 100%;

  @media screen and (min-width: 650px) {
    width: auto;
  }
`
const Button = styled.button`
  outline: none;
  border: none;
  background: whitesmoke;
  padding: 0.5rem 0.5rem;
  margin: 1rem 0 0;
  width: 100%;

  @media screen and (min-width: 650px) {
    margin-left: 0.8rem;
    width: auto;
  }
`
const Title = styled.h1`
  padding: 2rem 0rem 0.6rem;
`

const Row = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  @media screen and (min-width: 650px) {
    flex-direction: row;
    align-items: baseline;
  }
`

export default class extends React.Component {
  state = { number: "", sent: false }

  submit = async e => {
    e.preventDefault()
    var response = await fetch("/getToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: this.state.number })
    })
    var data = await response.json()
    if (data.error) return alert(data.error)
    console.log(data)
    this.setState({ sent: true })
  }

  render() {
    var { number, sent } = this.state
    return (
      <Main>
        <Form onSubmit={e => this.submit(e)}>
          <Logo fill={"#222"} />
          <Title>{env.PAGE_TITLE}</Title>
          <p>{env.PAGE_DESCRIPTION}</p>
          {!sent ? (
            <Row>
              <Input
                placeholder={`+82 99 1111 0000`}
                value={number}
                type={`tel`}
                onChange={event =>
                  this.setState({ number: event.target.value })
                }
              />
              <Button>Send</Button>
            </Row>
          ) : (
            <strong>You will recieve a message soon</strong>
          )}
        </Form>
      </Main>
    )
  }
}
