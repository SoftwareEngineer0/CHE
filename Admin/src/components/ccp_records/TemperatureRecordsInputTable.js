import React, { Component } from 'react'
import { Input } from 'antd'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import IconButton from '@material-ui/core/IconButton'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'
import { injectIntl } from 'react-intl'
import 'moment-timezone'

/**
 * Table pagination Component style sheets
 */
const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5)
  }
})

class TablePaginationActions extends React.Component {
  /**
   * Handle function for click first page button
   */
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0)
  }

  /**
   * Handle function for click back page button
   */
  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1)
  }

  /**
   * Handle function for click next page button
   */
  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1)
  }

  /**
   * Handle function for click last page button
   */
  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
    )
  }

  /**
   * Render function to view this component
   */
  render() {
    const {classes, count, page, rowsPerPage, theme} = this.props

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon/> : <FirstPageIcon/>}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon/> : <LastPageIcon/>}
        </IconButton>
      </div>
    )
  }
}

/**
 * Set prop types for table pagination actions
 */
TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
}

const TablePaginationActionsWrapped = withStyles(actionsStyles, {withTheme: true})(
  TablePaginationActions
)

/**
 * Component style sheets
 */
const styles = theme => ({
  toolbar: {
    width: '100%',
    margin: 0,
    padding: 0
  },
  tableWrapper: {
    overflowX: 'auto',
    marginTop: theme.spacing(0.5)
  },
  table: {
    minWidth: 300
  },
  title: {
    flex: '0 0 auto'
  },
  spacer: {
    flex: '1 1 100%'
  },
  tooltipButton: {
    textAlign: 'left',
    textTransform: 'none'
  },
  noDataCell: {
    textAlign: 'center'
  },
  noMargin: {
    margin: 0
  }
})

const StyledTableCell = withStyles(theme => ({
  head: {
    fontWeight: 'bold',
    color: '#405169',
    textAlign: 'left',
    fontSize: '15px',
    paddingLeft: '4px',
    paddingRight: '4px'
  },
  body: {
    border: 'none',
    '&hover:hover': {
      backgroundColor: '#DDE9FB'
    },
    padding: '4px !important'
  }

}))(TableCell)

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#DDE9FB'
    },
    '&:hover:hover': {
      backgroundColor: '#DDE9FB'
    }
  }
}))(TableRow)

class TemperatureRecordsInputTable extends Component {

  /**
   * Render function to view this component
   */

  handleChange = (event, id) => {
    this.props.onChangeInput(id, event.target.value)
  }

  render() {
    const {
      intl,
      classes,
      rows
    } = this.props
    const headers = [
      {
        id: 0,
        title: intl.formatMessage({id: 'table.header.equipmentName'})
      },
      {
        id: 1,
        title: intl.formatMessage({id: 'table.header.instrumentType'})
      },
      {
        id: 2,
        title: intl.formatMessage({id: 'table.header.temperature'})
      }
    ]

    let index_number = 0
    return (
      <div className={classes.tableWrapper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {headers.map(header => {
                return (
                  <StyledTableCell className={classes.tableCell} key={header.id}>
                    {header.title}
                  </StyledTableCell>
                )
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {
              !rows.length &&
              <StyledTableRow>
                <TableCell colSpan={13} className={classes.noDataCell}>
                  <p className={classes.noMargin}>{intl.formatMessage({id: 'table.noData'})}</p>
                </TableCell>
              </StyledTableRow>
            }
            {rows.map((row, key) => {
              return (
                <StyledTableRow
                  hover
                  key={key}>
                  <StyledTableCell>{row.machine_name}</StyledTableCell>
                  <StyledTableCell>{row.machine_kind}</StyledTableCell>
                  <StyledTableCell>
                    <Input type={'number'} addonBefore={(row.minus_temperature_record === true) ? '-' : null}
                           addonAfter="℃" className="input-mw-200" defaultValue={row.temperature_record}
                           onChange={(event) => this.handleChange(event, key)}/>
                  </StyledTableCell>
                </StyledTableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    )
  }
}

export default withStyles(styles)(injectIntl(TemperatureRecordsInputTable))
