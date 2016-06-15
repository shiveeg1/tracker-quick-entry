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

  _handleStageSelect() {
    console.log("selected program stage");
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

    const programNames = this.props.data.programStages.map(stage => (
        stage.name
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
                    title="Program Stage name"
                    style={{height:'30px'}}
                  />
                  <CardText>
                      {console.log(programNames)}
                          <SelectField value={this.state.value} onChange={this.handleChange}>
                            <MenuItem value={1} primaryText="Stage 1" />
                            <MenuItem value={2} primaryText="Stage 2" />
                            <MenuItem value={3} primaryText="Stage 3" />
                            <MenuItem value={4} primaryText="Stage 4" />
                            <MenuItem value={5} primaryText="Stage 5" />
                          </SelectField>
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
