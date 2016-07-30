class CardContainer extends React.Component{
    
    render(){
        return(
            <div>
                <SoffitStockCard companySymbol="^GSPC"/>
                <SoffitStockCard companySymbol="GOOG"/>
                <SoffitStockCard companySymbol="MSFT"/>
            </div>
        );
    }
}

class SoffitStockCard extends React.Component{
    constructor(){
        super();
        this.state ={
            quoteObject: "empty",
            showExtraContent: false,
            extraContentButton: "expand_more",
        }
    }

    componentDidMount(){
        $.ajax({
            url: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20IN%20(%22"+ this.props.companySymbol+"%22)&format=json&env=http://datatables.org/alltables.env",
            dataType: 'json',
            type: 'GET',
            success: function(data) {
                console.log(data);
                this.setState({quoteObject: data.query.results.quote});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error("", status, err.toString());
            }.bind(this)
        });


    }
    changeState(opt1, opt2){
        this.setState({
            showExtraContent: opt1,
            extraContentButton: opt2,
        });
    }
    
    getState(){
        return this.state;
    }
    
    render(){
        
        if (this.state.showExtraContent == false){
            console.log(this.state)
            return(
                <div className="stock-soffit-card">
                    <SoffitStockCardTitlebar changeState={this.changeState.bind(this)} getState={this.getState.bind(this)} />
                </div>
            );
        }else{
            return(
                <div className="stock-soffit-card">
                    <SoffitStockCardTitlebar  changeState={this.changeState.bind(this)} getState={this.getState.bind(this)}/>
                    <SoffitStockExtraContent getState={this.getState.bind(this)} />
                </div>
            );
        }
        
    }
}

class SoffitStockCardTitlebar extends React.Component{
    render(){
        var d = new Date();
        return(
            <div className="stock-soffit-titlebar">
                <div className="stock-soffit-titlebar-content">
                    <SoffitStockCardCompany getState={this.props.getState}/>
                    <div className="stockAndPercent">
                        <SoffitStockCardStock getState={this.props.getState}/>
                        <SoffitStockCardPercent getState={this.props.getState}/>
                    </div>
                    <div className="soffit-stock-disclaimer">
                        As of {d.getHours() + ":" + d.getMinutes()}
                    </div>
                    <SoffitStockMoreButton getState={this.props.getState} changeState={this.props.changeState} />
                </div>
            </div>
        );
    }
}

class SoffitStockCardCompany extends React.Component{
    render(){
        return(
            <div className="companyName">
                {this.props.getState().quoteObject.Name}
            </div>
        );
    }
}
 
class SoffitStockCardStock extends React.Component{
    render(){
        return(
            <div className="soffit-stock-price">
                {this.props.getState().quoteObject.Open}
            </div>
        );
    }
}

class SoffitStockCardPercent extends React.Component{
    render(){
        return(
            <div className="soffit-stock-card-percent">
                <i id="stockPriceUpArrow" className="material-icons">arrow_upward</i>
                {this.props.getState().quoteObject.Change + "%"}
            </div>
        );
    }
}

class SoffitStockMoreButton extends React.Component{
    toggleExtraContent(){
        if(this.props.getState().extraContentButton == "expand_more"){
            this.props.changeState(!(this.props.getState().showExtraContent), "expand_less");
        }else{
            this.props.changeState(!(this.props.getState().showExtraContent), "expand_more")
        }   
    }
    
    render(){
        
        return(
            <div>
                <button onClick={this.toggleExtraContent.bind(this)} className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
                    <i className="material-icons">{this.props.getState().extraContentButton}</i>
                </button>
            </div>
        );
    }
}

class SoffitStockExtraContent extends React.Component{
    render(){
        return(
            <div className="soffit-stock-extra-content" >
                <div className="content-content-ception">
                    <div className="today-high">
                        Today's High: {" " + this.props.getState().quoteObject.DaysHigh}
                    </div>
                    <div className="today-low">
                        Today's Low: {" " + this.props.getState().quoteObject.DaysHigh}
                    </div>
                    <div className="year-high">
                        This Year's High: {" " + this.props.getState().quoteObject.DaysHigh}
                    </div>
                    <div className="year-low">
                        This Year's Low: {" " + this.props.getState().quoteObject.DaysHigh}
                    </div>
                </div>
            </div>            
        );
    }
}


ReactDOM.render(<CardContainer />, document.getElementById('content'));