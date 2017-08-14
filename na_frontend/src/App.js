import React, {Component} from 'react'
import './App.css'
import {Button, Col, ControlLabel, FormControl, FormGroup, Navbar, Row, Table} from 'react-bootstrap'
import * as api from './api/'
import autobind from 'react-autobind'
import NotificationSystem from 'react-notification-system'

class App extends Component {
  state = {
    loading: true,
    agentList: [],
    agentStats: [],
    pickedAgent: `null`,
    pickedAgentStats: null,
    enteredOrderNumber: ``,
    uploadedOrders: null,
    pickedOrder: null
  }

  constructor() {
    super()
    autobind(this)
  }

  _notificationSystem = null

  _notify(level, title = ``, message = ``) {
    if (!this._notificationSystem) return

    this._notificationSystem.addNotification({
      title,
      message,
      level
    })
  }
  notifySuccess(title, message) {
    this._notify('success', title, message)
  }
  notifyInfo(title, message) {
    this._notify('info', title, message)
  }
  notifyError(title, message) {
    this._notify('error', title, message)
  }

  async componentDidMount() {
    const [list, stats] = await Promise.all([api.getAgentsList(), api.getAllAgentStats()])

    if (list.ok) this.setState({agentList: list.result.agents})
    else console.error(list.error)

    if (stats.ok) this.setState({agentStats: stats.result.agents})
    else console.error(stats.error)

    setImmediate(() => {
      this.setState({loading: false})
      this._notificationSystem = this.refs.notificationSystem
    })
  }

  async onAgentPicked(event) {
    const {value} = event.target
    this.setState({
      pickedAgent: value,
      pickedAgentStats: null
    })

    if (value === `null`) return

    const stats = await api.getAgentStats(value)

    if (stats.ok) this.setState({pickedAgentStats: stats.result.agent})
    else this.notifyError(`Ошибка`, stats.error)
  }

  onOrderNumberInputChanged(event) {
    this.setState({enteredOrderNumber: event.target.value})
  }

  async loadOrder() {
    this.setState({pickedOrder: null})

    const number = this.state.enteredOrderNumber
    if (number === ``) return this.notifyError(`Ошибка`, `Номер заказа не может быть пустым`)

    const order = await api.getOrder(number)
    if (order.ok) this.setState({pickedOrder: order.result.order})
    else this.notifyError(`Ошибка`, order.error)
  }

  async deleteOrder() {
    const order = this.state.pickedOrder
    if (!order) return
    const response = await api.deleteOrder(order.orderId)

    if (response.ok) {
      this.setState({pickedOrder: null})
      this.notifySuccess(`Заказ удален`, `Заказ №${response.result.orderId} успешно удален`)
    }
    else this.notifyError(`Ошибка`, response.error)
  }

  async sendFile(event) {
    const file = event.target.files[0]
    const response = await api.uploadJson(file)

    if (response.ok) {
      const {uploaded} = response.result
      this.setState({uploadedOrders: uploaded})
      this.notifySuccess(`Файл успешно загружен`, `Загружено заказов: ${uploaded}`)
    }
    else this.notifyError(`Ошибка`, response.error)
  }

  render() {
    const {loading, agentList, pickedAgentStats, agentStats, pickedOrder, uploadedOrders} = this.state

    if (loading) return <div className="container"><h1>loading...</h1></div>
    return (
      <div>
        <NotificationSystem ref="notificationSystem" />
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a className="link-cursor">na_testcase</a>
            </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
        <div className="container">
          <h4>1. Отображение количества заказов и суммы по каждому agent, с возможностью выбора agent в дропдауне</h4>
          <Row>
            <Col md={2}>
              <div className="form-group">
                <label htmlFor="sel1">Выберите агента:</label>
                <select onChange={this.onAgentPicked} className="form-control" id="sel1">
                  <option value="null">Не выбран</option>
                  {agentList.map(agent => <option key={agent}>{agent}</option>)}
                </select>
              </div>
            </Col>
            {
              pickedAgentStats &&
              <Col>
                <FormGroup>
                  <ControlLabel>Данные по агенту {pickedAgentStats.agent}</ControlLabel>
                  <FormControl.Static>
                    Заказов: {pickedAgentStats.count}. Общая сумма: {pickedAgentStats.amount}.
                  </FormControl.Static>
                </FormGroup>
              </Col>
            }
          </Row>

          <hr/>

          <h4>2. Отображение списка agent, по убыванию, в зависимости от суммы amount</h4>
          <Row>
            <Col lg={4} md={4} sm={6} xs={12}>
              <Table responsive>
                <thead>
                <tr>
                  <th>#</th>
                  <th>Агент</th>
                  <th>Кол-во заказов</th>
                  <th>Общая сумма</th>
                </tr>
                </thead>
                <tbody>
                {agentStats.map((agent, index) => <tr key={agent.agent}>
                  <td>{index + 1}</td>
                  <td>{agent.agent}</td>
                  <td>{agent.count}</td>
                  <td>{agent.amount}</td>
                </tr>)}
                </tbody>
              </Table>
            </Col>
          </Row>

          <hr/>

          <h4>3. Поиск заказа по orderId и его удаление</h4>
          <Row>
            <Col sm={2}>
              <label htmlFor="orderNumberInput">Введите номер заказа:</label>
              <FormControl
                onChange={this.onOrderNumberInputChanged}
                id="orderNumberInput"
                type="text"
                label="Text"
                placeholder="Номер заказа"
              />
            </Col>
            <Col sm={2}>
              <Button onClick={this.loadOrder} className="button-formControl">Загрузить</Button>
            </Col>
            {
              pickedOrder &&
              <Col sm={6}>
                <FormGroup>
                  <ControlLabel>Заказ {pickedOrder.orderId}</ControlLabel>
                  <FormControl.Static>
                    Дата отправления: {pickedOrder.departureDate}. Маршрут: {pickedOrder.city1}->{pickedOrder.city2}.
                    Агент: {pickedOrder.agent}. Сумма: {pickedOrder.amount}.
                  </FormControl.Static>
                </FormGroup>
              </Col>
            }
            {
              pickedOrder &&
              <Col sm={2}>
                <Button bsStyle="danger" onClick={this.deleteOrder} className="button-formControl">Удалить</Button>
              </Col>
            }
          </Row>

          <hr/>

          <h4>4. Добавление JSON файла и обновление БД</h4>
          <Row>
            <Col xs={4}>
              <ControlLabel>Загрузка заказов из JSON</ControlLabel>
              <FormControl
                id="formControlsFile"
                type="file"
                label="File"
                onChange={this.sendFile}
              />
            </Col>
            {
              uploadedOrders !== null &&
              <Col xs={4}>
                <FormGroup>
                  <ControlLabel/>
                  <FormControl.Static>
                    Загружено заказов: {uploadedOrders}
                  </FormControl.Static>
                </FormGroup>
              </Col>
            }
          </Row>

          <hr/>

        </div>
      </div>
    )
  }
}

export default App
