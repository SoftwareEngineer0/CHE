import React, { Component } from 'react'
import { AgencyItem } from '../../../components'
import { FormattedMessage, injectIntl } from 'react-intl'
import { addAgency } from '../../../api/axiosAPIs'
import PageConstant from '../../../constants/PageConstant'
import { connect } from 'react-redux'
import { openNotificationWithIcon } from '../../../components/common/Messages'

class AddAgency extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loader: false
    }

    this.prevPageNum = 0
    this.prevPageLimit = 10
  }

  componentDidMount() {
    let {pageNumberState, rowsPerPageState} = this.props.location
    if ((pageNumberState !== undefined) && (rowsPerPageState !== undefined)) {
      this.prevPageNum = pageNumberState
      this.prevPageLimit = rowsPerPageState
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {loader} = nextProps
    if (loader !== this.state.loader) {
      this.setState({loader})
    }
  }

  submitAddAgency = (data) => {
    
    let formData = new FormData()
    formData.append('name', data.name)
    formData.append('staff_email', data.representative_email)
    formData.append('password', data.password)
    addAgency(formData)
      .then(response => {
        openNotificationWithIcon('success', this.props.intl.formatMessage({id: 'message.success.newAgency'}))
        this.goToAgencyList()
      })
  }

  handleCancelBtn = () => {
    this.goToAgencyList()
  }

  goToAgencyList() {
    this.props.history.push({
      pathname: PageConstant.AGENCIES,
      pageNumberState: parseInt(this.prevPageNum),
      rowsPerPageState: parseInt(this.prevPageLimit)
    })
  }

  render() {
    let isAdd = true
    const {loader} = this.state
    return (
      <div>
        <div className="gx-flex-row gx-align-items-center gx-mb-4">
          <h2 className="title gx-mb-auto" style={{marginRight: '50px'}}><FormattedMessage
            id="card.title.customer.add"/></h2>
        </div>
        <AgencyItem
          isAdd={isAdd}
          loader={loader}
          submitAddInfo={this.submitAddAgency}
          handleCancelBtn={this.handleCancelBtn}
        />
      </div>
    )
  }
}

const mapDispatchToProps = {}

const mapStateToProps = ({progress}) => {
  return {
    loader: progress.loader
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(AddAgency))