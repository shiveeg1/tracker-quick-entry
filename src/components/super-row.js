import React from 'react';
import times from 'lodash.times';
// material-ui
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/lib/table';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/lib/card';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import FlatButton from 'material-ui/lib/flat-button';
//App
import RowComponent from './table-row';
import ProgramStageDropDown from './drop-down';

/*
TODO change collapsible height dynamically
*/
export default class CompositeRow extends React.Component {
  constructor(props,context){
    super(props);
    this.context=context;
    this.state = {
      animHeight:'0px'
    }
  }

  _handleStageSelect(obj) {
    console.log(this.props.data.programStages[obj.target.value]);
  }

  render() {
    const styles = {
      noPad : {
        padding:'0px',
        height:this.state.animHeight,
        transition:'height 1s ease'
      },
      cardStyle : {
        height:this.state.animHeight,
        transition:'height 1s ease',
      }
    }

    const bodyStyles= {
        overflowX:'visible',
        width: this.props.data.length*150
    }

    const programNames = this.props.data.programStages.map((stage,index) => (
        {displayName: stage.name, id: index}
    ))
    return (
//Single outer-row start
      <TableRow key={this.props.key}>
      <TableRowColumn colSpan={this.props.data.headers.length} style={styles.noPad}>
      <Table {...this.props.tableProps}>
          <TableBody {...this.props.tableBodyProps} >
          {/*Row1 for data Entry*/}
          <RowComponent data={this.props.data.headers} expandToggle={function(){this.setState({animHeight:'100px'})}.bind(this)}/>

          {/*Row2 for expandable Tab*/}
          <TableRow style={styles.noPad}>
          <TableRowColumn colSpan={this.props.data.headers.length} style={styles.noPad}>
          <Card style={styles.cardStyle}>
              <div style={{display:'flex'}}>
                  <CardHeader
                    title="Program Stage :"
                    style={{height:'30px'}}
                  />
                  <ProgramStageDropDown key={this.props.index} value='dropValue'
                      onChange={this._handleStageSelect.bind(this)}
                      menuItems={programNames}
                      includeEmpty={true}
                      emptyLabel='Select Program' />
                  <CardText>

                  </CardText>
              </div>
          </Card>
          </TableRowColumn>
          </TableRow>
          </TableBody>
      </Table>
      </TableRowColumn>
      </TableRow>
//Single outer-row close.

    )
  }
}
