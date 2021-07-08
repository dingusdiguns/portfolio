import React from "react";
import { withRouter } from "react-router";

class Transition extends React.Component{
    constructor( props ){
        super();
        this.state = {

        }

        this.project = props.match.params.project
    }

    componentDidMount(){
        window.setTimeout(
            () => {
                this.props.history.push( `/project/${ this.project }` );
            },
            10
        )
    }

    render(){
        return(
            <div className = "transition">

            </div>
        )
    }
}

const TransitionWithRouter = withRouter(Transition);

export default TransitionWithRouter
