import React from "react"
import styled from "styled-components"
import Logo from "../components/logo"
require("isomorphic-fetch")

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
  word-break: break-word;
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
    width: 100%;
  }
`
const Inner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`

export default class extends React.Component {
  state = { code: "", sent: false }

  async componentDidMount() {
    var seed = JSON.parse(await localStorage.getItem("seed"))
    if (seed) {
      this.setState({ seed: seed })
    } else {
      if (this.props.url.query.code) this.getSeed(this.props.url.query.code)
    }
  }

  getSeed = async code => {
    var response = await fetch("/getSeed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: code })
    })
    var seed = await response.json()
    if (seed.error) return alert(seed.error)
    console.log(seed)
    localStorage.setItem("seed", JSON.stringify(seed.seed))
    this.setState({ seed: seed.seed })
  }

  submit = async e => {
    e.preventDefault()
    this.getSeed(this.state.code)
  }

  render() {
    var { code, seed } = this.state
    return (
      <Main>
        <Form onSubmit={e => this.submit(e)}>
          <Logo fill={"#222"} />
          {!seed ? (
            <Inner style={{ width: "100%" }}>
              <Row>
                <Input
                  placeholder={`Enter code`}
                  value={code}
                  onChange={event =>
                    this.setState({ code: event.target.value })
                  }
                />
                <Button>Send</Button>
              </Row>
            </Inner>
          ) : (
            <div>
              <Title>Seed:</Title>
              <p>{seed}</p>
            </div>
          )}
        </Form>
      </Main>
    )
  }
}
