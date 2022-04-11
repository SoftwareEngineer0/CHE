import React from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import { AgencyList } from '../../../components'
import { CSVLink } from 'react-csv'
import { getAgencyList, getDownloadList, loginCustomerFromAgency } from '../../../api/axiosAPIs'
import _ from 'lodash'
import PageConstant from '../../../constants/PageConstant'
import { Button, Card, Input, Spin } from 'antd'
import { initSettings, setRole } from '../../../appRedux/actions/User'
import { setTitleText } from '../../../appRedux/actions/Custom'

class Agencies extends React.Component {
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
    this.props.setTitleText(intl.formatMessage({id: `page.title.agencies`}))

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
    this.fetchAgencyList(data)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {loader} = nextProps
    if (loader !== this.state.loader) {
      this.setState({loader})
    }
  }

  fetchAgencyList(data) {
    const {asc, keyword} = this.state

    let params = {
      asc: asc,
      keyword: keyword
    }
    Object.assign(params, data)
    getAgencyList(params)
      .then(response => {
        if (!_.isEmpty(response.data)) {
          if (response.data.data) {
            this.setState({
              count: response.data.total,
              rows: response.data.data
            })
          } else {
            //this.props.initSettings()
            //this.props.history.push('/admin/login')
          }
        }
      })
  }

  fetchCSVData() {

    getDownloadList()
      .then(response => {
        if (!_.isEmpty(response.data)) {
          this.setState({downloadRows: response.data.data}, () => {
            // click the CSVLink component to trigger the CSV download
            this.csvLink.current.link.click()
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
    getAgencyList(data)
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

    getAgencyList(data)
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

  onChangeKeyword = e => {
    this.setState({
      keyword: e.target.value
    })
  }

  /**
   * Handle function for deny members
   */
  onClickSearchButton = () => {
    let data = {
      page: this.state.page,
      limit: this.state.rowsPerPage
    }
    this.fetchAgencyList(data)
  }

  onClickEditButton = (id) => {
    if (!_.isEmpty(id) || id) {
      this.props.history.push({
        pathname: PageConstant.EDIT_AGENCY + '/~' + id + '?num=' + this.state.page + '&limit=' + this.state.rowsPerPage
      })
    }
  }

  onClickDeleteButton = (id) => {

    // this.showDeleteConfirmModal(id)
  }

  onClickDownloadCSV = () => {

    this.fetchCSVData()
  }

  onClickGoStoreLogin = (id) => {
    loginCustomerFromAgency(id)
      .then(response => {
        if (response.status === 200) {
          this.props.setRole(response.data.kind)
          this.props.history.push('/admin/customers')
        }
      })
  }

  onClickRegisterAgency = () => {
    this.props.history.push({
      pathname: PageConstant.ADD_AGENCY,
      pageNumberState: this.state.page,
      rowsPerPageState: this.state.rowsPerPage
    })
  }

  render() {
    const {
      loader,
      rows,
      count,
      page,
      rowsPerPage,
      rowsPerPageOptions
    } = this.state

    const today = new Date()
    return (
      <div>
        <div className="gx-flex-row gx-align-items-right gx-mb-3">
          <Button className="ant-btn-primary gx-btn-rounded-blue gx-ml-auto" onClick={this.onClickRegisterAgency}>
            <FormattedMessage id="btn.newRegisterAgency"/>
          </Button>
        </div>
        <div className="gx-flex-row gx-align-items-center gx-mb-4">
          <h2 className="title gx-mb-auto gx-page-title"><FormattedMessage id="page.title.agencies"/></h2>
        </div>
        <Card className="gx-card">
          <Spin spinning={loader} size="large">
            <div className="gx-flex-row gx-align-items-center gx-mb-4">
              <div
                className="ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-12 ant-col-lg-18 ant-col-xl-20 ant-col-xxl-20 gx-mb-2">
                <div
                  className="ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-24 ant-col-xl-12 ant-col-xxl-8 gx-no-padding">
                  <div className="gx-no-flex-wrap-flow">
                    <Input placeholder="代理店名" className="gx-mr-2" onChange={this.onChangeKeyword}/>
                    <Button className="ant-btn-primary gx-mb-0 gx-btn-rounded-blue1" onClick={this.onClickSearchButton}>
                      <FormattedMessage id="btn.search"/>
                    </Button>
                  </div>
                </div>
              </div>
              <div
                className="ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-12 ant-col-lg-6 ant-col-xl-4 ant-col-xxl-4 gx-mb-2">
                <Button className="ant-btn-primary gx-btn-rounded-green gx-no-margin gx-w-100"
                        onClick={this.onClickDownloadCSV}>
                  <FormattedMessage id="btn.downloadCSV"/>
                </Button>
                <CSVLink
                  data={this.state.downloadRows}
                  filename={"store_list_" + today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + ".csv"}
                  className="hidden"
                  ref={this.csvLink}
                  target="_blank"
                />
              </div>

            </div>
            <AgencyList
              rows={rows}
              count={count}
              page={page}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={rowsPerPageOptions}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
              onClickDeleteButton={this.onClickDeleteButton}
              onClickEditButton={this.onClickEditButton}
              onClickGoStoreLogin={this.onClickGoStoreLogin}
            />
          </Spin>
        </Card>
      </div>
    )
  }
}

const mapDispatchToProps = {
  setRole, initSettings, setTitleText
}

const mapStateToProps = ({progress}) => {
  return {
    loader: progress.loader
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Agencies))