import React from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import { ManagementDevicesList } from '../../../components'
import _ from 'lodash'
import PageConstant from '../../../constants/PageConstant'
import { Button, Card, Modal, Spin } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { deleteManagementDevice, getManagementDeviceList } from '../../../api/axiosAPIs'
import { managementDevicesCategory, managementDevicesMaker } from '../../../constants/ManagementDevice'
import { setTitleText } from '../../../appRedux/actions/Custom'

const {confirm} = Modal

class ManagementDevices extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loader: false,
      selectedItemId: null,
      rows: [],
      count: 0,
      page: 0,
      rowsPerPage: 5,
      rowsPerPageOptions: [5, 10, 20, 50, 100, 500],
      asc: 'desc',
      keyword: '',
      downloadRows: []
    }
    this.csvLink = React.createRef()
  }

  componentDidMount() {
    const {intl} = this.props
    this.props.setTitleText(intl.formatMessage({id: `page.title.management.devices`}))

    let {pageNumberState, rowsPerPageState} = this.props.location
    const {page, rowsPerPage} = this.state
    let data = {
      page: page,
      limit: rowsPerPage
    }
    if ((pageNumberState !== undefined) && (rowsPerPageState !== undefined)) {
      data = {
        page: pageNumberState,
        limit: rowsPerPageState
      }
      this.setState({
        page: pageNumberState,
        rowsPerPage: rowsPerPageState
      })
    }
    this.fetchData(data)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {loader} = nextProps
    if (loader !== this.state.loader) {
      this.setState({loader})
    }
  }

  fetchData(data) {
    const {asc, keyword} = this.state

    let params = {
      asc: asc,
      keyword: keyword
    }
    Object.assign(params, data)
    
    getManagementDeviceList(params)
      .then(response => {
        if (!_.isEmpty(response.data)) {
          const rows = response.data.data
          rows.map(row => {
            const makerCd = managementDevicesMaker.find(item => item.id === row.maker_cd)
            const machineType = managementDevicesCategory.find(item => item.id === row.machine_type)
            row.makerCd = (makerCd) ? makerCd.label : ''
            row.machineType = (machineType) ? machineType.label : ''
          })
          this.setState({
            count: response.data.total,
            rows: rows
          })
        }
      })
  }

  /**
   * Handle function for change page
   */
  handleChangePage = (event, page) => {
    const {rowsPerPage, asc, keyword} = this.state
    const data = {
      page: page,
      limit: rowsPerPage,
      asc: asc,
      keyword: keyword
    }
    
    getManagementDeviceList(data)
      .then(response => {
        if (!_.isEmpty(response.data)) {
          this.setState({
            page: page,
            count: response.data.total,
            rows: response.data.data
          })
        }
      })
  }

  /**
   * Handle function for change rows per page
   */
  handleChangeRowsPerPage = (event) => {
    const {asc, keyword} = this.state
    const data = {
      page: 0,
      limit: event.target.value,
      asc: asc,
      keyword: keyword
    }
    
    getManagementDeviceList(data)
      .then(response => {
        if (!_.isEmpty(response.data)) {
          this.setState({
            page: 0,
            rowsPerPage: event.target.value,
            count: response.data.total,
            rows: response.data.data
          })
        }
      })
  }

  onClickEditButton = (id) => {
    if (!_.isEmpty(id) || id) {
      console.log('id :::', id)
      this.props.history.push({
        pathname: PageConstant.EDIT_MANAGEMENT_DEVICE + '/~' + id + '?num=' + this.state.page + '&limit=' + this.state.rowsPerPage
      })
    }
  }

  onClickDeleteButton = (id) => {
    
    this.showDeleteConfirmModal(id)
  }

  showDeleteConfirmModal = (id) => {
    const {intl} = this.props
    const {page, rowsPerPage} = this.state

    confirm({
      title: intl.formatMessage({id: 'alert.deleteConfirm'}),
      icon: <ExclamationCircleOutlined/>,
      // content: intl.formatMessage({id: 'alert.deleteConfirm'}),
      okText: intl.formatMessage({id: 'btn.delete'}),
      okType: 'danger',
      cancelText: intl.formatMessage({id: 'btn.cancel'}),
      onOk: () => {
        deleteManagementDevice(id)
          .then(response => {
            if (response.status === 200) {
              let data = {
                page: page,
                limit: rowsPerPage
              }
              this.fetchData(data)
            }
          })
      },
      onCancel() {
      }
    })
  }

  goToPrevious = () => {
    this.props.history.push({pathname: PageConstant.MAINTENANCE})
  }

  finishRegist = () => {
    this.props.history.push({pathname: PageConstant.MAINTENANCE})
  }

  onClickRegisterManagementDevice = () => {
    this.props.history.push({pathname: PageConstant.NEW_MANAGEMENT_DEVICE})
  }

  render() {
    const {
      loader,
      rows,
      count,
      page,
      rowsPerPage,
      rowsPerPageOptions,
    } = this.state

    const today = new Date(),
      date = today.getHours() + '時' + today.getMinutes() + '分'

    return (
      <div>

        <Card className="gx-card">
          <Spin spinning={loader} size="large">
            <div
              className="ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-12 ant-col-lg-18 ant-col-xl-20 ant-col-xxl-20 gx-mb-5">
              <div
                className="ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-24 ant-col-xl-12 ant-col-xxl-8 gx-no-padding">
                <div className="gx-no-flex-wrap-flow">
                  <h2 className="gx-align-self-center ant-col ant-col-xs-12 ant-col-sm-12 ant-col-xl-12 ant-col-xxl-8">
                    <FormattedMessage id="lable.time"/>
                  </h2>
                  <div className="gx-mr-3 ant-col ant-col-xs-12 ant-col-sm-12 ant-col-xl-12 ant-col-xxl-8">
                    <Button className="maintenance-selector">{date}</Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="gx-no-flex-wrap-flow">
              <div className="gx-align-self-left ant-col ant-col-xs-12 ant-col-sm-12 ant-col-xl-12 ant-col-xxl-12">
                <h2 className="title gx-mb-auto gx-page-title"><FormattedMessage id="page.title.management.devices"/>
                </h2>
              </div>
              <div
                className="gx-flex-row gx-align-items-right ant-col ant-col-xs-12 ant-col-sm-12 ant-col-xl-12 ant-col-xxl-12">
                <Button className="ant-btn-primary gx-btn-rounded-blue gx-ml-auto"
                        onClick={this.onClickRegisterManagementDevice}>
                  <FormattedMessage id="btn.newRegisterEmployee"/>
                </Button>
              </div>
            </div>
            {/* <div className="gx-flex-row gx-align-items-center gx-mb-4">
                            <div className="ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-12 ant-col-lg-18 ant-col-xl-20 ant-col-xxl-20 gx-mb-2">
                                <div className="ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-24 ant-col-xl-12 ant-col-xxl-8 gx-no-padding">
                                    <div className="gx-no-flex-wrap-flow">
                                        <Input placeholder="店舗名" className="gx-mr-2" onChange={this.onChangeKeyword}/>
                                        <Button className="ant-btn-primary gx-mb-0" onClick={this.onClickSearchButton}>
                                            <FormattedMessage id="btn.search"/>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div> */}
            <ManagementDevicesList
              rows={rows}
              count={count}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={rowsPerPageOptions}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
              onClickDeleteButton={this.onClickDeleteButton}
              onClickEditButton={this.onClickEditButton}
              onClickGoDashboardLogin={this.onClickGoDashboardLogin}
            />
          </Spin>
        </Card>
        <div className="gx-flex-row gx-align-items-right gx-mb-3">
          <Button className="ant-btn-primary gx-btn-rounded-gray maintenance-btn gx-mr-4" onClick={this.goToPrevious}>
            <FormattedMessage id="btn.go.previous"/>
          </Button>
          <Button className="ant-btn-primary gx-btn-rounded-blue maintenance-btn gx-mr-auto"
                  onClick={this.finishRegist}>
            <FormattedMessage id="btn.finish.regist"/>
          </Button>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
  setTitleText
}

const mapStateToProps = ({progress}) => {
  return {
    loader: progress.loader
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ManagementDevices))